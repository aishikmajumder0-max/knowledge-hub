import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Boxes, GraduationCap, PlayCircle, Sparkles, Video, FileText, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const resources = await prisma.resource.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 });
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> YOUR PERSONAL LEARNING SPACE</div>
        <h1>Learn better.<br/><span>Build your future.</span></h1>
        <p className="hero-description">One place for expert classes, useful notes, interactive 3D learning and the resources that move you forward.</p>
        <div className="hero-actions"><Link className="button button-primary button-large" href="/classes">Explore classes <ArrowRight size={18}/></Link><Link className="button button-outline button-large" href="/learn/3d"><Boxes size={18}/> Try 3D learning</Link></div>
        <div className="hero-proof"><div className="avatar-stack"><span>A</span><span>K</span><span>S</span><span>+</span></div><p><strong>Made for curious minds</strong><br/><small>Learn at your own pace, anywhere.</small></p></div>
      </div>
      <div className="hero-art" aria-label="Decorative 3D learning illustration">
        <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
        <div className="art-glow"></div><div className="art-card art-card-back"><div className="mini-lines"></div><div className="mini-lines short"></div><div className="mini-pill"></div></div>
        <div className="book-3d"><div className="book-cover"><div className="book-mark"><BookOpen size={42}/></div><span>KNOWLEDGE<br/>IS POWER</span><small>LEARN • CREATE • GROW</small></div><div className="book-pages"></div></div>
        <div className="floating-chip chip-top"><span className="chip-icon purple-bg"><BrainCircuit size={18}/></span><span><b>Keep growing</b><small>One lesson at a time</small></span></div>
        <div className="floating-chip chip-bottom"><span className="chip-icon green-bg"><PlayCircle size={19}/></span><span><b>Learn by doing</b><small>Video + interactive</small></span></div>
        <div className="sparkle sparkle-a">✦</div><div className="sparkle sparkle-b">✧</div>
      </div>
    </section>
    <section className="stats-strip"><div><strong>Learn</strong><span>at your own pace</span></div><div><strong>Explore</strong><span>new subjects</span></div><div><strong>Practice</strong><span>with interactive tools</span></div><div><strong>Grow</strong><span>every single day</span></div></section>
    <section className="section container" id="features">
      <div className="section-heading"><div><span className="eyebrow">THE LEARNING TOOLKIT</span><h2>Everything you need to <span className="text-gradient">level up</span></h2></div><p>Designed to make learning organized, engaging, and easy to return to.</p></div>
      <div className="feature-grid">
        <Link href="/classes" className="feature-card"><div className="feature-icon icon-purple"><Video size={23}/></div><h3>Video classes</h3><p>Watch lessons, follow course links, and keep your learning in one place.</p><span className="feature-link">Browse classes <ArrowRight size={16}/></span></Link>
        <Link href="/notes" className="feature-card"><div className="feature-icon icon-blue"><FileText size={23}/></div><h3>Notes & resources</h3><p>Find revision notes, reference materials, and helpful study resources.</p><span className="feature-link">Explore notes <ArrowRight size={16}/></span></Link>
        <Link href="/learn/3d" className="feature-card"><div className="feature-icon icon-orange"><Boxes size={23}/></div><h3>Interactive 3D</h3><p>Explore a 3D learning object with mouse or touch controls.</p><span className="feature-link">Enter 3D lab <ArrowRight size={16}/></span></Link>
        <Link href="/dashboard" className="feature-card"><div className="feature-icon icon-green"><GraduationCap size={23}/></div><h3>Personal dashboard</h3><p>Access your learning area and discover resources shared by admins.</p><span className="feature-link">Open dashboard <ArrowRight size={16}/></span></Link>
      </div>
    </section>
    <section className="section recent-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FRESH FROM THE HUB</span><h2>Start with something useful</h2></div><Link className="text-link" href="/classes">View all resources <ArrowRight size={16}/></Link></div>
      {resources.length ? <div className="resource-grid">{resources.map((r) => <article className="resource-card" key={r.id}><div className={`resource-art ${r.type.toLowerCase()}`}><span>{r.type === "CLASS" ? <Video size={28}/> : r.type === "NOTE" ? <FileText size={28}/> : <Boxes size={28}/>}</span><small>{r.type}</small></div><div className="resource-info"><span className="resource-subject">{r.subject} · {r.level}</span><h3>{r.title}</h3><p>{r.description}</p><Link href={r.type === "NOTE" ? "/notes" : r.type === "ANIMATION" ? "/learn/3d" : "/classes"}>Open resource <ArrowRight size={15}/></Link></div></article>)}</div> : <div className="empty-state">No resources published yet. Check back soon.</div>}
    </div></section>
    <section className="container cta-section"><div className="cta-box"><div className="cta-icon"><GraduationCap size={28}/></div><div><h2>Your next chapter starts here.</h2><p>Create a free account to get started with Knowledge Hub.</p></div><Link className="button button-light button-large" href="/register">Create free account <ArrowRight size={17}/></Link></div></section>
    <footer className="site-footer"><div className="container footer-inner"><Link className="brand" href="/"><span className="brand-icon"><BookOpen size={20}/></span><span>Knowledge<span className="brand-accent">Hub</span></span></Link><p>Learn without limits. Built for curious minds.</p><div><Link href="/classes">Classes</Link><Link href="/notes">Notes</Link><Link href="/admin">Admin</Link></div><small>© {new Date().getFullYear()} Knowledge Hub</small></div></footer>
  </main>;
}
