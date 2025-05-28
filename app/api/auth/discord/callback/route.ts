import { OAUTH_CONFIG, createUser, getUserByEmail, createSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error || !code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch(OAUTH_CONFIG.discord.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: OAUTH_CONFIG.discord.clientId,
        client_secret: OAUTH_CONFIG.discord.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: OAUTH_CONFIG.discord.redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from Discord
    const userResponse = await fetch(OAUTH_CONFIG.discord.userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info")
    }

    const discordUser = await userResponse.json()

    // Check if user exists or create new one
    let user = getUserByEmail(discordUser.email)
    if (!user) {
      user = createUser({
        email: discordUser.email,
        name: discordUser.global_name || discordUser.username,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
        provider: "discord",
      })
    }

    // Create session
    const sessionId = createSession(user.id)

    // Set session cookie and redirect
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`)
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error) {
    console.error("Discord callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`)
  }
}
