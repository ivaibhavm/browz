import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from "express"
import { getSystemPrompt } from "../prompts"

const ai = new GoogleGenAI({});

const router = express.Router()
router.use(express.json())

router.post("/", async (req, res) => {
    const messages: any[] = req.body.messages
    const contents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
            systemInstruction: {
                role: "system",
                parts: [{ text: getSystemPrompt() }]
            }
        }
    });
    res.json({
        response: response.text
    });
})

export default router