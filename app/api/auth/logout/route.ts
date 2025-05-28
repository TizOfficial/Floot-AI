import { deleteSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (sessionId) {
      deleteSession(sessionId)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete("session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
