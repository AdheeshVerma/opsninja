"use client";

import { redirectToCognito } from "@/lib/auth";

interface GetStartedButtonProps {
  variant?: "small" | "large";
}

export default function GetStartedButton({
  variant = "small",
}: GetStartedButtonProps) {
  if (variant === "large") {
    return (
      <button
        onClick={() => redirectToCognito()}
        className="rounded-full bg-[#20251f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#20251f]/15 transition hover:-translate-y-0.5 hover:bg-[#40503f]"
      >
        Create your workspace
      </button>
    );
  }

  return (
    <button
      onClick={redirectToCognito}
      className="rounded-full bg-[#20251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#40503f]"
    >
      Get started
    </button>
  );
}
