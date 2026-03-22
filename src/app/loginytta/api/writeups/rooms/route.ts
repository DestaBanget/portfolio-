import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin.from("wu_rooms").select("*").order("order_index", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const { data, error } = await supabaseAdmin
    .from("wu_rooms")
    .insert({
      section_id: payload.section_id,
      title: payload.title,
      content: payload.content || null,
      difficulty: payload.difficulty || null,
      status: payload.status || "in-progress",
      is_public: payload.is_public ?? false,
      os: payload.os || null,
      retired: payload.retired ?? false,
      tags: payload.tags || [],
      completed_at: payload.completed_at || null,
      order_index: payload.order_index ?? 0,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
