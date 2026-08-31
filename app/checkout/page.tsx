import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen bg-night pt-40 text-center text-sm text-muted">Preparing your secure checkout…</div>}><CheckoutForm /></Suspense>;
}
