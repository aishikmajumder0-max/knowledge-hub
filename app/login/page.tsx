import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <main className="auth-page"><div className="auth-decoration"><div className="auth-orb"></div><span className="eyebrow">WELCOME BACK</span><h1>Your next big idea is one lesson away.</h1><p>Pick up where your curiosity left off.</p><div className="auth-quote">“The beautiful thing about learning is that nobody can take it away from you.”</div></div><div className="auth-panel"><Link href="/" className="back-link">← Back to home</Link><div className="auth-form-wrap"><span className="eyebrow">YOUR LEARNING SPACE</span><h2>Log in to Knowledge Hub</h2><p className="muted">Welcome back. Enter your account details.</p><AuthForm mode="login"/><p className="auth-switch">New to Knowledge Hub? <Link href="/register">Create an account</Link></p></div></div></main>;
}
