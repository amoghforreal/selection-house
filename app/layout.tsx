import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Selection House: Wholesale Sports Goods Since 1989",
    template: "%s | Selection House",
  },
  description:
    "Selection House is a trusted wholesale sports goods supplier based in Pilibhit, serving shop owners since 1989. Order cricket, hockey, badminton, gym equipment, school bags, and more in bulk.",
  keywords: [
    "wholesale sports goods",
    "sports equipment supplier",
    "Selection House Pilibhit",
    "bulk sports order",
    "cricket wholesale",
    "Yonex distributor",
  ],
  openGraph: {
    title: "Selection House: Wholesale Sports Goods Since 1989",
    description:
      "Trusted wholesale sports goods supplier for shop owners. Serving since 1989 from Pilibhit.",
    siteName: "Selection House",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
