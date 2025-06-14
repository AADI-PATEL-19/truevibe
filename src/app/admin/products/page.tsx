"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Package,
  DollarSign,
  ShoppingCart,
  MoreVertical,
  Grid3X3,
  List,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  discount: number
  quantity: number
  quality: string
  sku: string
  brand: string
  category: string
  tags: string[]
  images: string[]
  thumbnail: string
  createdAt: string
  status: "active" | "inactive" | "out_of_stock"
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products?limit=100") // Get more products for admin

        if (response.ok) {
          const data = await response.json()
          console.log("✅ Fetched products:", data)

          // Transform API data to match component interface
          const transformedProducts = data.products.map((product: any) => ({
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            discount: product.discount || 0,
            quantity: product.quantity,
            quality: product.quality,
            sku: product.sku || `SKU-${product._id.slice(-6)}`,
            brand: product.brand,
            category: product.category,
            tags: product.tags || [],
            images: product.images || [],
            thumbnail: product.thumbnail || "/placeholder.svg?height=300&width=300&text=Product",
            createdAt: product.createdAt || new Date().toISOString().split("T")[0],
            status: product.quantity === 0 ? "out_of_stock" : "active",
          }))

          setProducts(transformedProducts)
        } else {
          console.error("❌ Failed to fetch products:", response.status)
          // Fallback to empty array or show error message
          setProducts([])
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((product) => selectedCategory === "" || product.category === selectedCategory)
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Product]
      const bValue = b[sortBy as keyof Product]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const categories = [...new Set(products.map((p) => p.category))]

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Remove from local state
          setProducts(products.filter((p) => p._id !== id))
          alert("✅ Product deleted successfully!")
        } else {
          const error = await response.json()
          alert(`❌ Error deleting product: ${error.message}`)
        }
      } catch (error) {
        console.error("❌ Delete error:", error)
        alert("❌ Network error occurred while deleting product")
      }
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        // Delete each product individually
        const deletePromises = selectedProducts.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" }))

        const results = await Promise.all(deletePromises)
        const successful = results.filter((r) => r.ok).length

        if (successful === selectedProducts.length) {
          // Remove from local state
          setProducts(products.filter((p) => !selectedProducts.includes(p._id)))
          setSelectedProducts([])
          alert(`✅ Successfully deleted ${successful} products!`)
        } else {
          alert(`⚠️ Deleted ${successful} out of ${selectedProducts.length} products`)
          // Refresh the page to get current state
          window.location.reload()
        }
      } catch (error) {
        console.error("❌ Bulk delete error:", error)
        alert("❌ Network error occurred during bulk delete")
      }
    }
  }

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <XCircle className="w-4 h-4" />
      case "out_of_stock":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Products</h1>
                <p className="text-slate-600 mt-1">Manage your product inventory</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedProducts.length})
                </button>
              )}

              <Link
                href="/admin/products/add"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-")
                  setSortBy(field)
                  setSortOrder(order as "asc" | "desc")
                }}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white outline-none"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Name A-Z</option>
                <option value="title-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first product"}
            </p>
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-slate-800">{products.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Active Products</p>
                    <p className="text-2xl font-bold text-green-600">
                      {products.filter((p) => p.status === "active").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                      {products.filter((p) => p.status === "out_of_stock").length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Value</p>
                    <p className="text-2xl font-bold text-slate-800">
                      ${products.reduce((sum, p) => sum + p.price * p.quantity, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    isSelected={selectedProducts.includes(product._id)}
                    onToggleSelect={toggleProductSelection}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <ProductTable
                  products={filteredProducts}
                  onDelete={handleDeleteProduct}
                  selectedProducts={selectedProducts}
                  onToggleSelect={toggleProductSelection}
                  onToggleSelectAll={(selectAll) => {
                    setSelectedProducts(selectAll ? filteredProducts.map((p) => p._id) : [])
                  }}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({
  product,
  onDelete,
  isSelected,
  onToggleSelect,
  getStatusColor,
  getStatusIcon,
}: {
  product: Product
  onDelete: (id: string) => void
  isSelected: boolean
  onToggleSelect: (id: string) => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
}) {
  const [showMenu, setShowMenu] = useState(false)
  const discountedPrice = product.price - (product.price * product.discount) / 100

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
      }`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />

        {/* Overlay Controls */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(product._id)}
            className="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
          />

          <div className="flex gap-2">
            {product.discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                -{product.discount}%
              </span>
            )}

            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(product.status)}`}
            >
              {getStatusIcon(product.status)}
              {product.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Link
              href={`/admin/products/${product._id}`}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </Link>
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-green-600" />
            </Link>
            <button
              onClick={() => onDelete(product._id)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-800 line-clamp-2 flex-1">{product.title}</h3>
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <Link
                  href={`/admin/products/${product._id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(product._id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-800">${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">{product.quantity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>SKU: {product.sku}</span>
          <span>{product.brand}</span>
        </div>
      </div>
    </div>
  )
}

// Product Table Component
function ProductTable({
  products,
  onDelete,
  selectedProducts,
  onToggleSelect,
  onToggleSelectAll,
  getStatusColor,
  getStatusIcon,
}: {
  products: Product[]
  onDelete: (id: string) => void
  selectedProducts: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: (selectAll: boolean) => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
}) {
  const allSelected = products.length > 0 && selectedProducts.length === products.length

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product) => {
            const discountedPrice = product.price - (product.price * product.discount) / 100

            return (
              <tr
                key={product._id}
                className={`hover:bg-slate-50 transition-colors ${
                  selectedProducts.includes(product._id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onToggleSelect(product._id)}
                    className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800">{product.title}</h4>
                      <p className="text-sm text-slate-600">SKU: {product.sku}</p>
                      <p className="text-sm text-slate-500">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">${discountedPrice.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold ${
                      product.quantity === 0
                        ? "text-red-600"
                        : product.quantity < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {product.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}
                  >
                    {getStatusIcon(product.status)}
                    {product.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
