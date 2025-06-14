"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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
}

interface ProductsResponse {
  products: Product[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdmin, setIsAdmin] = useState(false) // You'll get this from your auth system
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
    // Check user role from your auth system
    checkUserRole()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ProductsResponse = await response.json()
      setProducts(data.products || [])
    } catch (error: any) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const checkUserRole = () => {
    // For testing purposes, you can temporarily set admin to true
    // Replace with your actual auth logic
    const userRole = localStorage.getItem("userRole") || "admin" // Temporarily set to admin for testing
    setIsAdmin(userRole === "admin")
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId))
        alert("Product deleted successfully!")
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? "Manage your product inventory" : "Browse our product collection"}
            </p>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <Link href="/admin/products/add">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative"
            >
              {/* Admin Actions - Top Right Corner */}
              {isAdmin && (
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <Link href={`/admin/products/edit/${product._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 bg-white/90 hover:bg-blue-50 border-blue-200"
                    >
                      <Edit className="w-3 h-3 text-blue-600" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product._id)}
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.thumbnail || "/placeholder.svg?height=300&width=300"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-xs text-gray-500 mb-3">{product.category?.name}</p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">${product.finalPrice?.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{product.discount}% OFF</span>
                    </>
                  )}
                </div>

                {/* Stock Info */}
                <p className="text-xs text-gray-500 mb-4">Stock: {product.quantity}</p>

                {/* User Actions - Only for non-admin users */}
                {!isAdmin && (
                  <Button className="w-full" disabled={!product.isAvailable}>
                    {product.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
