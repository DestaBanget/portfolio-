"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type SendState = "idle" | "sending" | "sent" | "failed";

const fieldClass =
  "mt-1 w-full border-0 border-b border-text-primary/45 bg-transparent py-2.5 text-lg text-text-primary outline-none transition-colors placeholder:text-text-muted hover:border-text-primary/80 focus-visible:border-accent focus-visible:outline-none";

export function ContactForm() {
  const [state, setState] = useState<SendState>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setState("sent");
    } catch {
      setState("failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Name
        <input name="name" required autoComplete="name" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" required rows={7} className={`${fieldClass} resize-y`} />
      </label>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <Button type="submit" variant="primary" size="lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending" : "Send message"}
        </Button>
        <p role="status" className={`text-sm ${state === "failed" ? "text-danger" : "text-text-secondary"}`}>
          {state === "sent" ? "Sent. I'll reply by email." : null}
          {state === "failed" ? "It didn't go through. Try again, or email me directly." : null}
        </p>
      </div>
    </form>
  );
}
