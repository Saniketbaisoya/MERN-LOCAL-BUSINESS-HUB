import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

// Domain/context instructions for the chatbot.
// Edit this text to "train" the behaviour of the model.
const CHAT_SYSTEM_CONTEXT = `You are an AI assistant for the Local Business Hub platform.You are a Real Estate Virtual Assistant that helps users find properties, understand listings, navigate the platform, and resolve issues efficiently. Respond in a professional, concise, and structured manner, clearly identifying user intent. Provide accurate information, personalized guidance when possible, and clear next steps. Do not fabricate data or request sensitive information, and redirect authentication issues to secure flows. Escalate to human support when necessary.`

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * POST /api/chat
 * Chat endpoint that connects to Google Gemini API
 * Accepts either:
 *  - { chatHistory: ChatHistoryItem[] }  (what the widget sends)
 *  - { message: string }                (fallback single message)
 */
router.post('/', async (req, res) => {
  try {
    const { chatHistory, message } = req.body || {}

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        response: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.',
      })
    }

    // Attach your custom context as a system instruction so every
    // response follows the behaviour you describe above.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: CHAT_SYSTEM_CONTEXT,
    })

    // If we received a chat history (from the widget), use the chat API
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const formattedHistory = []

      for (const item of chatHistory) {
        if (item?.role && Array.isArray(item.parts)) {
          formattedHistory.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: item.parts.map((p) => ({ text: p.text || '' })),
          })
        }
      }

      // Last message is the most recent user input
      const lastMessage = formattedHistory.pop()

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      })

      const userMessage = lastMessage?.parts?.[0]?.text || 'Hello'
      const result = await chat.sendMessage(userMessage)
      const response = await result.response
      const botResponse = response.text()

      return res.status(200).json({
        success: true,
        response: botResponse,
      })
    }

    // Fallback: no history, just a single message
    const prompt = typeof message === 'string' && message.trim() ? message.trim() : 'Hello'

    const result = await model.generateContent(prompt)
    const response = await result.response
    const botResponse = response.text()

    return res.status(200).json({
      success: true,
      response: botResponse,
    })
  } catch (error) {
    console.error('Error in /api/chat:', error)

    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return res.status(200).json({
        success: false,
        response: 'API quota exceeded. Please wait a moment and try again.',
      })
    }

    return res.status(200).json({
      success: false,
      response:
        error?.message || 'Sorry, something went wrong while talking to the AI service. Please try again.',
    })
  }
})

export default router
