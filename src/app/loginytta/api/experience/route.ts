import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin.from("experience").select("*").order("order_index", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await req.json();
  const { data, error } = await supabaseAdmin
    .from("experience")
    .insert({
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
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
