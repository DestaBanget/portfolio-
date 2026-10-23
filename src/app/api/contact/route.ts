import { Resend } from "resend";

const MAX_MESSAGE_LENGTH = 5000;

function readField(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;
  if (!apiKey || !toEmail) {
    return Response.json({ error: "Contact service is not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = readField(body, "name");
  const email = readField(body, "email");
  const message = readField(body, "message");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message || message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }

  // Resend only sends from a verified domain; onboarding@resend.dev works for the account owner's inbox.
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
    to: toEmail,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return Response.json({ error: "Failed to send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
