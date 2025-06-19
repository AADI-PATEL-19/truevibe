"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
        <ShoppingBag className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-indigo-600">TRUEVIBE</span>
    </Link>
  )
}
