import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_API_KEY } from "../configuration/serverConfig.js";
// Initialize Gemini AI with API key from environment
// here add the .env's GEMINI_API_KEY by first seggregating into the configuration.js folder... //
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);



// Domain/context instructions for the chatbot.
// Edit this text to "train" the behaviour of the model.
const CHAT_SYSTEM_CONTEXT = `You are an AI assistant for the LocalBusinessHub platform.You are a Real Estate Virtual Assistant that helps users find properties, understand listings, navigate the platform, and resolve issues efficiently. Respond in a professional, concise, and structured manner, clearly identifying user intent. Provide accurate information, personalized guidance when possible, and clear next steps. Do not fabricate data or request sensitive information, and redirect authentication issues to secure flows. Escalate to human support when necessary.`

async function chatService(ChatData) {
    const {chatHistory, message} = ChatData;
    // Attach your custom context as a system instruction so every
    // response follows the behaviour you describe above.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: CHAT_SYSTEM_CONTEXT,
    });
    
    // If we received a chat history (from the widget), use the chat API
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const formattedHistory = []

        for (const item of chatHistory) {
            if (item?.role && Array.isArray(item.parts)) {
                formattedHistory.push({
                    role: item.role === 'user' ? 'user' : 'model',
                    parts: item.parts.map((p) => ({ text: p.text || '' })),
                });
            };
        };

        // Last message is the most recent user input
        const lastMessage = formattedHistory.pop();

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
            maxOutputTokens: 1000,
            },
        })

        const userMessage = lastMessage?.parts?.[0]?.text || 'Hello';
        const result = await chat.sendMessage(userMessage);
        return result.response.text();
    }

    // Fallback: no history, just a single message
    const prompt = typeof message === 'string' && message.trim() ? message.trim() : 'Hello';

    const result = await model.generateContent(prompt);
    return result.response.text();
}

export {
    chatService
};