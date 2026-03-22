export interface Experience {
  company: string;
  role: string;
  type: "Internship" | "Part-time" | "Contract" | "Full-time";
  period: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  current: boolean;
}

export const experiences: Experience[] = [
  {
    company: "Defenxor",
    role: "Security Analyst",
    type: "Internship",
    period: "Feb 2026 – Present",
    duration: "2 mos",
    location: "Indonesia",
    description:
      "Support SOC workflows by triaging alerts, documenting incidents, and escalating suspicious activities. Contribute to improving playbooks and detection hygiene for day-to-day monitoring operations.",
    skills: ["SOC", "Incident Triage", "Threat Detection", "Documentation"],
    current: true,
  },
  {
    company: "BCC FILKOM UB",
    role: "Staff in Competitive Programming",
    type: "Part-time",
    period: "2025 – Present",
    duration: "Present",
    location: "Malang, Indonesia",
    description:
      "Mentor peers in algorithmic thinking and contest strategy while organizing training sessions for ICPC and national competitive programming events.",
    skills: ["Competitive Programming", "C++", "Teaching", "Problem Solving"],
    current: true,
  },
  {
    company: "BCC FILKOM UB",
    role: "Staff of Talent Development",
    type: "Part-time",
    period: "2024 – 2025",
    duration: "1 yr",
    location: "Malang, Indonesia",
    description:
      "Designed development tracks for members, coordinated technical upskilling activities, and monitored progress for student learning cohorts.",
    skills: ["Mentoring", "Program Design", "Team Collaboration"],
    current: false,
  },
  {
    company: "FILKOM UB",
    role: "Laboratory Assistant of ADS",
    type: "Part-time",
    period: "2024 – 2025",
    duration: "1 yr",
    location: "Malang, Indonesia",
    description:
      "Assisted teaching sessions for Algorithm and Data Structure classes by preparing exercises, supporting lab activities, and helping students debug implementation issues.",
    skills: ["Algorithms", "Data Structures", "Teaching Assistant"],
    current: false,
  },
  {
    company: "HOLOGY UB",
    role: "Jury Member of National Programming Competition",
    type: "Contract",
    period: "2024",
    duration: "Event-based",
    location: "Indonesia",
    description:
      "Evaluated problem-solving submissions, validated scoring fairness, and helped maintain quality standards during the national contest phase.",
    skills: ["Judging", "Contest Systems", "Quality Assurance"],
    current: false,
  },
];
