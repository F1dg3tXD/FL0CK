// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createClient } from "@supabase/supabase-js";

const handler = NextAuth(authOptions);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // your Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-only key
);

export { handler as GET, handler as POST };
