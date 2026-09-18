"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SigninPage() {
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Sign-in is not connected yet. Use the workspace preview to explore Ops Ninja.");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link>
        <h1>Welcome back</h1>
        <p>Sign in to continue with your shared operational context.</p>
        <div className="auth-field"><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" placeholder="you@company.com" required /></div>
        <div className="auth-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></div>
        <div className="auth-extras"><label><input type="checkbox" /> Remember me</label><a href="#password">Forgot password?</a></div>
        <button className="button button-primary auth-submit" type="submit">Sign in</button>
        {notice ? <p className="auth-notice" role="status">{notice}</p> : null}
        <div className="auth-divider">or continue with</div>
        <button className="auth-social" type="button" onClick={() => setNotice("Google sign-in is not configured yet.")}>G <span>Google</span></button>
        <p className="auth-footer">Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
      </form>
    </main>
  );
}
