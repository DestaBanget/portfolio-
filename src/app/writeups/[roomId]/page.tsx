import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";

interface RoomPageProps {
  params: { roomId: string };
}

export default async function WriteupRoomPage({ params }: RoomPageProps) {
  const { data: room } = await supabase
    .from("wu_rooms")
    .select("id,title,content,difficulty,tags,completed_at,is_public,section_id")
    .eq("id", params.roomId)
    .single();

  if (!room || !room.is_public) {
    notFound();
  }

  const { data: section } = await supabase.from("wu_sections").select("id,title,platform").eq("id", room.section_id).single();

  return (
    <article className="space-y-6">
      <Link href="/writeups" className="text-sm text-accent hover:text-accent-light">
        ← Back to writeups
      </Link>

      <header className="space-y-3">
        <h1 className="font-display text-4xl text-text-primary">{room.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-secondary">
          {section?.platform ? <span className="rounded-full border border-border px-2 py-1">{section.platform}</span> : null}
          {room.difficulty ? <span className="rounded-full border border-border px-2 py-1">{room.difficulty}</span> : null}
          {room.completed_at ? <span className="rounded-full border border-border px-2 py-1">{room.completed_at}</span> : null}
          {(room.tags ?? []).map((tag: string) => (
            <span key={tag} className="rounded-full border border-border px-2 py-1 lowercase">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="surface-card p-6 prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="font-display text-3xl font-bold text-text-primary mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="font-display text-2xl font-bold text-text-primary mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="font-display text-xl font-semibold text-text-primary mt-5 mb-2">{children}</h3>,
            h4: ({ children }) => <h4 className="font-body text-lg font-semibold text-text-secondary mt-4 mb-2">{children}</h4>,
            p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside text-text-secondary space-y-1 mb-4 pl-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4 pl-4">{children}</ol>,
            li: ({ children }) => <li className="text-text-secondary">{children}</li>,
            strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
            code: ({ children }) => <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded text-accent">{children}</code>,
            pre: ({ children }) => <pre className="font-mono text-sm bg-surface border border-border rounded-xl p-4 overflow-x-auto mb-4">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 text-text-tertiary italic mb-4">{children}</blockquote>,
            table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
            th: ({ children }) => <th className="border border-border px-3 py-2 text-text-primary font-semibold bg-surface text-left">{children}</th>,
            td: ({ children }) => <td className="border border-border px-3 py-2 text-text-secondary">{children}</td>,
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ""}
                className="rounded-lg my-4 max-w-full border border-border"
              />
            ),
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noreferrer" className="text-accent hover:underline underline-offset-2">
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-6" />,
          }}
        >
          {room.content || ""}
        </ReactMarkdown>
      </article>
    </article>
  );
}
