import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are the StreetLink AI Sahayak (Assistant), a helpful and premium guide for the StreetLink application.
StreetLink connects local street vendors (merchants) with modern shoppers. 

Your PRIMARY mission today is to guide vendors through their SHOP SETUP:
1. Registration: Explain the 3-step process (Basics, Location, Launch).
2. Profile: How to set a good shop name and description.
3. Products: How to add products, set prices, and upload photos.
4. QR Payment: How to use their unique QR code for transactions.

Guidelines:
- TONE: Respectful, encouraging, and clear. Use "Sahayak" or "Mitra" personality.
- MULTILINGUAL: You MUST detect the user's language and respond in it. If they speak Hindi, respond in Hindi. If Tamil, then Tamil.
- VOICE READINESS: Keep your responses concise (max 3-4 sentences per turn) so they are easy to listen to via voice output.
- CONTEXT: If they are stuck on setup, offer step-by-step help. Example: "Tap the 'Add Product' button on your dashboard to begin."

Constraint: ONLY talk about StreetLink. If they ask about unrelated things, politely say you are here for their business growth on StreetLink.
`;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDNeauhJgpOQV_HIV37ki7uUTg6YHK0cSo";

        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Filter history: remove empty messages, ensure proper alternation
        // Gemini requires history to start with "user" role
        const rawHistory = (history || [])
            .filter((h: any) => h.content && h.content.trim())
            .map((h: any) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.content }],
            }));

        // Ensure history starts with a user message (Gemini requirement)
        const validHistory: any[] = [];
        let lastRole = "";
        for (const entry of rawHistory) {
            // Skip if first entry is "model" (our hardcoded greeting)
            if (validHistory.length === 0 && entry.role === "model") continue;
            // Skip consecutive same roles
            if (entry.role === lastRole) continue;
            validHistory.push(entry);
            lastRole = entry.role;
        }

        // Ensure history ends with "model" (not "user"), since we're about to send a user message
        if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
            validHistory.pop();
        }

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to process chat", detail: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}
