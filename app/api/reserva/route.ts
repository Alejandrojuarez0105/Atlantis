import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { IP_RATE_LIMIT, getIpHash, isHoneypotFilled } from "@/lib/spam-guard";
import { MAX_LENGTH, SUBJECTS, TIME_SLOTS } from "@/lib/form-options";

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

// Fecha "YYYY-MM-DD" real, desde hoy (hora de España) hasta un año adelante.
function isValidDate(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const date = new Date(`${fecha}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== fecha
  ) {
    return false;
  }
  const madridDay = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);
  const now = new Date();
  const inOneYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  return fecha >= madridDay(now) && fecha <= madridDay(inOneYear);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  // Bot: se responde como si todo hubiera ido bien para que no lo note, pero
  // no se guarda nada ni se manda ningún correo.
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ ok: true });
  }

  // Una sola línea: el nombre va en el asunto del correo de aviso.
  const nombre = String(body.nombre ?? "").replace(/\s+/g, " ").trim();
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
  if (
    nombre.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    nota.length > MAX_LENGTH.note ||
    !SUBJECTS.includes(materia) ||
    !TIME_SLOTS.includes(hora)
  ) {
    return NextResponse.json({ error: "invalid-fields" }, { status: 400 });
  }
  if (!isValidDate(fecha)) {
    return NextResponse.json({ error: "invalid-date" }, { status: 400 });
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
  const ipHash = getIpHash(req);
  const [emailCount, phoneCount, ipCount] = await Promise.all([
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
    ipHash
      ? supabaseAdmin
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", since)
      : { count: 0, error: null },
  ]);

  if (emailCount.error || phoneCount.error || ipCount.error) {
    console.error(
      "Error checking reservation rate limit",
      emailCount.error,
      phoneCount.error,
      ipCount.error,
    );
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
  if (
    (emailCount.count ?? 0) >= RATE_LIMIT ||
    (phoneCount.count ?? 0) >= RATE_LIMIT ||
    (ipCount.count ?? 0) >= IP_RATE_LIMIT
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
      ip_hash: ipHash,
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

  // La confirmación va a la dirección que escribió quien envió el formulario,
  // que puede no ser suya: solo lleva datos validados contra una lista (nada
  // de texto libre como nombre o nota), para que nadie pueda usar el sitio
  // para mandar mensajes arbitrarios a terceros desde nuestro dominio.
  const confirmation = [
    `Materia: ${materia}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
  ].join("\n");

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: CLIENT_EMAIL,
      subject: "Hemos recibido tu solicitud de reserva - Atlantis",
      text: `¡Hola!\n\nRecibimos tu solicitud de reserva. Te responderemos lo antes posible.\n\n${confirmation}\n\n— Atlantis Tutorías Académicas`,
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
