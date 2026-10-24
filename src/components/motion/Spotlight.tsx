"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's backdrop: a dot grid that lights up around the mouse. On touch screens,
 * where there is no cursor to follow, the lit patch drifts slowly on its own (see .spotlight in CSS).
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const host = node?.parentElement;
    if (!node || !host || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect();
        node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--my", `${event.clientY - rect.top}px`);
        node.dataset.tracking = "";
      });
    };
    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="spotlight pointer-events-none absolute inset-0 -z-10">
      <div className="spotlight-dots absolute inset-0" />
      <div className="spotlight-lit absolute inset-0" />
    </div>
  );
}
