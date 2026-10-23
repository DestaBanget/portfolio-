import { GitHub, LinkedIn, Mail } from "@/components/Icons";
import type { Profile } from "@/lib/profile";

export function SocialLinks({ profile, className = "" }: { profile: Profile; className?: string }) {
  const items = [
    profile.githubUrl ? { label: "GitHub", href: profile.githubUrl, icon: <GitHub /> } : null,
    { label: "LinkedIn", href: profile.linkedinUrl, icon: <LinkedIn /> },
    profile.email ? { label: "Email", href: `mailto:${profile.email}`, icon: <Mail /> } : null,
  ].filter((item) => item !== null);

  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            aria-label={item.label}
            title={item.label}
            {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="grid size-10 place-items-center rounded-lg text-lg text-text-tertiary transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border/70">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-4">
          <SocialLinks profile={profile} />
          <a href="#top" className="link">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
