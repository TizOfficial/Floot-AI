"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/hooks/use-auth"
import { Send, User, Sparkles, Code, Calculator, Lightbulb, Heart, Briefcase } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const { user, loading, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login"
    }
  }, [loading, isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Kein Response Stream")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.trim() === "" || line.trim() === "data: [DONE]") continue

          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6)
              const data = JSON.parse(jsonStr)

              const content = data.choices?.[0]?.delta?.content
              if (content) {
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage && lastMessage.role === "assistant") {
                    lastMessage.content += content
                  }
                  return newMessages
                })
              }
            } catch (parseError) {
              console.log("Parse error:", parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setError(error.message)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `❌ Fehler: ${error.message}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt)
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-white">Lade...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Gemini AI Chat</h1>
                <p className="text-sm text-gray-400">Hallo {user?.name}! Powered by Google Gemini ✨</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-200px)] bg-black/40 backdrop-blur-xl border-white/10 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Hallo {user?.name}! 🚀</h2>
                <p className="text-gray-400 max-w-md mb-8">
                  Ich nutze Google Gemini AI und kann auf ALLE deine Fragen antworten - von Wissenschaft bis Alltag! ✨
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl">
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Erkläre mir die neuesten KI-Entwicklungen 2024")}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-medium">🤖 KI & Zukunft</div>
                        <div className="text-sm text-gray-400">Neueste Entwicklungen</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Schreibe mir einen Python Code für Machine Learning")}
                  >
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium">💻 Programmierung</div>
                        <div className="text-sm text-gray-400">Python ML Code</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Was ist der Sinn des Lebens?")}
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="font-medium">🤔 Philosophie</div>
                        <div className="text-sm text-gray-400">Sinn des Lebens</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Berechne 1847 * 293 + 5629")}
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">🧮 Mathematik</div>
                        <div className="text-sm text-gray-400">Komplexe Berechnungen</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Wie kann ich eine bessere Beziehung führen?")}
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="font-medium">❤️ Beziehungen</div>
                        <div className="text-sm text-gray-400">Liebe & Freundschaft</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-auto p-4 text-left"
                    onClick={() => handleStarterPrompt("Gib mir Karriere-Tipps für 2025")}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="font-medium">🚀 Karriere</div>
                        <div className="text-sm text-gray-400">Beruflicher Erfolg</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                        <AvatarFallback>
                          <Sparkles className="w-4 h-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500">
                        <AvatarFallback>
                          <User className="w-4 h-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                      <AvatarFallback>
                        <Sparkles className="w-4 h-4 text-white animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300">Gemini AI denkt nach... ✨</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-white/10 p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Frag mich ALLES - Gemini AI kann auf jede Frage antworten! ✨"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12 h-12 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Google Gemini AI - Kann auf ALLE Fragen antworten! ✨🚀
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
