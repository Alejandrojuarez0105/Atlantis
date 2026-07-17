"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";

const subjects = [
  "Matemática I",
  "Matemática II",
  "Matemática Discreta",
  "Matemática Numérica",
  "Estadística I",
  "Lenguajes de Programación",
];
const loopSubjects = [...subjects, ...subjects];

function LogoGraphic() {
  const { theme, mounted } = useTheme();
  const logoSrc =
    mounted && theme === "dark" ? "/logo-icon-dark.png" : "/logo-icon.png";

  return (
    <div className="absolute top-20 right-16 lg:right-55 -z-10 overflow-hidden pointer-events-none hidden lg:block w-[54%] h-[430px]">
      <Image
        src={logoSrc}
        alt=""
        fill
        sizes="54vw"
        priority
        className="object-contain object-right-top"
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <LogoGraphic />

      <div className="px-6 md:px-12 lg:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-[var(--accent-text)] max-w-2xl md:max-w-none"
        >
          <span className="md:whitespace-nowrap">Impulsa tu éxito académico</span>
          <br className="hidden md:block" />
          <span className="md:whitespace-nowrap"> con tutorías personalizadas</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 text-3xl md:text-5xl font-bold text-[var(--text)] max-w-2xl"
        >
          Aprende con confianza y alcanza tus metas académicas
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
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
