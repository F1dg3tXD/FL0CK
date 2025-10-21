// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions, GitHubSession } from "@/lib/authOptions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role key
);

// GET posts including profile info for each post's author
export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select(`id, content, created_at, user_id, profiles (name, avatar_url, username, verified)`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as GitHubSession | null;
  if (!session?.user?.username) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { content } = await req.json();

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        content,
        user_id: session.user.username,
        created_at: new Date(),
      },
    ])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
