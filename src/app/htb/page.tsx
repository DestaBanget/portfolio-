"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { RoomCard } from "@/components/RoomCard";
import { htbMachines } from "@/data/htb";
import { Button } from "@/components/ui/Button";

const SESSION_KEY = "htb-unlocked";

export default function HtbPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    setUnlocked(cached === "true");
  }, []);

  const sortedMachines = useMemo(
    () => [...htbMachines].sort((a, b) => Number(a.retired) - Number(b.retired)),
    [],
  );

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/htb/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Access denied");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    setUnlocked(true);
    setPassword("");
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  if (!unlocked) {
    return (
      <section className="surface-card fade-step-0 mx-auto max-w-md p-6 text-center">
        <p className="text-4xl text-accent" aria-hidden>
          🔒
        </p>
        <form onSubmit={handleUnlock} className="mt-5 space-y-3">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
            autoComplete="off"
            required
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full"
          >
            Unlock
          </Button>
          {error ? <p className="text-xs uppercase tracking-wider text-text-secondary">{error}</p> : null}
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="fade-step-0 space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-text-tertiary">Hack The Box</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Private Machines</h1>
      </header>

      <hr className="section-divider fade-step-1" />

      <div className="fade-step-2 grid gap-4">
        {sortedMachines.map((machine) => (
          <RoomCard
            key={machine.name}
            title={machine.name}
            statusLabel={machine.status}
            statusTone={machine.status === "pwned" ? "completed" : "in-progress"}
            metadata={[
              { label: "OS", value: machine.os },
              { label: "Difficulty", value: machine.difficulty },
              { label: "Retired", value: machine.retired ? "Yes" : "No" },
            ]}
            writeup={machine.writeup}
            showWriteup={machine.retired}
          />
        ))}
      </div>
    </section>
  );
}
