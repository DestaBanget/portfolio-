"use client";

import { useRef, type ReactNode } from "react";

/**
 * Leans its child toward the mouse while the pointer is near, then springs back.
 * Only fine pointers get the pull; on touch the child behaves like a normal link.
 */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className="magnetic inline-block"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * strength;
        const y = (event.clientY - rect.top - rect.height / 2) * strength;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
