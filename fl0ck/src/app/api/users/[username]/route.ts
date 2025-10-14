// src/app/api/users/[username]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", username)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
