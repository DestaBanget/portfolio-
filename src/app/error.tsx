"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page pb-24 pt-16 md:pt-24">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">This page didn&apos;t load</h1>
      <p className="mt-4 max-w-xl text-lg text-text-secondary">
        The content couldn&apos;t be fetched. It is usually a short outage on the database side.
      </p>
      <Button variant="primary" size="lg" onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
