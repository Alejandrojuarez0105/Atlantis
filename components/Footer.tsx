import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-band)] px-6 py-6 text-center text-sm text-[var(--on-band-muted)] md:px-12 lg:px-16">
      <p>
        © {year} Atlantis Tutorías Académicas
        <span aria-hidden="true"> · </span>
        <Link
          href="/privacidad"
          className="text-[var(--on-band)] underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          Aviso de privacidad
        </Link>
      </p>
    </footer>
  );
}
