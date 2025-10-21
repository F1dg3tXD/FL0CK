// src/app/api/users/[username]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions, GitHubSession } from "@/lib/authOptions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // your Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only key
);

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as GitHubSession | null;
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, bio, avatar_url, banner_url } = body;

  const { error } = await supabase
    .from("profiles")
    .update({ name, bio, avatar_url, banner_url })
  .eq("username", session.user.username);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}