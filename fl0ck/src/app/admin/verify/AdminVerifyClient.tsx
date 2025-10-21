"use client";

import { useState } from "react";
import Image from "next/image";

interface ProfileResult {
  user_id: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  username?: string;
}

export default function AdminVerifyClient() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return setResults([]);
    setLoading(true);
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data || []);
    setLoading(false);
  }

  async function toggleVerified(username: string, value: boolean) {
    const res = await fetch(`/api/admin/verify-auth/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: value }),
    });
    if (res.ok) doSearch();
  }

  return (
    <div>
      <form onSubmit={doSearch} className="flex gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-grow bg-neutral-900 border border-neutral-800 rounded-lg p-3" placeholder="Search users..." />
        <button className="bg-sky-500 px-4 rounded-lg">Search</button>
      </form>

      {loading && <div className="text-neutral-400">Searching...</div>}

      <div className="flex flex-col gap-2">
        {results.map((u: ProfileResult) => (
          <div key={u.user_id} className="flex items-center justify-between bg-neutral-900 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <Image src={u.avatar_url || "/res/icon.png"} alt="avatar" width={40} height={40} className="rounded-full" />
              <div>
                <div className="text-white">{u.name || u.user_id}</div>
                <div className="text-neutral-400 text-sm">@{u.user_id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVerified(u.user_id, true)} className="bg-green-600 px-3 py-1 rounded">Verify</button>
              <button onClick={() => toggleVerified(u.user_id, false)} className="bg-red-600 px-3 py-1 rounded">Unverify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
