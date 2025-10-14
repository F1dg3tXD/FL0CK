// User Search API Route
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // your Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-only key
);
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();

  if (!q) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, avatar_url, bio")
    .ilike("user_id", `%${q}%`)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
