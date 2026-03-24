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
    .insert(payload)
    .select("*")
    .single();

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, data });
}
