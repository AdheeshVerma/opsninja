"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/component/UserMenu";

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const projectsActive =
    pathname === "/projects" || pathname.startsWith("/project");
  const integrationsActive = pathname === "/integrations";

  return (
    <div className="flex min-h-screen bg-[#f7f8f5]">
      <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-[#20251f] px-4 py-6 text-[#e9eee7]">
        <Link
          href="/home"
          className="flex items-center gap-2 px-3 pb-8 text-lg font-bold text-white"
        >
          <span className="text-[#b7d0b7]">
            <Mark />
          </span>
          Ops Ninja
        </Link>
        <nav className="grid gap-2" aria-label="Workspace">
          <Link
            href="/projects"
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${projectsActive ? "bg-white/10 text-white" : "text-[#aeb9ac] hover:bg-white/10 hover:text-white"}`}
          >
            <span aria-hidden="true">▦</span>
            Projects
          </Link>
          <Link
            href="/integrations"
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${integrationsActive ? "bg-white/10 text-white" : "text-[#aeb9ac] hover:bg-white/10 hover:text-white"}`}
          >
            <span aria-hidden="true">◈</span>
            Integrations
          </Link>
        </nav>
        <div className="mt-auto border-t border-white/10 px-3 pt-4 text-xs text-[#9eaa9b]">
          Your operational workspace
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-end border-b border-[#dfe5dc] bg-white px-6 py-4 lg:px-10">
          <UserMenu />
        </header>
        {children}
      </main>
    </div>
  );
}
