"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  ArrowRight,
  Grid3X3,
  Shirt,
  Watch,
  Smartphone,
  Home,
  Dumbbell,
  Headphones,
  Camera,
  Book,
  Gamepad2,
  Car,
} from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  subcategories?: Subcategory[]
  featured?: boolean
  color?: string
}

interface Subcategory {
  _id: string
  name: string
  slug: string
  productCount: number
}

interface CategoriesResponse {
  categories: Category[]
}

const categoryIcons = {
  electronics: Smartphone,
  clothing: Shirt,
  accessories: Watch,
  home: Home,
  sports: Dumbbell,
  audio: Headphones,
  photography: Camera,
  books: Book,
  gaming: Gamepad2,
  automotive: Car,
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm])

  const fetchCategories = async () => {
    try {
      // Mock data for demonstration - replace with your actual API
      const mockCategories: Category[] = [
        {
          _id: "1",
          name: "Electronics",
          slug: "electronics",
          description: "Latest gadgets and electronic devices",
          image: "/placeholder.svg?height=300&width=400&text=Electronics",
          productCount: 156,
          featured: true,
          color: "bg-blue-500",
          subcategories: [
            { _id: "1a", name: "Smartphones", slug: "smartphones", productCount: 45 },
            { _id: "1b", name: "Laptops", slug: "laptops", productCount: 32 },
            { _id: "1c", name: "Tablets", slug: "tablets", productCount: 28 },
            { _id: "1d", name: "Smart Watches", slug: "smart-watches", productCount: 51 },
          ],
        },
        {
          _id: "2",
          name: "Clothing",
          slug: "clothing",
          description: "Fashion and apparel for all occasions",
          image: "/placeholder.svg?height=300&width=400&text=Clothing",
          productCount: 234,
          featured: true,
          color: "bg-purple-500",
          subcategories: [
            { _id: "2a", name: "Men's Wear", slug: "mens-wear", productCount: 89 },
            { _id: "2b", name: "Women's Wear", slug: "womens-wear", productCount: 112 },
            { _id: "2c", name: "Kids Wear", slug: "kids-wear", productCount: 33 },
          ],
        },
        {
          _id: "3",
          name: "Accessories",
          slug: "accessories",
          description: "Complete your look with our accessories",
          image: "/placeholder.svg?height=300&width=400&text=Accessories",
          productCount: 89,
          color: "bg-green-500",
          subcategories: [
            { _id: "3a", name: "Watches", slug: "watches", productCount: 34 },
            { _id: "3b", name: "Jewelry", slug: "jewelry", productCount: 28 },
            { _id: "3c", name: "Bags", slug: "bags", productCount: 27 },
          ],
        },
        {
          _id: "4",
          name: "Home & Garden",
          slug: "home-garden",
          description: "Everything for your home and garden",
          image: "/placeholder.svg?height=300&width=400&text=Home+Garden",
          productCount: 167,
          color: "bg-orange-500",
          subcategories: [
            { _id: "4a", name: "Furniture", slug: "furniture", productCount: 45 },
            { _id: "4b", name: "Decor", slug: "decor", productCount: 67 },
            { _id: "4c", name: "Garden Tools", slug: "garden-tools", productCount: 55 },
          ],
        },
        {
          _id: "5",
          name: "Sports & Fitness",
          slug: "sports-fitness",
          description: "Gear up for your active lifestyle",
          image: "/placeholder.svg?height=300&width=400&text=Sports+Fitness",
          productCount: 123,
          featured: true,
          color: "bg-red-500",
          subcategories: [
            { _id: "5a", name: "Gym Equipment", slug: "gym-equipment", productCount: 34 },
            { _id: "5b", name: "Outdoor Sports", slug: "outdoor-sports", productCount: 45 },
            { _id: "5c", name: "Fitness Apparel", slug: "fitness-apparel", productCount: 44 },
          ],
        },
        {
          _id: "6",
          name: "Books & Media",
          slug: "books-media",
          description: "Expand your knowledge and entertainment",
          image: "/placeholder.svg?height=300&width=400&text=Books+Media",
          productCount: 78,
          color: "bg-indigo-500",
          subcategories: [
            { _id: "6a", name: "Fiction", slug: "fiction", productCount: 34 },
            { _id: "6b", name: "Non-Fiction", slug: "non-fiction", productCount: 28 },
            { _id: "6c", name: "Educational", slug: "educational", productCount: 16 },
          ],
        },
      ]

      setCategories(mockCategories)
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    if (!searchTerm) {
      setFilteredCategories(categories)
      return
    }

    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategories?.some((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredCategories(filtered)
  }

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/shop?category=${categorySlug}`)
  }

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    router.push(`/shop?category=${categorySlug}&subcategory=${subcategorySlug}`)
  }

  const getIconForCategory = (categorySlug: string) => {
    const IconComponent = categoryIcons[categorySlug as keyof typeof categoryIcons] || Grid3X3
    return IconComponent
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
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

  const featuredCategories = filteredCategories.filter((cat) => cat.featured)
  const regularCategories = filteredCategories.filter((cat) => !cat.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Categories</h1>
          <p className="text-xl md:text-2xl mb-8">Discover products organized by type and use-case</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Categories</h2>
                <p className="text-gray-600">Our most popular product categories</p>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2">Trending</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category) => {
                const IconComponent = getIconForCategory(category.slug)
                return (
                  <Card
                    key={category._id}
                    className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                          {category.productCount} items
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {category.name}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      <p className="text-gray-600 mb-4">{category.description}</p>

                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Popular in this category:</p>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.slice(0, 3).map((subcategory) => (
                              <Button
                                key={subcategory._id}
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-indigo-50 hover:border-indigo-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSubcategoryClick(category.slug, subcategory.slug)
                                }}
                              >
                                {subcategory.name} ({subcategory.productCount})
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* All Categories */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h2>
            <p className="text-gray-600">Browse all available product categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularCategories.map((category) => {
              const IconComponent = getIconForCategory(category.slug)
              return (
                <Card
                  key={category._id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                    />
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-md">
                        <IconComponent className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm text-xs">
                        {category.productCount}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>

                    {/* Subcategories Preview */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="space-y-1">
                        {category.subcategories.slice(0, 2).map((subcategory) => (
                          <button
                            key={subcategory._id}
                            className="block w-full text-left text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSubcategoryClick(category.slug, subcategory.slug)
                            }}
                          >
                            • {subcategory.name} ({subcategory.productCount})
                          </button>
                        ))}
                        {category.subcategories.length > 2 && (
                          <p className="text-xs text-gray-400">+{category.subcategories.length - 2} more</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg mb-6 opacity-90">Browse all products or use our advanced search</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => router.push("/shop")}
            >
              Browse All Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-600"
              onClick={() => router.push("/search")}
            >
              Advanced Search
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
