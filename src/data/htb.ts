export type HtbStatus = "pwned" | "in-progress";

export interface HtbMachine {
  name: string;
  os: "Linux" | "Windows";
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  status: HtbStatus;
  retired: boolean;
  writeup: string | null;
}

// Keep active machines private and never expose private notes here.
// If retired=true and you have a public writeup, set the writeup URL.
export const htbMachines: HtbMachine[] = [
  {
    name: "Lame",
    os: "Linux",
    difficulty: "Easy",
    status: "pwned",
    retired: true,
    writeup: "https://example.com/writeups/htb-lame",
  },
  {
    name: "Forest",
    os: "Windows",
    difficulty: "Medium",
    status: "in-progress",
    retired: true,
    writeup: null,
  },
  {
    name: "Active Target",
    os: "Linux",
    difficulty: "Hard",
    status: "in-progress",
    retired: false,
    writeup: null,
  },
];
