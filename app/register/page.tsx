import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <main className="auth-page"><div className="auth-decoration"><div className="auth-orb"></div><span className="eyebrow">START LEARNING</span><h1>Make room for a little more knowledge.</h1><p>Build your learning routine with classes, notes and interactive experiences.</p><div className="auth-quote">A small step every day adds up to remarkable progress.</div></div><div className="auth-panel"><Link href="/" className="back-link">← Back to home</Link><div className="auth-form-wrap"><span className="eyebrow">CREATE YOUR ACCOUNT</span><h2>Join Knowledge Hub</h2><p className="muted">Create your free learner account.</p><AuthForm mode="register"/><p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p></div></div></main>;
}
