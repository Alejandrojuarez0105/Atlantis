import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { IP_RATE_LIMIT, getIpHash, isHoneypotFilled } from "@/lib/spam-guard";
import { MAX_LENGTH, SUBJECTS } from "@/lib/form-options";
import {
  CLIENT_EMAIL,
  FROM,
  VERIFY_WINDOW_HOURS,
} from "@/lib/testimonial-verification";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Bot: se responde como si todo hubiera ido bien para que no lo note, pero
  // no se guarda nada ni se manda ningún correo.
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ ok: true });
  }

  // Una sola línea: el nombre va en el asunto del correo de aviso.
  const name = String(body.name ?? "").replace(/\s+/g, " ").trim();
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
  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    message.length > MAX_LENGTH.review ||
    !SUBJECTS.includes(subject)
  ) {
    return NextResponse.json({ error: "invalid-fields" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "invalid-rating" }, { status: 400 });
  }

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const ipHash = getIpHash(req);
  const [emailCount, ipCount] = await Promise.all([
    supabaseAdmin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since),
    ipHash
      ? supabaseAdmin
          .from("testimonials")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", since)
      : { count: 0, error: null },
  ]);

  if (emailCount.error || ipCount.error) {
    console.error(
      "Error checking testimonial rate limit",
      emailCount.error,
      ipCount.error,
    );
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
  if (
    (emailCount.count ?? 0) >= RATE_LIMIT ||
    (ipCount.count ?? 0) >= IP_RATE_LIMIT
  ) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  // Se guarda sin verificar (verified = false por defecto en la tabla). Al
  // cliente no se le avisa hasta que la persona confirme el correo: eso pasa
  // en /testimonio/confirmar (lib/testimonial-verification.ts).
  const token = randomUUID();
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("testimonials")
    .insert({
      name,
      email,
      subject,
      rating,
      message,
      ip_hash: ipHash,
      verification_token: token,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Error inserting testimonial", insertError);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }

  // El correo va a la dirección que escribió quien envió el formulario, que
  // puede no ser suya: sin texto libre (solo la materia, validada contra la
  // lista), para que nadie use el sitio para mandar mensajes a terceros.
  const confirmUrl = `${req.nextUrl.origin}/testimonio/confirmar?token=${token}`;
  const { error: mailError } = await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: CLIENT_EMAIL,
    subject: "Confirma tu testimonio - Atlantis",
    text: `¡Hola!\n\nRecibimos tu testimonio sobre ${subject}. Para que podamos revisarlo y publicarlo, confirma que este correo es tuyo abriendo este enlace:\n\n${confirmUrl}\n\nEl enlace caduca en ${VERIFY_WINDOW_HOURS} horas. Si no enviaste ningún testimonio, ignora este correo: no se publicará nada.\n\n— Atlantis Tutorías Académicas`,
  });

  // Sin el correo el testimonio nunca podría confirmarse: se borra para que
  // no cuente en el límite por hora y la persona pueda reintentar.
  if (mailError) {
    console.error("Error sending testimonial verification email", mailError);
    await supabaseAdmin.from("testimonials").delete().eq("id", inserted.id);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
