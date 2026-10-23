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
  { place: "2nd place", event: "Competitive Programming, Pekan-IT" },
  { place: "Finalist", event: "Programming, GEMASTIK XVIII 2025" },
  { place: "Finalist", event: "Competitive Programming, FIND IT! 2025" },
  { place: "Finalist", event: "Competitive Programming, Schematics 2024" },
];

export const certifications = [
  "SOC Level 1",
  "Jr Penetration Tester (Legacy)",
  "CCNA: Enterprise Networking, Security, and Automation",
  "CCNA: Switching, Routing, and Wireless Essentials",
  "Advent of Cyber 2025",
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
