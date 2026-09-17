import Link from "next/link";

const sections = [
  {
    title: "Information we handle",
    content: (
      <>
        <p>
          Ops-Ninja is designed to turn meeting minutes into useful operational
          records. Depending on how you use the service, we may handle:
        </p>
        <ul>
          <li>Meeting minutes, summaries, decisions, risks, and action items.</li>
          <li>Project and workspace details needed to organize those records.</li>
          <li>Messages you send to the Ops-Ninja chatbot and its responses.</li>
          <li>Account and technical information needed to authenticate and operate the service.</li>
          <li>Information returned by connected services such as Jira, Slack, or Obsidian.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How we use information",
    content: (
      <>
        <p>We use information to provide and improve the service, including to:</p>
        <ul>
          <li>Generate meeting summaries and extract decisions, risks, and commitments.</li>
          <li>Store and retrieve project knowledge for the Ops-Ninja chatbot.</li>
          <li>Carry out actions you request, such as creating Jira issues or sending Slack messages.</li>
          <li>Authenticate users, protect the service, troubleshoot problems, and maintain reliability.</li>
        </ul>
        <p>
          We do not sell your personal information. We use meeting and project
          content only to provide the features you request and to operate the
          service.
        </p>
      </>
    ),
  },
  {
    title: "Connected services",
    content: (
      <p>
        Ops-Ninja can work with services such as Jira, Slack, Obsidian, cloud
        storage, and identity providers. When you connect one of these services,
        Ops-Ninja may access or send information according to the permissions
        you grant and the action you request. Those services process information
        under their own privacy policies. You can revoke access through the
        connected service or your Ops-Ninja configuration.
      </p>
    ),
  },
  {
    title: "Retention and security",
    content: (
      <p>
        We retain information for as long as needed to provide the service,
        maintain your project history, meet legitimate operational needs, or
        comply with legal obligations. We use reasonable technical and
        organizational safeguards to protect information, but no method of
        transmission or storage is completely secure.
      </p>
    ),
  },
  {
    title: "Your choices",
    content: (
      <p>
        You may review or update information in your workspace, disconnect
        integrations, and request deletion of information associated with your
        account, subject to applicable law and operational requirements. To make
        a privacy request, contact the person or organization that provided you
        access to Ops-Ninja.
      </p>
    ),
  },
  {
    title: "Children and policy changes",
    content: (
      <>
        <p>
          Ops-Ninja is intended for workplace and project use and is not directed
          to children under 13. We may update this policy as the service changes.
          When we do, we will post the updated version on this page and revise
          the effective date.
        </p>
        <p>
          For privacy questions, please contact the person or organization that
          manages your Ops-Ninja workspace.
        </p>
      </>
    ),
  },
];

export const metadata = {
  title: "Privacy Policy | Ops-Ninja",
  description: "How Ops-Ninja handles meeting, project, and integration data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#20251f]">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-16">
        <header className="border-b border-[#20251f]/15 pb-12">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#59745b] transition-colors hover:text-[#20251f]"
          >
            Ops-Ninja
          </Link>
          <div className="mt-16 grid gap-8 md:grid-cols-[1fr_240px] md:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#b15d3d]">
                Trust and transparency
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
                Privacy Policy
              </h1>
            </div>
            <p className="text-sm leading-6 text-[#20251f]/65">
              Effective date
              <br />
              September 17, 2026
            </p>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#20251f]/75">
            Ops-Ninja helps teams turn meeting records into accountable work,
            shared knowledge, and follow-through. This policy explains what we
            handle when you use the service.
          </p>
        </header>

        <div className="grid gap-12 py-12 md:grid-cols-[180px_1fr] md:gap-20">
          <aside className="text-sm font-semibold uppercase tracking-[0.14em] text-[#59745b]">
            <p>What matters</p>
            <div className="mt-4 h-px w-12 bg-[#b15d3d]" />
          </aside>
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-[#20251f]/15 pb-12 last:border-b-0">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {section.title}
                </h2>
                <div className="policy-copy mt-5 max-w-2xl text-base leading-8 text-[#20251f]/75">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="border-t border-[#20251f]/15 pt-8 text-sm text-[#20251f]/60">
          Ops-Ninja · Privacy Policy
        </footer>
      </div>
    </main>
  );
}