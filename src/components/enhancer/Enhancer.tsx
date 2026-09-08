"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// --- Constants ---

const USER_PROMPT = "fix the bug in login.py";
const SCRAMBLE_CHARS = "@#$%^&*!?~+=<>";

const CONTEXT_LINES = [
  "[PROJECT] Python 3.12, FastAPI, pytest",
  "[GIT] branch: feature/auth, 3 files changed",
  "[FILE] login.py exists (142 lines, Python)",
];

const DEBUG_LINES = [
  "[INTENT] debug \u2014 fix a bug",
  "[INSTRUCTIONS] Read the file first. Identify root",
  "cause. Apply surgical fix. Explain why.",
];

const REQUEST_LINES = ["fix the bug in login.py"];

const STATS = [
  { value: 8, suffix: "", label: "Intent modes" },
  { value: 3, suffix: "", label: "Context sources" },
  { value: 0, suffix: "", label: "Extra model calls" },
];

// --- Hooks ---

/** Decrypt/scramble text effect: characters start random and resolve left-to-right */
function useHyperText(
  text: string,
  active: boolean,
  durationMs: number = 2000
): string {
  const [output, setOutput] = useState("");
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const resolvedCount = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolvedCount) {
          result += text[i];
        } else {
          result +=
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setOutput(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, text, durationMs]);

  return active ? output || text.replace(/[^ ]/g, SCRAMBLE_CHARS[0]) : "";
}

/** Mini scramble for sub-cards: shorter duration */
function useMiniScramble(
  lines: string[],
  active: boolean,
  delay: number = 0
): string[] {
  const [outputs, setOutputs] = useState<string[]>(lines.map(() => ""));
  const frameRef = useRef<number>(0);
  const joinedText = lines.join("\n");

  useEffect(() => {
    if (!active) {
      return;
    }

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const duration = 600;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newOutputs = lines.map((line) => {
          const resolvedCount = Math.floor(progress * line.length);
          let result = "";
          for (let i = 0; i < line.length; i++) {
            if (line[i] === " " || line[i] === "[" || line[i] === "]") {
              result += line[i];
            } else if (i < resolvedCount) {
              result += line[i];
            } else {
              result +=
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
            }
          }
          return result;
        });

        setOutputs(newOutputs);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [active, joinedText, delay, lines]);

  return active ? outputs : lines.map(() => "");
}

/** Count-up animation */
function useCountUp(
  target: number,
  active: boolean,
  duration: number = 1200
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    if (target === 0) {
      return;
    }
    const start = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return active ? value : 0;
}

// --- Sub-card component ---

function EnhancerCard({
  label,
  borderColor,
  lines,
  active,
  delay,
  index,
}: {
  label: string;
  borderColor: string;
  lines: string[];
  active: boolean;
  delay: number;
  index: number;
}) {
  const scrambled = useMiniScramble(lines, active, delay);

  return (
    <motion.div
      className="rounded-lg p-4 font-mono"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${borderColor}`,
        fontSize: "clamp(0.75rem, 1.4vw, 0.8125rem)",
        lineHeight: 1.6,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: 0.3 * index,
        ease: "easeOut",
      }}
    >
      <div
        className="mb-2 font-bold uppercase tracking-wider"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          color: borderColor,
        }}
      >
        {label}
      </div>
      <div style={{ color: "#E0E0E0" }}>
        {scrambled.map((line, i) => (
          <div key={i}>{line || "\u00a0"}</div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export default function Enhancer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  // Decrypt effect for user prompt
  const decryptedPrompt = useHyperText(USER_PROMPT, isInView, 2000);

  // Count-up for stats
  const stat0 = useCountUp(STATS[0].value, statsInView);
  const stat1 = useCountUp(STATS[1].value, statsInView);
  const stat2 = useCountUp(STATS[2].value, statsInView);
  const statValues = [stat0, stat1, stat2];

  return (
    <section
      id="enhancer"
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 px-6 md:px-8"
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
            Your prompt, supercharged
          </h2>
          <p
            className="mt-3"
            style={{ fontSize: "1.125rem", color: "#888888", lineHeight: 1.7 }}
          >
            Type three words. The model receives a complete briefing.
          </p>
        </motion.div>

        {/* Two panels + arrow */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-0 max-w-[900px] mx-auto">
          {/* Left panel: You type */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="rounded-xl p-5 font-mono"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="mb-3 uppercase tracking-wider font-bold"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "#FFD700",
                }}
              >
                YOU TYPE
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9375rem)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#4ADE80" }}>djcode&gt; </span>
                <span style={{ color: isInView ? "#F5F5F5" : "#FFD700" }}>
                  {isInView ? decryptedPrompt : ""}
                </span>
                <span
                  style={{
                    color: "#FFD700",
                    animation: "enhancer-blink 0.8s step-end infinite",
                  }}
                >
                  |
                </span>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="flex items-center justify-center md:px-6 py-2 md:py-0">
            {/* Horizontal arrow (desktop) */}
            <motion.div
              className="hidden md:flex items-center flex-col"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="flex items-center">
                <motion.div
                  style={{
                    height: 2,
                    background:
                      "linear-gradient(90deg, rgba(255,215,0,0.1), rgba(255,215,0,0.6))",
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 60 } : { width: 0 }}
                  transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                />
                <motion.div
                  style={{ color: "#FFD700" }}
                  whileInView={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.div>
              </div>
              <span
                className="mt-1"
                style={{
                  fontSize: "0.75rem",
                  color: "#FFD700",
                  letterSpacing: "0.02em",
                }}
              >
                enhanced
              </span>
            </motion.div>

            {/* Vertical arrow (mobile) */}
            <motion.div
              className="flex md:hidden flex-col items-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  style={{
                    width: 2,
                    background:
                      "linear-gradient(180deg, rgba(255,215,0,0.1), rgba(255,215,0,0.6))",
                  }}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: 40 } : { height: 0 }}
                  transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                />
                <motion.div
                  style={{ color: "#FFD700" }}
                  whileInView={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.div>
              </div>
              <span
                className="mt-1"
                style={{
                  fontSize: "0.75rem",
                  color: "#FFD700",
                  letterSpacing: "0.02em",
                }}
              >
                enhanced
              </span>
            </motion.div>
          </div>

          {/* Right panel: Model receives */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="mb-3 uppercase tracking-wider font-bold"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "#FFD700",
                }}
              >
                MODEL RECEIVES
              </div>
              <div className="flex flex-col gap-3">
                <EnhancerCard
                  label="CONTEXT"
                  borderColor="#60A5FA"
                  lines={CONTEXT_LINES}
                  active={isInView}
                  delay={800}
                  index={0}
                />
                <EnhancerCard
                  label="DEBUG"
                  borderColor="#FF8C00"
                  lines={DEBUG_LINES}
                  active={isInView}
                  delay={1100}
                  index={1}
                />
                <EnhancerCard
                  label="REQUEST"
                  borderColor="#4ADE80"
                  lines={REQUEST_LINES}
                  active={isInView}
                  delay={1400}
                  index={2}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-6 mt-12 md:mt-16 max-w-[700px] mx-auto"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            >
              <div
                className="font-extrabold"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                  color: "#FFD700",
                }}
              >
                {statValues[i]}
                {stat.suffix}
              </div>
              <div
                className="mt-2"
                style={{
                  fontSize: "0.875rem",
                  color: "#888888",
                  lineHeight: 1.5,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes enhancer-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
