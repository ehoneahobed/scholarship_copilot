"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateEssayDraft } from "@/lib/agents/drafter";
import { refineEssay } from "@/lib/agents/refiner";
import { revalidatePath } from "next/cache";

export async function runDraftingPipeline(applicationId: string) {
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

    // 1. Generate Draft
    const draft = await generateEssayDraft(
        application.scholarship, 
        profile, 
        JSON.parse(application.userContext || "{}")
    );

    // 2. Refine Draft
    const refinedDraft = await refineEssay(draft, application.scholarship);

    // 3. Save and Transition
    await prisma.application.update({
        where: { id: applicationId },
        data: {
            draftContent: refinedDraft,
            status: "REFINED",
        },
    });

    revalidatePath(`/dashboard/application/${applicationId}`);
    revalidatePath("/dashboard");

    return { success: true };
}
