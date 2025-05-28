// OAuth Configuration
export const OAUTH_CONFIG = {
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`,
    scope: "identify email",
    authUrl: "https://discord.com/api/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    userUrl: "https://discord.com/api/users/@me",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
    scope: "user:email",
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userUrl: "https://api.github.com/user",
  },
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  provider: "discord" | "github"
  createdAt: Date
}

// Simple in-memory user store (in production use a database)
const users = new Map<string, User>()
const sessions = new Map<string, { userId: string; expiresAt: Date }>()

export function createUser(userData: Omit<User, "id" | "createdAt">): User {
  const user: User = {
    id: crypto.randomUUID(),
    ...userData,
    createdAt: new Date(),
  }
  users.set(user.id, user)
  return user
}

export function getUserById(id: string): User | undefined {
  return users.get(id)
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return undefined
}

export function createSession(userId: string): string {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  sessions.set(sessionId, { userId, expiresAt })
  return sessionId
}

export function getSession(sessionId: string): { userId: string; expiresAt: Date } | undefined {
  const session = sessions.get(sessionId)
  if (session && session.expiresAt > new Date()) {
    return session
  }
  if (session) {
    sessions.delete(sessionId) // Clean up expired session
  }
  return undefined
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function generateAuthUrl(provider: "discord" | "github"): string {
  const config = OAUTH_CONFIG[provider]
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope,
    state,
  })

  return `${config.authUrl}?${params.toString()}`
}
