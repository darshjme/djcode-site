"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

/* ---------- Shortcut data ---------- */
const SHORTCUTS = [
  { keys: ["Ctrl", "O"], action: "Toggle thinking display" },
  { keys: ["Ctrl", "P"], action: "PLAN / ACT mode" },
  { keys: ["Ctrl", "L"], action: "Clear screen" },
  { keys: ["Ctrl", "T"], action: "Toggle auto-accept" },
  { keys: ["Ctrl", "R"], action: "Rerun last command" },
  { keys: ["Ctrl", "K"], action: "Kill generation" },
  { keys: ["Escape"], action: "Cancel input" },
  { keys: ["/"], action: "Command picker" },
];

/* ---------- Keyboard layout rows ---------- */
const ROW_1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const ROW_2 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ROW_3 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_4 = [
  { label: "Ctrl", wide: true },
  { label: "Escape", wide: true },
  { label: "Space", extraWide: true },
  { label: "/", wide: false },
];

type KeyDef = string | { label: string; wide?: boolean; extraWide?: boolean };

function getLabel(k: KeyDef): string {
  return typeof k === "string" ? k : k.label;
}

function isHighlighted(
  keyLabel: string,
  hoveredShortcut: number | null
): boolean {
  if (hoveredShortcut === null) return false;
  const shortcut = SHORTCUTS[hoveredShortcut];
  return shortcut.keys.some(
    (k) => k.toUpperCase() === keyLabel.toUpperCase()
  );
}

/* ---------- Single key cap component ---------- */
function KeyCap({
  keyDef,
  highlighted,
  staggerIndex,
  isInView,
}: {
  keyDef: KeyDef;
  highlighted: boolean;
  staggerIndex: number;
  isInView: boolean;
}) {
  const label = getLabel(keyDef);
  const isWide =
    typeof keyDef === "object" && (keyDef.wide || keyDef.extraWide);
  const isExtraWide = typeof keyDef === "object" && keyDef.extraWide;

  return (
    <motion.div
      className={`
        relative flex items-center justify-center rounded-lg font-mono text-xs font-medium
        select-none cursor-default transition-all duration-150
        ${isExtraWide ? "col-span-4 min-w-[140px]" : isWide ? "col-span-2 min-w-[70px]" : "min-w-[40px]"}
        h-10
        ${
          highlighted
            ? "bg-gold/15 border-gold/60 text-gold shadow-[0_2px_16px_rgba(255,215,0,0.15)]"
            : "bg-white/[0.03] border-white/[0.08] text-text-dim"
        }
        border
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              transition: { delay: staggerIndex * 0.015, duration: 0.3 },
            }
          : {}
      }
      whileHover={{
        y: 2,
        boxShadow: "0 1px 4px rgba(255,215,0,0.1)",
        transition: { duration: 0.1 },
      }}
    >
      <span className="text-[11px]">{label}</span>
      {/* 3D key cap bottom shadow */}
      <div
        className={`absolute inset-x-[2px] bottom-0 h-[3px] rounded-b-lg ${
          highlighted ? "bg-gold/20" : "bg-white/[0.04]"
        }`}
      />
    </motion.div>
  );
}

/* ---------- Desktop keyboard visual ---------- */
function KeyboardVisual({
  hoveredShortcut,
  isInView,
}: {
  hoveredShortcut: number | null;
  isInView: boolean;
}) {
  let idx = 0;

  const renderRow = (keys: KeyDef[]) => (
    <div className="flex gap-1.5 justify-center">
      {keys.map((k) => {
        const label = getLabel(k);
        const currentIdx = idx++;
        return (
          <KeyCap
            key={label}
            keyDef={k}
            highlighted={isHighlighted(label, hoveredShortcut)}
            staggerIndex={currentIdx}
            isInView={isInView}
          />
        );
      })}
    </div>
  );

  return (
    <div className="space-y-1.5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      {renderRow(ROW_1)}
      {renderRow(ROW_2)}
      {renderRow(ROW_3)}
      <div className="flex gap-1.5 justify-center">
        {ROW_4.map((k) => {
          const label = getLabel(k);
          const currentIdx = idx++;
          return (
            <KeyCap
              key={label}
              keyDef={k}
              highlighted={isHighlighted(label, hoveredShortcut)}
              staggerIndex={currentIdx}
              isInView={isInView}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Shortcut list (sidebar on desktop, full on mobile) ---------- */
function ShortcutList({
  onHover,
  isInView,
  isMobile,
}: {
  onHover: (index: number | null) => void;
  isInView: boolean;
  isMobile?: boolean;
}) {
  return (
    <div className={`space-y-2 ${isMobile ? "grid grid-cols-1 gap-2 space-y-0" : ""}`}>
      {SHORTCUTS.map((s, i) => (
        <motion.div
          key={s.action}
          className={`
            flex items-center justify-between gap-4 px-4 py-3 rounded-xl cursor-default
            transition-colors duration-150
            ${isMobile ? "bg-[var(--glass-bg)] border border-[var(--glass-border)]" : "hover:bg-white/[0.04]"}
          `}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.35 } }
              : {}
          }
        >
          <div className="flex items-center gap-2">
            {s.keys.map((k) => (
              <kbd
                key={k}
                className="inline-flex items-center justify-center min-w-[28px] h-7 px-2
                  rounded-md bg-white/[0.06] border border-white/[0.1]
                  font-mono text-xs text-text-primary"
              >
                {k}
              </kbd>
            ))}
          </div>
          <span className="text-text-secondary text-sm">{s.action}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Main component ---------- */
export default function Keyboard() {
  const { ref, isInView } = useInView({ amount: 0.15 });
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);

  return (
    <section
      id="shortcuts"
      ref={ref}
      className="relative py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2
            className="font-sans font-extrabold tracking-tight leading-[1.15]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              background: "linear-gradient(90deg, #FFD700, #FFAA00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your hands never leave the keyboard
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Every action, one shortcut away.
          </p>
        </motion.div>

        {/* Desktop: keyboard + sidebar */}
        <div className="hidden md:flex gap-10 items-start justify-center">
          <div className="flex-shrink-0">
            <KeyboardVisual
              hoveredShortcut={hoveredShortcut}
              isInView={isInView}
            />
          </div>
          <div className="flex-1 max-w-sm">
            <ShortcutList onHover={setHoveredShortcut} isInView={isInView} />
          </div>
        </div>

        {/* Mobile: simple list */}
        <div className="md:hidden">
          <ShortcutList
            onHover={setHoveredShortcut}
            isInView={isInView}
            isMobile
          />
        </div>
      </div>
    </section>
  );
}
