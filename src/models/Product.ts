import mongoose, { Schema, type Document, type Model } from "mongoose"

// -----------------------
// Interfaces Only
// -----------------------

export interface IReview {
  user: mongoose.Types.ObjectId
  rating: number
  comment?: string
  createdAt?: Date
}

export interface IVariant {
  color?: string
  size?: string
  stock?: number
  sku?: string
}

export interface IProduct extends Document {
  title: string
  slug?: string
  description?: string
  price: number
  discount?: number
  finalPrice?: number
  sku?: string
  quantity: number
  quality?: "new" | "used" | "refurbished"
  category?: string // Changed from ObjectId to string for simplicity
  brand?: string
  tags?: string[]
  images?: string[]
  thumbnail?: string
  variants?: IVariant[]
  reviews?: IReview[]
  averageRating?: number
  totalReviews?: number
  isFeatured?: boolean
  isAvailable?: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

// -----------------------
// Clean Schema Structure Only
// -----------------------

const ReviewSchema: Schema<IReview> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const VariantSchema: Schema<IVariant> = new Schema(
  {
    color: { type: String },
    size: { type: String },
    stock: { type: Number, default: 0 },
    sku: { type: String },
  },
  { _id: false },
)

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    sku: { type: String, unique: true },
    quantity: { type: Number, default: 0, required: true },
    quality: { type: String, enum: ["new", "used", "refurbished"], default: "new" },
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    }, // Changed to string with enum validation
    brand: { type: String },
    tags: [{ type: String }],
    images: [{ type: String }],
    thumbnail: { type: String },
    variants: [VariantSchema],
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true },
)

// -----------------------
// Indexes
// -----------------------
ProductSchema.index({ title: "text", description: "text", brand: "text", tags: "text" })
ProductSchema.index({ category: 1, isAvailable: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })

// -----------------------
// Pre-save Hook (Business Logic)
// -----------------------
ProductSchema.pre<IProduct>("save", function (next) {
  // Generate slug
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  }

  // Calculate final price
  if (this.discount && this.discount > 0) {
    this.finalPrice = this.price - (this.price * this.discount) / 100
  } else {
    this.finalPrice = this.price
  }

  // Update availability
  this.isAvailable = this.quantity > 0

  next()
})

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product
