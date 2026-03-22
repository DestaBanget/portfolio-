import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { WriteupTree } from "@/components/WriteupTree";

export default async function WriteupsPage() {
  const isAdmin = isAdminAuthenticated();
  const db = isAdmin ? supabaseAdmin : supabase;

  const [{ data: paths }, { data: sections }, { data: rooms }] = await Promise.all([
    db.from("wu_paths").select("id,title,platform,order_index").order("order_index", { ascending: true }),
    db.from("wu_sections").select("id,path_id,title,order_index").order("order_index", { ascending: true }),
    db
      .from("wu_rooms")
      .select("id,section_id,title,content,difficulty,status,is_public,order_index")
      .order("order_index", { ascending: true }),
  ]);

  const visibleRooms = (rooms ?? []).filter((room) => (isAdmin ? true : room.is_public));

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-text-tertiary">Writeups</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Knowledge Base</h1>
      </header>

      <hr className="section-divider" />

      <WriteupTree paths={paths ?? []} sections={sections ?? []} rooms={visibleRooms} />
    </section>
  );
}
