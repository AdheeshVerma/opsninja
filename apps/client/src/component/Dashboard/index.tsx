import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#59745b]">
        Workspace
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#20251f]">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#667166]">
        Your operational memory at a glance.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/projects"
          className="group rounded-xl border border-[#dfe5dc] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#9db29b] hover:shadow-lg hover:shadow-[#59745b]/10"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#59745b]">
            Projects
          </span>
          <h2 className="mt-3 text-xl font-bold text-[#20251f]">
            Open your projects
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#667166]">
            Review project decisions, meeting intelligence, and follow-through.
          </p>
          <span className="mt-6 inline-block text-sm font-bold text-[#59745b] transition group-hover:translate-x-1">
            View projects →
          </span>
        </Link>
        <Link
          href="/integrations"
          className="group rounded-xl border border-[#dfe5dc] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#9db29b] hover:shadow-lg hover:shadow-[#59745b]/10"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#59745b]">
            Connected tools
          </span>
          <h2 className="mt-3 text-xl font-bold text-[#20251f]">
            Manage integrations
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#667166]">
            See the Jira, Slack, and Calendar connections available to your
            workspace.
          </p>
          <span className="mt-6 inline-block text-sm font-bold text-[#59745b] transition group-hover:translate-x-1">
            View integrations →
          </span>
        </Link>
      </div>
    </div>
  );
}
