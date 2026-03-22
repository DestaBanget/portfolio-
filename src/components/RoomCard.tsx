import { Badge } from "@/components/Badge";

interface RoomCardProps {
  title: string;
  category?: string;
  statusLabel: string;
  statusTone?: "completed" | "in-progress" | "skipped" | "neutral";
  description?: string;
  metadata?: Array<{ label: string; value: string }>;
  writeup?: string | null;
  showWriteup?: boolean;
}

export function RoomCard({
  title,
  category,
  statusLabel,
  statusTone = "neutral",
  description,
  metadata,
  writeup,
  showWriteup = false,
}: RoomCardProps) {
  return (
    <article className="surface-card surface-card-hover fade-step-1 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {category ? <Badge label={category} tone="neutral" /> : null}
        <Badge label={statusLabel} tone={statusTone} />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-text-primary">{title}</h3>

      {description ? <p className="mt-2 text-sm text-text-secondary">{description}</p> : null}

      {metadata && metadata.length > 0 ? (
        <dl className="mt-4 grid gap-2 sm:grid-cols-3">
          {metadata.map((item) => (
            <div
              key={`${title}-${item.label}`}
              className="rounded-md border border-border bg-surface-raised px-3 py-2"
            >
              <dt className="text-[10px] uppercase tracking-widest text-text-tertiary">{item.label}</dt>
              <dd className="mt-1 text-sm text-text-primary">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {showWriteup ? (
        <div className="mt-4">
          {writeup ? (
            <a
              href={writeup}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center border-b border-transparent text-xs uppercase tracking-widest text-accent transition-colors hover:border-accent"
            >
              Writeup
            </a>
          ) : (
            <span className="inline-flex items-center border-b border-border text-xs uppercase tracking-widest text-text-muted">
              Writeup (soon)
            </span>
          )}
        </div>
      ) : null}
    </article>
  );
}
