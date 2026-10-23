import type { CSSProperties, ReactNode } from "react";
import { Link } from "next-view-transitions";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmail } from "@/components/CopyEmail";
import { ArrowRight, ArrowUpRight, Download } from "@/components/Icons";
import { SocialLinks } from "@/components/SiteFooter";
import { buttonBase, buttonSizes, buttonVariants } from "@/components/ui/Button";
import { awards, certifications, education, languages, location, topSkills } from "@/data/highlights";
import { getExperience, type Experience } from "@/lib/experience";
import { displayUrl, getProfile } from "@/lib/profile";
import { getProjects, projectStatusLabel, projectTypeLabel, type Project } from "@/lib/projects";
import { getWriteupPaths, platformName, type Path } from "@/lib/writeups";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Every home section shares one frame: the heading sits in a narrow column on the
 * left and stays in view while its content scrolls past on the right.
 */
function Section({
  id,
  title,
  intro,
  action,
  transitionName,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  /** Lets the heading travel to the matching page heading during a view transition. */
  transitionName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="container-page">
      <div className="grid gap-8 border-t border-border/70 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
        <div className="reveal lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <h2
              id={`${id}-title`}
              className="w-fit text-2xl font-semibold tracking-tight md:text-3xl"
              style={transitionName ? { viewTransitionName: transitionName } : undefined}
            >
              {title}
            </h2>
            {intro ? <p className="mt-3 max-w-sm text-text-tertiary">{intro}</p> : null}
            {action ? <div className="mt-5">{action}</div> : null}
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-md border border-border bg-surface-raised/60 px-2.5 py-1 text-sm text-text-secondary">{children}</li>
  );
}

/** The hero's figure: contest results and certifications, the proof behind the headline. */
function TrackRecord() {
  return (
    <aside
      aria-labelledby="track-record"
      className="enter border-t border-border pt-6 lg:col-span-5 lg:col-start-8"
      style={delay(4)}
    >
      <h2 id="track-record" className="text-sm text-text-tertiary">
        Track record
      </h2>

      <ul className="mt-5 space-y-3.5">
        {awards.map((award) => (
          <li key={award.event} className="grid grid-cols-[6rem_1fr] items-baseline gap-3">
            <span
              className={`font-mono text-xs uppercase tracking-wide ${award.place === "Finalist" ? "text-text-tertiary" : "text-accent"}`}
            >
              {award.place}
            </span>
            <span>{award.event}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <h3 className="text-sm text-text-tertiary">Certifications</h3>
        <ul className="mt-3 space-y-1.5 text-text-secondary">
          {certifications.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li className="reveal relative pb-10 pl-8 last:pb-0">
      <span aria-hidden className="rail absolute bottom-0 left-[5px] top-2 w-px bg-border" />
      <span
        aria-hidden
        className={`absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-bg ${item.current ? "bg-accent" : "bg-text-muted"}`}
      />

      <h3 className="text-lg font-semibold leading-snug">{item.role}</h3>
      <p className="mt-0.5 text-text-secondary">{[item.company, item.type].filter(Boolean).join(" · ")}</p>
      <p className="mt-1 font-mono text-sm text-text-tertiary">
        {item.period} · {item.duration}
        {item.location ? ` · ${item.location}` : null}
      </p>
      {item.description
        ? item.description
            .split(/\n+/)
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph} className="mt-3 text-text-secondary">
                {paragraph}
              </p>
            ))
        : null}
      {item.skills.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const meta = [projectTypeLabel[project.type ?? ""], projectStatusLabel[project.status ?? ""]].filter(Boolean);
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
        {project.url ? (
          <ArrowUpRight className="mt-1 shrink-0 text-text-tertiary transition-colors group-hover:text-accent" />
        ) : null}
      </div>
      {project.description ? <p className="mt-3 text-text-secondary">{project.description}</p> : null}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm text-text-tertiary">
        <span>{meta.join(" · ")}</span>
        {project.url ? <span className="font-mono text-xs">{displayUrl(project.url)}</span> : null}
      </div>
    </>
  );

  return (
    <li className="reveal">
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="card group flex h-full flex-col p-6 transition-colors hover:border-text-muted"
        >
          {body}
        </a>
      ) : (
        <div className="card flex h-full flex-col p-6">{body}</div>
      )}
    </li>
  );
}

function PathRow({ path }: { path: Path }) {
  return (
    <li>
      <Link
        href={`/writeups#${path.id}`}
        className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-4 transition-colors hover:bg-surface-raised/60"
      >
        <span className="grow-line font-medium">{path.title}</span>
        <span className="flex items-center gap-4 text-sm text-text-tertiary">
          <span>
            {platformName[path.platform]} · {path.rooms} rooms
            {path.writeups > 0 ? ` · ${path.writeups} ${path.writeups === 1 ? "writeup" : "writeups"}` : null}
          </span>
          <ArrowRight className="transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
      </Link>
    </li>
  );
}

