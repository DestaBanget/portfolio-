import { supabase } from "@/lib/supabase";

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  current: boolean;
}

interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  type: string;
  period_start: string;
  period_end: string | null;
  location: string | null;
  description: string | null;
  skills: string[] | null;
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function toMonthYear(value: string) {
  return toDate(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toDuration(start: string, end: string | null) {
  const startDate = toDate(start);
  const endDate = end ? toDate(end) : new Date();
  const months = Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1,
  );

  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase.from("experience").select("*").order("period_start", { ascending: false });
  if (error) throw new Error(`experience: ${error.message}`);

  return ((data ?? []) as ExperienceRow[]).map((row) => ({
    id: row.id,
    company: row.company,
    role: row.role,
    type: row.type,
    period: `${toMonthYear(row.period_start)} to ${row.period_end ? toMonthYear(row.period_end) : "now"}`,
    duration: toDuration(row.period_start, row.period_end),
    location: row.location ?? "",
    description: row.description ?? "",
    skills: row.skills ?? [],
    current: !row.period_end,
  }));
}
