"use client"

import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold">Welcome to FL0CK</h2>
        <p className="mt-2 text-neutral-400">
          Sign in with GitHub to start connecting your creative repositories.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center mt-16">
      <h2 className="text-2xl font-semibold">
        Welcome, {session.user?.name}!
      </h2>
      <p className="mt-2 text-neutral-400">
        Your GitHub-linked creative space is ready.
      </p>
    </div>
  )
}
