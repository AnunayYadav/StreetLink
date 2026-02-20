import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
        const { message, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello" }] },
                { role: "model", parts: [{ text: "Hello! I am the StreetLink Support AI. How can I assist you today?" }] },
                ...history.map((h: any) => ({
                    role: h.role === "user" ? "user" : "model",
                    parts: [{ text: h.content }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Prepend system prompt to the first user message or handle it as instructions
        // Gemini 1.5/2.0 supports system instructions specifically if configured, 
        // but for simplicity here we can use a wrapper or just trust the chat history setup.
        // Actually, with model.startChat, we should ideally use systemInstruction.

        const modelWithInstructions = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        const chatWithInstructions = modelWithInstructions.startChat({
            history: history.map((h: any) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.content }]
            }))
        });

        const result = await chatWithInstructions.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
