"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ShoppingBag,
  User,
  Menu,
  Search,
  Heart,
  Settings,
  LogOut,
  Package,
  ShoppingCart,
  Bell,
  LayoutGrid,
  ClipboardList,
  List,
} from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith("/auth")
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const session = useSession()

  const isAuthenticated = session.status === "authenticated"
  const user = session.data?.user
  const isAdmin = isAuthenticated && user?.role === "admin"

  if (isAuthPage) return null

  const handleAuthAction = (action: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}&action=${action}`)
    }
  }

  const renderMiddleNav = () => {
    if (isAdmin) {
      return (
        <>
          <Link href="/admin/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
          <Link href="/admin/products" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Products</Link>
          <Link href="/admin/orders" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Orders</Link>
        </>
      )
    }

    return (
      <>
        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Home</Link>
        <Link
          href={isAuthenticated ? "/products" : "#"}
          onClick={() => !isAuthenticated && handleAuthAction("browse-shop")}
          className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          Products
        </Link>
        <Link
          href={isAuthenticated ? "/categories" : "#"}
          onClick={() => !isAuthenticated && handleAuthAction("browse-categories")}
          className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          Categories
        </Link>
      </>
    )
  }

  const renderRightActions = () => {
    if (isAdmin) {
      return (
        <>
          <SearchButton />
          <Notifications />
          <AccountMenu />
        </>
      )
    }

    if (isAuthenticated) {
      return (
        <>
          <SearchButton />
          <IconButton icon={<Heart className="h-4 w-4" />} label="Wishlist" onClick={() => router.push("/wishlist")} />
          <IconButton icon={<ShoppingCart className="h-4 w-4" />} label="Cart" badgeCount={3} onClick={() => router.push("/cart")} />
          <Notifications />
          <AccountMenu />
        </>
      )
    }

    return (
      <>
        <SearchButton />
        <Button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
          onClick={() => router.push("/auth/login")}
        >
          Join Now
        </Button>
      </>
    )
  }

  const SearchButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => isAuthenticated ? setIsSearchOpen(true) : handleAuthAction("search")}
    >
      <Search className="h-4 w-4" />
      <span className="sr-only">Search</span>
    </Button>
  )

  const Notifications = () => (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-4 w-4" />
      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">2</Badge>
      <span className="sr-only">Notifications</span>
    </Button>
  )

  const IconButton = ({ icon, label, onClick, badgeCount = 0 }) => (
    <Button variant="ghost" size="sm" className="relative" onClick={onClick}>
      {icon}
      {badgeCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-indigo-600">
          {badgeCount}
        </Badge>
      )}
      <span className="sr-only">{label}</span>
    </Button>
  )

  const AccountMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium">
            {user?.name || user?.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          <Package className="mr-2 h-4 w-4" /> Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/wishlist")}>
          <Heart className="mr-2 h-4 w-4" /> Wishlist
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Settings className="mr-2 h-4 w-4" /> Admin Panel
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-indigo-600">TRUEVIBE</span>
          </Link>

          {/* Middle Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {renderMiddleNav()}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {renderRightActions()}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigate through our store</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {renderMiddleNav()}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        onClick={() => router.push("/auth/login")}
                      >
                        Join Now
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
