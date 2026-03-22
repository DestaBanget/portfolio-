interface TerminalBlockProps {
  lines: string[];
}

export function TerminalBlock({ lines }: TerminalBlockProps) {
  return (
    <div className="surface-card fade-step-2 overflow-hidden bg-surface-raised">
      <div className="flex items-center border-b border-border border-t border-t-accent px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-yellow-300/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-text-primary">
        <code>{lines.join("\n")}</code>
      </pre>
    </div>
  );
}
