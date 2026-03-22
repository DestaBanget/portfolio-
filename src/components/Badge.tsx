interface BadgeProps {
  label: string;
  tone?: "completed" | "in-progress" | "skipped" | "neutral";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  completed: "border-accent-green/35 bg-accent-green/10 text-accent-green",
  "in-progress": "border-accent-warm/35 bg-accent-warm/10 text-accent-warm",
    skipped: "border-border bg-surface-raised text-text-muted",
    neutral: "border-border bg-surface-raised text-text-muted",
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
