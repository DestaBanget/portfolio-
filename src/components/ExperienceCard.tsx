"use client";

import { useState } from "react";
 
export interface ExperienceEntry {
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

interface ExperienceCardProps {
  experience: ExperienceEntry;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="fade-step-1 pl-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-text-tertiary">{experience.period}</p>
        {experience.current ? (
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">● NOW</span>
        ) : null}
      </div>

      <h3 className="font-display text-xl font-bold text-text-primary">{experience.company}</h3>

      <p className="mt-1 text-sm text-text-tertiary">
        {experience.role} · {experience.type} · {experience.location}
      </p>

      <p
        className="mt-4 text-sm leading-relaxed text-text-secondary"
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {experience.description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="text-sm text-accent hover:text-accent-light hover:underline underline-offset-2 cursor-pointer"
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      <p className="mt-5 text-xs tracking-wide text-text-muted">{experience.skills.join(" · ")}</p>
    </article>
  );
}
