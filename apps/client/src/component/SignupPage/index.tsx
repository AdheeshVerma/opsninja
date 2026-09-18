"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Account creation is not connected yet. You can explore the workspace preview now.",
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-5 py-10 text-[#20251f] sm:px-8">
      <form
        className="w-full max-w-md rounded-3xl border border-[#dfe5dc] bg-white p-7 shadow-xl shadow-[#59745b]/10 sm:p-10"
        onSubmit={submit}
      >
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="inline-flex items-end gap-0.5" aria-hidden="true">
            {["h-3", "h-4", "h-5", "h-3.5"].map((height) => (
              <i
                key={height}
                className={`block w-1 rounded-full bg-[#59745b] ${height}`}
              />
            ))}
          </span>
          Ops Ninja
        </Link>
        <h1 className="mt-10 text-3xl font-bold tracking-tight">
          Create your workspace
        </h1>
        <p className="mt-2 leading-7 text-[#6a7368]">
          Bring meeting decisions and follow-through into one accountable place.
        </p>
        <div className="mt-8 space-y-5">
          {[
            ["name", "Full name", "text", "Your name"],
            ["email", "Work email", "email", "you@company.com"],
            ["password", "Password", "password", "At least 8 characters"],
            [
              "confirm-password",
              "Confirm password",
              "password",
              "Repeat your password",
            ],
          ].map(([id, label, type, placeholder]) => (
            <label className="block" htmlFor={id} key={id}>
              <span className="mb-2 block text-sm font-semibold text-[#596257]">
                {label}
              </span>
              <input
                className="w-full rounded-xl border border-[#dfe5dc] bg-[#fbfcfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#a0a79e] focus:border-[#59745b] focus:ring-4 focus:ring-[#59745b]/10"
                id={id}
                type={type}
                autoComplete={
                  id === "password" || id === "confirm-password"
                    ? "new-password"
                    : id
                }
                placeholder={placeholder}
                minLength={type === "password" ? 8 : undefined}
                required
              />
            </label>
          ))}
        </div>
        <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-[#6a7368]">
          <input className="mt-1 accent-[#59745b]" type="checkbox" required />{" "}
          <span>
            I agree to the{" "}
            <Link
              className="font-semibold text-[#59745b] underline underline-offset-2"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <button
          className="mt-7 w-full rounded-xl bg-[#20251f] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#40503f]"
          type="submit"
        >
          Create account
        </button>
        {notice ? (
          <p
            className="mt-4 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm leading-6 text-[#9a4b1e]"
            role="status"
          >
            {notice}
          </p>
        ) : null}
        <p className="mt-7 text-center text-sm text-[#7a8278]">
          Already have an account?{" "}
          <Link className="font-bold text-[#59745b]" href="/signin">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
