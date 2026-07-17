"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  const isDark = mounted && theme === "dark";
  const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-12 h-12 text-[var(--text-muted)] border border-[var(--border)] rounded-lg hover:text-[var(--accent-text)] transition-colors bg-[var(--bg-card)]"
    >
      {isDark ? (
        <Sun size={22} aria-hidden="true" />
      ) : (
        <Moon size={22} aria-hidden="true" />
      )}
    </button>
  );
}
