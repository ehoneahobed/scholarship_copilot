"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { identifyApplicationGaps } from "@/lib/agents/prep";
import { revalidatePath } from "next/cache";

export async function getApplicationWithGaps(applicationId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const application = await prisma.application.findUnique({
        where: { id: applicationId, userId: session.user.id },
        include: { scholarship: true },
    });

    if (!application) throw new Error("Application not found");

    const profile = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) throw new Error("Profile not found");

    // Run gap analysis
    const gaps = await identifyApplicationGaps(application.scholarship, profile);

    return { application, gaps };
}

import { runDraftingPipeline } from "./draft";

export async function saveGapResponses(applicationId: string, responses: Record<string, string>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    // Store responses in processingLogs or a dedicated field
    await prisma.application.update({
        where: { id: applicationId, userId: session.user.id },
        data: {
            userContext: JSON.stringify(responses),
            status: "READY_TO_DRAFT",
        },
    });

    // Automatically trigger drafting
    await runDraftingPipeline(applicationId);

    revalidatePath(`/dashboard/application/${applicationId}`);
    revalidatePath("/dashboard");
}
