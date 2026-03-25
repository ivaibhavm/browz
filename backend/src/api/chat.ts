import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from "express"
import { getSystemPrompt } from "../prompts"
import { authMiddleware } from "../middleware/auth";
import { rateLimitPerUser } from "../middleware/rateLimit";

const ai = new GoogleGenAI({});

const router = express.Router()
router.use(express.json())

router.post(
    "/",
    authMiddleware,
    rateLimitPerUser,
    async (req, res): Promise<void> => {
        try {
            const messages: any[] = req.body.messages;

            if (!Array.isArray(messages)) {
                res.status(400).json({ error: "Invalid messages" });
                return;
            }

            const contents = messages.map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents,
                config: {
                    systemInstruction: {
                        role: "system",
                        parts: [{ text: getSystemPrompt() }]
                    }
                }
            });

            res.json({ response: response.text });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
);

export default router