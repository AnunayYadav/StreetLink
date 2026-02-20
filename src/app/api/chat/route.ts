import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDNeauhJgpOQV_HIV37ki7uUTg6YHK0cSo";

const SYSTEM_PROMPT = `You are the StreetLink AI Sahayak (Assistant), a helpful guide for street vendors.
Guide vendors through shop setup, products, and QR payments.
Be concise (3-4 sentences max). Respond in the user's language.
Only talk about StreetLink topics.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = body?.message || "Hello";
        const history = body?.history || [];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build clean history - only user/model pairs, skip initial bot greeting
        const cleanHistory: { role: string; parts: { text: string }[] }[] = [];
        for (const h of history) {
            if (!h?.content?.trim()) continue;
            const role = h.role === "user" ? "user" : "model";
            // Skip if it would create consecutive same-role entries
            if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === role) continue;
            // Skip leading model messages
            if (cleanHistory.length === 0 && role === "model") continue;
            cleanHistory.push({ role, parts: [{ text: h.content }] });
        }

        // Trim trailing user message (we'll send the new one)
        if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === "user") {
            cleanHistory.pop();
        }

        // Prepend system context to the user's message
        const fullMessage = `[System: ${SYSTEM_PROMPT}]\n\nUser message: ${message}`;

        const chat = model.startChat({
            history: cleanHistory,
        });

        const result = await chat.sendMessage(fullMessage);
        const text = result.response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        const msg = error?.message || error?.toString() || "Unknown error";
        console.error("Chat API Error:", msg);
        return NextResponse.json(
            { error: "Chat failed", detail: msg },
            { status: 500 }
        );
    }
}
