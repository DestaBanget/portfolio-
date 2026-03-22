import { ExperienceCard, type ExperienceEntry } from "@/components/ExperienceCard";
import { supabase } from "@/lib/supabase";

function toMonthYear(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function toDuration(start: string, end: string | null) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = end ? new Date(`${end}T00:00:00`) : new Date();
  const months = Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1,
  );

  if (months < 12) return `${months} mos`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} yr`;
  return `${years} yr ${remMonths} mos`;
}

export default async function ExperiencePage() {
  const { data } = await supabase.from("experience").select("*").order("created_at", { ascending: false });
  const experiences: ExperienceEntry[] = (data ?? []).map((item) => ({
    company: item.company,
    role: item.role,
    type: item.type,
    period: `${toMonthYear(item.period_start)} – ${item.period_end ? toMonthYear(item.period_end) : "Present"}`,
    duration: toDuration(item.period_start, item.period_end),
    location: item.location ?? "",
    description: item.description ?? "",
    skills: item.skills ?? [],
    current: !item.period_end,
  }));

  return (
    <section className="space-y-8">
      <header className="fade-step-0 space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-text-tertiary">Work Experience</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Experience</h1>
      </header>

      <hr className="section-divider fade-step-1" />

      <div className="relative pl-7">
        <span className="absolute bottom-0 left-2 top-0 w-px bg-accent/70" />
        <div className="fade-step-2">
          {experiences.map((experience) => (
            <div key={`${experience.company}-${experience.role}`} className="relative mb-16 last:mb-0">
              <span
                className={`absolute -left-[25px] top-1.5 size-3 rounded-full border-2 ${
                  experience.current ? "border-accent bg-accent" : "border-accent bg-bg"
                }`}
              />
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
