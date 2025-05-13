"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/auth/redirect" });

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Login to TRUEVIBE</h1>
        <p className="text-sm text-gray-500 mb-8">Sign in with your Google account</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
