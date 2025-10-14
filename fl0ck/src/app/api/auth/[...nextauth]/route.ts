// src/app/api/auth/[...nextauth]/route.ts
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile || !profile.login) return false;

      const username = profile.login;
      const avatar = profile.avatar_url;
      const name = profile.name || username;

      const { error } = await supabase.from("profiles").upsert({
        user_id: username,
        name,
        avatar_url: avatar,
      });

      if (error) console.error("Supabase upsert error:", error.message);
      return true;
    },
    async session({ session, token }) {
      if (token?.login) {
        session.user.username = token.login;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.login) token.login = profile.login;
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
