import { ContactForm } from "@/components/ContactForm";
import { supabase } from "@/lib/supabase";

export default async function ContactPage() {
  const { data: profile } = await supabase.from("profile").select("*").eq("id", 1).single();

  const contactNote = profile?.contact_note || "Feel free to reach out.";
  const linkedIn = profile?.linkedin_url || "https://linkedin.com/in/ferreldestatiananda";
  const github = profile?.github_url || "";
  const email = profile?.email || "placeholder@email.com";
  const whatsapp = profile?.whatsapp || "";

  const rows = [
    { icon: "↗", href: linkedIn, label: linkedIn.replace(/^https?:\/\//, "") },
    ...(github ? [{ icon: "↗", href: github, label: github.replace(/^https?:\/\//, "") }] : []),
    { icon: "@", href: `mailto:${email}`, label: email },
    ...(whatsapp ? [{ icon: "✆", href: `https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`, label: whatsapp }] : []),
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <header className="space-y-3">
            <p className="font-body text-xs uppercase tracking-widest text-text-tertiary">Contact</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Get in touch</h1>
          </header>

          <p className="max-w-xl text-sm text-text-secondary">{contactNote}</p>

          <div className="space-y-2">
            {rows.map((row) => (
              <a
                key={`${row.icon}-${row.label}`}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-3 text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
              >
                <span className="text-text-muted">{row.icon}</span>
                <span>{row.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
