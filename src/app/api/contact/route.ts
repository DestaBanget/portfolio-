import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL;
    if (!apiKey || !toEmail) {
      return Response.json({ error: "Contact service is not configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { name, email, message } = await req.json();

    await resend.emails.send({
      from: "portfolio@yourdomain.com",
      to: toEmail,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}
