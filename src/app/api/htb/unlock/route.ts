import { NextResponse } from "next/server";

interface UnlockPayload {
  password?: string;
}

export async function POST(request: Request) {
  const { password }: UnlockPayload = await request.json();
  const expectedPassword = process.env.HTB_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json({ error: "HTB password is not configured" }, { status: 500 });
  }

  if (!password || password !== expectedPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
