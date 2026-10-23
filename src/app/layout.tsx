import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getProfile } from "@/lib/profile";
import "./globals.css";

// A compact, slightly narrow grotesque that reads well at both heading and body sizes,
// with Plex Mono reserved for data: dates, counts and room tallies.
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// Content is edited from the admin dashboard, so pages are rebuilt at most a minute after a change.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ferrel Destatiananda Edwardo · Security Analyst",
  description:
    "Security analyst intern at Defenxor and Computer Science student at Universitas Brawijaya. Experience, TryHackMe writeups and projects.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();

  return (
    <ViewTransitions>
      <html lang="en" id="top" suppressHydrationWarning>
        <body className={`${sans.variable} ${mono.variable} bg-bg font-body text-text-primary antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <a
              href="#content"
              className="sr-only z-50 rounded-lg bg-accent px-4 py-3 font-medium text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <SiteHeader name={profile.name} />
            <main id="content" className="page min-h-[70svh]">
              {children}
            </main>
            <SiteFooter profile={profile} />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
