"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Account creation is not connected yet. You can explore the workspace preview now.");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link>
        <h1>Create your workspace</h1>
        <p>Bring meeting decisions and follow-through into one accountable place.</p>
        <div className="auth-field"><label htmlFor="name">Full name</label><input id="name" type="text" autoComplete="name" placeholder="Your name" required /></div>
        <div className="auth-field"><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" placeholder="you@company.com" required /></div>
        <div className="auth-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required /></div>
        <div className="auth-field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" placeholder="Repeat your password" minLength={8} required /></div>
        <div className="auth-terms"><label><input type="checkbox" required /> I agree to the <Link href="/privacy-policy">Privacy Policy</Link>.</label></div>
        <button className="button button-primary auth-submit" type="submit">Create account</button>
        {notice ? <p className="auth-notice" role="status">{notice}</p> : null}
        <p className="auth-footer">Already have an account? <Link href="/signin">Sign in</Link></p>
      </form>
    </main>
  );
}
