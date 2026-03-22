"use client";

import { FormEvent, useState } from "react";

type SendState = "idle" | "sending" | "sent" | "failed";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SendState>("idle");

  const buttonText =
    state === "sending"
      ? "Sending..."
      : state === "sent"
        ? "Sent ✓"
        : state === "failed"
          ? "Failed — try again"
          : "Send";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      setState("failed");
      return;
    }

    setState("sent");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary outline-none transition-colors focus:border-accent"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary outline-none transition-colors focus:border-accent"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        required
        className="min-h-40 w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary outline-none transition-colors focus:border-accent"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-light disabled:opacity-60"
      >
        {buttonText}
      </button>
    </form>
  );
}
