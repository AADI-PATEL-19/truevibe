import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function POST(req: NextRequest) {
  console.log("🚀 API Route called")

  try {
    await dbConnect()
    console.log("✅ Database connected")

    const body = await req.json()
    console.log("📥 Received data:", body)

    // Basic validation
    const { title, price, quantity, category } = body

    if (!title || !price || quantity === undefined || !category) {
      console.log("❌ Missing required fields:", {
        title: !!title,
        price: !!price,
        quantity: quantity !== undefined,
        category: !!category,
      })
      return NextResponse.json(
        {
          message: "Missing required fields",
          required: ["title", "price", "quantity", "category"],
          received: { title: !!title, price: !!price, quantity: quantity !== undefined, category: !!category },
        },
        { status: 400 },
      )
    }

    // Validate category
    const validCategories = [
      "electronics",
      "clothing",
      "accessories",
      "home",
      "sports",
      "books",
      "beauty",
      "automotive",
      "toys",
      "food",
    ]

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          message: "Invalid category",
          validCategories,
          received: category,
        },
        { status: 400 },
      )
    }

    // Create product
    const productData = {
      title: title.trim(),
      description: body.description?.trim() || "",
      price: Number(price),
      discount: Number(body.discount) || 0,
      quantity: Number(quantity),
      quality: body.quality || "new",
      sku: body.sku?.trim() || undefined,
      brand: body.brand?.trim() || "",
      category: category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      images: Array.isArray(body.images) ? body.images : [],
      thumbnail: body.thumbnail?.trim() || "",
      isFeatured: Boolean(body.isFeatured),
    }

    console.log("💾 Creating product with data:", productData)

    const newProduct = await Product.create(productData)
    console.log("✅ Product created:", newProduct._id)

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("❌ API Error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }))
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 },
      )
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "Duplicate key error - SKU might already exist",
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Enhanced GET endpoint with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    console.log("✅ Database connected for GET")

    const { searchParams } = new URL(req.url)

    // Parse query parameters
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "12")))
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const quality = searchParams.get("quality")
    const newArrivals = searchParams.get("newArrivals")

    // Build query object
    const query: any = {}

    if (category && category !== "all") query.category = category
    if (featured === "true") query.isFeatured = true
    if (quality) query.quality = quality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.finalPrice = {}
      if (minPrice) query.finalPrice.$gte = Number(minPrice)
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice)
    }

    // Sort options
    let sortOption: any = { createdAt: -1 } // Default: newest first

    if (newArrivals === "true") {
      // For new arrivals, get products from last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      query.createdAt = { $gte: thirtyDaysAgo }
      sortOption = { createdAt: -1 }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    console.log(`✅ Found ${products.length} products out of ${total} total`)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters: {
        category,
        featured,
        search,
        minPrice,
        maxPrice,
        quality,
        newArrivals,
      },
    })
  } catch (error: any) {
    console.error("❌ GET Error:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
