"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";

const categories = ["All", "Skin", "Makeup", "Lips", "Sets"] as const;

export function ProductGrid() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [finish, setFinish] = useState("All finishes");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleProducts = useMemo(() => {
    const result = products.filter((product) => (category === "All" || product.category === category) && (finish === "All finishes" || product.finish === finish));
    if (sort === "low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, finish, sort]);

  return <section id="shop" className="relative border-b border-white/10 bg-night px-5 py-24 lg:px-10 lg:py-36"><div className="mx-auto max-w-[1440px]"><div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end" data-reveal><div><p className="text-[10px] uppercase tracking-[.22em] text-violet">Curated for your shelf</p><h2 className="mt-4 max-w-2xl font-display text-5xl leading-[.95] tracking-[-.055em] text-ink sm:text-6xl">The AURAÉ<br /><span className="italic text-lavender">edit.</span></h2></div><p className="max-w-sm text-sm leading-7 text-muted">A small collection of high-performance essentials, built to layer beautifully and live easily.</p></div><div className="mb-8 flex flex-col gap-5 border-y border-white/10 py-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-5 overflow-x-auto pb-1 text-xs text-muted" role="tablist" aria-label="Product categories">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} onClick={() => setCategory(item)} className={cn("relative whitespace-nowrap py-2 transition after:absolute after:bottom-0 after:left-0 after:h-px after:bg-violet after:transition-all", category === item ? "text-ink after:right-0" : "after:right-full hover:text-ink hover:after:right-0")}>{item}<span className="ml-1.5 text-[10px] text-violet">{item === "All" ? "08" : products.filter((product) => product.category === item).length.toString().padStart(2, "0")}</span></button>)}</div><div className="flex items-center gap-3"><button onClick={() => setFiltersOpen((value) => !value)} className="flex items-center gap-2 text-xs text-muted transition hover:text-ink"><SlidersHorizontal size={14} /> Filters</button><span className="h-4 w-px bg-white/10" /><label className="flex items-center gap-2 text-xs text-muted"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent text-ink outline-none"><option className="bg-panel" value="featured">Featured</option><option className="bg-panel" value="low">Price: low to high</option><option className="bg-panel" value="high">Price: high to low</option><option className="bg-panel" value="rating">Top rated</option></select></label></div></div>{filtersOpen && <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4" data-reveal><span className="mr-2 text-[10px] uppercase tracking-[.18em] text-violet">Finish</span>{["All finishes", "Dewy", "Soft matte", "Radiant"].map((item) => <button key={item} onClick={() => setFinish(item)} className={cn("rounded-full border px-3 py-1.5 text-xs transition", finish === item ? "border-violet bg-violet/10 text-lavender" : "border-white/10 text-muted hover:border-white/30 hover:text-ink")}>{item}</button>)}</div>}<div className="grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product, index) => <div key={product.slug} data-reveal style={{ transitionDelay: `${index * 35}ms` }}><ProductCard product={product} /></div>)}</div>{visibleProducts.length === 0 && <div className="rounded-3xl border border-dashed border-white/15 py-20 text-center text-sm text-muted">No pieces in this edit yet. Try another finish.</div>}</div></section>;
}
