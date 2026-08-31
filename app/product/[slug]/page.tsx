import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/data";
import { ProductDetail } from "@/components/product-detail";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.longDescription, openGraph: { title: product.name + " · AURAÉ", description: product.description, images: [{ url: product.image }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
