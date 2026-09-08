"use client";
import { useEffect } from "react";

/** Pause decorative CSS loops outside the viewport or when the tab is hidden. */
export default function AnimationBudget() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main section")];
    const visible = new Set<Element>();
    function sync() {
      sections.forEach(section => section.style.setProperty("--motion-state", visible.has(section) && !document.hidden ? "running" : "paused"));
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      sync();
    });
    sections.forEach(section => observer.observe(section));
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); sections.forEach(section => section.style.removeProperty("--motion-state")); };
  }, []);
  return null;
}
