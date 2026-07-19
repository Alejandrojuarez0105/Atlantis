import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Atlantis Tutorías <atlantis@aejhernandez.dev>";
const CLIENT_EMAIL = "atlantis.tutorias@gmail.com";
const RATE_LIMIT = 2;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const rating = Number(body.rating ?? 0);
  const message = String(body.message ?? "").trim();
  const consentimiento = body.consentimiento === true;

  if (!name || !email || !subject || !message || !rating) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }
  if (!consentimiento) {
    return NextResponse.json({ error: "missing-consent" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "invalid-rating" }, { status: 400 });
  }

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count, error: countError } = await supabaseAdmin
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  if (countError) {
    console.error("Error checking testimonial rate limit", countError);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  const { error: insertError } = await supabaseAdmin.from("testimonials").insert({
    name,
    email,
    subject,
    rating,
    message,
  });

  if (insertError) {
    console.error("Error inserting testimonial", insertError);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: CLIENT_EMAIL,
      subject: "¡Gracias por tu testimonio! - Atlantis",
      text: `¡Hola ${name}!\n\nRecibimos tu testimonio sobre ${subject}. Lo revisaremos antes de publicarlo en la página.\n\n— Atlantis Tutorías Académicas`,
    });

    await resend.emails.send({
      from: FROM,
      to: CLIENT_EMAIL,
      replyTo: email,
      subject: `Nuevo testimonio — ${name}`,
      text: `Nombre: ${name}\nMateria: ${subject}\nCalificación: ${rating}/5\nReseña: ${message}`,
    });
  } catch (err) {
    console.error("Error sending testimonial emails", err);
  }

  return NextResponse.json({ ok: true });
}
