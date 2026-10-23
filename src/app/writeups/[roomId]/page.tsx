import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight } from "@/components/Icons";
import { supabase } from "@/lib/supabase";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

const markdown: Components = {
  h1: ({ children }) => <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">{children}</h2>,
  h2: ({ children }) => <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-10 text-xl font-semibold">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-8 font-semibold">{children}</h4>,
  p: ({ children }) => <p className="mb-5 text-text-secondary">{children}</p>,
  ul: ({ children }) => <ul className="mb-5 list-disc space-y-1.5 pl-6 text-text-secondary marker:text-text-muted">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 list-decimal space-y-1.5 pl-6 text-text-secondary marker:text-text-muted">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded-md bg-surface-raised px-1.5 py-0.5 font-mono text-[0.875em] text-text-primary">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-5 border-l-2 border-accent bg-surface py-3 pl-5 pr-4 [&_p]:mb-0">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-border bg-surface px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-border/60 px-3 py-2 text-text-secondary">{children}</td>,
  // Writeup images are arbitrary external URLs uploaded from the dashboard, so next/image is not used here.
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" className="my-6 max-w-full rounded-xl border border-border" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="link text-text-primary">
      {children}
    </a>
  ),
  hr: () => <hr className="my-10 border-border" />,
};

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomId } = await params;
  const { data } = await supabase.from("wu_rooms").select("title").eq("id", roomId).eq("is_public", true).single();
  return { title: data?.title ? `${data.title} | Writeups` : "Writeup" };
}

export default async function WriteupRoomPage({ params }: RoomPageProps) {
  noStore();
  const { roomId } = await params;
  const { data: room } = await supabase
    .from("wu_rooms")
    .select("id,title,content,difficulty,tags,completed_at,is_public,section_id")
    .eq("id", roomId)
    .single();

  if (!room || !room.is_public) notFound();

  const { data: section } = await supabase.from("wu_sections").select("title").eq("id", room.section_id).single();

  const meta = [section?.title, room.difficulty, room.completed_at ? `Finished ${room.completed_at}` : null].filter(Boolean);
  const tags: string[] = room.tags ?? [];

  return (
    <article className="container-page pb-24 md:pb-32">
      <header className="mx-auto max-w-3xl pt-10 md:pt-16">
        <Link href="/writeups" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
          <ArrowRight className="rotate-180" /> All writeups
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">{room.title}</h1>
        <p className="mt-4 text-text-secondary">{meta.join(" · ")}</p>
        {tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-md border border-border bg-surface-raised/60 px-2.5 py-1 text-sm text-text-secondary">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="mx-auto mt-10 max-w-3xl border-t border-border pt-10 text-[1.0625rem] [&>*:first-child]:mt-0">
        {room.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdown}>
            {room.content}
          </ReactMarkdown>
        ) : (
          <p className="text-text-secondary">This writeup is still being written.</p>
        )}
      </div>
    </article>
  );
}
