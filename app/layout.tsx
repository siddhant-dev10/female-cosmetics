import type { Metadata } from "next";
import { CommerceProvider } from "@/components/commerce-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurae-beauty.vercel.app"),
  title: { default: "AURAÉ — Beauty, in your best light.", template: "%s · AURAÉ" },
  description: "High-performance beauty essentials with a softer point of view. Vegan, considered and made thoughtfully in India.",
  keywords: ["AURAÉ", "Indian cosmetics", "vegan beauty", "skincare", "makeup", "lip colour"],
  authors: [{ name: "AURAÉ Beauty" }],
  openGraph: {
    title: "AURAÉ — Beauty, in your best light.",
    description: "A small collection of high-performance essentials for real skin, real days and all the in-between.",
    type: "website",
    siteName: "AURAÉ"
  },
  twitter: { card: "summary_large_image", title: "AURAÉ — Beauty, in your best light.", description: "Beauty, in your best light." },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body><MotionProvider><CommerceProvider><SiteShell>{children}</SiteShell></CommerceProvider></MotionProvider></body></html>;
}
