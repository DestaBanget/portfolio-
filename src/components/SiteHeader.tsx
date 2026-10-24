"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Close, Menu, Moon, Sun } from "@/components/Icons";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writeups", label: "Writeups" },
  { id: "contact", label: "Contact" },
];

const hrefFor = (id: string) => (id === "writeups" ? "/writeups" : `/#${id}`);

/** Jumps within the home page stay plain anchors; only real page changes go through a view transition. */
function NavLink({ id, onHome, ...props }: { id: string; onHome: boolean } & ComponentProps<"a">) {
  if (onHome && id !== "writeups") return <a href={`#${id}`} {...props} />;
  return <Link href={hrefFor(id)} {...props} />;
}

/** Tracks which home-page section is in view so the nav can mark it. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      // A section counts as current once it crosses the upper third of the screen.
      { rootMargin: "-30% 0px -65% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

/** The header steps out of the way while reading down and comes back as soon as the visitor scrolls up. */
function useHeaderState() {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      // Small jitters from trackpads should not toggle the header.
      if (Math.abs(delta) < 6 && y > 8) return;
      setState({ scrolled: y > 8, hidden: delta > 0 && y > 240 });
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";

  // The new theme grows out of the button as a circle, where the browser supports view transitions.
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = isLight ? "dark" : "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
    root.classList.add("theme-switch");

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      // next-themes applies the class in an effect; set it now so the new snapshot already has it.
      root.classList.remove(isLight ? "light" : "dark");
      root.classList.add(next);
    });
    transition.finished.finally(() => root.classList.remove("theme-switch"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="grid size-10 place-items-center rounded-full text-lg text-text-secondary transition-colors hover:text-text-primary"
    >
      {/* The stored theme is only known in the browser, so the icon waits for mount to avoid a hydration mismatch. */}
      {mounted ? isLight ? <Moon /> : <Sun /> : <span className="size-[1em]" />}
    </button>
  );
}

/** Desktop links share one highlight that rests on the current section and glides to whichever link is hovered. */
function DesktopNav({ current, onHome }: { current: string | null; onHome: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);
  const target = hovered ?? current;

  useLayoutEffect(() => {
    const item = target ? listRef.current?.querySelector<HTMLElement>(`[data-id="${target}"]`) : null;
    setBox(item ? { x: item.offsetLeft, w: item.offsetWidth } : null);
  }, [target]);

  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul ref={listRef} className="relative flex items-center" onMouseLeave={() => setHovered(null)}>
        <li
          aria-hidden
          className="nav-glide absolute inset-y-0 left-0 rounded-full bg-surface-raised"
          style={{ width: box?.w ?? 0, transform: `translateX(${box?.x ?? 0}px)`, opacity: box ? 1 : 0 }}
        />
        {links.map((link) => (
          <li key={link.id} data-id={link.id} className="relative">
            <NavLink
              id={link.id}
              onHome={onHome}
              onMouseEnter={() => setHovered(link.id)}
              onFocus={() => setHovered(link.id)}
              onBlur={() => setHovered(null)}
              aria-current={current === link.id ? "true" : undefined}
              className="block px-3.5 py-2 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:text-text-primary aria-[current]:text-text-primary"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = useActiveSection(pathname === "/");
  const { scrolled, hidden } = useHeaderState();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = pathname.startsWith("/writeups") ? "writeups" : active;
  // The full legal name is long; the header carries the name people use.
  const words = name.split(/\s+/);
  const shortName = words.length > 2 ? `${words[0]} ${words[words.length - 1]}` : name;

  return (
    <header
      data-hidden={hidden && !open ? "" : undefined}
      data-scrolled={scrolled || open ? "" : undefined}
      className="site-header sticky top-0 z-40 border-b border-transparent transition-[transform,background-color,border-color] duration-300 ease-out data-[hidden]:-translate-y-full data-[scrolled]:border-border/60 data-[scrolled]:bg-bg/90 data-[scrolled]:backdrop-blur"
    >
      <span aria-hidden className="scroll-progress absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent" />
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-semibold tracking-tight">{shortName}</span>
          <span className="hidden text-sm text-text-tertiary transition-colors group-hover:text-text-secondary lg:inline">
            Security analyst
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <DesktopNav current={current} onHome={pathname === "/"} />
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full text-xl text-text-secondary hover:text-text-primary md:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Main" className="md:hidden">
          <ul className="container-page pb-8 pt-2">
            {links.map((link, i) => (
              <li key={link.id} className="menu-item" style={{ "--i": i } as CSSProperties}>
                <NavLink
                  id={link.id}
                  onHome={pathname === "/"}
                  onClick={() => setOpen(false)}
                  aria-current={current === link.id ? "true" : undefined}
                  className="flex min-h-14 items-center justify-between border-b border-border/60 text-2xl font-medium tracking-tight text-text-secondary hover:text-text-primary aria-[current]:text-text-primary"
                >
                  {link.label}
                  {current === link.id ? <span aria-hidden className="size-1.5 rounded-full bg-accent" /> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
