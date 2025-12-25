"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, X, Minus } from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatHistoryItem {
  role: "user" | "model"
  parts: { text: string }[]
}

interface ChatWidgetProps {
  /** API endpoint for chat - defaults to /api/chat */
  apiEndpoint?: string
  /** Brand name shown in header */
  brandName?: string
  /** Subtitle shown in header */
  subtitle?: string
  /** Welcome title when no messages */
  welcomeTitle?: string
  /** Welcome message when no messages */
  welcomeMessage?: string
  /** Input placeholder text */
  placeholder?: string
  /** Primary color (header, buttons, user messages) */
  primaryColor?: string
  /** Position on screen */
  position?: "bottom-right" | "bottom-left"
  /** Start open or closed */
  defaultOpen?: boolean
  /** Custom header icon */
  headerIcon?: React.ReactNode
}

export function ChatWidget({
  apiEndpoint = "/api/chat",
  brandName = "Chat Support",
  subtitle = "Always here to help",
  welcomeTitle = "Welcome!",
  welcomeMessage = "How can we help you today?",
  placeholder = "Type your message...",
  primaryColor = "#000000",
  position = "bottom-right",
  defaultOpen = false,
  headerIcon,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const positionClass = position === "bottom-right" ? "right-6" : "left-6"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const sendMessage = async () => {
    const userMessage = inputValue.trim()
    if (!userMessage || isLoading) return

    setInputValue("")
    setIsLoading(true)
    addMessage(userMessage, true)

    const newUserHistory: ChatHistoryItem = {
      role: "user",
      parts: [{ text: userMessage }],
    }

    const updatedHistory = [...chatHistory, newUserHistory]
    setChatHistory(updatedHistory)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: updatedHistory }),
      })

      let data: any = null
      try {
        data = await response.json()
      } catch (e) {
        console.error("Failed to parse chat API JSON:", e)
      }

      const success = data?.success !== false && response.ok
      const botResponse =
        (success && (data?.response as string)) ||
        (data?.response as string) ||
        "Sorry, I couldn't process that request."

      addMessage(botResponse, false)

      const newBotHistory: ChatHistoryItem = {
        role: "model",
        parts: [{ text: botResponse }],
      }
      setChatHistory([...updatedHistory, newBotHistory])
    } catch (error) {
      console.error("Network or unexpected error calling chat API:", error)
      addMessage("Sorry, something went wrong. Please try again.", false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${positionClass} w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50`}
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 ${positionClass} bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden z-50 ${
        isMinimized ? "w-72 h-14" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div
        className="text-white px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            {headerIcon || <MessageCircle className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-medium text-sm">{brandName}</h3>
            {!isMinimized && <p className="text-xs opacity-75">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-130px)] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{welcomeTitle}</h4>
                <p className="text-sm text-gray-500">{welcomeMessage}</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    message.isUser
                      ? "text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}
                  style={message.isUser ? { backgroundColor: primaryColor } : undefined}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatWidget
