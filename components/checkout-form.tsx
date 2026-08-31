"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CreditCard, Landmark, Loader2, ShieldCheck, Smartphone, WalletCards } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCommerce } from "@/components/commerce-provider";
import { cn, formatINR, getDeliveryWindow } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

const paymentOptions: { value: PaymentMethod; label: string; detail: string; icon: typeof Smartphone }[] = [
  { value: "upi", label: "UPI", detail: "GPay, PhonePe, Paytm & more", icon: Smartphone },
  { value: "card", label: "Credit / debit card", detail: "Visa, Mastercard, RuPay & Amex", icon: CreditCard },
  { value: "netbanking", label: "Net banking", detail: "All major Indian banks", icon: Landmark },
  { value: "cod", label: "Cash on delivery", detail: "₹49 handling fee", icon: WalletCards }
];

function SuccessState({ orderId }: { orderId: string }) {
  return <main className="flex min-h-[80vh] items-center justify-center bg-night px-5 pb-24 pt-36"><div className="max-w-lg text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet text-night shadow-glow"><Check size={28} /></div><p className="mt-8 text-[10px] uppercase tracking-[.22em] text-violet">It’s on the way</p><h1 className="mt-4 font-display text-5xl leading-none tracking-[-.05em] text-ink">Thank you for choosing your glow.</h1><p className="mt-6 text-sm leading-7 text-muted">Your order <strong className="text-lavender">#{orderId}</strong> is confirmed. We’ll send tracking details to your email shortly.</p><Link href="/"><Button className="mt-8">Back to the edit <ArrowRight size={16} /></Button></Link></div></main>;
}

export function CheckoutForm() {
  const { cart, cartSubtotal } = useCommerce();
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codOrderId, setCodOrderId] = useState("");
  const delivery = useMemo(() => /^\d{6}$/.test(pin) ? getDeliveryWindow(pin) : null, [pin]);
  const shipping = cartSubtotal >= 1499 || cartSubtotal === 0 ? 0 : 99;
  const handling = paymentMethod === "cod" ? 49 : 0;
  const total = cartSubtotal + shipping + handling;
  const successId = searchParams.get("success") === "1" ? searchParams.get("session_id")?.slice(-8) ?? "AURE-PAID" : codOrderId;

  if (successId) return <SuccessState orderId={successId} />;
  if (!cart.length) return <main className="flex min-h-[80vh] items-center justify-center bg-night px-5 pb-24 pt-36"><div className="text-center"><p className="text-[10px] uppercase tracking-[.22em] text-violet">Your edit</p><h1 className="mt-4 font-display text-5xl text-ink">Your bag is waiting.</h1><p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted">Add something lovely first, then we’ll take care of the rest.</p><Link href="/#shop"><Button className="mt-8">Continue shopping <ArrowRight size={16} /></Button></Link></div></main>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const customer = { name: String(form.get("firstName")) + " " + String(form.get("lastName")), email: form.get("email"), phone: form.get("phone"), address: String(form.get("address")) + ", " + String(form.get("city")) + ", " + String(form.get("state")) + " " + String(form.get("pin")) };
    if (paymentMethod === "cod") { setCodOrderId("AUR" + Math.floor(1000 + Math.random() * 8999)); setLoading(false); return; }
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentMethod, customer, items: cart.map((line) => ({ name: line.product.name, price: line.product.price, quantity: line.quantity, slug: line.product.slug })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "We couldn’t start checkout.");
      if (data.url) window.location.assign(data.url);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "We couldn’t start checkout."); setLoading(false); }
  }

  return <main className="min-h-screen bg-night px-5 pb-24 pt-32 lg:px-10 lg:pt-40"><div className="mx-auto max-w-[1280px]"><Link href="/#shop" className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-ink"><ArrowLeft size={14} /> Back to the edit</Link><div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_.75fr] lg:gap-20"><div><p className="text-[10px] uppercase tracking-[.22em] text-violet">Almost yours</p><h1 className="mt-4 max-w-2xl font-display text-5xl leading-[.92] tracking-[-.055em] text-ink sm:text-6xl">Where should we send your glow?</h1><p className="mt-5 max-w-lg text-sm leading-7 text-muted">Free delivery above ₹1,499. All orders ship from our Bengaluru studio.</p><form onSubmit={submit} className="mt-10 space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label>First name<input required name="firstName" autoComplete="given-name" placeholder="Aarohi" /></label><label>Last name<input required name="lastName" autoComplete="family-name" placeholder="Sharma" /></label></div><label>House / flat / street<input required name="address" autoComplete="street-address" placeholder="12, Rosewood Lane" /></label><div className="grid gap-4 sm:grid-cols-2"><label>City<input required name="city" autoComplete="address-level2" placeholder="Mumbai" /></label><label>State<select required name="state" defaultValue=""><option value="" disabled>Select state</option><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option><option>Tamil Nadu</option><option>Telangana</option><option>West Bengal</option><option>Other</option></select></label></div><div className="grid gap-4 sm:grid-cols-2"><label>PIN code<input required name="pin" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="400001" /></label><label>Phone number<input required name="phone" autoComplete="tel" placeholder="+91 98765 43210" /></label></div><label>Email address<input required name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>{delivery ? <div className="flex gap-3 rounded-2xl border border-violet/20 bg-violet/10 p-4 text-xs text-lavender"><Check size={16} className="shrink-0 text-violet" /><span><strong className="text-ink">Arrives between {delivery.range}</strong><br /><span className="text-muted">{delivery.mode} · We deliver across India from Bengaluru.</span></span></div> : <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-xs text-muted">Enter your 6-digit PIN to see your delivery window.</div>}<div className="pt-5"><p className="text-[10px] uppercase tracking-[.2em] text-violet">Choose how you’d like to pay</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{paymentOptions.map((option) => { const Icon = option.icon; return <button type="button" key={option.value} onClick={() => setPaymentMethod(option.value)} className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left transition", paymentMethod === option.value ? "border-violet bg-violet/10" : "border-white/10 bg-white/[.03] hover:border-white/25")}><span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", paymentMethod === option.value ? "border-violet/30 bg-violet/15 text-violet" : "border-white/10 text-muted")}><Icon size={16} /></span><span className="min-w-0 flex-1"><strong className="block text-xs text-ink">{option.label}</strong><small className="mt-1 block text-[10px] text-muted">{option.detail}</small></span><span className={cn("flex h-4 w-4 items-center justify-center rounded-full border text-[10px]", paymentMethod === option.value ? "border-violet bg-violet text-night" : "border-white/20 text-transparent")}>✓</span></button>; })}</div></div>{error && <div role="alert" className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-xs text-red-200">{error}</div>}<Button type="submit" size="lg" className="w-full justify-between" disabled={loading}>{loading ? <><Loader2 className="animate-spin" size={17} /> Starting secure checkout…</> : <>{paymentMethod === "cod" ? "Place COD order" : "Continue to secure payment"}<ArrowRight size={17} /></>}</Button><p className="flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[.13em] text-muted"><ShieldCheck size={13} className="text-violet" /> Encrypted checkout · Your details stay private</p></form></div><aside className="h-fit rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8 lg:sticky lg:top-32"><p className="text-[10px] uppercase tracking-[.2em] text-violet">Your order</p><div className="mt-5 space-y-4">{cart.map((line) => <div key={line.product.slug} className="flex items-center gap-3"><div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-white/[.06]"><Image src={line.product.image} alt={line.product.name} fill sizes="56px" className="object-cover mix-blend-screen" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs text-ink">{line.product.name}</p><p className="mt-1 text-[10px] text-muted">Qty {line.quantity} · {line.product.finish}</p></div><span className="text-xs text-ink">{formatINR(line.product.price * line.quantity)}</span></div>)}</div><div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs text-muted"><div className="flex justify-between"><span>Subtotal</span><span className="text-ink">{formatINR(cartSubtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span className="text-ink">{shipping ? formatINR(shipping) : "Free"}</span></div>{handling > 0 && <div className="flex justify-between"><span>COD handling</span><span className="text-ink">{formatINR(handling)}</span></div>}<div className="flex justify-between border-t border-white/10 pt-4 text-base"><span className="text-ink">Total</span><span className="font-semibold text-violet">{formatINR(total)}</span></div></div><div className="mt-7 flex gap-3 border-t border-white/10 pt-5 text-xs text-muted"><span className="text-lg text-violet">♡</span><p><strong className="text-ink">A little extra care</strong><br />Every order is wrapped in signature violet tissue.</p></div></aside></div></div></main>;
}
