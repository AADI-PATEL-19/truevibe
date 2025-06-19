"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, Heart, Star, ChevronDown, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  title: string
  price: number
  discount: number
  finalPrice: number
  quantity: number
  thumbnail: string
  category: Category
  brand: string
  isAvailable: boolean
  rating?: number
  reviewCount?: number
  tags?: string[]
  isNew?: boolean
  isFeatured?: boolean
}

interface ProductsResponse {
  products: Product[]
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, searchTerm, selectedCategory, selectedBrands, priceRange, sortBy, showOnlyInStock])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ProductsResponse = await response.json()
      // Add mock data for demo purposes with safe image URLs
      const productsWithMockData = (data.products || []).map((product, index) => ({
        ...product,
        // Use placeholder images that work with Next.js
        thumbnail: product.thumbnail || `/placeholder.svg?height=300&width=300&text=Product+${index + 1}`,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        reviewCount: Math.floor(Math.random() * 200) + 10,
        tags: ["popular", "trending", "new"].filter(() => Math.random() > 0.7),
        isNew: Math.random() > 0.8,
        isFeatured: Math.random() > 0.7,
      }))
      setProducts(productsWithMockData)
    } catch (error: any) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category._id === selectedCategory)
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
    }

    // Price filter
    filtered = filtered.filter((product) => product.finalPrice >= priceRange[0] && product.finalPrice <= priceRange[1])

    // Stock filter
    if (showOnlyInStock) {
      filtered = filtered.filter((product) => product.isAvailable && product.quantity > 0)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.finalPrice - b.finalPrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.finalPrice - a.finalPrice)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "popularity":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // featured
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleAddToCart = (product: Product) => {
    // Add your cart logic here
    console.log("Adding to cart:", product)
    // You can integrate with your cart state management
  }

  const handleToggleWishlist = (product: Product) => {
    // Add your wishlist logic here
    console.log("Toggle wishlist:", product)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  // Safe image URL helper
  const getSafeImageUrl = (url: string, fallback = "/placeholder.svg?height=300&width=300") => {
    if (!url) return fallback

    // If it's already a placeholder or relative URL, return as is
    if (url.startsWith("/placeholder.svg") || url.startsWith("/")) {
      return url
    }

    // For external URLs, you might want to proxy them or use a different approach
    // For now, return the fallback to avoid the configuration error
    return fallback
  }

  // Get unique brands
  const uniqueBrands = [...new Set(products.map((p) => p.brand))]

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Shop</h1>
          <p className="text-xl md:text-2xl mb-8">Discover amazing products at great prices</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              {/* Categories */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-categories"
                        checked={selectedCategory === "all"}
                        onCheckedChange={() => setSelectedCategory("all")}
                      />
                      <Label htmlFor="all-categories">All Categories</Label>
                    </div>
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category._id}
                          checked={selectedCategory === category._id}
                          onCheckedChange={() => setSelectedCategory(category._id)}
                        />
                        <Label htmlFor={category._id}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">-</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brands */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <Label htmlFor={brand}>{brand}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={showOnlyInStock}
                      onCheckedChange={(checked) => setShowOnlyInStock(checked === true)}
                    />
                    <Label htmlFor="in-stock">In Stock Only</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-gray-600">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {currentProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {currentProducts.map((product) => (
                  <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={viewMode === "list" ? "flex" : ""}>
                      {/* Product Image */}
                      <div className={`relative ${viewMode === "list" ? "w-48 h-48" : "aspect-square"} bg-gray-100`}>
                        <Image
                          src={getSafeImageUrl(product.thumbnail) || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && <Badge className="bg-green-500">New</Badge>}
                          {product.discount > 0 && <Badge className="bg-red-500">{product.discount}% OFF</Badge>}
                          {!product.isAvailable && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleToggleWishlist(product)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Product Info */}
                      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category.name}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">{renderStars(product.rating)}</div>
                            <span className="text-sm text-gray-600">
                              {product.rating.toFixed(1)} ({product.reviewCount})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold">${product.finalPrice.toFixed(2)}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Stock Info */}
                        <p className="text-xs text-gray-500 mb-4">
                          {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                        </p>

                        {/* Add to Cart Button */}
                        <Button
                          className="w-full"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.isAvailable || product.quantity === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.isAvailable && product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
