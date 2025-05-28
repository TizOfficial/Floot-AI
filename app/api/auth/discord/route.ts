import { generateAuthUrl } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const authUrl = generateAuthUrl("discord")
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Discord auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
