"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { htbMachines } from "@/data/htb";

const SESSION_KEY = "htb-unlocked";

// Active machines first; retired ones may link to a public writeup.
const machines = [...htbMachines].sort((a, b) => Number(a.retired) - Number(b.retired));

export default function HtbPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "true");
  }, []);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setChecking(true);

    const response = await fetch("/api/htb/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: new FormData(form).get("password") }),
    }).catch(() => null);

    setChecking(false);
    if (!response?.ok) {
      setError("Wrong password.");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <div className="container-page pb-24">
        <PageHeader title="Private">Hack The Box machines that are still active stay behind a password.</PageHeader>
        <form onSubmit={handleUnlock} className="card flex max-w-md flex-col gap-4 p-6">
          <label className="text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete="off"
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 outline-none hover:border-text-muted focus-visible:border-accent"
            />
          </label>
          <Button type="submit" variant="primary" size="lg" disabled={checking} className="self-start">
            {checking ? "Checking" : "Unlock"}
          </Button>
          <p role="status" className="text-sm text-danger">
            {error}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="container-page pb-24 md:pb-32">
      <PageHeader title="Hack The Box">Machines I have worked on. Writeups are published once a machine retires.</PageHeader>

      <ul className="grid gap-4 md:grid-cols-2">
        {machines.map((machine) => (
          <li key={machine.name} className="card flex flex-col gap-3 p-6">
            <h2 className="text-xl font-semibold tracking-tight">{machine.name}</h2>
            <p className="text-text-secondary">
              {machine.os}, {machine.difficulty}, {machine.status === "pwned" ? "pwned" : "in progress"}
              {machine.retired ? ", retired" : ", active"}
            </p>
            <p className="mt-auto pt-2 text-sm">
              {machine.retired && machine.writeup ? (
                <a href={machine.writeup} target="_blank" rel="noreferrer" className="link font-medium">
                  Read the writeup
                </a>
              ) : (
                <span className="text-text-tertiary">{machine.retired ? "Writeup not published yet" : "No writeup while active"}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
