"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>/\\{}[]=?";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Text that decodes itself from noise, left to right, like a cipher being cracked.
 * The final text is what renders on the server, so it reads fine without script.
 * Each letter keeps the width of its real character, so nothing reflows while it scrambles.
 */
export function DecryptText({ text, delay = 250, className = "" }: { text: string; delay?: number; className?: string }) {
  const [noise, setNoise] = useState<(string | null)[]>(() => Array.from(text, () => null));
  const frame = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    // Each letter settles a little after the one before it.
    const settleAt = Array.from(text, (_, i) => 380 + i * 32 + Math.random() * 140);
    let lastSwap = 0;

    const tick = (now: number) => {
      const t = now - start;
      // Swapping glyphs every frame is a blur; ~20 swaps a second reads as decoding.
      if (now - lastSwap > 48) {
        lastSwap = now;
        setNoise(Array.from(text, (char, i) => (char === " " || t >= settleAt[i] ? null : randomGlyph())));
      }
      if (t < settleAt[settleAt.length - 1]) frame.current = requestAnimationFrame(tick);
      else setNoise(Array.from(text, () => null));
    };
    frame.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(run, delay);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame.current);
    };
  }, [run, delay]);

  const words = text.split(" ");
  let offset = 0;

  return (
    <span
      aria-label={text}
      role="text"
      className={className}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) run();
      }}
    >
      {words.map((word, w) => {
        const base = offset;
        offset += word.length + 1;
        return (
          <span key={`${word}-${w}`}>
            {w > 0 ? " " : null}
            <span aria-hidden className="inline-block whitespace-nowrap">
              {Array.from(word, (char, i) => {
                const glyph = noise[base + i];
                return (
                  <span key={i} className="relative inline-block">
                    <span className={glyph ? "opacity-0" : undefined}>{char}</span>
                    {glyph ? <span className="decrypt-glyph absolute inset-0 text-center">{glyph}</span> : null}
                  </span>
                );
              })}
            </span>
          </span>
        );
      })}
    </span>
  );
}
