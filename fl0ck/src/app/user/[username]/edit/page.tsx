// Edit Profile Page
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const { data: session } = useSession();

{
    session?.user?.username === username && (
        <a
            href={`/user/${username}/edit`}
            className="inline-block mt-6 bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg"
        >
            Edit Profile
        </a>
    )
}

export default function EditProfilePage() {
    const { username } = useParams();
    const router = useRouter();
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const res = await fetch(`/api/users/${username}`);
            const data = await res.json();
            setBio(data.bio || "");
            setAvatarUrl(data.avatar_url || "");
            setLoading(false);
        }
        loadProfile();
    }, [username]);

    async function saveProfile() {
        const res = await fetch(`/api/users/${username}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bio, avatar_url: avatarUrl }),
        });
        if (res.ok) router.push(`/user/${username}`);
    }

    if (loading)
        return <div className="p-8 text-center text-neutral-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-sky-400">Edit Profile</h1>

            <div className="mb-4">
                <label className="block mb-1 text-neutral-400">Avatar URL</label>
                <input
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1 text-neutral-400">Bio</label>
                <textarea
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 h-24"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <button
                onClick={saveProfile}
                className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg"
            >
                Save
            </button>
        </div>
    );
}

