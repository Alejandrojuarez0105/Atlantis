import { createHmac } from "crypto";
import type { NextRequest } from "next/server";

// Máximo de envíos por IP y por hora, sumado al límite por correo/teléfono de
// cada ruta. Más holgado que ese (2) porque varias personas pueden compartir
// IP (wifi de la universidad, datos móviles detrás del mismo NAT).
export const IP_RATE_LIMIT = 5;

// Honeypot: los formularios tienen un campo "website" invisible para personas.
// Los bots que rellenan todos los campos lo completan y se delatan.
export function isHoneypotFilled(body: Record<string, unknown>) {
  return String(body.website ?? "").trim() !== "";
}

// La IP no se guarda tal cual (es un dato personal): se guarda un HMAC, que
// sirve para contar envíos de la misma IP pero no para recuperarla. La clave
// es la service_role key porque ya es secreta y solo existe en el servidor;
// si se rota, los hashes viejos dejan de coincidir, lo cual no importa porque
// el límite solo mira la última hora.
export function getIpHash(req: NextRequest): string | null {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(ip)
    .digest("hex");
}
