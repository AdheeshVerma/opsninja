type PageScaffoldProps = {
  title: string;
  description: string;
  eyebrow?: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
};

export default function PageScaffold({
  title,
  description,
  eyebrow = "Ops Ninja",
  details = [],
}: PageScaffoldProps) {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            {description}
          </p>
        </div>

        {details.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => (
              <div
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                key={detail.label}
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {detail.label}
                </p>
                <p className="mt-2 break-words text-sm font-medium text-zinc-900">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
