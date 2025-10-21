import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions, GitHubSession } from "@/lib/authOptions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdminUsername(username?: string | null) {
  if (!username) return false;

  // Prefer checking the admin_users table (requires service role key)
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("username, enabled")
      .eq("username", username)
      .limit(1)
      .maybeSingle();

    if (error) {
      // fallback to env var check below
      console.error("admin_users table check error:", error.message);
    } else if (data && data.enabled) {
      return true;
    }
  } catch (err) {
    console.error("admin_users table check failed:", err);
  }

  // fallback to env var list if table is not available
  const env = process.env.ADMIN_USERS || process.env.ADMIN_USERNAME || "";
  const admins = env.split(",").map((s) => s.trim()).filter(Boolean);
  return admins.includes(username);
}

export async function POST(req: Request, context: { params: Promise<{ username: string }> }) {
  const session = (await getServerSession(authOptions)) as GitHubSession | null;
  const currentUser = session?.user?.username;
  if (!(await isAdminUsername(currentUser))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { username } = await context.params;
  const { verified } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({ verified: !!verified })
    .eq("username", username);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
