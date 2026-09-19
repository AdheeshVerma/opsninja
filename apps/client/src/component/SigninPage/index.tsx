"use client";

import { useEffect } from "react";
import { redirectToCognito } from "@/lib/auth";

export default function SigninPage() {
  useEffect(() => {
    redirectToCognito();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-5 py-10 text-[#20251f]">
      <section className="w-full max-w-md rounded-3xl border border-[#dfe5dc] bg-white p-8 text-center shadow-xl shadow-[#59745b]/10">
        <h1 className="text-lg font-bold">Ops Ninja</h1>
        <h2 className="mt-10 text-3xl font-bold tracking-tight">
          Redirecting to authentication
        </h2>
        <p className="mt-3 leading-7 text-[#6a7368]">
          You will be redirected to secure Cognito authentication.
        </p>
        <div className="mt-7 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#dfe5dc] border-t-[#20251f]" />
        </div>
      </section>
    </main>
  );
}
