"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/layout/logo"
import { Navigation } from "@/components/layout/navigation"
import { Actions } from "@/components/layout/actions"
import { MobileMenu } from "@/components/layout/mobile-menu"

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith("/auth")
  const { data: session, status } = useSession()

  const isAuthenticated = status === "authenticated"
  const user = session?.user
  const isAdmin = isAuthenticated && user?.role === "admin"
  const isUser = isAuthenticated && user?.role === "user"

  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <Navigation isAdmin={isAdmin} isUser={isUser} pathname={pathname} />
          <Actions isAdmin={isAdmin} isUser={isUser} isAuthenticated={isAuthenticated} />
          <MobileMenu isAdmin={isAdmin} isUser={isUser} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  )
}
