import { ProjectFolder } from "@/components/ProjectFolder";
import { supabase } from "@/lib/supabase";

export default async function ProjectsPage() {
  const { data } = await supabase
    .from("projects")
    .select("id,title,description,type,status,url,is_public,order_index")
    .eq("is_public", true)
    .order("order_index", { ascending: true });

  const projects = (data ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description || "No description yet.",
    type: (project.type || "dev") as "security" | "competitive" | "dev" | "research",
    status: (project.status || "wip") as "active" | "completed" | "wip",
    children: project.url
      ? [
          {
            title: "Project Link",
            description: project.url,
            locked: false,
            tags: [project.status || "wip"],
          },
        ]
      : [],
  }));

  return (
    <section className="space-y-8">
      <header className="fade-step-0 space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-text-tertiary">Projects</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Project Library</h1>
      </header>

      <hr className="section-divider fade-step-1" />

      <div className="fade-step-2 grid gap-4">
        {projects.map((project) => (
          <ProjectFolder key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
