export interface SubProject {
  title: string;
  description: string;
  locked: boolean;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: "security" | "competitive" | "dev" | "research";
  status: "active" | "completed" | "wip";
  children?: SubProject[];
}

export const projects: Project[] = [
  {
    id: "jr-pentest",
    title: "Junior Penetration Testing",
    description:
      "Structured penetration testing learning path. Room writeups, methodology notes, and recon workflows.",
    type: "security",
    status: "wip",
    children: [
      {
        title: "Writeups",
        description: "Individual room writeups — unlocked as machines retire.",
        locked: true,
        tags: ["THM", "HTB", "writeup"],
      },
    ],
  },
];
