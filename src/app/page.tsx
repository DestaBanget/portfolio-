import type { CSSProperties, ReactNode } from "react";
import { Link } from "next-view-transitions";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmail } from "@/components/CopyEmail";
import { Download } from "@/components/Icons";
import { DecryptText } from "@/components/motion/DecryptText";
import { RiseText } from "@/components/motion/RiseText";
import { LocalTime } from "@/components/motion/LocalTime";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrollLitText } from "@/components/motion/ScrollLitText";
import { Sky } from "@/components/motion/Sky";
import { SocialLinks } from "@/components/SiteFooter";
import { buttonBase, buttonSizes, buttonVariants } from "@/components/ui/Button";
import {
  awards,
  certifications,
  education,
  languages,
  location,
  teaching,
  topSkills,
} from "@/data/highlights";
import { getExperience, type Experience } from "@/lib/experience";
import { getProfile } from "@/lib/profile";
import { getProjects, projectStatusLabel, projectTypeLabel, type Project } from "@/lib/projects";
import { getWriteupPaths, type Path } from "@/lib/writeups";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

const primaryButton = `${buttonBase} ${buttonVariants.primary} ${buttonSizes.lg}`;

// Full class names, so Tailwind finds them in the source and keeps them in the build.
const washes = {
  blue: "wash wash-blue",
  royal: "wash wash-royal",
  "blue-left": "wash wash-blue wash-left",
  "royal-left": "wash wash-royal wash-left",
} as const;

/**
 * Every section after the hero shares one shape: the title in a narrow column on the left, the content on the
 * right. Space, not lines, separates them, and a soft wash of light or royal blue behind each one carries the palette
 * down the page.
 */
function Section({
  id,
  title,
  intro,
  transitionName,
  tone,
  backdrop,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  transitionName?: string;
  /** Which colour washes behind the section, and from which side. */
  tone?: keyof typeof washes;
  /** Something drawn behind the whole section instead of a wash, such as a sky. */
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const wash = tone ? washes[tone] : "";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`chapter ${wash} ${backdrop ? "relative isolate" : ""}`}
    >
      {backdrop}
      <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <h2
              id={`${id}-title`}
              className="w-fit text-2xl font-semibold tracking-tight md:text-3xl"
              style={transitionName ? { viewTransitionName: transitionName } : undefined}
            >
              <RiseText text={title} />
            </h2>
            {intro}
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}

function Figure({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-accent-text">{children}</span>;
}

function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li className="gap-8 md:grid md:grid-cols-[9.5rem_1fr]">
      <p className="text-sm tabular-nums text-text-tertiary">
        {item.period}
        <br />
        {item.duration}
        {item.location ? `, ${item.location}` : null}
      </p>
      <div className="mt-2 md:mt-0">
        <h3 className="wipe text-xl font-semibold leading-snug tracking-tight">{item.role}</h3>
        <p className="mt-1 font-medium text-accent-text">
          {item.company}
          {item.type ? <span className="font-normal text-text-tertiary">, {item.type.toLowerCase()}</span> : null}
        </p>
        {item.description
          ? item.description
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph} className="mt-3 max-w-2xl text-text-secondary">
                  {paragraph}
                </p>
              ))
          : null}
        {item.skills.length > 0 ? <p className="mt-4 text-sm text-text-tertiary">{item.skills.join(", ")}</p> : null}
      </div>
    </li>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  const kind = projectTypeLabel[project.type ?? ""];
  const status = projectStatusLabel[project.status ?? ""];

  return (
    <li>
      <h3 className="wipe text-2xl font-semibold tracking-tight">{project.title}</h3>
      {kind || status ? (
        <p className="mt-1 font-medium text-accent-text">
          {kind}
          {kind && status ? ", " : null}
          {status ? <span className="font-normal text-text-tertiary">{kind ? status.toLowerCase() : status}</span> : null}
        </p>
      ) : null}
      {project.description ? <p className="mt-3 max-w-2xl text-text-secondary">{project.description}</p> : null}
      {project.url ? (
        <a href={project.url} target="_blank" rel="noreferrer" className={`${primaryButton} mt-6`}>
          {project.url.includes("github.com") ? "View on GitHub" : "Open project"}
        </a>
      ) : null}
    </li>
  );
}

