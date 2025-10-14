import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const bio = formData.get("bio") as string;
  const avatarData = formData.get("avatar") as string | null;

  let avatar_url = session.user.avatar_url;

  if (avatarData && avatarData.startsWith("data:")) {
    // convert base64 data URL to a file and upload to Supabase Storage
    const base64Data = avatarData.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const filePath = `avatars/${session.user.username}.png`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      avatar_url = data.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ bio, avatar_url })
    .eq("user_id", session.user.username)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
