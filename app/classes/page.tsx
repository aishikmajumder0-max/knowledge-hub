import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Video, ArrowUpRight, Search } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function ClassesPage() {
  const classes = await prisma.resource.findMany({ where: { published: true, type: "CLASS" }, orderBy: { createdAt: "desc" } });
  return <main className="page-shell container"><div className="page-heading"><span className="eyebrow">KNOWLEDGE LIBRARY</span><h1>Classes that move you forward.</h1><p>Browse lessons and follow your learning path at your own pace.</p></div><div className="library-grid">{classes.map(item => <article className="library-card" key={item.id}><div className="library-card-icon"><Video size={25}/></div><span className="type-label">VIDEO CLASS</span><h2>{item.title}</h2><p>{item.description}</p><div className="resource-meta"><span>{item.subject}</span><span>{item.level}</span></div><Link className="button button-primary" href={`/checkout/${item.id}`}>Enroll / Unlock course <ArrowUpRight size={16}/></Link></article>)}{classes.length === 0 && <div className="empty-state">No classes published yet. Sign in as admin to add one.</div>}</div></main>;
}
