"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const role = (session?.user as any)?.role;

    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "user") router.replace("/user/dashboard");
    else router.replace("/");
  }, [session, status, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
