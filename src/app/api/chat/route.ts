import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are the StreetLink Support AI, a helpful and premium assistant for the StreetLink application.
StreetLink is a platform designed to connect local street vendors (merchants) with modern shoppers. Its mission is to digitize the "street-side charm" with efficiency and elegance.

Key Features of StreetLink:
1. For Merchants:
   - Digital Storefront: Vendors can list their products and manage inventory.
   - Merchant Dashboard: Provides real-time updates on orders, balance, and deliveries.
   - AI Smart Insights: Offers localized trends, pricing analysis, and customer heatmaps to help businesses grow.
   - Shop QR Code: Every merchant gets a unique QR code to share their digital shop.
   - Multi-language Support: Supports 10+ Indian languages (Hindi, Tamil, Telugu, etc.).

2. For Customers (Explorers):
   - Market Explorer: Discover nearby street shops and vendors on a map.
   - Verified Merchants: Ensuring quality and trust in local commerce.
   - Direct Contact: Customers can call or WhatsApp vendors directly from their profile.

3. Onboarding:
   - A simple 3-step process: Shop basics, Identity & Reach (location), and Launch (contact details).

Your Guidelines:
- Greet users warmly and professionally.
- Guide them based on their needs (if they are a merchant or a shopper).
- ONLY talk about StreetLink related topics. If a user asks about anything else, politely decline and redirect them back to StreetLink features.
- Keep the tone premium, helpful, and modern.
- Respond in the language the user speaks if possible (English, Hindi, Tamil, Telugu, etc.).

If a user asks how to get started:
- If a vendor: Tell them to go to "Register Your Shop" or "Merchant Dashboard".
- If a shopper: Tell them to check the "Market Explorer" to find shops nearby.
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
