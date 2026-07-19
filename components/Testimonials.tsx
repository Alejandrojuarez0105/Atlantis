"use client";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

type Testimonial = {
  name: string;
  subject: string;
  rating: number;
  message: string;
};

const subjects = [
  "Matemática I",
  "Matemática II",
  "Matemática Numérica",
  "Matemática Discreta",
  "Estadística I",
  "Lenguajes de Programación",
  "Marketing Estratégico y Operativo",
];

function Star() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 text-[var(--on-band)] md:h-5 md:w-5"
      fill="currentColor"
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          aria-label={`${i + 1} estrellas`}
          className="p-0.5"
        >
          <svg
            viewBox="0 0 20 20"
            className={`h-6 w-6 ${
              i < value ? "text-amber-400" : "text-gray-400"
            }`}
            fill="currentColor"
          >
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85L10 1.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Testimonio anterior" : "Siguiente testimonio"}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const emptyReviewForm = {
  nombre: "",
  email: "",
  materia: "",
  rating: 0,
  resena: "",
  consentimiento: false,
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(0);
  const total = items.length;
  const visibleCount = Math.min(3, total);
  const canPage = total > 3;
  const visible = Array.from(
    { length: visibleCount },
    (_, i) => items[(start + i) % total],
  );

  const prev = () => setStart((s) => (s - 1 + total) % total);
  const next = () => setStart((s) => (s + 1) % total);

  const [open, setOpen] = useState(false);
  const [portalMounted, setPortalMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [reviewStatus, setReviewStatus] = useState<
    "idle" | "sending" | "error"
  >("idle");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonios");
        const data = await res.json();
        if (active) setItems(data.testimonials ?? []);
      } catch {
        // deja la lista vacía; el estado vacío ya lo maneja la UI
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setReviewForm(emptyReviewForm);
      setReviewStatus("idle");
      setReviewError("");
    }, 300);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setReviewStatus("sending");
    setReviewError("");

    try {
      const res = await fetch("/api/testimonio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewForm.nombre,
          email: reviewForm.email,
          subject: reviewForm.materia,
          rating: reviewForm.rating,
          message: reviewForm.resena,
          consentimiento: reviewForm.consentimiento,
        }),
      });

      if (res.status === 429) {
        setReviewStatus("error");
        setReviewError(
          "Has alcanzado el límite de 2 testimonios por hora. Intenta de nuevo más tarde.",
        );
        return;
      }
      if (!res.ok) {
        throw new Error("request-failed");
      }

      setReviewStatus("idle");
      setSubmitted(true);
    } catch {
      setReviewStatus("error");
      setReviewError("No pudimos enviar tu testimonio. Intenta de nuevo.");
    }
  };

  return (
    <section
      id="testimonios"
      className="px-6 pb-16 pt-4 md:px-12 md:pb-24 md:pt-6 lg:px-16"
    >
      <h2 className="text-center text-2xl font-bold text-[var(--text)] md:text-4xl">
        Testimonios
      </h2>

      {!loading && total === 0 && (
        <p className="mx-auto mt-10 max-w-md text-center text-[var(--text-muted)]">
          Todavía no hay testimonios publicados. ¡Sé el primero en escribir
          uno!
        </p>
      )}

      {total > 0 && (
        <>
          <div className="mx-auto mt-10 flex max-w-7xl items-center gap-2 md:gap-6">
            {canPage && <ArrowButton direction="prev" onClick={prev} />}

            <div className="grid flex-1 gap-6 md:grid-cols-3">
              {visible.map((t, i) => (
                <motion.div
                  key={`${t.name}-${start}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-2xl bg-[var(--bg-band)] p-6 text-[var(--on-band)] md:p-10 ${
                    i > 0 ? "hidden md:block" : ""
                  }`}
                >
                  <p className="font-bold md:text-xl">{t.name}</p>
                  <p className="text-sm text-[var(--on-band-muted)] md:text-base">
                    {t.subject}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed md:mt-6 md:text-lg">
                    {t.message}
                  </p>
                  <div className="mt-4 flex gap-1 md:mt-6">
                    {Array.from({ length: t.rating }).map((_, starIndex) => (
                      <Star key={starIndex} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {canPage && <ArrowButton direction="next" onClick={next} />}
          </div>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            {total} testimonios
          </p>
        </>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-[var(--bg-input)] px-6 py-3 text-base font-semibold text-[var(--bg-band)] transition-opacity hover:opacity-90"
        >
          Escribe tu testimonio
        </button>
      </div>

      {portalMounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="Escribe tu testimonio"
          >
            <div
              className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[var(--bg-card)] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-[var(--on-accent)]">
                    ✓
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text)]">
                    ¡Gracias!
                  </h3>
                  <p className="text-[var(--text-muted)]">
                    Revisaremos tu reseña antes de publicarla.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-2 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[var(--text)]">
                    Escribe tu testimonio
                  </h3>
                  <form
                    onSubmit={handleReviewSubmit}
                    className="flex flex-col gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Nombre"
                      required
                      value={reviewForm.nombre}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          nombre: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-[var(--bg-band)] placeholder:text-gray-500 outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
                    />
                    <input
                      type="email"
                      placeholder="Correo (no se publica, solo para confirmarte)"
                      required
                      value={reviewForm.email}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-[var(--bg-band)] placeholder:text-gray-500 outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
                    />
                    <select
                      aria-label="Materia"
                      required
                      value={reviewForm.materia}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          materia: e.target.value,
                        }))
                      }
                      className={`w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)] ${
                        reviewForm.materia
                          ? "text-[var(--bg-band)]"
                          : "!text-gray-500"
                      }`}
                    >
                      <option value="" disabled className="text-black">
                        Materia
                      </option>
                      {subjects.map((subject) => (
                        <option
                          key={subject}
                          value={subject}
                          className="text-black"
                        >
                          {subject}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-[var(--text-muted)]">
                        Calificación
                      </span>
                      <StarPicker
                        value={reviewForm.rating}
                        onChange={(rating) =>
                          setReviewForm((f) => ({ ...f, rating }))
                        }
                      />
                    </div>
                    <textarea
                      placeholder="Tu reseña"
                      required
                      rows={4}
                      value={reviewForm.resena}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          resena: e.target.value,
                        }))
                      }
                      className="w-full resize-none rounded-lg bg-[var(--bg-input)] px-4 py-3 text-[var(--bg-band)] placeholder:text-gray-500 outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
                    />

                    <label className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <input
                        type="checkbox"
                        required
                        checked={reviewForm.consentimiento}
                        onChange={(e) =>
                          setReviewForm((f) => ({
                            ...f,
                            consentimiento: e.target.checked,
                          }))
                        }
                        className="mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
                      />
                      <span>
                        He leído y acepto la{" "}
                        <a
                          href="/privacidad"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-[var(--accent-text)]"
                        >
                          Política de Privacidad
                        </a>
                        .
                      </span>
                    </label>

                    {reviewStatus === "error" && (
                      <p className="text-sm text-red-500">{reviewError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--accent-text)]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={
                          reviewForm.rating === 0 ||
                          reviewStatus === "sending"
                        }
                        className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {reviewStatus === "sending" ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
