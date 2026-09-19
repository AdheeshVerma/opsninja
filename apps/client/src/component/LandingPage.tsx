import Link from "next/link";
import GetStartedButton from "@/component/GetStartedButton";

function Mark() {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      {["h-3", "h-4", "h-5", "h-3.5"].map((height) => (
        <i
          key={height}
          className={`block w-1 rounded-full bg-current ${height}`}
        />
      ))}
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7f3] text-[#20251f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Mark /> Ops Ninja
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#596257] md:flex">
          <a href="#how-it-works" className="transition hover:text-[#20251f]">
            How it works
          </a>
          <a href="#approval" className="transition hover:text-[#20251f]">
            Approval gate
          </a>
        </div>
        <div className="flex items-center gap-3">
          <GetStartedButton />
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#59745b]">
            <span className="h-2 w-2 rounded-full bg-[#d97706]" /> Meeting
            intelligence, under your control
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Turn the meeting into{" "}
            <em className="font-serif font-normal text-[#59745b]">
              the next move.
            </em>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#596257]">
            Ops Ninja extracts the signal from every conversation, connects it
            to your operational memory, and puts every real-world action behind
            a deliberate human decision.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GetStartedButton variant="large" />
            <a
              href="#how-it-works"
              className="text-sm font-bold text-[#59745b]"
            >
              See the flow <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4 text-sm text-[#7a8278]">
            <span>Works with</span>
            <strong className="text-[#20251f]">Obsidian</strong>
            <span className="h-1 w-1 rounded-full bg-[#c6ccc2]" />
            <strong className="text-[#20251f]">Jira</strong>
            <span className="h-1 w-1 rounded-full bg-[#c6ccc2]" />
            <strong className="text-[#20251f]">Slack</strong>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-[#d9e0d5] bg-[#e8eee5] p-4 shadow-2xl shadow-[#59745b]/10 sm:p-6">
          <div className="rounded-2xl border border-[#d9e0d5] bg-white/80 p-5 backdrop-blur sm:p-7">
            <div className="mb-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#7a8278]">
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#16a34a]" /> Live
                processing
              </span>
              <span>12:08:42</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e0e5de] bg-white p-4 shadow-sm sm:translate-y-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#59745b]">
                  Input
                </span>
                <strong className="mt-3 block text-sm">
                  Product sync transcript
                </strong>
                <p className="mt-3 text-xs leading-5 text-[#7a8278]">
                  “Let&apos;s keep the Oct 18 release...”
                </p>
                <small className="mt-5 block text-[11px] text-[#a0a79e]">
                  46 minutes · 4 speakers
                </small>
              </div>
              <div className="rounded-xl border border-[#dfe6dc] bg-[#f4f8f2] p-4 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2491d]">
                  AI extraction
                </span>
                <div className="my-6 space-y-2">
                  <i className="block h-1.5 w-full rounded bg-[#b7d0b7]" />
                  <i className="block h-1.5 w-4/5 rounded bg-[#d8e6d5]" />
                  <i className="block h-1.5 w-3/5 rounded bg-[#e7efe5]" />
                </div>
                <p className="text-xs font-semibold text-[#596257]">
                  3 decisions found
                </p>
                <p className="mt-2 text-xs font-semibold text-[#596257]">
                  3 action items found
                </p>
              </div>
              <div className="rounded-xl border border-[#e0e5de] bg-white p-4 shadow-sm sm:translate-y-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#59745b]">
                  Structured MOM
                </span>
                <strong className="mt-3 block text-sm">Project Orca</strong>
                <p className="mt-5 border-b border-[#edf0eb] pb-3 text-xs text-[#596257]">
                  ✓ October 18 release
                </p>
                <p className="pt-3 text-xs text-[#596257]">
                  ✓ API access is blocked
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-[#20251f] p-4 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c2491d] font-bold">
                !
              </span>
              <span className="flex-1">
                <small className="block text-xs text-[#bec8ba]">
                  Approval required
                </small>
                <strong className="text-sm">Create Jira issue in ORCA</strong>
              </span>
              <span className="hidden rounded-full border border-white/20 px-3 py-2 text-xs font-bold sm:block">
                Review action
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        className="border-y border-[#dfe5dc] bg-white px-6 py-16 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#59745b]">
            A closed operational loop
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {[
              [
                "01",
                "Capture the record",
                "Transcript becomes a structured, editable MOM with decisions, risks, owners, and deadlines.",
              ],
              [
                "02",
                "Connect the context",
                "Meeting notes become linked Obsidian records, ready for questions across people, projects, and actions.",
              ],
              [
                "03",
                "Act with intent",
                "The orchestrator proposes the smallest useful Jira or Slack action. You decide if it leaves the vault.",
              ],
            ].map(([number, title, copy]) => (
              <div key={number}>
                <span className="text-sm font-bold text-[#c2491d]">
                  {number}
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight">
                  {title}
                </h2>
                <p className="mt-3 max-w-sm leading-7 text-[#6a7368]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="approval"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c2491d]">
            The approval gate
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
            AI can prepare the work.
            <br />
            <span className="font-serif font-normal text-[#59745b]">
              Only you can release it.
            </span>
          </h2>
        </div>
        <p className="max-w-lg self-end text-lg leading-8 text-[#596257]">
          Every external write carries its source, destination, and consequence
          forward. There are no invisible automations, only clear proposals and
          accountable outcomes.
        </p>
      </section>
      <footer className="flex flex-col gap-4 border-t border-[#dfe5dc] px-6 py-8 text-sm text-[#7a8278] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="flex items-center gap-2 font-bold text-[#20251f]">
          <Mark /> Ops Ninja
        </span>
        <span>Operational clarity, one approved action at a time.</span>
      </footer>
    </main>
  );
}
