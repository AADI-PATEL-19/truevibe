"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Product {
  _id: string
  title: string
  price: number
  finalPrice: number
  thumbnail: string
  category: { name: string }
  brand: string
  isAvailable: boolean
  quantity: number
}

interface CartItem extends Product {
  cartQuantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

interface CartContextType {
  cart: CartState
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getCartItem: (productId: string) => CartItem | undefined
  isAuthenticated: boolean
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload
      const existingItem = state.items.find((item) => item._id === product._id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item._id === product._id
            ? { ...item, cartQuantity: Math.min(item.cartQuantity + quantity, item.quantity) }
            : item,
        )
      } else {
        newItems = [...state.items, { ...product, cartQuantity: Math.min(quantity, product.quantity) }]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.finalPrice * item.cartQuantity, 0)

      return { items: newItems, totalItems, totalPrice }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter((item) => item._id !== action.payload)
      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.finalPrice * item.cartQuantity, 0)

      return { items: newItems, totalItems, totalPrice }
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload
      const newItems = state.items.map((item) =>
        item._id === productId ? { ...item, cartQuantity: Math.min(Math.max(quantity, 1), item.quantity) } : item,
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.finalPrice * item.cartQuantity, 0)

      return { items: newItems, totalItems, totalPrice }
    }

    case "CLEAR_CART":
      return { items: [], totalItems: 0, totalPrice: 0 }

    case "LOAD_CART": {
      const items = action.payload
      const totalItems = items.reduce((sum, item) => sum + item.cartQuantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + item.finalPrice * item.cartQuantity, 0)

      return { items, totalItems, totalPrice }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAuthenticated = status === "authenticated"
  // Use email as unique identifier since it's guaranteed to be present
  const userIdentifier = session?.user?.email

  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  // Load cart from localStorage on mount (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && userIdentifier) {
      // Create a safe key from email by replacing special characters
      const safeKey = userIdentifier.replace(/[^a-zA-Z0-9]/g, "_")
      const savedCart = localStorage.getItem(`cart_${safeKey}`)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    } else if (status === "unauthenticated") {
      // Clear cart if user is not authenticated
      dispatch({ type: "CLEAR_CART" })
    }
  }, [isAuthenticated, userIdentifier, status])

  // Save cart to localStorage whenever it changes (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && userIdentifier) {
      // Create a safe key from email by replacing special characters
      const safeKey = userIdentifier.replace(/[^a-zA-Z0-9]/g, "_")
      localStorage.setItem(`cart_${safeKey}`, JSON.stringify(cart.items))
    }
  }, [cart.items, isAuthenticated, userIdentifier])

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/user/cart")}`)
      return false
    }
    return true
  }

  const addToCart = (product: Product, quantity = 1) => {
    if (!requireAuth()) return

    if (!product.isAvailable || product.quantity === 0) {
      return
    }
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } })
  }

  const removeFromCart = (productId: string) => {
    if (!requireAuth()) return
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (!requireAuth()) return

    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
    }
  }

  const clearCart = () => {
    if (!requireAuth()) return
    dispatch({ type: "CLEAR_CART" })
  }

  const isInCart = (productId: string) => {
    if (!isAuthenticated) return false
    return cart.items.some((item) => item._id === productId)
  }

  const getCartItem = (productId: string) => {
    if (!isAuthenticated) return undefined
    return cart.items.find((item) => item._id === productId)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
