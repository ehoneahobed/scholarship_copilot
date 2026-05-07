"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { EducationLevel, Gender, Ethnicity } from "@/generated/client";
import { extractProfileFromText } from "@/lib/agents/extractor";

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
    gender: Gender | "";
    ethnicity: Ethnicity | "";
    householdContext: string;
    careerGoals: string;
    currentGPA: string;
    levelOfEducation: EducationLevel | "";
}

export async function magicAutoFill(text: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    return await extractProfileFromText(text);
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
            gender: formData.gender === "" ? null : formData.gender,
            ethnicity: formData.ethnicity === "" ? null : formData.ethnicity,
            householdContext: formData.householdContext,
            careerGoals: formData.careerGoals,
            currentGPA: formData.currentGPA,
            levelOfEducation: formData.levelOfEducation === "" ? null : formData.levelOfEducation,
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
            gender: formData.gender === "" ? null : formData.gender,
            ethnicity: formData.ethnicity === "" ? null : formData.ethnicity,
            householdContext: formData.householdContext,
            careerGoals: formData.careerGoals,
            currentGPA: formData.currentGPA,
            levelOfEducation: formData.levelOfEducation === "" ? null : formData.levelOfEducation,
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
