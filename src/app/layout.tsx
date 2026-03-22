import type { Metadata } from "next";
import { Fraunces, Figtree, JetBrains_Mono } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import StarField from "@/components/StarField";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-display",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ferrel Destatiananda Edwardo — Cybersecurity Portfolio",
  description: "Cybersecurity portfolio, experience, and project log.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${figtree.variable} ${mono.variable} bg-bg font-body text-text-primary antialiased transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["dark", "light"]}>
          <StarField />
          <div
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: "#2f5de3",
                filter: "blur(130px)",
                opacity: 0.07,
                top: -150,
                left: -150,
                animation: "drift1 20s ease-in-out infinite alternate",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: "#1a3fa0",
                filter: "blur(110px)",
                opacity: 0.06,
                bottom: -100,
                right: -100,
                animation: "drift2 25s ease-in-out infinite alternate",
              }}
            />
          </div>
          <BottomNav />
          <main className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-6 pb-28 pt-32 md:px-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
