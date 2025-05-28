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
    const tokenResponse = await fetch(OAUTH_CONFIG.github.tokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: OAUTH_CONFIG.github.clientId,
        client_secret: OAUTH_CONFIG.github.clientSecret,
        code,
        redirect_uri: OAUTH_CONFIG.github.redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from GitHub
    const userResponse = await fetch(OAUTH_CONFIG.github.userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "AI-Chat-App",
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info")
    }

    const githubUser = await userResponse.json()

    // Get user email if not public
    let email = githubUser.email
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "AI-Chat-App",
        },
      })

      if (emailResponse.ok) {
        const emails = await emailResponse.json()
        const primaryEmail = emails.find((e: any) => e.primary)
        email = primaryEmail?.email || emails[0]?.email
      }
    }

    if (!email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_email`)
    }

    // Check if user exists or create new one
    let user = getUserByEmail(email)
    if (!user) {
      user = createUser({
        email,
        name: githubUser.name || githubUser.login,
        avatar: githubUser.avatar_url,
        provider: "github",
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
    console.error("GitHub callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`)
  }
}
