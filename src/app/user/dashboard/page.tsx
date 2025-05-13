import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "user") {
    return redirect("/auth/login");
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
    </div>
  );
}
