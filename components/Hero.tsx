"use client";

import { motion } from "motion/react";

const subjects = [
  "Matemática I",
  "Matemática II",
  "Matemática Discreta",
  "Matemática Numérica",
  "Estadística I",
];
const loopSubjects = [...subjects, ...subjects];

const waveLayers = [
  { color: "var(--wave-1)", dx: 0, dy: 0, width: 100, opacity: 0.95 },
  { color: "var(--wave-2)", dx: 70, dy: -50, width: 80, opacity: 0.7 },
  { color: "var(--wave-3)", dx: 140, dy: -100, width: 65, opacity: 0.6 },
  { color: "var(--wave-4)", dx: 210, dy: -150, width: 50, opacity: 0.5 },
];

const wavePath =
  "M 1300 -100 C 900 150, 1050 350, 650 450 C 250 550, 400 750, -100 950";

function WaveGraphic() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden lg:block">
      <svg
        viewBox="0 0 1200 900"
        className="absolute right-0 top-0 h-full w-[70%]"
        preserveAspectRatio="xMaxYMid slice"
        aria-hidden="true"
      >
        {waveLayers.map((layer, i) => (
          <motion.path
            key={i}
            d={wavePath}
            stroke={layer.color}
            strokeWidth={layer.width}
            strokeLinecap="round"
            fill="none"
            opacity={layer.opacity}
            transform={`translate(${layer.dx} ${layer.dy})`}
            animate={{ x: [0, 40, 0] }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      <WaveGraphic />

      <div className="px-6 md:px-12 lg:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-[var(--accent-text)] max-w-2xl"
        >
          Impulsa tu éxito académico con tutorías personalizadas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-2xl md:text-4xl font-bold text-[var(--text)] max-w-2xl"
        >
          Aprende con confianza y alcanza tus metas académicas
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap text-xl md:text-3xl font-semibold text-[var(--text-muted)]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {loopSubjects.map((subject, i) => (
            <span key={i} className="flex items-center gap-10">
              {subject}
              <span className="text-[var(--border)]">•</span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
