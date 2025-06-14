import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/dashboard"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "admin") {
    return redirect("/auth/login")
  }

  return <AdminDashboard session={session} />
}
