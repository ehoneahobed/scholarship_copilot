"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ProfileData {
    education: any;
    experience: any;
    volunteering: any;
    achievements: any;
    rawResumeText: string;
    skills: string[];
    preferredFields: string[];
    nationality: string;
    residency: string;
    isFirstGen: boolean;
    gender: string;
    ethnicity: string;
    householdContext: string;
    careerGoals: string;
    currentGPA: string;
}

export async function saveProfile(formData: ProfileData) {
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
            volunteering: formData.volunteering,
            achievements: formData.achievements,
            rawResumeText: formData.rawResumeText,
            skills: formData.skills,
            preferredFields: formData.preferredFields,
            nationality: formData.nationality,
            residency: formData.residency,
            isFirstGen: formData.isFirstGen,
            gender: formData.gender,
            ethnicity: formData.ethnicity,
            householdContext: formData.householdContext,
            careerGoals: formData.careerGoals,
            currentGPA: formData.currentGPA,
        },
        create: {
            userId: session.user.id,
            education: formData.education,
            experience: formData.experience,
            volunteering: formData.volunteering,
            achievements: formData.achievements,
            rawResumeText: formData.rawResumeText,
            skills: formData.skills,
            preferredFields: formData.preferredFields,
            nationality: formData.nationality,
            residency: formData.residency,
            isFirstGen: formData.isFirstGen,
            gender: formData.gender,
            ethnicity: formData.ethnicity,
            householdContext: formData.householdContext,
            careerGoals: formData.careerGoals,
            currentGPA: formData.currentGPA,
        },
    });

    revalidatePath("/onboarding");
    revalidatePath("/dashboard");
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
