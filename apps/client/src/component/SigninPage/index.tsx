"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirectToCognito } from "@/lib/auth";

export default function SigninPage() {
  useEffect(() => {
    redirectToCognito();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-5 py-10 text-[#20251f]">
      <section className="w-full max-w-md rounded-3xl border border-[#dfe5dc] bg-white p-8 text-center shadow-xl shadow-[#59745b]/10">
        <Link href="/" className="text-lg font-bold">
          Ops Ninja
        </Link>
        <h1 className="mt-10 text-3xl font-bold tracking-tight">
          Taking you to sign in
        </h1>
        <p className="mt-3 leading-7 text-[#6a7368]">
          You will be redirected to secure Cognito authentication.
        </p>
        <button
          className="mt-7 w-full rounded-xl bg-[#20251f] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#40503f]"
          onClick={redirectToCognito}
          type="button"
        >
          Continue to sign in
        </button>
        <p className="mt-5 text-sm text-[#7a8278]">
          Need an account?{" "}
          <Link className="font-bold text-[#59745b]" href="/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
