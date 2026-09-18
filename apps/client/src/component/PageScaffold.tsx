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
    <main className="page-scaffold">
      <nav className="resource-nav">
        <Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link>
        <Link href="/home" className="button button-quiet small">Open workspace</Link>
      </nav>
      <section className="resource-page">
        <div className="resource-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {details.length > 0 ? (
          <div className="resource-details">
            {details.map((detail) => (
              <div className="resource-detail" key={detail.label}>
                <p>{detail.label}</p>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
import Link from "next/link";
