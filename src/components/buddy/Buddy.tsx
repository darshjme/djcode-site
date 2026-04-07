"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// --- Diya (oil lamp) ASCII art ---

const DIYA_ART = [
  "     ( )     ",
  "    (   )    ",
  "     ) (     ",
  "   _/   \\_   ",
  "  |  {E}  |  ",
  "  |       |  ",
  "   \\_____/   ",
  "    |   |    ",
  " _____|_____  ",
];

const EYE_CYCLE = [".", "\u203e", "-", "."];

// Glitch replacement characters
const GLITCH_CHARS = ["\u2593", "\u2591", "\u2592", "\u2588"];

// --- Buddy speech bubble data ---

const BUBBLES = [
  {
    borderColor: "#60A5FA",
    scenario: "You just edited auth.py",
    text: "Token validation looks solid. Don\u2019t forget the refresh flow.",
  },
  {
    borderColor: "#FF5F56",
    scenario: "3 test failures in a row",
    text: "Three strikes. Want me to call Sherlock?",
  },
  {
    borderColor: "#FFD700",
    scenario: "You\u2019re about to commit .env",
    text: "Hold up \u2014 .env is staged. That\u2019s secrets in your history.",
  },
];

// --- Trait cards data ---

const TRAITS = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Context-Aware",
    desc: "Watches your code changes, errors, and tool results",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    ),
    title: "Knows When to Shut Up",
    desc: "Only speaks when it has something useful to say",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="22" x2="12" y2="8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
    ),
    title: "Steadfast",
    desc: "Never panics. Calm guidance through hard debugging",
  },
];

// --- Component ---

export default function Buddy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Eye blink animation
  const [eyeIndex, setEyeIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setEyeIndex((i) => (i + 1) % EYE_CYCLE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchSeed, setGlitchSeed] = useState(0);
  useEffect(() => {
    const trigger = () => {
      setGlitchActive(true);
      setGlitchSeed(Date.now());
      setTimeout(() => setGlitchActive(false), 150);
    };
    // Random 5-8s intervals
    let timeout: NodeJS.Timeout;
    const schedule = () => {
      const delay = 5000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        trigger();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  // Render ASCII art with eye replacement and optional glitch
  const renderedArt = useMemo(() => {
    const eye = EYE_CYCLE[eyeIndex];
    let lines = DIYA_ART.map((line) => line.replace("{E}", eye + " " + eye));

    if (glitchActive) {
      // Pick 1-2 random lines to glitch
      const rng = (n: number) =>
        Math.floor(((glitchSeed * 9301 + 49297) % 233280) / 233280 * n);
      const lineIdx = rng(lines.length);
      const chars = lines[lineIdx].split("");
      const charIdx = rng(chars.length);
      chars[charIdx] = GLITCH_CHARS[rng(GLITCH_CHARS.length)];
      // Shift a line slightly
      lines[lineIdx] = " " + chars.join("").slice(0, -1);
    }

    return lines.join("\n");
  }, [eyeIndex, glitchActive, glitchSeed]);

  // Shadow version (dim, offset)
  const shadowArt = useMemo(() => {
    return DIYA_ART.map((line) =>
      line
        .replace("{E}", "\u00b7 \u00b7")
        .replace(/[^\s]/g, "\u2591")
    ).join("\n");
  }, []);

  return (
    <section
      id="buddy"
      ref={sectionRef}
      className="relative py-16 md:py-24 px-6 md:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              background: "linear-gradient(90deg, #FFD700, #FFAA00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Meet Mitra, your coding buddy
          </h2>
          <p
            className="mt-3"
            style={{ fontSize: "1.125rem", color: "#888888", lineHeight: 1.7 }}
          >
            An ASCII companion that actually pays attention.
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Buddy visual */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative select-none">
              {/* Shadow layer (offset) */}
              <pre
                className="absolute font-mono leading-none"
                style={{
                  color: "rgba(255,215,0,0.08)",
                  fontSize: "clamp(0.4rem, 1.2vw, 0.85rem)",
                  fontWeight: 700,
                  top: 4,
                  left: 4,
                  pointerEvents: "none",
                }}
                aria-hidden
              >
                {shadowArt}
              </pre>
              {/* Main art */}
              <pre
                className="relative font-mono leading-none"
                style={{
                  color: "#FFD700",
                  fontSize: "clamp(0.4rem, 1.2vw, 0.85rem)",
                  fontWeight: 700,
                  lineHeight: 1.0,
                  textShadow: "0 0 12px rgba(255,215,0,0.25)",
                  transition: glitchActive
                    ? "none"
                    : "text-shadow 0.3s ease",
                }}
              >
                {renderedArt}
              </pre>
              {/* Name label */}
              <div
                className="text-center mt-3 font-mono"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "#FFD700",
                  fontWeight: 600,
                }}
              >
                MITRA THE STEADFAST
              </div>
              <div
                className="text-center mt-1 font-mono"
                style={{
                  fontSize: "0.6875rem",
                  color: "#555555",
                }}
              >
                Diya species &bull; context observer
              </div>
            </div>
          </motion.div>

          {/* Right: Bubbles + traits */}
          <div>
            {/* Speech bubbles */}
            <div className="flex flex-col gap-4">
              {BUBBLES.map((bubble, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className="rounded-xl p-4 transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderLeft: `3px solid ${bubble.borderColor}`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderLeftColor =
                        bubble.borderColor;
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        `0 0 20px ${bubble.borderColor}22`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "#555555",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {bubble.scenario}
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: "0.875rem",
                        color: "#E0E0E0",
                        lineHeight: 1.5,
                      }}
                    >
                      &quot;{bubble.text}&quot;
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trait cards */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {TRAITS.map((trait, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl p-4 text-center transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 1.2 + i * 0.15,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(255,215,0,0.2)",
                    boxShadow: "0 2px 16px rgba(255,215,0,0.06)",
                  }}
                >
                  <div
                    className="flex justify-center mb-2"
                    style={{ color: "#FFD700" }}
                  >
                    {trait.icon}
                  </div>
                  <div
                    className="font-bold mb-1"
                    style={{
                      fontSize: "0.875rem",
                      color: "#F5F5F5",
                      lineHeight: 1.4,
                    }}
                  >
                    {trait.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#888888",
                      lineHeight: 1.5,
                    }}
                  >
                    {trait.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
