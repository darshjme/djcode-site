"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* -------------------------------------------------- */
/*  Data                                              */
/* -------------------------------------------------- */

const COMPETITORS = ["DJcode", "Claude Code", "Gemini CLI", "Aider", "OpenCode", "Goose"] as const;

interface Row {
  feature: string;
  values: Record<(typeof COMPETITORS)[number], string>;
}

const ROWS: Row[] = [
  {
    feature: "Price",
    values: {
      DJcode: "Free forever",
      "Claude Code": "$20\u2013200/mo",
      "Gemini CLI": "Free + API costs",
      Aider: "Free + API costs",
      OpenCode: "Free + API costs",
      Goose: "Free / Apache 2.0",
    },
  },
  {
    feature: "Local inference",
    values: {
      DJcode: "Native (Ollama + MLX)",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "Workaround",
      OpenCode: "Workaround",
      Goose: "Candle + llama.cpp",
    },
  },
  {
    feature: "Apple Silicon / MLX",
    values: {
      DJcode: "Native Metal",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "No",
      OpenCode: "No",
      Goose: "No",
    },
  },
  {
    feature: "Smart buddy",
    values: {
      DJcode: "Mitra (5 species, 3D)",
      "Claude Code": "Fenwick",
      "Gemini CLI": "No",
      Aider: "No",
      OpenCode: "No",
      Goose: "No",
    },
  },
  {
    feature: "Prompt enhancer",
    values: {
      DJcode: "8 intent modes",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "Repo map",
      OpenCode: "No",
      Goose: "No",
    },
  },
  {
    feature: "Agent system",
    values: {
      DJcode: "22 agents (semantic routing)",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "No",
      OpenCode: "No",
      Goose: "Extensions",
    },
  },
  {
    feature: "Zero telemetry",
    values: {
      DJcode: "By design (hardcoded)",
      "Claude Code": "Opt-out",
      "Gemini CLI": "Opt-out",
      Aider: "Opt-in",
      OpenCode: "Opt-out",
      Goose: "Opt-out (PostHog)",
    },
  },
  {
    feature: "Works offline",
    values: {
      DJcode: "Yes",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "No",
      OpenCode: "No",
      Goose: "Partial (Candle)",
    },
  },
  {
    feature: "No API key needed",
    values: {
      DJcode: "Yes",
      "Claude Code": "No",
      "Gemini CLI": "No",
      Aider: "No",
      OpenCode: "No",
      Goose: "No",
    },
  },
  {
    feature: "Open source",
    values: {
      DJcode: "MIT",
      "Claude Code": "Source-available",
      "Gemini CLI": "Apache 2.0",
      Aider: "Apache 2.0",
      OpenCode: "FSL-1.1",
      Goose: "Apache 2.0",
    },
  },
  {
    feature: "3-tier memory",
    values: {
      DJcode: "Session + Facts + Vectors",
      "Claude Code": "CLAUDE.md",
      "Gemini CLI": "GEMINI.md",
      Aider: "Repo map",
      OpenCode: "SQLite",
      Goose: "No",
    },
  },
];

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */

function isDJcodePositive(val: string): boolean {
  const positives = [
    "Free forever",
    "Native",
    "Yes",
    "MIT",
    "By design",
    "Mitra",
    "8 intent",
    "22 agents",
    "Session + Facts",
  ];
  return positives.some((p) => val.includes(p));
}

function isNegative(val: string): boolean {
  return val === "No";
}

function isPartial(val: string): boolean {
  return (
    val === "Workaround" ||
    val === "Opt-out" ||
    val === "Opt-in" ||
    val === "Repo map" ||
    val === "Fenwick" ||
    val === "Extensions" ||
    val.startsWith("Opt-out (") ||
    val.startsWith("Partial (") ||
    val.startsWith("Candle")
  );
}

/* -------------------------------------------------- */
/*  Cell renderers                                    */
/* -------------------------------------------------- */

function DJcodeCell({ value }: { value: string }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-text-primary"
      style={{ backgroundColor: "rgba(255, 215, 0, 0.05)" }}
    >
      <div className="flex items-center gap-2">
        {isDJcodePositive(value) && (
          <svg
            className="h-4 w-4 shrink-0 text-gold"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        <span>{value}</span>
      </div>
    </td>
  );
}

function CompetitorCell({ value }: { value: string }) {
  if (isNegative(value)) {
    return (
      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-dim">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0 text-text-dim"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6" />
            <path d="M9 9l6 6" />
          </svg>
          <span>No</span>
        </div>
      </td>
    );
  }

  if (isPartial(value)) {
    return (
      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">
        <span>{value}</span>
      </td>
    );
  }

  return (
    <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
      {value}
    </td>
  );
}

/* -------------------------------------------------- */
/*  Main Component                                    */
/* -------------------------------------------------- */

export default function Comparison() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="compare" className="relative py-16 md:py-24" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gradient-gold mb-4 font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            How we stack up
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-text-secondary">
            Feature-by-feature against every major coding CLI.
          </p>
        </motion.div>

        {/* Table wrapper */}
        <motion.div
          className="mx-auto max-w-[1100px]"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <div className="compare-scroll-wrapper glass-card relative overflow-hidden">
            {/* Scroll fade indicator (right edge) */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-bg-elevated to-transparent md:hidden" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                {/* Header */}
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="sticky left-0 z-20 min-w-[140px] bg-bg-elevated px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Feature
                    </th>
                    {COMPETITORS.map((name) => (
                      <th
                        key={name}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                        style={
                          name === "DJcode"
                            ? {
                                color: "#FFD700",
                                backgroundColor: "rgba(255, 215, 0, 0.05)",
                              }
                            : { color: "#888888" }
                        }
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {ROWS.map((row, ri) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                        ri === ROWS.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="sticky left-0 z-20 min-w-[140px] bg-bg-elevated px-4 py-3 text-sm font-medium text-text-primary">
                        {row.feature}
                      </td>
                      {COMPETITORS.map((name) =>
                        name === "DJcode" ? (
                          <DJcodeCell key={name} value={row.values[name]} />
                        ) : (
                          <CompetitorCell key={name} value={row.values[name]} />
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
