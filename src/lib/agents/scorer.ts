import { generateStructuredData } from "@/lib/gemini";

export async function scoreScholarshipFit(scholarship: any, profile: any) {
    const prompt = `
        Evaluate the fit between this user profile and the scholarship requirements.
        
        Scholarship:
        ${JSON.stringify(scholarship, null, 2)}
        
        User Profile:
        ${JSON.stringify(profile, null, 2)}
        
        Return a JSON object:
        {
            "fit_score": 0-100,
            "confidence": 0-1,
            "justification": ["string"],
            "missing_information": ["string"]
        }
    `;

    try {
        const result = await generateStructuredData(prompt, {});
        return result;
    } catch (error) {
        console.error("Scoring Error:", error);
        return { fit_score: 0, confidence: 0, justification: ["Error during scoring"], missing_information: [] };
    }
}
