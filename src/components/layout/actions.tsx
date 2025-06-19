"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { SearchDialog } from "./search-dialog"
import NotificationsDropdown from "./notifications-dropdown"
import { AccountMenu } from "./account-menu"
import { IconButton } from "./icon-button"

interface ActionsProps {
  isAdmin: boolean
  isUser: boolean
  isAuthenticated: boolean
}

export function Actions({ isAdmin, isUser, isAuthenticated }: ActionsProps) {
  const router = useRouter()

  if (isAdmin) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <SearchDialog />
        <NotificationsDropdown />
        <AccountMenu />
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <IconButton icon={<Heart className="h-4 w-4" />} label="Wishlist" href="/user/wishlist" />
        <IconButton icon={<ShoppingCart className="h-4 w-4" />} label="Cart" badgeCount={3} href="/user/cart" />
        <SearchDialog />
        <NotificationsDropdown />
        <AccountMenu />
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <SearchDialog />
      <Button
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
        onClick={() => router.push("/auth/login")}
      >
        Join Now
      </Button>
    </div>
  )
}
