import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "GabFrag Vault — Private Collection",
  description: "A beautifully designed, luxury-focused web application built to catalog and explore a growing fragrance collection.",
};

import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-[100dvh] bg-base text-ink selection:bg-accent/30 selection:text-ink">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
