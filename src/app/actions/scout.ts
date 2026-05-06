"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { scoutScholarships, generateSearchQueries } from "@/lib/agents/scout";
import { extractScholarshipData } from "@/lib/agents/extractor";
import { scoreScholarshipFit } from "@/lib/agents/scorer";
import { revalidatePath } from "next/cache";

export async function runScoutPipeline() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const profile = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) throw new Error("Profile not found. Please complete onboarding.");

    const queries = generateSearchQueries(profile);
    
    // For MVP, we run just the first query to avoid long timeouts
    const results = await scoutScholarships(queries[0]);

    const processed = [];

    for (const result of results) {
        // 1. Check if scholarship already exists
        let scholarship = await prisma.scholarship.findUnique({
            where: { sourceUrl: result.url }
        });

        if (!scholarship) {
            // 2. Extract Data
            const structuredData = await extractScholarshipData(result.content || result.rawContent || "");
            
            if (!structuredData) continue;

            // 3. Save Scholarship
            scholarship = await prisma.scholarship.create({
                data: {
                    title: structuredData.title || result.title,
                    provider: structuredData.provider || "Unknown",
                    sourceUrl: result.url,
                    rawText: result.content,
                    structuredData: structuredData,
                }
            });
        }

        // 4. Score Fit (State: DISCOVERED -> SCORED)
        const existingApp = await prisma.application.findFirst({
            where: { userId: session.user.id, scholarshipId: scholarship.id }
        });

        if (!existingApp) {
            const evaluation = await scoreScholarshipFit(scholarship.structuredData, profile);
            
            await prisma.application.create({
                data: {
                    userId: session.user.id,
                    scholarshipId: scholarship.id,
                    status: "SCORED",
                    fitScore: evaluation.fit_score,
                    fitJustification: evaluation.justification.join(". "),
                    processingLogs: evaluation,
                }
            });
            
            processed.push({ title: scholarship.title, score: evaluation.fit_score });
        }
    }

    revalidatePath("/dashboard");
    return processed;
}

export async function getScoredApplications() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return [];

    return await prisma.application.findMany({
        where: { userId: session.user.id },
        include: { scholarship: true },
        orderBy: { fitScore: 'desc' }
    });
}
