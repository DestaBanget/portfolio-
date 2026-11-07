import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-raised": token("surface-raised"),
        border: token("border"),
        second: token("second"),
        "second-light": token("second-light"),
        "second-ink": token("second-ink"),
        accent: token("accent"),
        "accent-light": token("accent-light"),
        "accent-ink": token("accent-ink"),
        "accent-text": token("accent-text"),
        danger: token("danger"),
        "text-primary": token("text-primary"),
        "text-secondary": token("text-secondary"),
        "text-tertiary": token("text-tertiary"),
        "text-muted": token("text-muted"),
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
