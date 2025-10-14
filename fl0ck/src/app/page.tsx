// Home Page
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="text-center p-8">Loading...</div>;
  if (session) router.push("/feed");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to <span className="text-sky-400">FL0CK</span></h1>
      <p className="text-neutral-400 mb-6 text-center max-w-md">
        A social network where you own your data — all posts, media, and activity are stored in your GitHub repository.
      </p>
      <button
        onClick={() => signIn("github")}
        className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-xl font-medium"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
