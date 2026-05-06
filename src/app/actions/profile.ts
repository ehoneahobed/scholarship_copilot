"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: {
    education: any;
    experience: any;
    achievements: any;
    rawResumeText: string;
    skills: string[];
    preferredFields: string[];
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const profile = await prisma.userProfile.upsert({
        where: { userId: session.user.id },
        update: {
            education: formData.education,
            experience: formData.experience,
            achievements: formData.achievements,
            rawResumeText: formData.rawResumeText,
            skills: formData.skills,
            preferredFields: formData.preferredFields,
        },
        create: {
            userId: session.user.id,
            education: formData.education,
            experience: formData.experience,
            achievements: formData.achievements,
            rawResumeText: formData.rawResumeText,
            skills: formData.skills,
            preferredFields: formData.preferredFields,
        },
    });

    revalidatePath("/profile");
    return profile;
}

export async function getProfile() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return null;

    return await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
    });
}
