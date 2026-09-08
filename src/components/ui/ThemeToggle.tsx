"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

type Preference = "dark" | "light" | "system";

function applyTheme(preference: Preference) {
  const theme = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f8f6ef" : "#0a0a0a");
}

export default function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onSystemChange = () => {
      if (document.documentElement.dataset.themePreference === "system") applyTheme("system");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "djcode-theme" || event.key === null) {
        applyTheme(event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system");
      }
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("djcode-theme", next); } catch { /* Theme still works when storage is blocked. */ }
  }

  // CSS chooses the visible icon and accessible name before hydration, exactly
  // as it chooses the page palette. Server and client markup stay identical.
  return (
    <button type="button" onClick={toggleTheme} className="theme-toggle">
      <span className="theme-show-dark"><Sun size={17} aria-hidden="true" /><span className="sr-only">Switch to light theme</span></span>
      <span className="theme-show-light"><Moon size={17} aria-hidden="true" /><span className="sr-only">Switch to dark theme</span></span>
    </button>
  );
}
