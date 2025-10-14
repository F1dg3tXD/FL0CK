// Navbar Component
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="flex items-center justify-between bg-neutral-900 px-6 py-4 border-b border-neutral-800">
            <h1 className="text-2xl font-bold text-sky-400">FL0CK</h1>

            {session ? (
                <div className="flex items-center gap-3">
                    <span className="text-neutral-300">{session.user?.name}</span>
                    <img
                        src={session.user?.image || ""}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-neutral-700"
                    />
                    <button onClick={() => signOut()} className="text-sm text-sky-400 hover:text-sky-300">
                        Sign out
                    </button>
                </div>
            ) : (
                <button onClick={() => signIn("github")} className="text-sky-400 hover:text-sky-300">
                    Sign in
                </button>
            )}
        </nav>
    );
}
