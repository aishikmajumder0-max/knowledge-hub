import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
export async function GET(req: Request) {
 const user=await getSession(); if(!user)return NextResponse.json({error:"Please sign in first."},{status:401});
 const orderId=new URL(req.url).searchParams.get("orderId"); if(!orderId)return NextResponse.json({error:"Order ID required."},{status:400});
 const order=await prisma.paymentOrder.findFirst({where:{providerOrderId:orderId,userId:user.id,status:"PENDING"},select:{id:true}});
 if(!order)return NextResponse.json({error:"Payment order not found."},{status:404});
 return NextResponse.json({paymentOrderId:order.id});
}
