import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      title: payload.title,
      description: payload.description || null,
      type: payload.type || null,
      status: payload.status || null,
      url: payload.url || null,
      is_public: payload.is_public ?? true,
      order_index: payload.order_index ?? 0,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { error } = await supabaseAdmin.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
