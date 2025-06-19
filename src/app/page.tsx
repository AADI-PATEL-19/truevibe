"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  ShoppingBag,
  Loader2,
  ArrowRight,
  Shield,
  Truck,
  Heart,
  Eye,
  Lock,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Gift,
  Crown,
} from "lucide-react"

interface Product {
  _id: string
  title: string
  price: number
  discount: number
  finalPrice: number
  thumbnail: string
  images: string[]
  category: string
  brand: string
  quantity: number
  isFeatured: boolean
  tags: string[]
  createdAt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products?featured=true&limit=6")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const calculateDiscount = (price: number, discount: number) => {
    return ((discount / price) * 100).toFixed(0)
  }

  const handleRestrictedAction = (action: string) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}&action=${action}`)
    }
  }

  const isAuthenticated = status === "authenticated"

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section - Combined Premium Shopping + CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-screen flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
            <Badge className="mb-8 bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-6 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              New Collection Available
            </Badge>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Premium
              <span className="block bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Shopping
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4">Experience</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover exclusive products, enjoy seamless shopping, and experience luxury like never before. Join
              thousands of satisfied customers today.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/auth/login")}
                >
                  <Crown className="mr-3 h-6 w-6" />
                  Join Premium Club
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 text-xl font-bold rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/shop")}
                >
                  <Eye className="mr-3 h-6 w-6" />
                  Browse Collection
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/shop")}
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  Continue Shopping
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-300">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">99%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100 text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Why Choose Us
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Premium Benefits</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Free Express Shipping</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Free delivery on orders over $99. Lightning-fast shipping worldwide with premium packaging.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Bank-Level Security</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Your payment information is protected with military-grade encryption and fraud protection.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Gift className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Premium Rewards</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Earn points on every purchase and unlock exclusive deals, early access, and VIP perks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-indigo-100 text-indigo-800 hover:bg-indigo-100 text-lg px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Now
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Handpicked premium products that our customers love most. Each item is carefully selected for quality
                and style.
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                  <span className="text-gray-600 text-lg">Loading amazing products...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-12 max-w-md mx-auto">
                  <p className="text-red-600 mb-6 text-lg">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" size="lg">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                {products.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product) => (
                      <Card
                        key={product._id}
                        className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl overflow-hidden bg-white rounded-3xl"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              product.thumbnail ||
                              product.images[0] ||
                              "/placeholder.svg?height=400&width=400&text=Product" ||
                              "/placeholder.svg"
                            }
                            alt={product.title}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=400&width=400&text=Product"
                            }}
                          />

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            <Button
                              size="lg"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white rounded-full p-4"
                              onClick={() => {
                                if (isAuthenticated) {
                                  router.push(`/products/${product._id}`)
                                } else {
                                  handleRestrictedAction("view-product")
                                }
                              }}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                            <Button
                              size="lg"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white rounded-full p-4"
                              onClick={() => handleRestrictedAction("add-to-wishlist")}
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                              size="lg"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white rounded-full p-4"
                              onClick={() => handleRestrictedAction("add-to-cart")}
                            >
                              <ShoppingBag className="h-5 w-5" />
                            </Button>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-6 left-6 flex flex-col gap-3">
                            {product.isFeatured && (
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-3 py-1">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {product.discount > 0 && (
                              <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-sm px-3 py-1">
                                -{calculateDiscount(product.price, product.discount)}% OFF
                              </Badge>
                            )}
                          </div>

                          {/* Category Badge */}
                          <Badge className="absolute top-6 right-6 bg-white/90 text-gray-800 capitalize border-0 text-sm px-3 py-1">
                            {product.category}
                          </Badge>
                        </div>

                        <CardContent className="p-8">
                          <div className="mb-4">
                            {product.brand && (
                              <p className="text-sm text-indigo-600 uppercase tracking-wide font-bold mb-2">
                                {product.brand}
                              </p>
                            )}
                            <h3 className="font-bold text-2xl text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                              {product.title}
                            </h3>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ${product.finalPrice?.toFixed(2) || product.price.toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-700 ml-1 font-bold">4.8</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-gray-300 px-2 py-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stock Status & Action */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-bold ${
                                product.quantity > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                            </span>

                            {!isAuthenticated && (
                              <div className="flex items-center text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                <Lock className="h-4 w-4 mr-1" />
                                <span className="text-xs font-medium">Login to purchase</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-50 rounded-3xl p-16 max-w-md mx-auto">
                      <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-600 mb-4">No Products Found</h3>
                      <p className="text-gray-500 mb-8 text-lg">
                        It looks like there are no products available at the moment.
                      </p>
                      {isAuthenticated && (
                        <Link href="/admin/products/add">
                          <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
                            Add Your First Product
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* View All Products Button */}
                {products.length > 0 && (
                  <div className="text-center mt-20">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-12 py-6 text-xl border-2 hover:bg-indigo-50 hover:border-indigo-300 rounded-full font-bold"
                      onClick={() => {
                        if (isAuthenticated) {
                          router.push("/shop")
                        } else {
                          handleRestrictedAction("browse-products")
                        }
                      }}
                    >
                      {isAuthenticated ? "View All Products" : "Join to Browse All Products"}
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Admin Quick Access (Only for authenticated users) */}
        {isAuthenticated && (
          <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Quick Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/shop"
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="text-indigo-600 font-bold text-xl mb-2 group-hover:text-indigo-700">Browse Shop</div>
                  <div className="text-gray-500">Explore all products</div>
                </Link>
                <Link
                  href="/cart"
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="text-indigo-600 font-bold text-xl mb-2 group-hover:text-indigo-700">
                    Shopping Cart
                  </div>
                  <div className="text-gray-500">View your items</div>
                </Link>
                <Link
                  href="/account"
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="text-indigo-600 font-bold text-xl mb-2 group-hover:text-indigo-700">My Account</div>
                  <div className="text-gray-500">Profile & orders</div>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
