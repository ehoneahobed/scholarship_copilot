import { tavily as tavilyClient } from "@tavily/core";

const tavily = tavilyClient({ apiKey: process.env.TAVILY_API_KEY || "" });

export async function scoutScholarships(query: string) {
    try {
        console.log(`Scouting for: ${query}`);
        const response = await tavily.search(query, {
            searchDepth: "advanced",
            includeRawContent: true,
            maxResults: 5,
        });

        return response.results.map((result: any) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            rawContent: result.rawContent,
        }));
    } catch (error) {
        console.error("Tavily Search Error:", error);
        return [];
    }
}

/**
 * Generates search queries based on user profile
 */
export function generateSearchQueries(profile: any) {
    const fields = profile.preferredFields || [];
    const skills = profile.skills || [];
    
    const queries = [
        `scholarships for ${fields.join(" ")} students 2026`,
        `academic grants for ${skills.slice(0, 2).join(" ")} expertise`,
        `international scholarships for ${profile.education?.[0]?.degree || "undergraduate"} students`,
    ];

    return queries;
}
