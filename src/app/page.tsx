"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-white text-gray-900">
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to YourShop</h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Explore our wide range of products and enjoy fast, secure, and seamless shopping.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/products")}
            className="bg-white text-blue-600 px-6 py-3 rounded shadow font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="border border-white px-6 py-3 rounded hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </button>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Developer Links</h2>
        <div className="space-y-2 text-sm">
          <Link href="/auth/login" className="text-blue-600 hover:underline block">Login</Link>
          <Link href="/products" className="text-blue-600 hover:underline block">Products</Link>
          {/* <Link href="/admin/dashboard" className="text-blue-600 hover:underline block">Admin Dashboard</Link>
          <Link href="/user/dashboard" className="text-blue-600 hover:underline block">User Dashboard</Link> */}
        </div>
      </section>
    </main>
  );
}
