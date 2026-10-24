"use client";

import { useRef, type ReactNode } from "react";

/**
 * A soft light that follows the mouse across a surface, with a brighter rim on its border.
 * Touch screens never fire mouse moves, so there the surface stays as it is.
 */
export function PointerGlow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`pointer-glow ${className}`}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // Set on the element itself, not a parent, so only this surface restyles.
        ref.current.style.setProperty("--gx", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--gy", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
