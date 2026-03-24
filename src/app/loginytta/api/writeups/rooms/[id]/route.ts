import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const tags =
    typeof body.tags === "string"
      ? body.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : body.tags || [];

  const payload = {
    section_id: body.section_id,
    title: body.title,
    content: body.content || "",
    difficulty: body.difficulty || "Easy",
    status: body.status || "in-progress",
    is_public: body.is_public ?? false,
    os: body.os || null,
    tags,
    order_index: body.order_index || 0,
  };

  const { data, error } = await supabaseAdmin
    .from("wu_rooms")
    .update(payload)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, data });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { error } = await supabaseAdmin.from("wu_rooms").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
