import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Context = { params: Promise<{id:string}> };
export async function PATCH(request:Request, context:Context) {
  if(!await requireAdmin()) return NextResponse.json({error:"Admin access required."},{status:403});
  const {id}=await context.params;
  const parsed=z.object({published:z.boolean()}).safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:"Invalid update."},{status:400});
  try {
    const resource=await prisma.resource.update({where:{id},data:parsed.data});
    return NextResponse.json({resource:{...resource,createdAt:resource.createdAt.toISOString()}});
  } catch { return NextResponse.json({error:"Resource not found."},{status:404}); }
}
export async function DELETE(_request:Request, context:Context) {
  if(!await requireAdmin()) return NextResponse.json({error:"Admin access required."},{status:403});
  const {id}=await context.params;
  try { await prisma.resource.delete({where:{id}}); return NextResponse.json({ok:true}); }
  catch { return NextResponse.json({error:"Resource not found."},{status:404}); }
}
