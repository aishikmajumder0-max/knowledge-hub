import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import CheckoutClient from "./checkout-client";

export const dynamic = "force-dynamic";
export default async function CheckoutPage({ params, searchParams }: { params: Promise<{resourceId:string}>; searchParams: Promise<{provider?:string; order_id?:string}> }) {
  const {resourceId}=await params; const query=await searchParams; const user=await getSession();
  if(!user) redirect(`/login?next=/checkout/${resourceId}`);
  const resource=await prisma.resource.findFirst({where:{id:resourceId,type:"CLASS",published:true}});
  if(!resource) notFound();
  const enrollment=await prisma.enrollment.findUnique({where:{userId_resourceId:{userId:user.id,resourceId}}});
  return <main className="page-shell container"><div className="page-heading"><span className="eyebrow">SECURE CHECKOUT</span><h1>{enrollment ? "You are enrolled" : resource.title}</h1><p>{enrollment ? "Your full course access is active." : `One-time payment · ₹${resource.price.toFixed(2)} INR`}</p></div>{enrollment ? <a className="button button-primary" href={resource.url || "/classes"}>Open course</a> : <CheckoutClient resourceId={resource.id} title={resource.title} price={resource.price} returnedOrderId={query.order_id} returnedProvider={query.provider}/>}</main>;
}
