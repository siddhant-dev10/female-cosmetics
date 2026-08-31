import { Hero } from "@/components/hero";
import { BrandMarquee, NewRituals, PromiseStrip, ReviewSection, StorySection } from "@/components/home-sections";
import { ProductGrid } from "@/components/product-grid";
import { products } from "@/lib/data";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "AURAÉ",
    description: "High-performance vegan beauty essentials made thoughtfully in India.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurae-beauty.vercel.app",
    brand: { "@type": "Brand", name: "AURAÉ" },
    offers: products.map((product) => ({ "@type": "Offer", name: product.name, priceCurrency: "INR", price: product.price, availability: "https://schema.org/InStock" }))
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <Hero />
    <BrandMarquee />
    <ProductGrid />
    <NewRituals />
    <StorySection />
    <ReviewSection />
    <PromiseStrip />
  </>;
}
