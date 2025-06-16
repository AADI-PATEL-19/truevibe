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
  RefreshCw,
  Heart,
  Eye,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
  Award,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
            <div className="text-center">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Sparkles className="h-3 w-3 mr-1" />
                New Collection Available
              </Badge>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Premium
                <span className="block bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  Shopping
                </span>
                Experience
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover exclusive products, enjoy seamless shopping, and experience luxury like never before.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => router.push("/products")}
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-600">Free delivery on orders over $99. Fast and reliable shipping worldwide.</p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  Your payment information is processed securely with bank-level encryption.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                <p className="text-gray-600">30-day hassle-free returns. Not satisfied? Get your money back.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Now
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked premium products that our customers love most
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Loading amazing products...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                {products.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <Card
                        key={product._id}
                        className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white"
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
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white"
                              onClick={() => {
                                if (isAuthenticated) {
                                  router.push(`/products/${product._id}`)
                                } else {
                                  handleRestrictedAction("view-product")
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white"
                              onClick={() => handleRestrictedAction("add-to-wishlist")}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white"
                              onClick={() => handleRestrictedAction("add-to-cart")}
                            >
                              <ShoppingBag className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isFeatured && (
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {product.discount > 0 && (
                              <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
                                -{calculateDiscount(product.price, product.discount)}% OFF
                              </Badge>
                            )}
                          </div>

                          {/* Category Badge */}
                          <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800 capitalize border-0">
                            {product.category}
                          </Badge>
                        </div>

                        <CardContent className="p-6">
                          <div className="mb-3">
                            {product.brand && (
                              <p className="text-sm text-indigo-600 uppercase tracking-wide font-semibold">
                                {product.brand}
                              </p>
                            )}
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {product.title}
                            </h3>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ${product.finalPrice?.toFixed(2) || product.price.toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-700 ml-1 font-medium">4.8</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stock Status & Action */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${
                                product.quantity > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                            </span>

                            {!isAuthenticated && (
                              <div className="flex items-center text-gray-500">
                                <Lock className="h-4 w-4 mr-1" />
                                <span className="text-xs">Login to purchase</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                      <p className="text-gray-500 mb-6">It looks like there are no products available at the moment.</p>
                      {isAuthenticated && (
                        <Link href="/admin/products/add">
                          <Button className="bg-indigo-600 hover:bg-indigo-700">Add Your First Product</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* View All Products Button */}
                {products.length > 0 && (
                  <div className="text-center mt-16">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-lg border-2 hover:bg-indigo-50 hover:border-indigo-300"
                      onClick={() => {
                        if (isAuthenticated) {
                          router.push("/products")
                        } else {
                          handleRestrictedAction("browse-products")
                        }
                      }}
                    >
                      {isAuthenticated ? "View All Products" : "Sign In to Browse All Products"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Shopping?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover premium products at unbeatable prices.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-indigo px-8 py-4 text-lg"
                  onClick={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => router.push("/products")}
              >
                Continue Shopping
                <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </section>

        {/* Admin Quick Access (Only for authenticated users) */}
        {isAuthenticated && (
          <section className="py-12 bg-gray-50 border-t">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Quick Access</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/products"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-indigo-600 font-semibold mb-1">Browse Shop</div>
                  <div className="text-sm text-gray-500">All products</div>
                </Link>
                <Link
                  href="/cart"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-indigo-600 font-semibold mb-1">Shopping Cart</div>
                  <div className="text-sm text-gray-500">View cart</div>
                </Link>
                <Link
                  href="/account"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-indigo-600 font-semibold mb-1">My Account</div>
                  <div className="text-sm text-gray-500">Profile & orders</div>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  )
}
