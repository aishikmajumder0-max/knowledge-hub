import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
function safeEqual(a: string, b: string) { const aa=Buffer.from(a), bb=Buffer.from(b); return aa.length===bb.length && timingSafeEqual(aa,bb); }
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  try {
    const body = await req.json();
    const order = await prisma.paymentOrder.findFirst({ where: { ...(body.paymentOrderId ? { id: body.paymentOrderId } : { providerOrderId: body.orderId }), userId: user.id, status: "PENDING" } });
    if (!order) return NextResponse.json({ error: "Pending payment order not found." }, { status: 404 });
    let paid = false, paymentId: string | undefined;
    if (order.provider === "razorpay") {
      const keyId=process.env.RAZORPAY_KEY_ID, secret=process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !secret || body.razorpay_order_id !== order.providerOrderId || !body.razorpay_payment_id || !body.razorpay_signature) return NextResponse.json({ error: "Invalid Razorpay response." }, { status: 400 });
      const expected=createHmac("sha256",secret).update(`${order.providerOrderId}|${body.razorpay_payment_id}`).digest("hex");
      if (!safeEqual(expected, body.razorpay_signature)) return NextResponse.json({ error: "Razorpay signature verification failed." }, { status: 400 });
      const response=await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(body.razorpay_payment_id)}`, { headers: { Authorization: "Basic "+Buffer.from(`${keyId}:${secret}`).toString("base64") }, cache: "no-store" });
      const payment=await response.json();
      paid=response.ok && payment.order_id===order.providerOrderId && payment.amount===order.amountPaise && payment.currency===order.currency && payment.status==="captured";
      paymentId=body.razorpay_payment_id;
    } else if (order.provider === "cashfree") {
      const clientId=process.env.CASHFREE_CLIENT_ID, clientSecret=process.env.CASHFREE_CLIENT_SECRET;
      if (!clientId || !clientSecret || body.orderId !== order.providerOrderId) return NextResponse.json({ error: "Invalid Cashfree response." }, { status: 400 });
      const base=process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
      const response=await fetch(`${base}/orders/${encodeURIComponent(order.providerOrderId)}`, { headers: { "x-client-id": clientId, "x-client-secret": clientSecret, "x-api-version": "2025-01-01" }, cache: "no-store" });
      const data=await response.json();
      paid=response.ok && data.order_status==="PAID" && Math.round(Number(data.order_amount)*100)===order.amountPaise && data.order_currency===order.currency;
      paymentId=data.cf_order_id ? String(data.cf_order_id) : undefined;
    }
    if (!paid) return NextResponse.json({ error: "Payment is not confirmed as successful yet. Please retry verification shortly." }, { status: 409 });
    await prisma.$transaction([prisma.paymentOrder.update({ where: { id: order.id }, data: { status: "PAID", providerPaymentId: paymentId } }), prisma.enrollment.upsert({ where: { userId_resourceId: { userId: user.id, resourceId: order.resourceId } }, create: { userId: user.id, resourceId: order.resourceId }, update: {} })]);
    return NextResponse.json({ success: true, enrolled: true, resourceId: order.resourceId });
  } catch (e) { console.error("Payment verify error", e); return NextResponse.json({ error: "Could not verify payment." }, { status: 500 }); }
}
