import { generateText } from "@/lib/gemini";

export async function generateEssayDraft(scholarship: any, profile: any, userContext: any) {
    const prompt = `
        You are an expert Scholarship Consultant. Your goal is to draft a high-quality, authentic scholarship essay.
        
        FACTUAL SOURCE OF TRUTH (Profile):
        ${JSON.stringify(profile, null, 2)}
        
        SUPPLEMENTAL CONTEXT (User's specific anecdotes for this scholarship):
        ${JSON.stringify(userContext, null, 2)}
        
        SCHOLARSHIP DETAILS & PROMPTS:
        ${JSON.stringify(scholarship.structuredData, null, 2)}
        
        STRICT RULES:
        1. DO NOT fabricate any facts. Only use information from the Profile and Supplemental Context.
        2. Maintain a professional yet authentic student voice.
        3. Address all essay prompts specifically.
        4. Focus on impact and specific achievements.
        
        Draft the essay(s) below:
    `;

    try {
        const draft = await generateText(prompt);
        return draft;
    } catch (error) {
        console.error("Drafting Error:", error);
        return "Failed to generate draft.";
    }
}
