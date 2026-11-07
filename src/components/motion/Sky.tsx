"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Domain-warped noise folds one diagonal ramp: navy into deep blue, into blue, with ice cyan only at the
// brightest crest. The ramp rises toward the top right (or the bottom right for a sky that rises from the foot of
// its section), so text on the left always sits on the dark end.
const fragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uProgress;
uniform float uRise;
uniform vec3 uMain;
uniform vec3 uMid;
uniform vec3 uSecond;
uniform vec3 uAccent;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = vec2(uv.x * min(uResolution.x / uResolution.y, 2.2), uv.y);
  float t = uTime * 0.04;

  vec2 warp = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  float n = fbm(p * 1.5 + warp * 2.0 + vec2(t * 0.6, 0.0));

  float s = (uv.x + mix(uv.y, 1.0 - uv.y, uRise)) * 0.5;
  s += (n - 0.5) * 0.42;
  s += mix(-0.04, 0.14, uProgress);
  s += 0.07 * (1.0 - min(distance(uv, uPointer) * 2.2, 1.0));

  vec3 color = mix(uMain, uSecond, smoothstep(0.3, 0.62, s));
  color = mix(color, uMid, smoothstep(0.56, 0.82, s));
  color = mix(color, uAccent, smoothstep(0.82, 1.04, s));

  // Faint vertical streaks give the ramp a surface, like the curtains of an aurora.
  float streak = mix(0.07, 0.014, dot(uMain, vec3(0.333)));
  color *= 1.0 + (noise(vec2(uv.x * 150.0, 2.0)) - 0.5) * streak;

  // A little dither keeps the long dark ramps from banding.
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (2.5 / 255.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const readToken = (styles: CSSStyleDeclaration, name: string) =>
  styles.getPropertyValue(name).trim().split(/\s+/).map((channel) => Number(channel) / 255);

/**
 * A living sky drawn from the --sky tokens, filling whichever box it is placed in. It leans toward the pointer,
 * swells as its section is scrolled and stops drawing once it is off screen. `rise` turns it upside down for a
 * section at the end of the page, so its colour gathers at the foot instead of the top. The .sky gradient
 * underneath stands in wherever WebGL is unavailable.
 */
export function Sky({ rise = false }: { rise?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.3, y: 0.3, clientX: -1, clientY: -1 };
    let progress = 0;
    let frame = 0;
    let last = 0;
    let stale = true;
    let visible = true;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      gl.uniform3fv(uniform("uMain"), readToken(styles, "--sky-main"));
      gl.uniform3fv(uniform("uMid"), readToken(styles, "--sky-mid"));
      gl.uniform3fv(uniform("uSecond"), readToken(styles, "--sky-second"));
      gl.uniform3fv(uniform("uAccent"), readToken(styles, "--sky-accent"));
      stale = true;
    };

    // The sky has no fine detail, so a small buffer stretched by the browser looks the same and costs a fraction.
    const resize = () => {
      const scale = Math.min(0.45, 620 / Math.max(canvas.clientWidth, 1));
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniform("uResolution"), canvas.width, canvas.height);
      stale = true;
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || now - last < 33) return;
      last = now;

      const rect = canvas.getBoundingClientRect();
      // How far the section has been scrolled through the screen: away for the hero, into view for a rising sky.
      const through = rise ? (window.innerHeight - rect.top) / (rect.height + window.innerHeight) : -rect.top / rect.height;
      const target = Math.min(Math.max(through, 0), 1);
      const moving = Math.abs(target - progress) > 0.0005;
      // Visitors who ask for reduced motion get a still sky that only follows their own scrolling.
      if (reduced && !moving && !stale) return;

      if (pointer.clientX >= 0) {
        const x = (pointer.clientX - rect.left) / rect.width;
        const y = 1 - (pointer.clientY - rect.top) / rect.height;
        pointer.x += (x - pointer.x) * 0.06;
        pointer.y += (y - pointer.y) * 0.06;
      }
      progress += (target - progress) * (reduced ? 1 : 0.09);

      gl.uniform1f(uniform("uTime"), reduced ? 30 : now / 1000);
      gl.uniform1f(uniform("uProgress"), progress);
      gl.uniform2f(uniform("uPointer"), pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      stale = false;
      canvas.dataset.ready = "";
    };

    const onPointer = (event: PointerEvent) => {
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
    };

    // A lost context draws nothing again, so step aside for the gradient underneath.
    const onContextLost = () => {
      cancelAnimationFrame(frame);
      delete canvas.dataset.ready;
    };

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      stale = true;
    });
    viewObserver.observe(canvas);

    gl.uniform1f(uniform("uRise"), rise ? 1 : 0);
    readColors();
    resize();
    frame = requestAnimationFrame(draw);
    canvas.addEventListener("webglcontextlost", onContextLost);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [rise]);

  return (
    <div aria-hidden className="sky" data-rise={rise ? "" : undefined}>
      <canvas ref={canvasRef} />
    </div>
  );
}
