import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().max(1000).default(""),
  type: z.enum(["CLASS","NOTE","ANIMATION","RESOURCE"]),
  subject: z.string().trim().max(80).default("General"),
  level: z.string().trim().max(80).default("All levels"),
  url: z.string().trim().max(2048).refine(v => !v || /^https?:\/\//i.test(v) || v.startsWith("/"), "Use an http(s) URL or a local route.").default(""),
  published: z.boolean().default(true)
});
export async function POST(request:Request) {
  const admin=await requireAdmin();
  if(!admin) return NextResponse.json({error:"Admin access required."},{status:403});
  const parsed=schema.safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:"Please check the resource details."},{status:400});
  const resource=await prisma.resource.create({data:parsed.data});
  return NextResponse.json({resource:{...resource,createdAt:resource.createdAt.toISOString()}},{status:201});
}
