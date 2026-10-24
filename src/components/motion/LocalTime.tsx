"use client";

import { useEffect, useState } from "react";

const format = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(date);

/** The current time where Ferrel is, so a visitor can tell whether a reply is likely soon. Checked every 15 seconds so the minute turns over on time. */
export function LocalTime({ place }: { place: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);

  // Rendering the time on the server would show the build's clock, so it waits for the browser.
  if (!time) return null;

  const [hours, minutes] = time.split(":");

  return (
    <p className="flex items-baseline gap-3 text-sm text-text-tertiary">
      <span className="font-mono text-2xl text-text-primary tabular-nums">
        {hours}
        <span className="clock-colon">:</span>
        {minutes}
      </span>
      <span>in {place} (WIB)</span>
    </p>
  );
}
