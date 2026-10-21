import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, FileText, Boxes, ArrowRight, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const resources = await prisma.resource.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 });
  return <main className="page-shell container"><div className="dashboard-top"><div><span className="eyebrow">YOUR LEARNING SPACE</span><h1>Welcome back, {user.name.split(" ")[0]}.</h1><p>Pick a resource and keep moving forward.</p></div><LogoutButton/></div>
    <div className="dashboard-stats"><div><BookOpen/><span><b>{resources.filter(r=>r.type==="CLASS").length}</b><small>Featured classes</small></span></div><div><FileText/><span><b>{resources.filter(r=>r.type==="NOTE"||r.type==="RESOURCE").length}</b><small>Notes & resources</small></span></div><div><Boxes/><span><b>3D</b><small>Interactive lab</small></span></div></div>
    <div className="section-heading dashboard-heading"><div><span className="eyebrow">CONTINUE EXPLORING</span><h2>Recommended resources</h2></div></div>
    <div className="resource-grid">{resources.map(r=><article className="resource-card" key={r.id}><div className={`resource-art ${r.type.toLowerCase()}`}><span>{r.type==="CLASS"?<BookOpen/>:r.type==="NOTE"?<FileText/>:<Boxes/>}</span><small>{r.type}</small></div><div className="resource-info"><span className="resource-subject">{r.subject} · {r.level}</span><h3>{r.title}</h3><p>{r.description}</p><Link href={r.type==="NOTE"||r.type==="RESOURCE"?"/notes":r.type==="ANIMATION"?"/learn/3d":"/classes"}>Explore <ArrowRight size={15}/></Link></div></article>)}</div>
    <div className="profile-strip"><UserRound/><div><b>Signed in as {user.email}</b><p>Your account is active. Explore the learning library whenever you're ready.</p></div></div>
  </main>;
}
