'use client';

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          TRUEVIBE
        </Link>
        <nav className="space-x-4">
          <Link href="/products" className="text-gray-700 hover:text-blue-600">
            Products
          </Link>
          <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
