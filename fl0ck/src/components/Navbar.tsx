"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { GitHubSession } from "../lib/authOptions";

export default function Navbar() {
    const { data: session } = useSession() as { data: GitHubSession | null };

    return (
        <nav className="flex items-center justify-between bg-neutral-900 px-6 py-4 border-b border-neutral-800">
            <h1 className="text-2xl font-bold text-sky-400">FL0CK</h1>

            {session ? (
                <div className="flex items-center gap-3">
                    <span className="text-neutral-300 flex items-center gap-2">
                        {session.user?.name}
                        {/** If the session includes a verified flag show the badge */}
                        {session.user?.username && (
                            // show verified badge if profile has verified flag available in session.user
                            <Image src="/res/verified.png" alt="verified" width={16} height={16} className="inline-block" />
                        )}
                    </span>
                    {session.user?.image && (
                        <Image
                            src={session.user.image}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-full border border-neutral-700"
                        />
                    )}
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-sky-400 hover:text-sky-300"
                    >
                        Sign out
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => signIn("github")}
                    className="text-sky-400 hover:text-sky-300"
                >
                    Sign in
                </button>
            )}
        </nav>
    );
}
