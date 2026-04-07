"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

/* -------------------------------------------------- */
/*  Data                                              */
/* -------------------------------------------------- */

const PIPELINE_NODES = [
  {
    id: "input",
    type: "endpoint" as const,
    icon: "↘",
    name: "User Input",
    description: "Commands, conversations, agent results",
    color: "#D4A853",
    glowColor: "rgba(212, 168, 83, 0.4)",
  },
  {
    id: "tier1",
    type: "tier" as const,
    tier: 1,
    icon: "⚡",
    badge: "Tier 1 · Hot",
    name: "Session Memory",
    description: "Current conversation context",
    tech: "In-process · Until exit",
    color: "#34D399",
    glowColor: "rgba(52, 211, 153, 0.35)",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
  },
  {
    id: "tier2",
    type: "tier" as const,
    tier: 2,
    icon: "💾",
    badge: "Tier 2 · Warm",
    name: "Persistent Facts",
    description: "Facts that survive across sessions",
    tech: "~/.djcode/memory/ · JSON files",
    color: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.35)",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-400",
  },
  {
    id: "tier3",
    type: "tier" as const,
    tier: 3,
    icon: "🧠",
    badge: "Tier 3 · Deep",
    name: "Semantic Vectors",
    description: "Vector search by meaning",
    tech: "ChromaDB · all-MiniLM-L6-v2",
    color: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.35)",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-400",
  },
  {
    id: "output",
    type: "endpoint" as const,
    icon: "✦",
    name: "Context Injected",
    description: "Relevant past context fed to every prompt",
    color: "#D4A853",
    glowColor: "rgba(212, 168, 83, 0.4)",
  },
];

const CONNECTIONS = [
  { from: "#D4A853", to: "#34D399" },
  { from: "#34D399", to: "#60A5FA" },
  { from: "#60A5FA", to: "#A78BFA" },
  { from: "#A78BFA", to: "#D4A853" },
];

const STATS = [
  { label: "tiers", value: 3 },
  { label: "memory", value: "Infinite" },
  { label: "cloud", value: "Zero" },
];

/* -------------------------------------------------- */
/*  CountUp                                           */
/* -------------------------------------------------- */

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(Math.round(t * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  return <>{val}</>;
}

/* -------------------------------------------------- */
/*  Framer variants                                   */
/* -------------------------------------------------- */

const headingVar = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const nodeVar = (i: number) => ({
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: 0.15 + i * 0.18,
    },
  },
});

const connVar = (i: number) => ({
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      delay: 0.25 + i * 0.18,
    },
  },
});

const statsVar = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1.2 },
  },
};

const calloutVar = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1.5 },
  },
};

/* -------------------------------------------------- */
/*  Component                                         */
/* -------------------------------------------------- */

