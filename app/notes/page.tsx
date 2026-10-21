import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function NotesPage() {
  const notes = await prisma.resource.findMany({ where: { published: true, type: { in: ["NOTE", "RESOURCE"] } }, orderBy: { createdAt: "desc" } });
  return <main className="page-shell container"><div className="page-heading"><span className="eyebrow">STUDY MATERIALS</span><h1>Notes, guides & resources.</h1><p>Quick references and useful links for your next study session.</p></div><div className="notes-list">{notes.map(item => <article className="note-row" key={item.id}><div className="feature-icon icon-blue"><FileText size={22}/></div><div className="note-copy"><span className="resource-subject">{item.subject} · {item.level}</span><h2>{item.title}</h2><p>{item.description}</p></div>{item.url.startsWith("/") ? <Link className="button button-outline" href={item.url}>Open <ArrowUpRight size={15}/></Link> : <a className="button button-outline" href={item.url} target="_blank" rel="noreferrer">Open <ArrowUpRight size={15}/></a>}</article>)}{notes.length === 0 && <div className="empty-state">No notes published yet. Check back soon.</div>}</div></main>;
}
