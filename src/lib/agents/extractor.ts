import { generateStructuredData } from "@/lib/gemini";

export async function extractScholarshipData(rawContent: string) {
    const prompt = `
        Extract scholarship details from the following raw web content. 
        Return a valid JSON object matching this schema:
        {
            "title": "string",
            "provider": "string",
            "deadline": "ISO date string or null",
            "eligibility": {
                "citizenship": ["string"],
                "degree_level": "string",
                "gpa": "string or null",
                "field": ["string"]
            },
            "requirements": ["string"],
            "essay_prompts": ["string"],
            "amount": "string or null"
        }

        Raw Content:
        ${rawContent.slice(0, 5000)} // Limiting to prevent token overflow
    `;

    try {
        const data = await generateStructuredData(prompt, {});
        return data;
    } catch (error) {
        console.error("Extraction Error:", error);
        return null;
    }
}
