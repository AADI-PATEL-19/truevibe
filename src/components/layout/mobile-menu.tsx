"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Home,
  ShoppingBag,
  Grid3X3,
  Heart,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react"

interface MobileMenuProps {
  isAdmin: boolean
  isUser: boolean
  isAuthenticated: boolean
}

export function MobileMenu({ isAdmin, isUser, isAuthenticated }: MobileMenuProps) {
  const router = useRouter()

  const renderMenuItems = () => {
    if (isAdmin) {
      return [
        <Link
          key="dashboard"
          href="/admin/dashboard"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>,
        <Link
          key="products"
          href="/admin/products"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Package className="h-5 w-5" />
          <span>Manage Products</span>
        </Link>,
        <Link
          key="orders"
          href="/admin/orders"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <ClipboardList className="h-5 w-5" />
          <span>Manage Orders</span>
        </Link>,
        <Link
          key="users"
          href="/admin/users"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Users className="h-5 w-5" />
          <span>Manage Users</span>
        </Link>,
      ]
    }

    if (isUser) {
      return [
        <Link
          key="home"
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>,
        <Link
          key="shop"
          href="/shop"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Shop</span>
        </Link>,
        <Link
          key="categories"
          href="/categories"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Grid3X3 className="h-5 w-5" />
          <span>Categories</span>
        </Link>,
        <Link
          key="wishlist"
          href="/user/wishlist"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Heart className="h-5 w-5" />
          <span>Wishlist</span>
        </Link>,
        <Link
          key="cart"
          href="/user/cart"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart</span>
        </Link>,
      ]
    }

    return [
      <Link
        key="home"
        href="/"
        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>,
      <Link
        key="products"
        href="/shop"
        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <ShoppingBag className="h-5 w-5" />
        <span>Products</span>
      </Link>,
      <Link
        key="categories"
        href="/categories"
        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <Grid3X3 className="h-5 w-5" />
        <span>Categories</span>
      </Link>,
    ]
  }

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              {isAdmin ? "Admin Panel" : isUser ? "Navigate our store" : "Explore our products"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-2">
            {renderMenuItems()}

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

            {isAuthenticated && (
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(isAdmin ? "/admin/profile" : "/user/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  {isAdmin ? "Admin Profile" : "My Account"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
