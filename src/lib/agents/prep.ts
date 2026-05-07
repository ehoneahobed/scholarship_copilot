import { generateObject } from "@/lib/gemini";

export async function identifyApplicationGaps(scholarship: any, profile: any) {
    const prompt = `
        Analyze this scholarship application and the user's profile.
        Identify specific pieces of information or personal anecdotes that are MISSING but required to write a high-quality essay for these prompts.
        
        Scholarship Prompts:
        ${JSON.stringify(scholarship.structuredData.essay_prompts, null, 2)}
        
        User Profile:
        ${JSON.stringify(profile, null, 2)}
        
        Return a JSON object:
        {
            "gaps": [
                {
                    "id": "string",
                    "field": "string",
                    "reason": "Why is this needed?",
                    "question_for_user": "A clear question to ask the user to get this info."
                }
            ]
        }
    `;

    try {
        const result = await generateObject(prompt, {});
        return result.gaps;
    } catch (error) {
        console.error("Gap Analysis Error:", error);
        return [];
    }
}
