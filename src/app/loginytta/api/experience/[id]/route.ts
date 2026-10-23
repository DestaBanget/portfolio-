import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const { data, error } = await supabaseAdmin
    .from("experience")
    .update({
      company: payload.company,
      role: payload.role,
      type: payload.type,
      period_start: payload.period_start,
      period_end: payload.period_end || null,
      location: payload.location || null,
      description: payload.description || null,
      skills: payload.skills || [],
      order_index: payload.order_index ?? 0,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { error } = await supabaseAdmin.from("experience").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
