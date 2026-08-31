"use client";

import Link from "next/link";
import { Check, Heart, MapPin, Package, Settings2, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Order = { id: string; date: string; status: string; total: number; products: string[]; address: string };
const starterOrders: Order[] = [
  { id: "AUR2194", date: "18 Aug 2026", status: "Delivered", total: 2398, products: ["Dew Drop Barrier Serum", "Plump Theory Lip Oil"], address: "Mumbai, Maharashtra" },
  { id: "AUR1977", date: "02 Jul 2026", status: "Delivered", total: 1699, products: ["Cloud Veil SPF 50"], address: "Mumbai, Maharashtra" }
];

export function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders" | "addresses" | "preferences">("profile");
  const [orders, setOrders] = useState<Order[]>(starterOrders);
  useEffect(() => { try { const saved = window.localStorage.getItem("aurae-orders"); if (saved) setOrders(JSON.parse(saved)); } catch { /* private browsing */ } }, []);
  const tabs = [{ id: "profile", label: "My profile", icon: UserRound }, { id: "orders", label: "Order history", icon: Package }, { id: "addresses", label: "Saved addresses", icon: MapPin }, { id: "preferences", label: "Beauty preferences", icon: Settings2 }] as const;

  return <main className="min-h-screen bg-night px-5 pb-24 pt-32 lg:px-10 lg:pt-40"><div className="mx-auto max-w-[1180px]"><div data-reveal><p className="text-[10px] uppercase tracking-[.22em] text-violet">Your AURAÉ</p><h1 className="mt-4 font-display text-5xl tracking-[-.05em] text-ink sm:text-6xl">Account.</h1></div><div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]"><nav className="flex gap-2 overflow-x-auto border-b border-white/10 pb-3 lg:block lg:space-y-2 lg:border-0 lg:pb-0">{tabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setTab(item.id)} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-xs transition lg:w-full", tab === item.id ? "bg-violet/10 text-lavender" : "text-muted hover:bg-white/[.04] hover:text-ink")}><Icon size={15} className={tab === item.id ? "text-violet" : "text-muted"} />{item.label}{item.id === "orders" && <span className="ml-auto text-[10px] text-violet">{orders.length}</span>}</button>; })}<div className="mt-12 hidden rounded-2xl border border-white/10 bg-white/[.03] p-5 lg:block"><Sparkles size={18} className="text-violet" /><p className="mt-4 text-xs leading-6 text-muted">Need a hand with an order or a formula?</p><Link href="/help" className="mt-4 block text-xs text-lavender transition hover:text-violet">Visit help desk →</Link></div></nav><div>{tab === "profile" && <ProfilePanel orders={orders} onOrders={() => setTab("orders")} />}{tab === "orders" && <OrdersPanel orders={orders} />}{tab === "addresses" && <AddressesPanel />}{tab === "preferences" && <PreferencesPanel />}</div></div></div></main>;
}

function ProfilePanel({ orders, onOrders }: { orders: Order[]; onOrders: () => void }) {
  return <section data-reveal><div className="flex flex-wrap items-start gap-4 border-b border-white/10 pb-8"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4becb] font-display text-xl text-night">AS</div><div><p className="text-[10px] uppercase tracking-[.2em] text-violet">Welcome back</p><h2 className="mt-2 font-display text-3xl text-ink">Aarohi Sharma</h2><p className="mt-2 text-xs text-muted">Member since March 2023 · <span className="text-lavender">AURAÉ muse</span></p></div><button className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs text-muted transition hover:border-violet hover:text-ink">Edit profile</button></div><div className="mt-8 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-violet p-6 text-night"><Heart size={18} /><p className="mt-5 text-[10px] uppercase tracking-[.17em] opacity-70">Your glow points</p><p className="mt-2 font-display text-4xl">1,240</p><p className="mt-3 text-xs opacity-70">₹124 ready to redeem on your next order.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><Sparkles size={18} className="text-violet" /><p className="mt-5 text-[10px] uppercase tracking-[.17em] text-violet">Your signature</p><p className="mt-2 font-display text-3xl text-ink">Soft & radiant</p><p className="mt-3 text-xs text-muted">Based on your saved skin and finish preferences.</p></div></div><div className="mt-10"><div className="flex items-center justify-between"><h3 className="font-display text-2xl text-ink">Recent orders</h3><button onClick={onOrders} className="text-xs text-lavender transition hover:text-violet">View all →</button></div><div className="mt-4 border-t border-white/10">{orders.slice(0, 2).map((order) => <OrderRow key={order.id} order={order} />)}</div></div></section>;
}

