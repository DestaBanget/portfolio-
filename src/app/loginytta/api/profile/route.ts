import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin.from("profile").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const update = {
    name: payload.name ?? null,
    cv_url: payload.cv_url ?? null,
    linkedin_url: payload.linkedin_url ?? null,
    github_url: payload.github_url ?? null,
    email: payload.email ?? null,
    whatsapp: payload.whatsapp ?? null,
    contact_note: payload.contact_note ?? null,
    bio: payload.bio ?? null,
    terminal_lines: payload.terminal_lines ?? [],
  };

  const { data, error } = await supabaseAdmin
    .from("profile")
    .upsert({ id: 1, ...update }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
