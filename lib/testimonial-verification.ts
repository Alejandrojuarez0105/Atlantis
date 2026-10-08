// Solo servidor: confirmación por correo (doble opt-in) de los testimonios.
import "server-only";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

export const FROM = "Atlantis Tutorías <atlantis@aejhernandez.dev>";
export const CLIENT_EMAIL = "atlantis.tutorias@gmail.com";

// El enlace del correo caduca a las 48h; pasado eso hay que reenviar el
// testimonio.
const VERIFY_WINDOW_MS = 48 * 60 * 60 * 1000;
export const VERIFY_WINDOW_HOURS = VERIFY_WINDOW_MS / (60 * 60 * 1000);

// El token es un UUID (columna uuid en Supabase): cualquier otra cosa se
// descarta antes de llegar a la base de datos.
const TOKEN_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function windowStart() {
  return new Date(Date.now() - VERIFY_WINDOW_MS).toISOString();
}

// Solo lectura: la página la usa para no mostrar el botón con un enlace
// caducado o ya usado.
export async function isPendingToken(token: string): Promise<boolean> {
  if (!TOKEN_RE.test(token)) return false;
  const { count, error } = await supabaseAdmin
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("verification_token", token)
    .gte("created_at", windowStart());
  if (error) {
    console.error("Error checking verification token", error);
    return false;
  }
  return (count ?? 0) > 0;
}

// Marca el testimonio como verificado y anula el token en un solo UPDATE, así
// dos clics seguidos no confirman (ni avisan al cliente) dos veces. Solo
// entonces se avisa al cliente: un correo ajeno nunca llega a su bandeja.
export async function confirmTestimonial(token: string): Promise<boolean> {
  if (!TOKEN_RE.test(token)) return false;

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .update({
      verified: true,
      verified_at: new Date().toISOString(),
      verification_token: null,
    })
    .eq("verification_token", token)
    .gte("created_at", windowStart())
    .select("name, email, subject, rating, message")
    .maybeSingle();

  if (error) {
    console.error("Error confirming testimonial", error);
    return false;
  }
  if (!data) return false;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: mailError } = await resend.emails.send({
    from: FROM,
    to: CLIENT_EMAIL,
    replyTo: data.email,
    subject: `Nuevo testimonio confirmado — ${data.name}`,
    text: `Nombre: ${data.name}\nMateria: ${data.subject}\nCalificación: ${data.rating}/5\nReseña: ${data.message}\n\nEl correo ya está confirmado. Para publicarlo, cambia "approved" a true en Supabase.`,
  });
  if (mailError) {
    console.error("Error sending testimonial notification", mailError);
  }

  return true;
}
