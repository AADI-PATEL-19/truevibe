"use client"

import Link from "next/link"

interface NavigationProps {
  isAdmin: boolean
  isUser: boolean
  pathname: string
}

export function Navigation({ isAdmin, isUser, pathname }: NavigationProps) {
  const getLinkClassName = (path: string) =>
    `text-sm font-medium transition-colors hover:text-indigo-600 ${
      pathname === path ? "text-indigo-600" : "text-gray-700"
    }`

  if (isAdmin) {
    return (
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/admin/dashboard" className={getLinkClassName("/admin/dashboard")}>
          Dashboard
        </Link>
        <Link href="/admin/products" className={getLinkClassName("/admin/products")}>
          Manage Products
        </Link>
        <Link href="/admin/orders" className={getLinkClassName("/admin/orders")}>
          Manage Orders
        </Link>
        <Link href="/admin/users" className={getLinkClassName("/admin/users")}>
          Manage Users
        </Link>
      </nav>
    )
  }

  if (isUser) {
    return (
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className={getLinkClassName("/")}>
          Home
        </Link>
        <Link href="/shop" className={getLinkClassName("/shop")}>
          Shop
        </Link>
        <Link href="/categories" className={getLinkClassName("/categories")}>
          Categories
        </Link>
      </nav>
    )
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/" className={getLinkClassName("/")}>
        Home
      </Link>
      <Link href="/shop" className={getLinkClassName("/shop")}>
        Products
      </Link>
      <Link href="/categories" className={getLinkClassName("/categories")}>
        Categories
      </Link>
    </nav>
  )
}
