import Link from "next/link";
import { BookOpen, Layers3, LogIn, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getSession();
  return <header className="site-header">
    <Link className="brand" href="/"><span className="brand-icon"><BookOpen size={21}/></span><span>Knowledge<span className="brand-accent">Hub</span></span></Link>
    <nav className="nav-links">
      <Link href="/classes">Classes</Link><Link href="/notes">Notes</Link><Link href="/learn/3d">3D Learning</Link>
    </nav>
    <div className="nav-actions">
      {user?.role === "ADMIN" && <Link className="button button-quiet admin-link" href="/admin"><ShieldCheck size={16}/> Admin</Link>}
      {user ? <Link className="button button-primary" href="/dashboard">Dashboard</Link> : <><Link className="button button-quiet login-link" href="/login"><LogIn size={16}/> Log in</Link><Link className="button button-primary" href="/register">Join free <span>↗</span></Link></>}
    </div>
  </header>;
}
