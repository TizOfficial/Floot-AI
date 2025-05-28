"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, MessageCircle, Sparkles, Shield, Zap, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "auth_failed":
          setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.")
          break
        case "no_email":
          setError("Keine E-Mail-Adresse gefunden. Bitte stelle sicher, dass deine E-Mail öffentlich ist.")
          break
        default:
          setError("Ein unbekannter Fehler ist aufgetreten.")
      }
    }
  }, [searchParams])

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück!</h1>
          <p className="text-gray-400">Melde dich an, um mit der KI zu chatten</p>
        </div>

        {/* Login Card */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Anmelden</CardTitle>
            <CardDescription className="text-gray-400">Wähle deinen bevorzugten Anbieter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            )}

            {/* Discord Login */}
            <Button
              onClick={handleDiscordLogin}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white h-12 text-base font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Mit Discord anmelden
            </Button>

            {/* GitHub Login */}
            <Button
              onClick={handleGitHubLogin}
              className="w-full bg-[#24292e] hover:bg-[#1a1e22] text-white h-12 text-base font-medium"
            >
              <Github className="w-5 h-5 mr-3" />
              Mit GitHub anmelden
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-gray-400">Warum anmelden?</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Sichere und private Gespräche</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Personalisierte KI-Erfahrung</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Chat-Verlauf speichern</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>
            Durch die Anmeldung stimmst du unseren{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Nutzungsbedingungen
            </a>{" "}
            zu.
          </p>
        </div>
      </div>
    </div>
  )
}
