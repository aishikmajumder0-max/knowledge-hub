import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPanel } from "@/components/admin-panel";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  const [resources, usersCount] = await Promise.all([
    prisma.resource.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.count()
  ]);
  return <main className="page-shell container"><div className="page-heading"><span className="eyebrow">ADMINISTRATION</span><h1>Knowledge Hub control room.</h1><p>Manage published classes, notes, learning links, and platform content.</p></div><div className="admin-summary"><div><span>Total resources</span><b>{resources.length}</b></div><div><span>Registered users</span><b>{usersCount}</b></div><div><span>Published</span><b>{resources.filter(r=>r.published).length}</b></div></div><AdminPanel initialResources={resources.map(r=>({...r,createdAt:r.createdAt.toISOString()}))}/></main>;
}
