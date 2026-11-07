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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <a href={`mailto:${email}`} className="min-w-0 truncate text-lg font-medium underline-offset-4 hover:underline">
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
            <Check /> Copied
          </span>
        </span>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </button>
    </div>
  );
}
