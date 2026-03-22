"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/data/projects";

interface ProjectFolderProps {
  project: Project;
}

const typeTone: Record<Project["type"], string> = {
  security: "text-accent border-accent/40 bg-accent-glow",
  competitive: "text-accent-warm border-accent-warm/40 bg-accent-warm/10",
  dev: "text-accent-green border-accent-green/40 bg-accent-green/10",
  research: "text-text-secondary border-border bg-surface-raised",
};

export function ProjectFolder({ project }: ProjectFolderProps) {
  const [open, setOpen] = useState(false);

  const childCount = useMemo(() => project.children?.length ?? 0, [project.children]);

  return (
    <article className="surface-card fade-step-1 overflow-hidden">
      <Button
        type="button"
        onClick={() => setOpen((value) => !value)}
        variant="ghost"
        size="md"
        className="h-auto w-full justify-start border-0 p-0 text-left"
        aria-expanded={open}
      >
        <div className="relative p-5">
          <div className="absolute left-5 top-0 h-3 w-20 rounded-b-md border-x border-b border-border bg-surface-raised" />
          <div className="mb-3 flex items-center justify-between gap-3 pt-2">
            <h3 className="font-display text-xl font-semibold text-text-primary">{project.title}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-wider ${typeTone[project.type]}`}>
              {project.type}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{project.description}</p>
          <p className="mt-2 text-xs uppercase tracking-widest text-text-tertiary">
            {open ? "Folder open" : "Folder closed"} · {childCount} item{childCount === 1 ? "" : "s"}
          </p>
        </div>
      </Button>

      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border bg-surface-raised/50 px-5 py-4">
            {(project.children ?? []).map((child) => (
              <div key={`${project.id}-${child.title}`} className="mb-3 last:mb-0 rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-base font-medium text-text-primary">📂 {child.title}</p>
                  {child.locked ? <Badge label="Private" tone="skipped" /> : <Badge label="Open" tone="completed" />}
                </div>
                <p className={`text-sm text-text-secondary ${child.locked ? "blur-[2px] select-none" : ""}`}>
                  {child.locked ? `🔒 ${child.description}` : child.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {child.tags.map((tag) => (
                    <Badge key={`${child.title}-${tag}`} label={tag} tone="neutral" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
