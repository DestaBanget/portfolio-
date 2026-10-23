import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  name: string;
  bio: string;
  /** Null when the CV points at a file that is not in /public, so the button is hidden instead of linking to a 404. */
  cvUrl: string | null;
  linkedinUrl: string;
  githubUrl: string | null;
  email: string | null;
  whatsapp: string | null;
  contactNote: string | null;
  focus: string[];
}

const FALLBACK_NAME = "Ferrel Destatiananda Edwardo";

const FALLBACK: Profile = {
  name: FALLBACK_NAME,
  bio: "Computer Science student at Universitas Brawijaya working on cyber security, networking and algorithmic problem solving. Competed at ICPC Asia-Jakarta and Gemastik.",
  cvUrl: null,
  linkedinUrl: "https://linkedin.com/in/ferreldestatiananda",
  githubUrl: null,
  email: null,
  whatsapp: null,
  contactNote: null,
  focus: [],
};

/**
 * The admin dashboard stores the old terminal block as raw lines
 * ("desta@portfolio:~$ current-focus", "- TryHackMe SOC path").
 * Only the "- " list items carry content worth showing.
 */
function focusFromTerminalLines(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter((line): line is string => typeof line === "string" && line.trim().startsWith("- "))
    .map((line) => line.trim().slice(2).trim())
    .filter(Boolean);
}

export const getProfile = cache(async (): Promise<Profile> => {
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  if (!data) return FALLBACK;

  return {
    name: data.name || FALLBACK.name,
    bio: data.bio || FALLBACK.bio,
    cvUrl: existingCv(data.cv_url || "/cv.pdf"),
    linkedinUrl: data.linkedin_url || FALLBACK.linkedinUrl,
    githubUrl: data.github_url || null,
    email: data.email || null,
    whatsapp: data.whatsapp || null,
    contactNote: data.contact_note || null,
    focus: focusFromTerminalLines(data.terminal_lines),
  };
});

function existingCv(url: string) {
  if (!url.startsWith("/")) return url;
  return fs.existsSync(path.join(process.cwd(), "public", url)) ? url : null;
}

/** "https://www.linkedin.com/in/name/?x=1" -> "linkedin.com/in/name" */
export function displayUrl(url: string) {
  return url
    .replace(/^https?:\/\/(www\.)?/, "")
    .split("?")[0]
    .replace(/\/$/, "");
}
