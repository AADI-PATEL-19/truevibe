"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Chrome } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/auth/redirect" })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-200 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-purple-200 rounded-full blur-2xl"></div>
        </div>

        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/20"></div>
      </div>

      {/* Focused Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-2xl">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">Welcome to TRUEVIBE</h1>
          </div>

          {/* Focused Login Card */}
          <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 ring-1 ring-gray-200/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                  ) : (
                    <Chrome className="h-5 w-5 text-blue-600" />
                  )}
                  <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
                </div>
              </Button>

              {/* Simple Benefits */}
              <div className="text-center space-y-2 pt-4">{/* Benefits removed as requested */}</div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-sm text-gray-600 drop-shadow-sm">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium drop-shadow-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
