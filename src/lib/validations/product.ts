import { z } from "zod"

// -----------------------
// Zod Validation Schemas
// -----------------------

export const ReviewValidationSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
})

export const VariantValidationSchema = z.object({
  color: z.string().max(50, "Color name cannot exceed 50 characters").optional(),
  size: z.string().max(20, "Size cannot exceed 20 characters").optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(0),
  sku: z
    .string()
    .max(50, "SKU cannot exceed 50 characters")
    .regex(/^[A-Z0-9-_]*$/, "SKU can only contain uppercase letters, numbers, hyphens, and underscores")
    .optional(),
})

export const ProductValidationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title cannot exceed 200 characters").trim(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").trim().optional(),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(999999.99, "Price cannot exceed $999,999.99")
    .refine((val) => Number.isFinite(val), "Price must be a valid number"),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .int("Discount must be a whole number")
    .default(0),
  quantity: z
    .number()
    .min(0, "Quantity cannot be negative")
    .max(999999, "Quantity cannot exceed 999,999")
    .int("Quantity must be a whole number")
    .default(0),
  quality: z.enum(["new", "used", "refurbished"]).default("new"),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU cannot exceed 50 characters")
    .regex(/^[A-Z0-9-_]+$/, "SKU can only contain uppercase letters, numbers, hyphens, and underscores")
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  brand: z.string().max(100, "Brand cannot exceed 100 characters").trim().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z
    .array(z.string().min(1).max(50))
    .max(20, "Maximum 20 tags allowed")
    .default([])
    .transform((tags) => tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .max(10, "Maximum 10 images allowed")
    .default([])
    .refine(
      (images) => images.every((img) => /\.(jpg|jpeg|png|gif|webp)$/i.test(img)),
      "All images must be valid image URLs",
    ),
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid URL")
    .refine((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url), "Thumbnail must be a valid image URL")
    .optional(),
  variants: z.array(VariantValidationSchema).max(50, "Maximum 50 variants allowed").default([]),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(60, "Meta title cannot exceed 60 characters").trim().optional(),
  metaDescription: z.string().max(160, "Meta description cannot exceed 160 characters").trim().optional(),
})

// -----------------------
// Type Exports
// -----------------------
export type ProductValidationType = z.infer<typeof ProductValidationSchema>
export type VariantValidationType = z.infer<typeof VariantValidationSchema>
export type ReviewValidationType = z.infer<typeof ReviewValidationSchema>

// -----------------------
// Validation Functions
// -----------------------
export function validateProductData(data: any): {
  success: boolean
  data?: ProductValidationType
  errors?: Array<{ field: string; message: string }>
} {
  try {
    const validatedData = ProductValidationSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error: any) {
    if (error.name === "ZodError") {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }))
      return { success: false, errors }
    }
    return { success: false, errors: [{ field: "general", message: "Validation failed" }] }
  }
}

export function validatePartialProductData(data: any): {
  success: boolean
  data?: Partial<ProductValidationType>
  errors?: Array<{ field: string; message: string }>
} {
  try {
    const validatedData = ProductValidationSchema.partial().parse(data)
    return { success: true, data: validatedData }
  } catch (error: any) {
    if (error.name === "ZodError") {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }))
      return { success: false, errors }
    }
    return { success: false, errors: [{ field: "general", message: "Validation failed" }] }
  }
}

// -----------------------
// Helper Functions
// -----------------------
export function processFormData(formData: any): any {
  return {
    ...formData,
    price: Number(formData.price),
    discount: Number(formData.discount || 0),
    quantity: Number(formData.quantity || 0),
    tags:
      typeof formData.tags === "string"
        ? formData.tags
            .split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)
        : formData.tags || [],
    images:
      typeof formData.images === "string"
        ? formData.images
            .split(",")
            .map((i: string) => i.trim())
            .filter((i: string) => i.length > 0)
        : formData.images || [],
    variants: Array.isArray(formData.variants) ? formData.variants : [],
    isFeatured: Boolean(formData.isFeatured),
  }
}
