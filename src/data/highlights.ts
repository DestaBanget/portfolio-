/**
 * Awards, certifications, education and languages, taken from the LinkedIn
 * profile export. They are not in the database yet, so edit them here.
 */

export interface Award {
  place: string;
  event: string;
}

export const awards: Award[] = [
  { place: "1st place", event: "Competitive Programming, Veternity" },
  { place: "Finalist", event: "ICPC Asia Jakarta Regional 2025" },
  { place: "Finalist", event: "Programming, GEMASTIK XVIII 2025" },
  { place: "Finalist", event: "Competitive Programming, COMPFEST 2025" },
  { place: "Finalist", event: "Competitive Programming, FIND IT! 2025" },
];

/** Results from the LinkedIn profile that are not featured above; they still count toward the totals. */
export const otherResults: Award[] = [
  { place: "2nd place", event: "Competitive Programming, Pekan-IT" },
  { place: "Finalist", event: "Competitive Programming, Schematics 2024" },
];

/** Figures stated on the LinkedIn profile (the FILKOM lab assistant role). */
export const teaching = {
  labStudents: 40,
};

export const certifications = [
  "SOC Level 1 - TryHackMe",
  "Security Engineer - TryHackMe",
  "DevSecOps - TryHackMe",
  "CCNA: Enterprise Networking, Security, and Automation",
  "CCNA: Switching, Routing, and Wireless Essentials",
];

export const education = {
  school: "Universitas Brawijaya",
  degree: "Bachelor of Computer Science",
  years: "2023 to 2027",
};

export const location = "Bekasi, West Java";

export const languages = "Indonesian (native), English (professional working)";

/** LinkedIn's "Top Skills". */
export const topSkills = ["Application Security", "DevSecOps", "Software Development Life Cycle (SDLC)"];
