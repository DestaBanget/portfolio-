import { TerminalBlock } from "@/components/TerminalBlock";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: profile } = await supabase.from("profile").select("*").eq("id", 1).single();

  const name = profile?.name ?? "Ferrel Destatiananda Edwardo";
  const cvUrl = profile?.cv_url ?? "/cv.pdf";
  const linkedIn = profile?.linkedin_url ?? "https://linkedin.com/in/ferreldestatiananda";
  const email = profile?.email ?? "placeholder@email.com";
  const bio =
    profile?.bio ??
    "A dedicated Computer Science student at Universitas Brawijaya with a deep passion for Cyber Security, Networking, and Algorithmic Problem Solving. Proven track record in competitive programming — ICPC Asia-Jakarta, Gemastik.";
  const terminalLines = profile?.terminal_lines?.length
    ? profile.terminal_lines
    : [
        "desta@portfolio:~$ whoami",
        "Security Analyst Intern | CS Student | Competitive Programmer",
        "",
        "desta@portfolio:~$ current-focus",
        "- TryHackMe SOC path",
        "- AppSec & Web Security fundamentals",
        "- Bug bounty preparation",
      ];

  return (
    <section className="space-y-14">
      <div className="fade-step-0 space-y-6">
        <p className="border-l border-accent pl-3 text-xs uppercase tracking-[0.28em] text-text-tertiary">
          Portfolio
        </p>
        <h1 className="hero-name font-display text-5xl font-black leading-tight tracking-tight text-text-primary md:text-7xl">
          {name}
        </h1>
        <div className="flex flex-wrap gap-2.5">
          <span className="home-role-chip px-3 py-1 rounded-full text-sm font-medium border">
            Security Analyst Intern at Defenxor
          </span>
          <span className="home-role-chip px-3 py-1 rounded-full text-sm font-medium border">
            CS Student at Universitas Brawijaya
          </span>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
          {bio}
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={cvUrl}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
          >
            ↓ Download CV
          </a>
          <a
            href={linkedIn}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
              <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A2.01 2.01 0 103 5.01 2 2 0 005.25 3zM20.44 13.22c0-3.36-1.79-4.92-4.17-4.92a3.6 3.6 0 00-3.23 1.78V8.5H9.66V20h3.38v-6.01c0-1.58.3-3.11 2.25-3.11 1.92 0 1.95 1.79 1.95 3.21V20h3.38z" />
            </svg>
            LinkedIn ↗
          </a>
        </div>
      </div>

      <hr className="fade-step-1 h-0.5 border-0 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.15)]" />

      <TerminalBlock lines={terminalLines} />

    </section>
  );
}
