import express from 'express'

import {chat_controller} from '../controllers/chat.controller.js'

const router = express.Router();

/**
 * POST /api/chat
 * Chat endpoint that connects to Google Gemini API
 * Accepts either:
 *  - { chatHistory: ChatHistoryItem[] }  (what the widget sends)
 *  - { message: string }                (fallback single message)
 */
router.post('/', chat_controller)

export default router;
