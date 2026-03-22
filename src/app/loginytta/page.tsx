"use client";

import { FormEvent, useState } from "react";

export default function SecretLoginPage() {
  const [password, setPassword] = useState("");
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await fetch("/loginytta/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
      setErrorMessage("Wrong password");
      setPassword("");
      return;
    }

    window.location.href = "/loginytta/dashboard";
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
      <style>{`@keyframes shake { 0% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } 100% { transform: translateX(0) } }`}</style>
      <form onSubmit={onSubmit} className="w-full">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
          style={shaking ? { animation: "shake 350ms ease" } : undefined}
        />
        <button type="submit" disabled={loading} className="sr-only">
          submit
        </button>
        {loading ? <p className="mt-3 text-sm text-text-secondary">Checking password...</p> : null}
        {errorMessage ? <p className="mt-3 text-sm text-red-400">{errorMessage}</p> : null}
      </form>
    </main>
  );
}
