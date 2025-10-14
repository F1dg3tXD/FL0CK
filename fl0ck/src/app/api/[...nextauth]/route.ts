import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { NextRequest, NextResponse } from "next/server"

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler
