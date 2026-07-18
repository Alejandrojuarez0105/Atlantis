import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <span className="font-mono text-xs tracking-widest text-[var(--accent-text)]">
        // error 404 — ruta no encontrada
      </span>
      <h1 className="mt-4 text-7xl font-bold text-[var(--text)] md:text-8xl">
        404
      </h1>
      <h2 className="mt-4 text-xl font-bold text-[var(--text)] md:text-2xl">
        Esta página no existe
      </h2>
      <p className="mt-3 max-w-md text-[var(--text-muted)]">
        La dirección que buscas no está aquí. Puede que el enlace sea
        incorrecto o que la página se haya movido.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90"
      >
        ← Volver al inicio
      </Link>
    </main>
  );
}
