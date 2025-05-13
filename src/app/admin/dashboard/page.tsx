import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return redirect("/auth/login");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
    </div>
  );
}
