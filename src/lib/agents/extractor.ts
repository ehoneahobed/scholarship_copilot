import { generateObject } from "@/lib/gemini";
import { z } from "zod";

const ProfileSchema = z.object({
    education: z.array(z.object({
        title: z.string(),
        organization: z.string(),
        date: z.string(),
        description: z.string(),
    })),
    experience: z.array(z.object({
        title: z.string(),
        organization: z.string(),
        date: z.string(),
        description: z.string(),
    })),
    achievements: z.array(z.object({
        title: z.string(),
        organization: z.string(),
        date: z.string(),
        description: z.string(),
    })),
    volunteering: z.array(z.object({
        title: z.string(),
        organization: z.string(),
        date: z.string(),
        description: z.string(),
    })),
    skills: z.array(z.string()),
    nationality: z.string().optional(),
    residency: z.string().optional(),
    currentGPA: z.string().optional(),
    levelOfEducation: z.string().optional(),
});

export async function extractProfileFromText(text: string) {
    const prompt = `
        You are an expert resume parser. Extract structured information from the following text to help a user build their scholarship profile.
        
        TEXT:
        ${text}
        
        RULES:
        1. Be as comprehensive as possible.
        2. Format all dates clearly (e.g., "Jan 2021 - Dec 2023").
        3. For education, the 'title' is the Degree/Field of Study.
        4. For experience/volunteering, the 'title' is the Job Title/Role.
        5. Map "levelOfEducation" to one of: HIGH_SCHOOL, UNDERGRADUATE, MASTERS, PHD, VOCATIONAL, OTHER.
        6. Map "gender" to one of: MALE, FEMALE, NON_BINARY, PREFER_NOT_TO_SAY, OTHER.
        7. Map "ethnicity" to one of: ASIAN, BLACK, HISPANIC, WHITE, MIDDLE_EASTERN, NATIVE, MULTIRACIAL, OTHER.
        
        Return a JSON object matching the ProfileSchema.
    `;

    try {
        const result = await generateObject(prompt, ProfileSchema);
        return result;
    } catch (error) {
        console.error("Extraction Error:", error);
        return null;
    }
}

export async function extractScholarshipData(rawContent: string) {
    const prompt = `
        You are an expert at parsing scholarship information from raw web content.
        
        CONTENT:
        ${rawContent.slice(0, 8000)}
        
        Extract structured scholarship information and return a JSON object:
        {
            "title": "Scholarship name",
            "provider": "Organization providing the scholarship",
            "amount": "Dollar amount or range",
            "deadline": "Application deadline",
            "eligibility": ["List of eligibility requirements"],
            "essay_prompts": ["List of essay questions or prompts"],
            "levelOfEducation": "Target education level",
            "fields_of_study": ["Relevant fields"],
            "gpa_requirement": "Minimum GPA if any",
            "citizenship_requirements": ["Citizenship/residency requirements"],
            "description": "Brief description of the scholarship"
        }
    `;

    try {
        return await generateObject(prompt, null);
    } catch (error) {
        console.error("Scholarship Extraction Error:", error);
        return null;
    }
}
