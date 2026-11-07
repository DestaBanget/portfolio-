"use client";

import { useEffect, useRef } from "react";

/**
 * A title that rises into place the first time it comes on screen: each letter lifts out from behind its word,
 * from soft focus to sharp, one after another, and then an accent rule is drawn beneath it. The full title is what
 * renders on the server, so it reads fine without script, and visitors who ask for reduced motion see it still.
 */
export function RiseText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide the letters only once script is here to bring them back.
    root.dataset.armed = "";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        root.dataset.in = "";
      },
      // Wait until the title is well into the screen, so the rise is seen rather than half missed.
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  let index = 0;

  return (
    <span ref={ref} aria-label={text} role="text" className="rise">
      {text.split(" ").map((word, w) => (
        <span key={`${word}-${w}`}>
          {w > 0 ? " " : null}
          <span aria-hidden className="rise-word">
            {Array.from(word, (char, i) => (
              <span key={i} className="rise-char" style={{ "--i": index++ } as React.CSSProperties}>
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
      <span aria-hidden className="rise-rule" style={{ "--i": index } as React.CSSProperties} />
    </span>
  );
}
