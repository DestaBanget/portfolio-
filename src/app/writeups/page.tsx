import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { WriteupTree } from "@/components/WriteupTree";

export default async function WriteupsPage() {
  const isAdmin = isAdminAuthenticated();
  const db = isAdmin ? supabaseAdmin : supabase;

  const [{ data: sections }, { data: rooms }] = await Promise.all([
    db.from("wu_sections").select("id,title,platform,order_index_global").order("order_index_global", { ascending: true }),
    db
      .from("wu_rooms")
      .select("id,section_id,title,content,difficulty,status,is_public,order_index")
      .order("order_index", { ascending: true }),
  ]);

  const visibleRooms = (rooms ?? []).filter((room) => (isAdmin ? true : room.is_public));

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="font-body text-xs uppercase tracking-widest text-text-tertiary">Writeups</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Knowledge Base</h1>
      </header>

      <hr className="section-divider" />

      <WriteupTree sections={sections ?? []} rooms={visibleRooms} />
    </section>
  );
}
