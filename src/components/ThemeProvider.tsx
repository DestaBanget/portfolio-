"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import type { ComponentProps, ReactNode } from "react";

interface ThemeProviderProps extends ComponentProps<typeof NextThemesProvider> {
  children: ReactNode;
}

function ThemeClassSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeClassSync />
      {children}
    </NextThemesProvider>
  );
}
