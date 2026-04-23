import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Best Coffee Shops in Houston, TX | Houston Coffee Rankings",
  description: "Personally visited and ranked coffee shops across Houston, TX — filtered by best coffee, study spots, date vibes, and more. Updated regularly by a local.",
  keywords: "best coffee shops houston, houston coffee, coffee houston tx, houston cafe rankings, montrose coffee, heights coffee, houston espresso",
  openGraph: {
    title: "Best Coffee Shops in Houston, TX | Houston Coffee Rankings",
    description: "Personally visited and ranked coffee shops across Houston, TX — filtered by best coffee, study spots, date vibes, and more.",
    url: "https://houstoncoffeeproject.com",
    siteName: "Houston Coffee Rankings",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}<Analytics /></body>
    </html>
  );
}
