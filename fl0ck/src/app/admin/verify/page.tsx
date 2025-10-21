import { getServerSession } from "next-auth";
import { authOptions, GitHubSession } from "@/lib/authOptions";
import AdminVerifyClient from "./AdminVerifyClient";

export default async function AdminVerifyPage() {
  const session = (await getServerSession(authOptions)) as GitHubSession | null;
  const currentUser = session?.user?.username;
  const env = process.env.ADMIN_USERS || process.env.ADMIN_USERNAME || "";
  const admins = env.split(",").map((s) => s.trim()).filter(Boolean);

  if (!currentUser || !admins.includes(currentUser)) {
    return <div className="p-8 text-center text-neutral-400">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-2xl font-bold text-sky-400 mb-4">Admin: Verify Users</h1>
      <AdminVerifyClient />
    </div>
  );
}
