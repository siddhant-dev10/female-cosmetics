"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { useCommerce } from "@/components/commerce-provider";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const [added, setAdded] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 240, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 240, damping: 20 });
  const shadowX = useTransform(springY, [-10, 10], [-12, 12]);
  const shadowY = useTransform(springX, [-10, 10], [12, -12]);

  const add = () => { addToCart(product); setAdded(true); window.setTimeout(() => setAdded(false), 1700); };

  return <motion.article className="group relative" style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }} onMouseMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); rotateY.set(((event.clientX - bounds.left) / bounds.width - .5) * 8); rotateX.set(-((event.clientY - bounds.top) / bounds.height - .5) * 8); }} onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}>
    <motion.div className="absolute inset-2 -z-10 rounded-3xl bg-violet/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ x: shadowX, y: shadowY }} />
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#13111a] p-3 transition-colors duration-500 group-hover:border-violet/40"><div className="relative aspect-[.92] overflow-hidden rounded-2xl bg-white/[.05]"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover opacity-80 mix-blend-screen transition duration-700 group-hover:scale-105 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d0b12]/50 via-transparent to-transparent" /><Badge className="absolute left-3 top-3 bg-night/65">{product.badge}</Badge><button aria-label={`${isWishlisted(product.slug) ? "Remove" : "Save"} ${product.name} ${isWishlisted(product.slug) ? "from" : "to"} wishlist`} onClick={() => toggleWishlist(product)} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl transition ${isWishlisted(product.slug) ? "border-violet bg-violet text-night" : "border-white/10 bg-night/60 text-muted hover:border-violet hover:text-violet"}`}><Heart size={15} fill={isWishlisted(product.slug) ? "currentColor" : "none"} /></button><motion.button onClick={add} className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-between rounded-full bg-ink px-4 text-xs font-semibold text-night opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100" whileTap={{ scale: .97 }}><span>{added ? "Added to bag" : "Add to bag"}</span><Plus size={15} className={added ? "rotate-45" : ""} /></motion.button></div><Link href={`/product/${product.slug}`} className="block px-1 pb-2 pt-5 focus-visible:outline-none"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.16em] text-violet">{product.eyebrow}</p><h3 className="mt-1 font-display text-xl text-ink">{product.name}</h3></div><span className="pt-1 text-sm font-medium text-ink">{formatINR(product.price)}</span></div><div className="mt-3 flex items-center justify-between text-xs text-muted"><span>{product.description}</span><span className="flex items-center gap-1 text-lavender"><Star size={11} fill="currentColor" /> {product.rating}</span></div></Link></div>
  </motion.article>;
}
