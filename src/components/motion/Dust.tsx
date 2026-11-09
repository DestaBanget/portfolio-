"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; speed: number; depth: number; phase: number; warm: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const readRgb = (styles: CSSStyleDeclaration, name: string) => styles.getPropertyValue(name).trim().split(/\s+/).join(",");

// Nearer motes closer than this are joined by a faint thread, so the ground reads as a slowly shifting network.
const LINK_DISTANCE = 130;

/**
 * Fine motes of light drifting up behind the page, almost all in the second colour and a rare one in the accent.
 * Nearer motes are larger, slide further when the page is scrolled and are threaded to their near neighbours,
 * which gives the flat ground some depth. Now and then a spark of the accent streaks across. Drawing stops while
 * the tab is hidden, and visitors who ask for reduced motion get none.
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
    let points: { x: number; y: number; depth: number }[] = [];
    let sparks: Spark[] = [];
    let nextSpark = 0;
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

      // About one mote per 15,000 square pixels, so a phone still gets only a few dozen.
      const count = Math.min(110, Math.round((width * height) / 15000));
      motes = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + depth * 1.5,
          speed: 0.08 + depth * 0.3,
          depth,
          phase: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.1,
        };
      });
    };

    const spawnSpark = (now: number) => {
      // Sparks cross from the upper left toward the lower right, at a slightly different angle each time.
      const angle = 0.35 + Math.random() * 0.35;
      const speed = 9 + Math.random() * 5;
      const max = 55 + Math.random() * 30;
      sparks.push({
        x: Math.random() * width * 0.7,
        y: Math.random() * height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max,
      });
      nextSpark = now + 3500 + Math.random() * 5000;
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden) return;

      context.clearRect(0, 0, width, height);
      const scroll = window.scrollY;

      points = motes.map((mote) => {
        mote.y -= mote.speed;
        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }
        // Nearer motes slide further with the scroll; the modulo keeps every mote on screen.
        const y = (((mote.y - scroll * mote.depth * 0.25) % (height + 20)) + height + 20) % (height + 20) - 10;
        const x = mote.x + Math.sin(now / 2600 + mote.phase) * 10 * mote.depth;
        return { x, y, depth: mote.depth };
      });

      // Threads between near motes of the nearer half, fading with distance.
      context.lineWidth = 0.6;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        if (a.depth < 0.45) continue;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          if (b.depth < 0.45) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;
          context.strokeStyle = `rgba(${colors.second},${(1 - distance / LINK_DISTANCE) * 0.16})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      for (let i = 0; i < motes.length; i++) {
        const mote = motes[i];
        const { x, y } = points[i];
        const twinkle = 0.5 + 0.5 * Math.sin(now / 900 + mote.phase * 3);
        const alpha = (0.15 + 0.45 * mote.depth) * (0.5 + 0.5 * twinkle);
        context.beginPath();
        context.arc(x, y, mote.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(${mote.warm ? colors.accent : colors.second},${alpha})`;
        context.fill();
      }

      if (now > nextSpark) spawnSpark(now);
      sparks = sparks.filter((spark) => spark.life < spark.max);
      for (const spark of sparks) {
        spark.life += 1;
        spark.x += spark.vx;
        spark.y += spark.vy;
        // Fades in quickly, out slowly; the tail is a gradient back along its path.
        const fade = Math.min(spark.life / 8, 1) * (1 - spark.life / spark.max);
        const tailX = spark.x - spark.vx * 10;
        const tailY = spark.y - spark.vy * 10;
        const gradient = context.createLinearGradient(spark.x, spark.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(${colors.accent},${0.85 * fade})`);
        gradient.addColorStop(1, `rgba(${colors.accent},0)`);
        context.strokeStyle = gradient;
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(spark.x, spark.y);
        context.lineTo(tailX, tailY);
        context.stroke();
      }
    };

    readColors();
    resize();
    nextSpark = performance.now() + 1500;
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
