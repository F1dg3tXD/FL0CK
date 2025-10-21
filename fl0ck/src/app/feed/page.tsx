"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: {
        name?: string;
        avatar_url?: string;
        username?: string;
        verified?: boolean;
    };
}

interface UserSearch {
    user_id: string;
    avatar_url?: string;
}

export default function FeedPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<UserSearch[]>([]);

    async function fetchPosts() {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (Array.isArray(data)) {
            // legacy: if API returns array
            setPosts(data);
        } else if (Array.isArray(data.posts)) {
            setPosts(data.posts);
        } else {
            setPosts([]);
        }
    }

    async function handlePost() {
        if (!newPost.trim()) return;
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newPost }),
        });
        if (res.ok) {
            setNewPost("");
            fetchPosts();
        }
    }

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!search.trim()) {
            setResults([]);
            return;
        }
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(search)}`);
        const data: UserSearch[] = await res.json();
        setResults(data);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!session)
        return (
            <div className="text-center p-8">
                <p>Please sign in first.</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-sky-400">FL0CK Feed</h1>
                <button
                    onClick={() => signOut()}
                    className="bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700"
                >
                    Sign out
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    className="flex-grow bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-sky-500 hover:bg-sky-600 px-4 rounded-lg">Search</button>
            </form>

            {results.length > 0 && (
                <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-sky-400">Users</h2>
                    <div className="flex flex-col gap-2">
                        {results.map((u) => (
                            <Link
                                key={u.user_id}
                                href={`/profile/${u.user_id}`}
                                className="hover:bg-neutral-800 p-2 rounded-md flex items-center gap-3"
                            >
                                <Image
                                    src={u.avatar_url || "/res/icon.png"}
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-neutral-700"
                                />
                                <span className="text-white">@{u.user_id}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Post composer */}
            <div className="mb-6 flex gap-2">
                <input
                    className="flex-grow bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white"
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button
                    onClick={handlePost}
                    className="bg-sky-500 hover:bg-sky-600 px-4 rounded-lg"
                >
                    Post
                </button>
            </div>

            {/* Feed */}
            <div className="flex flex-col gap-4">
                    {posts.map((p) => (
                    <div
                        key={p.id}
                        className="bg-neutral-900 p-4 rounded-xl border border-neutral-800"
                    >
                        <div className="flex items-start gap-3">
                            <Image
                                src={p.profiles?.avatar_url || "/res/icon.png"}
                                alt="avatar"
                                width={48}
                                height={48}
                                className="rounded-full border border-neutral-700"
                            />
                            <div>
                                <p className="text-white">{p.content}</p>
                                <p className="text-sm text-neutral-500 mt-1">
                                    <Link
                                        href={`/user/${p.user_id}`}
                                        className="text-sky-400 hover:underline flex items-center gap-2 inline-block"
                                    >
                                        <span>@{p.profiles?.username || p.user_id}</span>
                                        {p.profiles?.verified && (
                                            <Image src="/res/verified.png" alt="verified" width={16} height={16} />
                                        )}
                                    </Link>{" "}
                                    — {new Date(p.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
