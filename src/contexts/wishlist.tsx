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

interface WishlistState {
  items: Product[]
  totalItems: number
}

interface WishlistContextType {
  wishlist: WishlistState
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
  isAuthenticated: boolean
}

type WishlistAction =
  | { type: "ADD_TO_WISHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: Product[] }

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const existingItem = state.items.find((item) => item._id === action.payload._id)
      if (existingItem) {
        return state // Item already in wishlist
      }

      const newItems = [...state.items, action.payload]
      return { items: newItems, totalItems: newItems.length }
    }

    case "REMOVE_FROM_WISHLIST": {
      const newItems = state.items.filter((item) => item._id !== action.payload)
      return { items: newItems, totalItems: newItems.length }
    }

    case "CLEAR_WISHLIST":
      return { items: [], totalItems: 0 }

    case "LOAD_WISHLIST": {
      const items = action.payload
      return { items, totalItems: items.length }
    }

    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAuthenticated = status === "authenticated"
  // Use email as unique identifier since it's guaranteed to be present
  const userIdentifier = session?.user?.email

  const [wishlist, dispatch] = useReducer(wishlistReducer, {
    items: [],
    totalItems: 0,
  })

  // Load wishlist from localStorage on mount (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && userIdentifier) {
      // Create a safe key from email by replacing special characters
      const safeKey = userIdentifier.replace(/[^a-zA-Z0-9]/g, "_")
      const savedWishlist = localStorage.getItem(`wishlist_${safeKey}`)
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist)
          dispatch({ type: "LOAD_WISHLIST", payload: parsedWishlist })
        } catch (error) {
          console.error("Error loading wishlist from localStorage:", error)
        }
      }
    } else if (status === "unauthenticated") {
      // Clear wishlist if user is not authenticated
      dispatch({ type: "CLEAR_WISHLIST" })
    }
  }, [isAuthenticated, userIdentifier, status])

  // Save wishlist to localStorage whenever it changes (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && userIdentifier) {
      // Create a safe key from email by replacing special characters
      const safeKey = userIdentifier.replace(/[^a-zA-Z0-9]/g, "_")
      localStorage.setItem(`wishlist_${safeKey}`, JSON.stringify(wishlist.items))
    }
  }, [wishlist.items, isAuthenticated, userIdentifier])

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/user/wishlist")}`)
      return false
    }
    return true
  }

  const addToWishlist = (product: Product) => {
    if (!requireAuth()) return
    dispatch({ type: "ADD_TO_WISHLIST", payload: product })
  }

  const removeFromWishlist = (productId: string) => {
    if (!requireAuth()) return
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId })
  }

  const clearWishlist = () => {
    if (!requireAuth()) return
    dispatch({ type: "CLEAR_WISHLIST" })
  }

  const isInWishlist = (productId: string) => {
    if (!isAuthenticated) return false
    return wishlist.items.some((item) => item._id === productId)
  }

  const toggleWishlist = (product: Product) => {
    if (!requireAuth()) return

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
        isAuthenticated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
