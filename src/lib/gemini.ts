import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateStructuredData(prompt: string, schema: any) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp", // or latest stable
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
}

export async function generateText(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
