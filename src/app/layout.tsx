import { Metadata } from "next";
import "./globals.css";

import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import SessionProviderWrapper from "../app/providers/SessionProviderWrapper";
import { WishlistProvider } from "@/contexts/wishlist";
import { CartProvider } from "@/contexts/cart";

export const metadata: Metadata = {
  title: "YourShop – The Future of Shopping",
  description: "Premium products, lightning-fast delivery, and unbeatable support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <WishlistProvider>
            <CartProvider>
              <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
          </WishlistProvider>
      </SessionProviderWrapper>
    </body>
    </html >
  );
}
