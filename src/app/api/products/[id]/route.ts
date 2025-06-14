import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

// GET single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error fetching product:", error)
    return NextResponse.json({ message: "Failed to fetch product", error: error.message }, { status: 500 })
  }
}

// PUT - Update product by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const body = await req.json()

    // Validate required fields
    const { title, price, quantity, category } = body

    if (!title || !price || !quantity || !category) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: [
            { field: "title", message: "Title is required" },
            { field: "price", message: "Price is required" },
            { field: "quantity", message: "Quantity is required" },
            { field: "category", message: "Category is required" },
          ].filter((err) => !body[err.field]),
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
          message: "Validation failed",
          errors: [{ field: "category", message: `Category must be one of: ${validCategories.join(", ")}` }],
        },
        { status: 400 },
      )
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: body.description?.trim() || "",
      price: Number(price),
      discount: Number(body.discount) || 0,
      quantity: Number(quantity),
      quality: body.quality || "new",
      sku: body.sku?.trim().toUpperCase() || undefined,
      brand: body.brand?.trim() || "",
      category,
      tags: Array.isArray(body.tags)
        ? body.tags
        : body.tags
            ?.split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean) || [],
      images: Array.isArray(body.images)
        ? body.images
        : body.images
            ?.split(",")
            .map((img: string) => img.trim())
            .filter(Boolean) || [],
      thumbnail: body.thumbnail?.trim() || "",
      isFeatured: Boolean(body.isFeatured),
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    console.log("✅ Product updated successfully:", updatedProduct._id)
    return NextResponse.json({ product: updatedProduct, message: "Product updated successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error updating product:", error)

    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }))
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: [{ field, message: `${field} already exists` }],
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ message: "Failed to update product", error: error.message }, { status: 500 })
  }
}

// DELETE product by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id)

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    console.log("✅ Product deleted successfully:", deletedProduct._id)
    return NextResponse.json({ message: "Product deleted successfully", product: deletedProduct }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error deleting product:", error)
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 })
  }
}
