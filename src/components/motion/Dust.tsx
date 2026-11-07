"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; speed: number; depth: number; phase: number; warm: boolean };

const readRgb = (styles: CSSStyleDeclaration, name: string) => styles.getPropertyValue(name).trim().split(/\s+/).join(",");

/**
 * Fine motes of light drifting slowly up behind the page, almost all in the second colour and a rare one in the
 * accent. Nearer motes are larger and slide further when the page is scrolled, which gives the flat ground some
 * depth. Drawing stops while the tab is hidden, and visitors who ask for reduced motion get none.
 */
export function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let colors = { second: "", accent: "" };
    let frame = 0;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      colors = { second: readRgb(styles, "--second"), accent: readRgb(styles, "--accent") };
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = window.innerWidth !== width;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      // A phone's address bar showing or hiding only changes the height; keep the motes where they are then.
      if (!widthChanged) return;

      // Sparse on purpose: about one mote per 22,000 square pixels, so a phone gets a handful.
      const count = Math.min(80, Math.round((width * height) / 22000));
      motes = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + depth * 1.4,
          speed: 0.06 + depth * 0.22,
          depth,
          phase: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.08,
        };
      });
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden) return;

      context.clearRect(0, 0, width, height);
      const scroll = window.scrollY;
      for (const mote of motes) {
        mote.y -= mote.speed;
        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }
        // Nearer motes slide further with the scroll; the modulo keeps every mote on screen.
        const y = (((mote.y - scroll * mote.depth * 0.25) % (height + 20)) + height + 20) % (height + 20) - 10;
        const x = mote.x + Math.sin(now / 2600 + mote.phase) * 8 * mote.depth;
        const twinkle = 0.5 + 0.5 * Math.sin(now / 900 + mote.phase * 3);
        const alpha = (0.12 + 0.38 * mote.depth) * (0.55 + 0.45 * twinkle);

        context.beginPath();
        context.arc(x, y, mote.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(${mote.warm ? colors.accent : colors.second},${alpha})`;
        context.fill();
      }
    };

    readColors();
    resize();
    frame = requestAnimationFrame(draw);

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="dust" />;
}
