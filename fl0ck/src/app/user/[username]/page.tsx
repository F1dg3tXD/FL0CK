"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Profile {
    user_id: string;
    name?: string;
    bio?: string;
    avatar_url?: string;
    banner_url?: string;
    verified?: boolean;
}

interface Post {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
}

export default function UserProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchData() {
            const [profileRes, postsRes] = await Promise.all([
                fetch(`/api/users/${username}`),
                fetch(`/api/posts?user=${username}`),
            ]);

            const profileData: Profile = await profileRes.json();
            const postsData: Post[] = await postsRes.json();
            setProfile(profileData);
            setPosts(postsData);
        }
        fetchData();
    }, [username]);

    if (!profile) return <div className="text-center text-neutral-400 p-8">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="w-full h-48 bg-neutral-800 relative">
                {profile.banner_url && (
                    <Image src={profile.banner_url} alt="banner" className="w-full h-48 object-cover" width={1200} height={300} />
                )}
                <div className="absolute -bottom-12 left-8">
                    <Image
                        src={profile.avatar_url || "/res/icon.png"}
                        alt="avatar"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border-4 border-neutral-950"
                    />
                </div>
            </div>

            <div className="px-8 mt-16">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            {profile.name || profile.user_id}
                            {profile.verified && (
                                <Image src="/res/verified.png" alt="verified" width={20} height={20} />
                            )}
                        </h1>
                        <p className="text-neutral-400">@{profile.user_id}</p>
                    </div>
                </div>

                {profile.bio && <p className="text-neutral-300 mb-6">{profile.bio}</p>}

                <div className="border-b border-neutral-800 mb-4"></div>

                <h2 className="text-lg font-semibold text-neutral-300 mb-3">Posts</h2>
                <div className="flex flex-col gap-4">
                    {posts.length === 0 && <p className="text-neutral-500 text-sm">No posts yet.</p>}
                    {posts.map((p) => (
                        <div key={p.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                            <p>{p.content}</p>
                            <p className="text-sm text-neutral-500 mt-1">
                                @{p.user_id} — {new Date(p.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
