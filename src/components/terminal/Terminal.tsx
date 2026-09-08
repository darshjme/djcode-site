"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// --- Constants ---

const ASCII_BANNER = `    ____     _  ____          _
   |  _ \\   | |/ ___|___   __| | ___
   | | | |  | | |   / _ \\ / _\` |/ _ \\
   | |_| |_ | | |__| (_) | (_| |  __/
   |____/(_)|_|\\____\\___/ \\__,_|\\___|`;

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const RESULT_LINES = [
  { icon: "✓", text: "Read login.py (142 lines)" },
  { icon: "✓", text: "Found root cause: token expiry not checked" },
  { icon: "✓", text: "Applied fix at line 87" },
  { icon: "✓", text: "Tests passing (4/4)" },
];

// --- Helpers ---

function useTypewriter(
  text: string,
  speed: number,
  active: boolean
): { displayed: string; done: boolean } {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let position = 0;
    const timer = setInterval(() => {
      if (!active) { setIndex(0); clearInterval(timer); return; }
      position += 1;
      setIndex(position);
      if (position >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, active]);

  return { displayed: active ? text.slice(0, index) : "", done: active && index >= text.length };
}

// --- Sequence Steps ---

type Step =
  | "idle"
  | "typing-djcode"
  | "banner"
  | "empty1"
  | "typing-prompt"
  | "spinner"
  | "results"
  | "empty2"
  | "final-prompt";

// --- Component ---

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [step, setStep] = useState<Step>("idle");
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [visibleResults, setVisibleResults] = useState(0);
  const [playKey, setPlayKey] = useState(0);

  // Typewriters
  const djcodeTyper = useTypewriter("djcode", 60, step === "typing-djcode");
  const promptTyper = useTypewriter(
    "fix the auth bug in login.py",
    50,
    step === "typing-prompt"
  );

  // Reset function
  const resetSequence = useCallback(() => {
    setStep("idle");
    setSpinnerFrame(0);
    setVisibleResults(0);
    setPlayKey((k) => k + 1);
  }, []);

  // Start on view
  useEffect(() => {
    if (isInView && step === "idle") {
      const t = setTimeout(() => setStep("typing-djcode"), 300);
      return () => clearTimeout(t);
    }
  }, [isInView, step]);

  // Sequence progression
  useEffect(() => {
    if (step === "typing-djcode" && djcodeTyper.done) {
      const t = setTimeout(() => setStep("banner"), 200);
      return () => clearTimeout(t);
    }
  }, [step, djcodeTyper.done]);

  useEffect(() => {
    if (step === "banner") {
      const t = setTimeout(() => setStep("empty1"), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === "empty1") {
      const t = setTimeout(() => setStep("typing-prompt"), 100);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === "typing-prompt" && promptTyper.done) {
      const t = setTimeout(() => setStep("spinner"), 400);
      return () => clearTimeout(t);
    }
  }, [step, promptTyper.done]);

  // Spinner animation
  useEffect(() => {
    if (step !== "spinner") return;
    const interval = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % BRAILLE_FRAMES.length);
    }, 80);
    const stopTimer = setTimeout(() => {
      clearInterval(interval);
      setStep("results");
    }, 1500);
    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, [step]);

  // Result lines stagger
  useEffect(() => {
    if (step !== "results") return;
    if (visibleResults >= RESULT_LINES.length) {
      const t = setTimeout(() => setStep("empty2"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setVisibleResults((v) => v + 1),
      100
    );
    return () => clearTimeout(t);
  }, [step, visibleResults]);

  useEffect(() => {
    if (step === "empty2") {
      const t = setTimeout(() => setStep("final-prompt"), 200);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Replay handler
  const handleReplay = () => {
    resetSequence();
    // Small delay so idle state registers, then restart
    setTimeout(() => setStep("typing-djcode"), 100);
  };

  // Step ordering for conditional rendering
  const stepOrder: Step[] = [
    "idle",
    "typing-djcode",
    "banner",
    "empty1",
    "typing-prompt",
    "spinner",
    "results",
    "empty2",
    "final-prompt",
  ];
  const stepIndex = stepOrder.indexOf(step);
  const past = (s: Step) => stepIndex >= stepOrder.indexOf(s);

  return (
    <section
      aria-label="Illustrative coding session demo"
      id="demo"
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
            See the workflow
          </h2>
          <p
            className="mt-3"
            style={{ fontSize: "1.125rem", color: "#888888", lineHeight: 1.7 }}
          >
            An illustrative walkthrough of reading, editing, and testing code.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          ref={containerRef}
          key={playKey}
          className="relative mx-auto max-w-[800px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Replay button */}
          <button
            onClick={handleReplay}
            className="absolute top-2 right-3 z-10 px-3 py-1 text-xs rounded-md transition-colors duration-150"
            style={{
              color: "#888888",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = "#FFD700";
              (e.target as HTMLButtonElement).style.borderColor =
                "rgba(255,215,0,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = "#888888";
              (e.target as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.08)";
            }}
          >
            Replay
          </button>

          <div
            className="overflow-hidden"
            style={{
              background: "#0d0d1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center px-4"
              style={{
                background: "#161616",
                height: 36,
              }}
            >
              <div className="flex gap-2">
                <span
                  className="rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    background: "#FF5F56",
                  }}
                />
                <span
                  className="rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    background: "#FFBD2E",
                  }}
                />
                <span
                  className="rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    background: "#27C93F",
                  }}
                />
              </div>
              <span
                className="flex-1 text-center font-mono"
                style={{
                  fontSize: 11,
                  color: "#555555",
                }}
              >
                djcode &mdash; zsh
              </span>
            </div>

            {/* Terminal body */}
            <div
              className="p-5 font-mono overflow-x-auto"
              style={{
                fontSize: "clamp(0.75rem, 1.4vw, 0.875rem)",
                lineHeight: 1.5,
                color: "#E0E0E0",
                minHeight: 320,
              }}
            >
              {/* Line 1: $ djcode */}
              {past("typing-djcode") && (
                <div>
                  <span style={{ color: "#4ADE80" }}>$ </span>
                  <span>{step !== "typing-djcode" || djcodeTyper.done ? "djcode" : djcodeTyper.displayed}</span>
                  {step === "typing-djcode" && !djcodeTyper.done && (
                    <span className="animate-blink" style={{ color: "#FFD700" }}>
                      |
                    </span>
                  )}
                </div>
              )}

              {/* Banner */}
              {past("banner") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <pre
                    className="leading-none my-1"
                    style={{
                      color: "#FFD700",
                      fontSize: "clamp(0.4rem, 1.1vw, 0.75rem)",
                      textShadow: "0 0 8px rgba(255,215,0,0.3)",
                    }}
                  >
                    {ASCII_BANNER}
                  </pre>
                  <div style={{ color: "#888888" }}>
                    DJcode v4.1.0 | gemma4 | ollama
                  </div>
                </motion.div>
              )}

              {/* Empty line */}
              {past("empty1") && <div>&nbsp;</div>}

              {/* Line 2: djcode> prompt */}
              {past("typing-prompt") && (
                <div>
                  <span style={{ color: "#4ADE80" }}>djcode&gt; </span>
                  <span>
                    {step !== "typing-prompt" || promptTyper.done
                      ? "fix the auth bug in login.py"
                      : promptTyper.displayed}
                  </span>
                  {step === "typing-prompt" && !promptTyper.done && (
                    <span className="animate-blink" style={{ color: "#FFD700" }}>
                      |
                    </span>
                  )}
                </div>
              )}

              {/* Spinner */}
              {step === "spinner" && (
                <div className="mt-1">
                  <span style={{ color: "#FFD700" }}>
                    {BRAILLE_FRAMES[spinnerFrame]}
                  </span>{" "}
                  <span style={{ color: "#888888" }}>
                    Sherlock investigating...
                  </span>
                </div>
              )}

              {/* Results */}
              {past("results") && (
                <div className="mt-1">
                  {RESULT_LINES.slice(0, visibleResults).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span style={{ color: "#4ADE80" }}>{line.icon} </span>
                      <span>{line.text}</span>
                    </motion.div>
                  ))}
                  {/* Show all results if we've moved past this step */}
                  {step !== "results" &&
                    RESULT_LINES.slice(visibleResults).map((line, i) => (
                      <div key={`fill-${i}`}>
                        <span style={{ color: "#4ADE80" }}>{line.icon} </span>
                        <span>{line.text}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Empty line 2 */}
              {past("empty2") && <div>&nbsp;</div>}

              {/* Final prompt with blinking cursor */}
              {past("final-prompt") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2"
                >
                  <span style={{ color: "#4ADE80" }}>djcode&gt; </span>
                  <span className="animate-blink" style={{ color: "#FFD700" }}>
                    |
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Blinking cursor keyframes */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
      `}</style>
    </section>
  );
}
