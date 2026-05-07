import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates structured JSON data using a Zod-like schema logic.
 * Note: For standard Gemini API, we use responseMimeType: "application/json"
 */
export async function generateObject(prompt: string, schema?: any) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error in generateObject:", e, "Raw text:", text);
        return null;
    }
}

export async function generateText(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
