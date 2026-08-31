import Stripe from "stripe";
import { NextResponse } from "next/server";

type CheckoutBody = {
  paymentMethod?: "upi" | "card" | "netbanking";
  customer?: { name?: string; email?: string; phone?: string; address?: string };
  items?: { name: string; price: number; quantity: number; slug: string }[];
};

export async function POST(request: Request) {
  const body = await request.json() as CheckoutBody;
  if (!body.items?.length || !body.customer?.email) return NextResponse.json({ error: "Please add at least one product and a valid email." }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel project settings to activate live checkout.", code: "STRIPE_NOT_CONFIGURED" }, { status: 503 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.customer.email,
    line_items: body.items.map((item) => ({ price_data: { currency: "inr", product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity })),
    metadata: { customer_name: body.customer.name ?? "", phone: body.customer.phone ?? "", address: body.customer.address ?? "", payment_method: body.paymentMethod ?? "card" },
    success_url: origin + "/checkout?success=1&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/checkout?canceled=1"
  });
  return NextResponse.json({ url: session.url });
}
