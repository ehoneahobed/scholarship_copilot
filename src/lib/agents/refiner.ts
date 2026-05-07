import { generateText } from "@/lib/gemini";

export async function refineEssay(draft: string, scholarship: any) {
    const prompt = `
        You are a Senior Editor and Scholarship Reviewer. You have been given an initial essay draft.
        Your task is to refine it for clarity, impact, and tone, while ensuring it perfectly matches the scholarship's criteria.
        
        SCHOLARSHIP CRITERIA:
        ${JSON.stringify(scholarship.structuredData, null, 2)}
        
        INITIAL DRAFT:
        ${draft}
        
        TASKS:
        1. Critically evaluate the draft against the criteria.
        2. Improve word choice and flow.
        3. Ensure the tone is persuasive yet humble.
        4. Fix any grammatical or structural issues.
        
        Return the FINAL polished version of the essay.
    `;

    try {
        const finalPolish = await generateText(prompt);
        return finalPolish;
    } catch (error) {
        console.error("Refining Error:", error);
        return draft; // Fallback to original draft
    }
}
