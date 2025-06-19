"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useWishlist } from "@/contexts/wishlist"
import { useCart } from "@/contexts/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Star,
  Grid,
  List,
  Share2,
  Filter,
  Lock,
} from "lucide-react"

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const { wishlist, removeFromWishlist, clearWishlist, isAuthenticated } = useWishlist()
  const { addToCart, isInCart } = useCart()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/user/wishlist")}`)
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="mb-6">
              <Lock className="w-24 h-24 mx-auto text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in to view your wishlist</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to save and view your favorite items.</p>
            <div className="space-y-4">
              <Button size="lg" onClick={() => router.push("/auth/login")} className="px-8">
                Sign In
              </Button>
              <div>
                <Link href="/shop" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Update the requireAuth function
  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/user/wishlist")}`)
      return false
    }
    return true
  }

  // Get unique categories for filtering
  const categories = [...new Set(wishlist.items.map((item) => item.category.name))]

  // Filter and sort wishlist items
  const filteredAndSortedItems = wishlist.items
    .filter((item) => {
      if (filterBy === "all") return true
      if (filterBy === "available") return item.isAvailable && item.quantity > 0
      if (filterBy === "unavailable") return !item.isAvailable || item.quantity === 0
      return item.category.name === filterBy
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.finalPrice - b.finalPrice
        case "price-high":
          return b.finalPrice - a.finalPrice
        case "name":
          return a.title.localeCompare(b.title)
        case "newest":
        default:
          return 0 // Keep original order for newest
      }
    })

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleAddAllToCart = () => {
    wishlist.items
      .filter((item) => item.isAvailable && item.quantity > 0)
      .forEach((item) => {
        if (!isInCart(item._id)) {
          addToCart(item)
        }
      })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist",
          text: `Check out my wishlist with ${wishlist.totalItems} amazing items!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="mb-6">
              <Heart className="w-24 h-24 mx-auto text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon on any product.</p>
            <div className="space-y-4">
              <Button size="lg" onClick={() => router.push("/shop")} className="px-8">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              <div>
                <Link href="/categories" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Browse Categories →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlist.totalItems} items saved • Signed in as {session?.user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {wishlist.items.some((item) => item.isAvailable && item.quantity > 0) && (
                <Button onClick={handleAddAllToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Out of Stock</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
            {wishlist.items.length > 0 && (
              <Button variant="outline" onClick={clearWishlist} className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredAndSortedItems.map((item) => (
            <Card key={item._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className={viewMode === "list" ? "flex" : ""}>
                {/* Product Image */}
                <div className={`relative ${viewMode === "list" ? "w-48 h-48" : "aspect-square"} bg-gray-100`}>
                  <Image
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!item.isAvailable && <Badge variant="destructive">Out of Stock</Badge>}
                    {item.quantity === 0 && item.isAvailable && (
                      <Badge variant="secondary">Temporarily Unavailable</Badge>
                    )}
                  </div>

                  {/* Remove from Wishlist */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>

                {/* Product Info */}
                <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category.name}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.brand}</p>

                  {/* Mock Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.0 (120)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold">${item.finalPrice.toFixed(2)}</span>
                    {item.price !== item.finalPrice && (
                      <span className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Stock Info */}
                  <p className="text-xs text-gray-500 mb-4">
                    {item.quantity > 0 ? `${item.quantity} in stock` : "Out of stock"}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable || item.quantity === 0 || isInCart(item._id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isInCart(item._id)
                        ? "In Cart"
                        : item.isAvailable && item.quantity > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <Heart className="w-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty Filtered Results */}
        {filteredAndSortedItems.length === 0 && wishlist.items.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter settings</p>
            <Button variant="outline" onClick={() => setFilterBy("all")}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/shop")}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
