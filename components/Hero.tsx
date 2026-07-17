"use client";

import { motion } from "motion/react";

const subjects = [
  "Matemática I",
  "Matemática II",
  "Matemática Discreta",
  "Matemática Numérica",
  "Estadística I",
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <div className="absolute inset-y-0 right-0 w-1/2 -z-10 pointer-events-none hidden md:block">
        <motion.div
          className="absolute top-1/4 right-[-15%] w-[26rem] h-[26rem] rounded-[45%] bg-[var(--accent)]/90"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/3 right-[5%] w-[20rem] h-[20rem] rounded-[45%] bg-[var(--text-muted)]/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-[var(--accent-text)] max-w-xl"
        >
          Impulsa tu éxito académico con tutorías personalizadas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-2xl md:text-3xl font-bold text-[var(--text)] max-w-xl"
        >
          Aprende con confianza y alcanza tus metas académicas
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-muted)]"
        >
          {subjects.map((subject, i) => (
            <span key={subject} className="flex items-center gap-2">
              {i > 0 && <span className="text-[var(--border)]">•</span>}
              {subject}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
