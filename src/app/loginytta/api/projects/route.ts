import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin.from("projects").select("*").order("order_index", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      title: payload.title,
      description: payload.description || null,
      type: payload.type || null,
      status: payload.status || null,
      url: payload.url || null,
      is_public: payload.is_public ?? true,
      order_index: payload.order_index ?? 0,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
