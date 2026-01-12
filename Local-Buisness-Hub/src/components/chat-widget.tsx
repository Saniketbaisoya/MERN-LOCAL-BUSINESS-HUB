"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, X, Minus, ChevronUp } from "lucide-react"

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
  apiEndpoint?: string
  brandName?: string
  subtitle?: string
  welcomeTitle?: string
  welcomeMessage?: string
  placeholder?: string
  primaryColor?: string
  position?: "bottom-right" | "bottom-left"
  defaultOpen?: boolean
  headerIcon?: React.ReactNode
}

export function ChatWidget({
  apiEndpoint = "/api/chat",
  brandName = "Local Business Hub",
  subtitle = "Always here to help",
  welcomeTitle = "Welcome!",
  welcomeMessage = "How can we help you today?",
  placeholder = "Type your message...",
  primaryColor = "#4f83f1", // Matching the blue in your image
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

  const positionClass = position === "bottom-right" ? "right-0 sm:right-6" : "left-0 sm:left-6"

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

      const data = await response.json()
      const botResponse = data?.response || "Sorry, I couldn't process that request."

      addMessage(botResponse, false)
      setChatHistory([...updatedHistory, { role: "model", parts: [{ text: botResponse }] }])
    } catch (error) {
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

  // 1. Floating Action Button (Closed State)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${position === "bottom-right" ? "right-6" : "left-6"} w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[9999]`}
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    )
  }

  return (
    <div
      className={`fixed z-[9999] transition-all duration-300 ease-in-out bg-white shadow-2xl border border-gray-200 
        ${positionClass} 
        ${isMinimized 
          ? "bottom-6 w-[280px] h-[60px] rounded-full mx-6 sm:mx-0" 
          : "bottom-0 sm:bottom-6 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] rounded-none sm:rounded-2xl"
        } overflow-hidden flex flex-col`}
    >
      {/* Header - Improved for mobile touch */}
      <div
        className={`flex items-center justify-between px-5 py-3 shrink-0 cursor-pointer sm:cursor-default`}
        style={{ backgroundColor: primaryColor }}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {headerIcon || <MessageCircle className="w-5 h-5 text-white" fill="white" />}
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-white leading-tight">{brandName}</h3>
            {!isMinimized && <p className="text-[11px] text-white/80 font-medium uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="w-5 h-5 text-white" /> : <Minus className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10" style={{ color: primaryColor }} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{welcomeTitle}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{welcomeMessage}</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] shadow-sm ${
                    message.isUser
                      ? "text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                  style={message.isUser ? { backgroundColor: primaryColor } : undefined}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className={`text-[10px] block mt-1 opacity-70 ${message.isUser ? "text-right" : "text-left"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom for mobile */}
          <div className="p-4 bg-white border-t border-gray-100 pb-safe sm:pb-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-transparent text-sm focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:grayscale"
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