export default function Memory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="memory" className="relative py-16 md:py-28" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* ---- Heading ---- */}
        <motion.div
          className="mb-14 text-center md:mb-20"
          variants={headingVar}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-gradient-gold mb-4 font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            Memory that never forgets
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
            3-tier architecture. Every session builds your AI&apos;s understanding
            of your codebase.
          </p>
        </motion.div>

        {/* ---- Pipeline ---- */}
        <div className="relative mx-auto flex max-w-[440px] flex-col items-center">
          {PIPELINE_NODES.map((node, i) => (
            <div key={node.id} className="flex w-full flex-col items-center">
              {/* Connection line + particles (between nodes) */}
              {i > 0 && (
                <motion.div
                  className="pipeline-connection relative w-[2px] origin-top"
                  style={{
                    height: 64,
                    background: `linear-gradient(to bottom, ${CONNECTIONS[i - 1].from}, ${CONNECTIONS[i - 1].to})`,
                  }}
                  variants={connVar(i)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  {/* Glow */}
                  <div
                    className="absolute inset-0 w-[6px] -translate-x-[2px] blur-[4px]"
                    style={{
                      background: `linear-gradient(to bottom, ${CONNECTIONS[i - 1].from}88, ${CONNECTIONS[i - 1].to}88)`,
                      animation: "pulseGlow 3s ease-in-out infinite",
                    }}
                  />
                  {/* Particles */}
                  {Array.from({ length: 8 }).map((_, p) => (
                    <span
                      key={p}
                      className="pipeline-particle absolute left-1/2 -translate-x-1/2"
                      style={
                        {
                          "--delay": `${p * 0.35}s`,
                          "--color": CONNECTIONS[i - 1].from,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </motion.div>
              )}

              {/* Node Card */}
              <motion.div
                className="pipeline-node group relative w-full"
                variants={nodeVar(i)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {node.type === "endpoint" ? (
                  /* Gold endpoint cards */
                  <div
                    className="relative overflow-hidden rounded-2xl border border-[#D4A853]/20 bg-[#D4A853]/[0.06] p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#D4A853]/40"
                    style={{
                      boxShadow: `0 0 30px ${node.glowColor}, inset 0 1px 0 rgba(212,168,83,0.1)`,
                    }}
                  >
                    {/* Shimmer */}
                    <div className="endpoint-shimmer absolute inset-0 pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A853]/15 text-xl">
                        {node.icon}
                      </span>
                      <div>
                        <h4 className="font-sans text-base font-bold text-[#D4A853]">
                          {node.name}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tier cards */
                  <div
                    className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      borderColor: undefined,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = `${node.color}44`;
                      el.style.boxShadow = `0 0 24px ${node.glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                      style={{ backgroundColor: node.color }}
                    />

                    <div className="p-5 pl-6">
                      <div className="mb-3 flex items-center gap-3">
                        {/* Animated icon */}
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                            node.id === "tier1"
                              ? "tier-icon-pulse"
                              : node.id === "tier2"
                                ? "tier-icon-spin"
                                : "tier-icon-orbit"
                          }`}
                          style={{
                            backgroundColor: `${node.color}18`,
                          }}
                        >
                          {node.icon}
                        </span>

                        {/* Badge */}
                        {"badge" in node && (
                          <span
                            className={`rounded-md px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${node.badgeBg} ${node.badgeText}`}
                          >
                            {node.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="mb-1 font-sans text-lg font-bold text-text-primary">
                        {node.name}
                      </h4>
                      <p className="mb-2 text-sm leading-relaxed text-text-secondary">
                        {node.description}
                      </p>
                      {"tech" in node && (
                        <span className="inline-block rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-text-muted">
                          {node.tech}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* ---- Stats strip ---- */}
        <motion.div
          className="mx-auto mt-12 flex max-w-md items-center justify-center gap-6 md:mt-16"
          variants={statsVar}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-sans text-2xl font-extrabold text-text-primary">
                {typeof s.value === "number" ? (
                  <CountUp target={s.value} inView={inView} />
                ) : (
                  s.value
                )}
              </span>
              <span className="text-sm text-text-muted">{s.label}</span>
              {i < STATS.length - 1 && (
                <span className="ml-4 text-text-muted/30">·</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* ---- Auto-learning callout ---- */}
        <motion.div
          className="mx-auto mt-10 max-w-[520px] md:mt-14"
          variants={calloutVar}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="callout-card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
            {/* Sparkle dots */}
            <span className="callout-sparkle callout-sparkle-1" />
            <span className="callout-sparkle callout-sparkle-2" />
            <span className="callout-sparkle callout-sparkle-3" />

            <div className="relative z-10 flex items-start gap-3">
              <span
                className="mt-0.5 text-lg text-[#D4A853]"
                aria-hidden="true"
              >
                &#x2728;
              </span>
              <p className="text-sm leading-relaxed text-text-secondary">
                <span className="font-semibold text-text-primary">
                  Auto-learning:
                </span>{" "}
                Every session makes DJcode smarter. Patterns extracted. Context
                remembered. No cloud required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- CSS for pipeline animations ---- */}
      <style jsx>{`
        /* ---- Particles flowing down the connection ---- */
        .pipeline-particle {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color);
          box-shadow: 0 0 6px var(--color);
          opacity: 0;
          animation: particleFall 2.8s linear infinite;
          animation-delay: var(--delay);
        }
        @keyframes particleFall {
          0% {
            top: -2px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: calc(100% - 2px);
            opacity: 0;
          }
        }

        /* ---- Connection glow pulse ---- */
        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        /* ---- Endpoint shimmer ---- */
        .endpoint-shimmer {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(212, 168, 83, 0.08) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmerSlide 4s ease-in-out infinite;
        }
        @keyframes shimmerSlide {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* ---- Tier icon animations ---- */
        .tier-icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }

        .tier-icon-spin {
          animation: iconSpin 6s linear infinite;
        }
        @keyframes iconSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .tier-icon-orbit {
          animation: iconOrbit 3s ease-in-out infinite;
        }
        @keyframes iconOrbit {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          25% {
            transform: translateX(3px) scale(1.05);
          }
          50% {
            transform: translateX(0) scale(1);
          }
          75% {
            transform: translateX(-3px) scale(1.05);
          }
        }

        /* ---- Callout sparkles ---- */
        .callout-sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #d4a853;
          animation: sparkle 2.5s ease-in-out infinite;
          z-index: 5;
        }
        .callout-sparkle-1 {
          top: 12px;
          right: 24px;
          animation-delay: 0s;
        }
        .callout-sparkle-2 {
          top: 50%;
          right: 48px;
          animation-delay: 0.8s;
        }
        .callout-sparkle-3 {
          bottom: 12px;
          right: 16px;
          animation-delay: 1.6s;
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </section>
  );
}
