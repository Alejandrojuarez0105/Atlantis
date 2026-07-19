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

function isValidPhone(phone: string) {
  return /^[0-9\s-]{6,15}$/.test(phone);
}

function isValidCountryCode(code: string) {
  return /^\+[0-9]{1,4}$/.test(code);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const email = String(body.email ?? "").trim();
  const countryCode = String(body.countryCode ?? "").trim();
  const telefono = String(body.telefono ?? "").trim();
  const materia = String(body.materia ?? "").trim();
  const fecha = String(body.fecha ?? "").trim();
  const hora = String(body.hora ?? "").trim();
  const nota = String(body.nota ?? "").trim();
  const consentimiento = body.consentimiento === true;

  if (
    !nombre ||
    !email ||
    !countryCode ||
    !telefono ||
    !materia ||
    !fecha ||
    !hora
  ) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }
  if (!consentimiento) {
    return NextResponse.json({ error: "missing-consent" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  if (!isValidCountryCode(countryCode)) {
    return NextResponse.json(
      { error: "invalid-country-code" },
      { status: 400 },
    );
  }
  if (!isValidPhone(telefono)) {
    return NextResponse.json({ error: "invalid-phone" }, { status: 400 });
  }

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const [emailCount, phoneCount] = await Promise.all([
    supabaseAdmin
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since),
    supabaseAdmin
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("country_code", countryCode)
      .eq("telefono", telefono)
      .gte("created_at", since),
  ]);

  if (emailCount.error || phoneCount.error) {
    console.error(
      "Error checking reservation rate limit",
      emailCount.error,
      phoneCount.error,
    );
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
  if (
    (emailCount.count ?? 0) >= RATE_LIMIT ||
    (phoneCount.count ?? 0) >= RATE_LIMIT
  ) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  const { error: insertError } = await supabaseAdmin
    .from("reservations")
    .insert({
      nombre,
      email,
      country_code: countryCode,
      telefono,
      materia,
      fecha,
      hora,
      nota: nota || null,
    });

  if (insertError) {
    console.error("Error inserting reservation", insertError);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }

  const summary = [
    `Nombre: ${nombre}`,
    `Teléfono: ${countryCode} ${telefono}`,
    `Materia: ${materia}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
    nota && `Nota: ${nota}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: CLIENT_EMAIL,
      subject: "Hemos recibido tu solicitud de reserva - Atlantis",
      text: `¡Hola ${nombre}!\n\nRecibimos tu solicitud de reserva. Te responderemos lo antes posible.\n\n${summary}\n\n— Atlantis Tutorías Académicas`,
    });

    await resend.emails.send({
      from: FROM,
      to: CLIENT_EMAIL,
      replyTo: email,
      subject: `Nueva solicitud de reserva — ${nombre}`,
      text: summary,
    });
  } catch (err) {
    console.error("Error sending reservation emails", err);
  }

  return NextResponse.json({ ok: true });
}
