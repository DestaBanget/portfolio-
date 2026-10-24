"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/Icons";

/** The address as a mailto link, with a button that copies it for people whose mail client isn't set up. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the mailto link next to the button still works.
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-bg py-1.5 pl-4 pr-1.5">
      <a href={`mailto:${email}`} className="min-w-0 flex-1 truncate font-mono text-sm hover:text-accent">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
      >
        {/* Both states stay mounted and cross-fade through a short blur, so the label swap reads as one change. */}
        <span className="swap" data-on={copied ? "" : undefined}>
          <span className="swap-a inline-flex items-center gap-1.5">
            <Copy /> Copy
          </span>
          <span className="swap-b inline-flex items-center gap-1.5">
            <Check className="text-accent" /> Copied
          </span>
        </span>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </button>
    </div>
  );
}
