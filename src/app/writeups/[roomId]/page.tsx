import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
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

  const { data: section } = await supabase.from("wu_sections").select("id,path_id,title").eq("id", room.section_id).single();
  const { data: path } = await supabase.from("wu_paths").select("id,platform,title").eq("id", section?.path_id ?? "").single();

  return (
    <article className="space-y-6">
      <Link href="/writeups" className="text-sm text-accent hover:text-accent-light">
        ← Back to writeups
      </Link>

      <header className="space-y-3">
        <h1 className="font-display text-4xl text-text-primary">{room.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-secondary">
          {path?.platform ? <span className="rounded-full border border-border px-2 py-1">{path.platform}</span> : null}
          {room.difficulty ? <span className="rounded-full border border-border px-2 py-1">{room.difficulty}</span> : null}
          {room.completed_at ? <span className="rounded-full border border-border px-2 py-1">{room.completed_at}</span> : null}
          {(room.tags ?? []).map((tag: string) => (
            <span key={tag} className="rounded-full border border-border px-2 py-1 lowercase">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="surface-card p-6 prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary">
        <ReactMarkdown>{room.content || "No content available."}</ReactMarkdown>
      </div>
    </article>
  );
}
