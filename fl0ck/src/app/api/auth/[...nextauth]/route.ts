// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // only use this on server routes
);

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Fires when a user signs in
    async signIn({ user, account, profile }) {
      if (!profile || !profile.login) return false;

      const username = profile.login;
      const avatar_url = profile.avatar_url;
      const display_name = profile.name || username;

      // Create or update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: username,
            name: display_name,
            avatar_url,
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Supabase upsert error:", error.message);
        return false;
      }

      return true;
    },

    // Attach GitHub username to JWT
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.login = profile.login;
        token.avatar_url = profile.avatar_url;
        token.name = profile.name;
      }
      return token;
    },

    // Attach GitHub data to the session object
    async session({ session, token }) {
      if (token?.login) {
        session.user.username = token.login;
        session.user.avatar_url = token.avatar_url;
        session.user.name = token.name;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
