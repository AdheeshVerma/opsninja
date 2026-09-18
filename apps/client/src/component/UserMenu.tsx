"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const { user, isLoading, logout } = useAuth();
  const initials =
    user?.user_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  if (isLoading) {
    return (
      <span
        className="inline-flex h-9 w-9 animate-pulse rounded-full bg-surface-muted"
        aria-label="Loading user"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className="inline-flex min-h-9 items-center rounded-pill border border-border-strong px-3 text-sm font-semibold text-text-secondary"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <strong className="block text-sm text-text-primary">
          {user.user_name}
        </strong>
        <span className="block text-xs text-text-muted">{user.email}</span>
      </div>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-text-primary text-sm font-semibold text-surface"
        type="button"
        onClick={logout}
        aria-label="Log out"
      >
        {initials}
      </button>
    </div>
  );
}
