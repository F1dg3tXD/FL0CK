// ./src/lib/authOptions.ts
import { NextAuthOptions, Profile, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GitHub-specific Profile
export interface GitHubProfile extends Profile {
  login: string;
  avatar_url: string;
  name?: string;
}

// Simple token object
export interface GitHubToken {
  login?: string;
  iat?: number;
  exp?: number;
  sub?: string;
  [key: string]: unknown;
}

// Extend Session to carry GitHub username
export interface GitHubSession extends Session {
  user: Session["user"] & { username?: string };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const ghProfile = profile as GitHubProfile;
      if (!ghProfile?.login) return false;

      const { error } = await supabase.from("profiles").upsert({
        user_id: ghProfile.login,
        name: ghProfile.name || ghProfile.login,
        avatar_url: ghProfile.avatar_url,
      });

      if (error) console.error("Supabase upsert error:", error.message);
      return true;
    },
    async jwt({ token, profile }) {
      const ghProfile = profile as GitHubProfile | undefined;
      const ghToken = token as GitHubToken;
      if (ghProfile?.login) ghToken.login = ghProfile.login;
      return ghToken;
    },
    async session({ session, token }) {
      const ghToken = token as GitHubToken;
      const ghSession = session as GitHubSession;
      if (ghToken.login) ghSession.user.username = ghToken.login;
      return ghSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