export default async function Home() {
  const [profile, experience, paths, projects] = await Promise.all([
    getProfile(),
    getExperience().catch(() => []),
    getWriteupPaths().catch(() => []),
    getProjects().catch(() => []),
  ]);

  const current = experience.find((item) => item.current);
  const skills = Array.from(new Set([...topSkills, ...experience.flatMap((item) => item.skills)]));
  const rooms = paths.reduce((sum, path) => sum + path.rooms, 0);

  const facts = [
    { label: "Studying", value: `${education.degree}, ${education.school} (${education.years})` },
    { label: "Based in", value: location },
    { label: "Languages", value: languages },
    rooms > 0 ? { label: "Labs", value: `${rooms} TryHackMe rooms across ${paths.length} learning paths` } : null,
  ].filter((fact) => fact !== null);

  return (
    <>
      <section className="container-page grid gap-14 pb-16 pt-14 md:pb-24 md:pt-24 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 lg:self-center">
          {current ? (
            <p className="enter text-sm text-text-tertiary">
              Now{" "}
              <span className="text-text-secondary">
                {/* The legal name in brackets ("Defenxor (PT ...)") is too long for a status line. */}
                {current.role}, {current.company.replace(/\s*\(.*\)\s*$/, "")}
              </span>
            </p>
          ) : null}

          <h1
            className="enter mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]"
            style={delay(1)}
          >
            {profile.name}
          </h1>

          <p className="enter mt-6 max-w-xl text-lg text-text-secondary" style={delay(2)}>
            Security analyst intern and Computer Science student at Universitas Brawijaya. I compete in programming
            contests, set and judge problems for them, and teach algorithms.
          </p>

          <div className="enter mt-9 flex flex-wrap items-center gap-3" style={delay(3)}>
            <a href="#contact" className={`${buttonBase} ${buttonVariants.primary} ${buttonSizes.lg}`}>
              Get in touch
            </a>
            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className={`${buttonBase} ${buttonVariants.outline} ${buttonSizes.lg}`}
              >
                <Download /> Download CV
              </a>
            ) : null}
            <SocialLinks profile={profile} className="ml-1" />
          </div>
        </div>

        <TrackRecord />
      </section>

      <Section id="about" title="About">
        <div className="reveal">
          <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed">
            {profile.bio}
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
            <dl className="divide-y divide-border border-y border-border self-start">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3">
                  <dt className="text-sm text-text-tertiary">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-8">
              {profile.focus.length > 0 ? (
                <div>
                  <h3 className="font-medium">Working on now</h3>
                  <ul className="mt-3 space-y-2 text-text-secondary">
                    {profile.focus.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <h3 className="font-medium">Skills</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="experience" title="Experience" intro="Work, teaching and the contests I help run.">
        {experience.length > 0 ? (
          <ol className="max-w-3xl">
            {experience.map((item) => (
              <ExperienceItem key={item.id} item={item} />
            ))}
          </ol>
        ) : (
          <p className="text-text-secondary">Experience will be listed here once it is added.</p>
        )}
      </Section>

      <Section id="projects" title="Projects" intro="Things I have built or am building, outside the writeups.">
        {projects.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <Link
            href="/writeups"
            className="reveal group flex flex-col gap-2 rounded-2xl border border-dashed border-border p-6 transition-colors hover:border-text-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-text-secondary">No public projects yet. Until then, the writeups show the work.</span>
            <span className="inline-flex items-center gap-1.5 font-medium group-hover:text-accent">
              Read the writeups <ArrowRight />
            </span>
          </Link>
        )}
      </Section>

      {paths.length > 0 ? (
        <Section
          id="writeups"
          title="Writeups"
          transitionName="writeups-title"
          intro="Notes from the TryHackMe learning paths I have finished."
          action={
            <Link href="/writeups" className="group inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent">
              <span className="grow-line">All writeups</span>
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        >
          <ul className="card reveal divide-y divide-border overflow-hidden">
            {paths.map((path) => (
              <PathRow key={path.id} path={path} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section id="contact" title="Get in touch">
        <div className="card reveal grid gap-10 p-6 md:p-10 xl:grid-cols-2 xl:gap-14">
          <div>
            <p className="text-lg text-text-secondary">
              {profile.contactNote ?? "Write to me about SOC work, web security, or a contest you're running."}
            </p>
            <div className="mt-8 space-y-3">
              {profile.email ? <CopyEmail email={profile.email} /> : null}
              {profile.whatsapp ? (
                <p className="text-sm text-text-secondary">
                  WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    {profile.whatsapp}
                  </a>
                </p>
              ) : null}
            </div>
            <SocialLinks profile={profile} className="-ml-2.5 mt-6" />
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