function OrdersPanel({ orders }: { orders: Order[] }) {
  return <section data-reveal><div className="flex items-end justify-between border-b border-white/10 pb-8"><div><p className="text-[10px] uppercase tracking-[.2em] text-violet">Your AURAÉ archive</p><h2 className="mt-2 font-display text-3xl text-ink">Order history</h2></div><span className="text-xs text-muted">{orders.length} orders</span></div><div className="mt-3">{orders.map((order) => <OrderRow key={order.id} order={order} detailed />)}</div></section>;
}

function OrderRow({ order, detailed = false }: { order: Order; detailed?: boolean }) {
  return <div className="flex flex-wrap items-center gap-4 border-b border-white/10 py-5"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet"><Package size={18} /></div><div className="min-w-0 flex-1"><p className="text-sm text-ink">Order #{order.id}</p><p className="mt-1 truncate text-xs text-muted">{order.date} · {order.products.join(" + ")}</p>{detailed && <p className="mt-1 text-xs text-muted">Delivering to {order.address}</p>}</div><div className="text-right"><p className="text-sm text-ink">{formatINR(order.total)}</p><span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] uppercase tracking-[.12em] text-emerald-300"><Check size={10} /> {order.status}</span></div></div>;
}

function AddressesPanel() {
  return <section data-reveal><div className="flex items-end justify-between border-b border-white/10 pb-8"><div><p className="text-[10px] uppercase tracking-[.2em] text-violet">For a faster checkout</p><h2 className="mt-2 font-display text-3xl text-ink">Saved addresses</h2></div><Button variant="outline" size="sm">+ Add address</Button></div><div className="mt-7 max-w-lg rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.15em] text-violet">Home · Default</span><button className="text-xs text-muted hover:text-ink">Edit</button></div><p className="mt-5 text-sm text-ink">Aarohi Sharma</p><p className="mt-2 text-xs leading-6 text-muted">12, Rosewood Lane, Bandra West<br />Mumbai, Maharashtra 400050<br />+91 98765 43210</p></div></section>;
}

function PreferencesPanel() {
  const groups = [{ label: "My skin type", options: ["Combination", "Dry", "Oily", "Normal"] }, { label: "My favourite finish", options: ["Soft matte", "Dewy", "Radiant"] }, { label: "What I’m shopping for", options: ["Everyday skin", "Easy colour", "Occasion ready"] }];
  return <section data-reveal><div className="border-b border-white/10 pb-8"><p className="text-[10px] uppercase tracking-[.2em] text-violet">Make it yours</p><h2 className="mt-2 font-display text-3xl text-ink">Beauty preferences</h2></div><div className="divide-y divide-white/10">{groups.map((group, groupIndex) => <div key={group.label} className="py-6"><p className="text-xs text-ink">{group.label}</p><div className="mt-4 flex flex-wrap gap-2">{group.options.map((option, index) => <button key={option} className={cn("rounded-full border px-4 py-2 text-xs transition", index === groupIndex % 2 ? "border-violet bg-violet/10 text-lavender" : "border-white/10 text-muted hover:border-white/30 hover:text-ink")}>{option}</button>)}</div></div>)}</div><Button className="mt-7">Save preferences <Check size={15} /></Button></section>;
}
