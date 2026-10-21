import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  try {
    const { resourceId, provider } = await req.json();
    if (!resourceId || !["razorpay", "cashfree"].includes(provider)) return NextResponse.json({ error: "Invalid course or payment provider." }, { status: 400 });
    const resource = await prisma.resource.findFirst({ where: { id: resourceId, type: "CLASS", published: true } });
    if (!resource) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    const existing = await prisma.enrollment.findUnique({ where: { userId_resourceId: { userId: user.id, resourceId } } });
    if (existing) return NextResponse.json({ enrolled: true });
    const amountPaise = Math.round(resource.price * 100);
    if (amountPaise < 100) return NextResponse.json({ error: "Course price must be at least ₹1. Set a valid price in the database/admin panel." }, { status: 400 });
    const appUrl = process.env.APP_URL;
    if (!appUrl) return NextResponse.json({ error: "APP_URL is not configured in .env." }, { status: 500 });
    if (provider === "razorpay") {
      const keyId = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !secret) return NextResponse.json({ error: "Razorpay test keys are missing." }, { status: 500 });
      const response = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64"), "Content-Type": "application/json" }, body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: `kh_${randomUUID().replaceAll("-", "").slice(0, 24)}`, notes: { resourceId, userId: user.id } }) });
      const data = await response.json();
      if (!response.ok) return NextResponse.json({ error: data.error?.description || "Could not create Razorpay order." }, { status: 502 });
      await prisma.paymentOrder.create({ data: { userId: user.id, resourceId, provider, providerOrderId: data.id, amountPaise } });
      return NextResponse.json({ provider, orderId: data.id, amount: amountPaise, currency: "INR", keyId, courseTitle: resource.title });
    }
    const clientId = process.env.CASHFREE_CLIENT_ID, clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return NextResponse.json({ error: "Cashfree sandbox keys are missing." }, { status: 500 });
    const orderId = `kh_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
    const base = process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const response = await fetch(`${base}/orders`, { method: "POST", headers: { "x-client-id": clientId, "x-client-secret": clientSecret, "x-api-version": "2025-01-01", "Content-Type": "application/json" }, body: JSON.stringify({ order_id: orderId, order_amount: amountPaise / 100, order_currency: "INR", customer_details: { customer_id: user.id.slice(0, 50), customer_email: user.email, customer_phone: process.env.PAYMENT_CUSTOMER_PHONE || "9999999999" }, order_meta: { return_url: `${appUrl}/checkout/${resourceId}?provider=cashfree&order_id=${orderId}` } }) });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.message || "Could not create Cashfree order." }, { status: 502 });
    await prisma.paymentOrder.create({ data: { userId: user.id, resourceId, provider, providerOrderId: orderId, amountPaise } });
    return NextResponse.json({ provider, orderId, paymentSessionId: data.payment_session_id, mode: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox", courseTitle: resource.title });
  } catch (e) { console.error("Payment create error", e); return NextResponse.json({ error: "Payment order could not be created." }, { status: 500 }); }
}



