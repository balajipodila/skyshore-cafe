import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RecommendChat } from "@/components/chat/RecommendChat";
import { LocationProvider } from "@/components/location/LocationProvider";
import { CartAddPopup } from "@/components/cart/CartAddPopup";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Skyshore Café — Where the Sky Meets the Sea",
  description: "A calm beachside café chain across India. Affordable, warm, and honest — from ₹25 chai to signature Sunset Skies.",
  openGraph: {
    title: "Skyshore Café",
    description: "Where the sky meets the sea. Chai, cold coffee, street food and coastal calm.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-white focus:px-4 focus:py-2 focus:rounded-full z-[60]">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="pt-24 sm:pt-28">
          {children}
        </main>
        <Footer />
        <RecommendChat />
        <LocationProvider />
        <CartAddPopup />
        <ToastContainer />
      </body>
    </html>
  );
}
