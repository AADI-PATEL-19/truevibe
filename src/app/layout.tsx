import { Metadata } from "next";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SessionProviderWrapper from "../app/providers/SessionProviderWrapper"; 

export const metadata: Metadata = {
  title: "YourShop – The Future of Shopping",
  description: "Premium products, lightning-fast delivery, and unbeatable support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
