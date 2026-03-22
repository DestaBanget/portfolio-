"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface NavItem {
  href: string;
  label: string;
  icon: (isActive: boolean) => JSX.Element;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: () => (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.75 9.75V21h10.5V9.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/experience",
    label: "Experience",
    icon: () => (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/writeups",
    label: "Writeups",
    icon: () => (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M4 6h11v3H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h8v3H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18h5v2H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10l4 2v3c0 2.5-1.5 4.6-4 5.5-2.5-.9-4-3-4-5.5v-3l4-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: () => (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M9 7L4 12l5 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: () => (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setMounted(true);

    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const isLight = activeTheme === "light";

  return (
    <nav
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border border-border bg-surface/80 px-2 py-1 backdrop-blur-md ${
        isLight ? "shadow-lg shadow-slate-300/60" : "shadow-lg shadow-black/40"
      }`}
      aria-label="Primary"
    >
      {navItems.map((item) => {
        const isContact = item.href === "/contact";
        const isHome = item.href === "/";
        const isActive = isContact
          ? pathname === "/contact"
          : isHome
            ? pathname === "/" && hash !== "#contact"
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`relative flex size-11 items-center justify-center rounded-xl transition-transform duration-150 hover:scale-110 ${
              isActive ? "text-accent" : "text-text-secondary hover:text-accent"
            }`}
          >
            {item.icon(isActive)}
            {isActive ? <span className="absolute bottom-1 left-1/2 size-0.5 -translate-x-1/2 rounded-full bg-accent" /> : null}
          </Link>
        );
      })}

      <span className="mx-1 h-5 w-px bg-border" aria-hidden />

      <Button
        type="button"
        onClick={() => setTheme(isLight ? "dark" : "light")}
        aria-label="Toggle color theme"
        variant="ghost"
        size="sm"
        className="relative size-11 border-0 px-0 py-0 text-text-secondary transition-transform duration-150 hover:scale-110 hover:text-accent"
      >
        {mounted ? (
          isLight ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path
                d="M20.5 15.5A8.5 8.5 0 118.5 3.5a7 7 0 0012 12z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" strokeLinecap="round" />
            </svg>
          )
        ) : null}
      </Button>
    </nav>
  );
}