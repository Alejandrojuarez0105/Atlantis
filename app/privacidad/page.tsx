import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — Atlantis",
  description:
    "Cómo Atlantis Tutorías Académicas recopila, usa y protege tus datos personales.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-[var(--text)] md:text-xl">
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-[var(--text-muted)]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <main className="px-6 pb-24 pt-32 md:px-12 md:pt-44 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-widest text-[var(--accent-text)]">
          // legal
        </span>
        <h1 className="mt-2 text-3xl font-bold text-[var(--text)] md:text-4xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Última actualización: 19 de julio de 2026.
        </p>

        <Section title="Responsable del tratamiento">
          <p>
            Atlantis Tutorías Académicas, servicio de tutorías particulares en
            Santander, Cantabria. Puedes contactarnos en{" "}
            <a
              href="mailto:atlantis.tutorias@gmail.com"
              className="underline hover:text-[var(--accent-text)]"
            >
              atlantis.tutorias@gmail.com
            </a>{" "}
            para cualquier consulta sobre tus datos.
          </p>
        </Section>

        <Section title="Qué datos recopilamos">
          <p>
            <strong className="text-[var(--text)]">
              Formulario de reserva:
            </strong>{" "}
            nombre, correo electrónico, código de país y teléfono, materia de
            interés, fecha y hora solicitadas, y una nota opcional.
          </p>
          <p>
            <strong className="text-[var(--text)]">
              Formulario de testimonio:
            </strong>{" "}
            nombre, correo electrónico, materia, calificación y el texto de
            tu reseña.
          </p>
        </Section>

        <Section title="Para qué usamos tus datos">
          <p>
            Únicamente para gestionar tu solicitud de reserva o tu
            testimonio: responderte por correo o WhatsApp, coordinar la
            clase, y — si apruebas tu testimonio para publicación — mostrar
            tu nombre, materia, calificación y reseña en la sección de
            Testimonios del sitio. Tu correo electrónico nunca se publica.
          </p>
        </Section>

        <Section title="Base legal">
          <p>
            Tu consentimiento explícito, otorgado al marcar la casilla de
            aceptación antes de enviar cada formulario.
          </p>
        </Section>

        <Section title="Con quién se comparten">
          <p>
            No vendemos ni compartimos tus datos con fines publicitarios.
            Usamos dos proveedores como encargados del tratamiento para
            operar el sitio: Supabase (almacenamiento de la base de datos) y
            Resend (envío de los correos de confirmación y aviso). Ninguno
            de los dos usa tus datos para fines propios.
          </p>
        </Section>

        <Section title="Cuánto tiempo los conservamos">
          <p>
            Mientras sea necesario para gestionar tu solicitud. Puedes pedir
            que eliminemos tus datos en cualquier momento escribiendo a{" "}
            <a
              href="mailto:atlantis.tutorias@gmail.com"
              className="underline hover:text-[var(--accent-text)]"
            >
              atlantis.tutorias@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="Tus derechos">
          <p>
            Tienes derecho a acceder, rectificar o eliminar tus datos, y a
            oponerte a su tratamiento. Para ejercer cualquiera de estos
            derechos, escríbenos por correo y atenderemos tu solicitud lo
            antes posible.
          </p>
        </Section>

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
