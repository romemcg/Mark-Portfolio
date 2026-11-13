"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light");
  }, []);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  }
  return (
    <button onClick={toggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="grid h-10 w-10 place-items-center rounded-full border border-line/20 text-lg hover:bg-ink/10 transition">
      <span aria-hidden>{theme === "light" ? "☾" : "☀"}</span>
    </button>
  );
}
