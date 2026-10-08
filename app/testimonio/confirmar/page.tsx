import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  confirmTestimonial,
  isPendingToken,
} from "@/lib/testimonial-verification";

export const metadata: Metadata = {
  title: "Confirma tu testimonio — Atlantis",
  robots: { index: false, follow: false },
};

// Abrir el enlace no confirma nada: hay que pulsar el botón (un POST). Algunos
// correos (Outlook, antivirus) abren solos los enlaces para revisarlos, y si
// bastara con abrirlo confirmarían testimonios que nadie confirmó.
async function confirm(formData: FormData) {
  "use server";
  const ok = await confirmTestimonial(String(formData.get("token") ?? ""));
  redirect(`/testimonio/confirmar?estado=${ok ? "confirmado" : "invalido"}`);
}

const buttonClass =
  "mt-8 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90";

export default async function ConfirmarTestimonioPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; estado?: string }>;
}) {
  const { token = "", estado } = await searchParams;

  let view: "pendiente" | "confirmado" | "invalido";
  if (estado === "confirmado") view = "confirmado";
  else if (estado !== "invalido" && (await isPendingToken(token)))
    view = "pendiente";
  else view = "invalido";

  const content = {
    pendiente: {
      kicker: "// confirma tu testimonio",
      title: "Un último paso",
      body: "Pulsa el botón para confirmar que este correo es tuyo. Después revisaremos tu testimonio antes de publicarlo.",
    },
    confirmado: {
      kicker: "// testimonio confirmado",
      title: "¡Gracias!",
      body: "Tu testimonio quedó confirmado. Lo revisaremos y aparecerá en la página una vez aprobado.",
    },
    invalido: {
      kicker: "// enlace no válido",
      title: "Enlace caducado o ya usado",
      body: "Este enlace de confirmación no es válido, caducó o ya se utilizó. Si tu testimonio no llegó a confirmarse, vuelve a enviarlo desde la página.",
    },
  }[view];

  return (
    <main
      id="contenido"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      <span className="font-mono text-xs tracking-widest text-[var(--accent-text)]">
        {content.kicker}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-[var(--text)] md:text-4xl">
        {content.title}
      </h1>
      <p className="mt-3 max-w-md text-[var(--text-muted)]">{content.body}</p>

      {view === "pendiente" ? (
        <form action={confirm}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={buttonClass}>
            Confirmar testimonio
          </button>
        </form>
      ) : (
        <Link href="/#testimonios" className={buttonClass}>
          ← Volver al inicio
        </Link>
      )}
    </main>
  );
}
