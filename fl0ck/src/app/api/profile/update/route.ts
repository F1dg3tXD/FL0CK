// src/app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, GitHubSession } from "@/lib/authOptions";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // Cast session to GitHubSession
  const session = (await getServerSession(authOptions)) as GitHubSession | null;

  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio, avatar_url } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({ name, bio, avatar_url })
    .eq("user_id", session.user.username);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
