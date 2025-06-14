"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Plus,
  Edit3,
  Package,
  DollarSign,
  ImageIcon,
  Tag,
  FileText,
  Hash,
  Percent,
  ShoppingCart,
  Star,
  Upload,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductFormProps {
  product?: any
}

// Sample data for quick testing
const SAMPLE_PRODUCTS = [
  {
    title: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system. Features a 6.7-inch Super Retina XDR display with ProMotion technology.",
    price: "1199.99",
    discount: "10",
    quantity: "25",
    quality: "new",
    sku: "IPHONE-15-PRO-MAX-256",
    brand: "Apple",
    category: "electronics",
    tags: "smartphone, apple, iphone, 5g, camera, titanium, pro",
    images:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500, https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
    isFeatured: true,
  },
  {
    title: "Nike Air Max 270",
    description:
      "Comfortable running shoes with Max Air unit in the heel for exceptional cushioning. Perfect for daily wear and light workouts.",
    price: "149.99",
    discount: "20",
    quantity: "50",
    quality: "new",
    sku: "NIKE-AIR-MAX-270-BLK-10",
    brand: "Nike",
    category: "clothing",
    tags: "shoes, nike, running, sports, comfort, air max, athletic",
    images:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500, https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    isFeatured: false,
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling wireless headphones with 30-hour battery life and premium sound quality.",
    price: "399.99",
    discount: "15",
    quantity: "30",
    quality: "new",
    sku: "SONY-WH1000XM5-BLACK",
    brand: "Sony",
    category: "electronics",
    tags: "headphones, sony, wireless, noise canceling, bluetooth, premium",
    images:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500, https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    isFeatured: true,
  },
]

// Fallback categories
const FALLBACK_CATEGORIES = [
  { _id: "electronics", name: "Electronics" },
  { _id: "clothing", name: "Clothing & Fashion" },
  { _id: "accessories", name: "Accessories" },
  { _id: "home", name: "Home & Garden" },
  { _id: "sports", name: "Sports & Outdoors" },
  { _id: "books", name: "Books & Media" },
  { _id: "beauty", name: "Beauty & Personal Care" },
  { _id: "automotive", name: "Automotive" },
  { _id: "toys", name: "Toys & Games" },
  { _id: "food", name: "Food & Beverages" },
]

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    quality: "new",
    sku: "",
    brand: "",
    category: "",
    tags: "",
    images: "",
    thumbnail: "",
    isFeatured: false,
  })

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
    if (product) {
      // Pre-fill form with existing product data
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        discount: product.discount?.toString() || "0",
        quantity: product.quantity?.toString() || "",
        quality: product.quality || "new",
        sku: product.sku || "",
        brand: product.brand || "",
        category: product.category || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        images: Array.isArray(product.images) ? product.images.join(", ") : "",
        thumbnail: product.thumbnail || "",
        isFeatured: product.isFeatured || false,
      })
    }
  }, [product])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || FALLBACK_CATEGORIES)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const loadSampleData = (index: number) => {
    const sample = SAMPLE_PRODUCTS[index]
    if (sample) {
      setFormData(sample)
      setErrors({}) // Clear any existing errors
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Product title is required"
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required"
    if (!formData.category) newErrors.category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Clean and prepare payload
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      discount: Number(formData.discount) || 0,
      quantity: Number(formData.quantity),
      quality: formData.quality,
      sku: formData.sku.trim() || undefined,
      brand: formData.brand.trim(),
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      images: formData.images
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img.length > 0),
      thumbnail: formData.thumbnail.trim() || undefined,
      isFeatured: formData.isFeatured,
    }

    console.log("📤 Sending payload:", payload)

    try {
      const url = isEdit ? `/api/products/${product._id}` : "/api/products"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("📥 Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Success:", result)
        alert(`✅ Product ${isEdit ? "updated" : "created"} successfully!`)
        router.push("/products")
      } else {
        const error = await response.json()
        console.error("❌ API Error:", error)
        alert(`❌ Error: ${error.message || "Unknown error occurred"}`)

        if (error.errors) {
          const newErrors: Record<string, string> = {}
          error.errors.forEach((err: any) => {
            newErrors[err.field] = err.message
          })
          setErrors(newErrors)
        }
      }
    } catch (error) {
      console.error("❌ Network Error:", error)
      alert("❌ Network error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const finalPrice =
    formData.price && formData.discount
      ? (Number(formData.price) * (1 - Number(formData.discount) / 100)).toFixed(2)
      : formData.price

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-white/50 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Button>

          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              {isEdit ? <Edit3 className="w-8 h-8 text-white" /> : <Plus className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{isEdit ? "Edit Product" : "Add New Product"}</h1>
              <p className="text-gray-600 text-lg">
                {isEdit ? "Update your product information" : "Create a new product for your store"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Data Buttons - Only show for new products */}
        {!isEdit && (
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Zap className="w-5 h-5" />
                Quick Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 mb-4">Click any button to load sample product data for testing:</p>
              <div className="flex flex-wrap gap-3">
                {SAMPLE_PRODUCTS.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleData(index)}
                    className="bg-white hover:bg-orange-50 border-orange-200 text-orange-800 hover:text-orange-900"
                  >
                    {sample.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Package className="w-6 h-6" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Product Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                    className={`transition-all ${errors.title ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Product SKU (optional)"
                    className="transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                    className="transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className={`transition-all ${errors.category ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  className="transition-all resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <DollarSign className="w-6 h-6" />
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`transition-all ${errors.price ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="transition-all"
                  />
                  {formData.discount && Number(formData.discount) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Final Price: ${finalPrice}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    className={`transition-all ${errors.quantity ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Quality
                  </Label>
                  <Select value={formData.quality} onValueChange={(value) => handleSelectChange("quality", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media & Tags */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <ImageIcon className="w-6 h-6" />
                Media & Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Thumbnail URL
                </Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URLs
                </Label>
                <Input
                  id="images"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="transition-all"
                />
                <p className="text-sm text-gray-500">Separate multiple URLs with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="electronics, smartphone, android"
                  className="transition-all"
                />
                <p className="text-sm text-gray-500">Separate tags with commas</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <Label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  Featured Product
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              size="lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
