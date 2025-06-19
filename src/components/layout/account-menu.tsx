"use client"

import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Package, Heart, LayoutDashboard, Users } from "lucide-react"

export function AccountMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const isAdmin = user?.role === "admin"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium">
            {user?.name || user?.email?.split("@")[0] || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isAdmin ? (
          <>
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              <User className="mr-2 h-4 w-4" /> Admin Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/users")}>
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/orders")}>
              <Package className="mr-2 h-4 w-4" /> My Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/wishlist")}>
              <Heart className="mr-2 h-4 w-4" /> Wishlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
