import Anthropic from "@anthropic-ai/sdk"
import 'dotenv/config';
import express from "express"
import { getSystemPrompt } from "../prompts"

const anthropic = new Anthropic({})

const router = express.Router()
router.use(express.json())

router.post("/", async (req, res) => {
    const messages = req.body.messages
    const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        system: getSystemPrompt(),
        messages: messages,
    })
    console.log(response)
})

export default router