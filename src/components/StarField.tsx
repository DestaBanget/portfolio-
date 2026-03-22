"use client";

import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    const spikes = 4;
    const outerRadius = r;
    const innerRadius = r * 0.4;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 280;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLight = document.documentElement.classList.contains("light");
      stars.forEach((star) => {
        const twinkle = Math.sin(star.phase + Date.now() * 0.001) * 0.2;
        const alpha = Math.min(1, star.opacity + twinkle);
        ctx.fillStyle = isLight
          ? "rgba(30, 64, 175, 0.35)"
          : `rgba(255, 255, 255, ${alpha})`;
        drawStar(ctx, star.x, star.y, star.r);
        star.phase += 0.005;

        star.y += star.speed;
        if (star.y > canvas.height + 2) {
          star.y = -2;
          star.x = Math.random() * canvas.width;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
