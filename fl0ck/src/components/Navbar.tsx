"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="flex items-center justify-between bg-neutral-900 p-4 border-b border-neutral-800">
            <h1 className="text-xl font-bold">FL0CK</h1>
            <div>
                {session ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={session.user?.image ?? ""}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <span>{session.user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn("github")}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Sign in with GitHub
                    </button>
                )}
            </div>
        </nav>
    )
}
