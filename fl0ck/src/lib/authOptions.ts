// ./src/lib/authOptions.ts
import { NextAuthOptions, Profile, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create a minimal repo on the user's GitHub account using their access token.
// This is called on first sign-in so users get a repo to store their data.
async function createGitHubRepo(accessToken: string, repoName = "fl0ck-data") {
  try {
    // Get authenticated user's login
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}`, Accept: "application/vnd.github+json" },
    });
    if (!userRes.ok) {
      // can't determine username, abort
      return;
    }
    const userJson = await userRes.json();
    const login = userJson.login;

    // Check if repo exists
    const check = await fetch(`https://api.github.com/repos/${login}/${repoName}`, {
      headers: { Authorization: `token ${accessToken}`, Accept: "application/vnd.github+json" },
    });

    // If check returns 200 the repo already exists; otherwise attempt to create it.
    if (check.status === 200) return;

    const res = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: repoName, description: "FL0CK user data", private: false }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Failed to create GitHub repo:", res.status, txt);
    }
  } catch (err) {
    console.error("Error creating GitHub repo:", err);
  }
}

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
  accessToken?: string;
  access_token?: string;
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
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Request repo scope so we can create a user repo when they sign in.
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const ghProfile = profile as GitHubProfile;
      if (!ghProfile?.login) return false;

      // Upsert profile with both user_id (email or login) and username for lookup.
      const { error } = await supabase.from("profiles").upsert({
        user_id: ghProfile.login,
        username: ghProfile.login,
        name: ghProfile.name || ghProfile.login,
        avatar_url: ghProfile.avatar_url,
      });

      if (error) console.error("Supabase upsert error:", error.message);
      return true;
    },
    async jwt({ token, profile, account }) {
      const ghProfile = profile as GitHubProfile | undefined;
      const ghToken = token as GitHubToken;
      // account is present on initial sign in and contains access_token
      if (account?.access_token) ghToken.access_token = account.access_token as string;
      if (ghProfile?.login) ghToken.login = ghProfile.login;
      return ghToken;
    },
    async session({ session, token }) {
      const ghToken = token as GitHubToken;
      const ghSession = session as GitHubSession;
      if (ghToken.login) ghSession.user.username = ghToken.login;

      // Attach a small helper on first session to ensure repo exists. We only have
      // the access token inside the JWT when provider stores it — next-auth may
      // include accessToken as `accessToken` or `access_token` depending on config.
  const accessToken = ghToken.accessToken || ghToken.access_token;
      if (accessToken) {
        // fire-and-forget: create user's repo if not present
        createGitHubRepo(accessToken, `fl0ck-${ghSession.user.username}`);
      }

      return ghSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