function PathRow({ path }: { path: Path }) {
  return (
    <li>
      <Link
        href={`/writeups#${path.id}`}
        className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-3"
      >
        <span className="row-title text-lg font-medium tracking-tight md:text-xl">{path.title}</span>
        <span className="text-sm tabular-nums text-text-tertiary">
          {path.rooms} rooms
          {path.writeups > 0 ? `, ${path.writeups} ${path.writeups === 1 ? "writeup" : "writeups"}` : null}
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
  // The legal name in brackets ("Defenxor (PT ...)") is too long for the opening sentence.
  const employer = current?.company.replace(/\s*\(.*\)\s*$/, "");
  const skills = Array.from(new Set([...topSkills, ...experience.flatMap((item) => item.skills)]));

  const facts = [
    { label: "Studying", value: `${education.degree}, ${education.school}` },
    { label: "Based in", value: location },
    { label: "Languages", value: languages },
  ];

  return (
    <>
      {/*
        The one bold thing on the page: a live sky behind the name. It runs under the header and melts into the
        ground at its foot, so it has no edge.
      */}
      <section aria-label="Introduction" className="relative isolate -mt-16 pt-16">
        <Sky />
        <div className="container-page flex min-h-[calc(84svh-4rem)] flex-col justify-end pb-12 pt-16 md:pb-16">
          <h1
            className="enter text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
            style={delay(1)}
          >
            <DecryptText text={profile.name} />
          </h1>

          <div className="mt-5 grid items-end gap-7 lg:grid-cols-12 lg:gap-12">
            <p className="enter text-lg leading-relaxed text-text-secondary lg:col-span-7" style={delay(2)}>
              <span className="hl">Security analyst intern{employer ? ` at ${employer}` : null}</span> and Computer
              Science student at Universitas Brawijaya. I compete in programming contests, set and judge problems for
              them, and teach algorithms.
            </p>

            <div className="enter flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end" style={delay(3)}>
              <Magnetic>
                <a href="#contact" className={primaryButton}>
                  Get in touch
                </a>
              </Magnetic>
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
        </div>
      </section>

      <Section id="record" title="Track record" tone="royal-left">
        <p className="max-w-3xl text-xl leading-snug md:text-2xl md:leading-snug">
          <Figure>{awards.length}</Figure> contest finals and podiums,{" "}
          <Figure>{paths.length}</Figure> TryHackMe learning paths, and <Figure>{teaching.labStudents}</Figure>{" "}
          students mentored in the lab.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h3 className="font-semibold">Contests</h3>
            <ul className="mt-4 space-y-3">
              {awards.map((award) => (
                <li key={award.event} className="nudge grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                  <span
                    className={`text-sm ${award.place === "Finalist" ? "text-text-tertiary" : "font-semibold text-accent-text"}`}
                  >
                    {award.place}
                  </span>
                  <span className="nudge-text">{award.event}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <h3 className="font-semibold">Certifications</h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((name) => (
                <li key={name} className="nudge">
                  <span className="nudge-text">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="about" title="About" tone="blue">
        <ScrollLitText text={profile.bio} className="max-w-3xl text-lg leading-relaxed md:text-xl md:leading-relaxed" />

        <dl className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm text-text-tertiary">{fact.label}</dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {profile.focus.length > 0 ? (
            <div className="md:col-span-5">
              <h3 className="font-semibold">Working on now</h3>
              <ul className="mt-2 space-y-1 text-text-secondary">
                {profile.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={profile.focus.length > 0 ? "md:col-span-7" : "md:col-span-12"}>
            <h3 className="font-semibold">Skills</h3>
            <p className="mt-2 text-text-secondary">{skills.join(", ")}</p>
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        title="Experience"
        tone="royal-left"
        intro={<p className="mt-3 max-w-xs text-text-secondary">Work, teaching and the contests I help run.</p>}
      >
        {experience.length > 0 ? (
          <ol className="space-y-14">
            {experience.map((item) => (
              <ExperienceItem key={item.id} item={item} />
            ))}
          </ol>
        ) : (
          <p className="text-text-secondary">Experience will be listed here once it is added.</p>
        )}
      </Section>

      <Section
        id="projects"
        title="Projects"
        tone="blue"
        intro={<p className="mt-3 max-w-xs text-text-secondary">Things I have built or am building.</p>}
      >
        {projects.length > 0 ? (
          <ul className="space-y-14">
            {projects.map((project) => (
              <ProjectEntry key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <p className="text-lg">
            Nothing public yet. The{" "}
            <Link href="/writeups" className="link">
              writeups
            </Link>{" "}
            show the work in the meantime.
          </p>
        )}
      </Section>

      {paths.length > 0 ? (
        <Section
          id="writeups"
          title="Writeups"
          tone="royal"
          transitionName="writeups-title"
          intro={
            <>
              <p className="mt-3 max-w-xs text-text-secondary">Notes from the TryHackMe paths I have finished.</p>
              <Link href="/writeups" className={`${primaryButton} mt-6`}>
                Read the writeups
              </Link>
            </>
          }
        >
          <ul className="-mt-3">
            {paths.map((path) => (
              <PathRow key={path.id} path={path} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section
        id="contact"
        title="Get in touch"
        backdrop={<Sky rise />}
        intro={
          <p className="mt-3 max-w-xs text-text-secondary">
            {profile.contactNote ?? "Write to me about SOC work, web security, or a contest you're running."}
          </p>
        }
      >
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <LocalTime place={location.split(",")[0]} />
            <div className="mt-6 space-y-3">
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
            <SocialLinks profile={profile} className="-ml-2.5 mt-5" />
          </div>
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
