import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  status: string | null;
  url: string | null;
}

export const projectTypeLabel: Record<string, string> = {
  security: "Security",
  competitive: "Competitive programming",
  dev: "Development",
  research: "Research",
};

export const projectStatusLabel: Record<string, string> = {
  active: "Active",
  completed: "Finished",
  wip: "In progress",
};

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,description,type,status,url")
    .eq("is_public", true)
    .order("order_index", { ascending: true });

  if (error) throw new Error(`projects: ${error.message}`);
  return (data ?? []) as Project[];
}
