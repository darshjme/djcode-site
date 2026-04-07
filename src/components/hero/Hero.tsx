"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";

const ASCII_ART = `    ____     _  ____          _
   |  _ \\   | |/ ___|___   __| | ___
   | | | |  | | |   / _ \\ / _\` |/ _ \\
   | |_| |_ | | |__| (_) | (_| |  __/
   |____/(_)|_|\\____\\___/ \\__,_|\\___|`;

const WATERMARK_WORDS = [
  "AGENTS", "MEMORY", "TOOLS", "LOCAL", "OLLAMA", "ENHANCER",
  "BUDDY", "SKILLS", "VOICE", "MLX", "CHROMADB", "SCOUT",
  "CODER", "ARCHITECT", "TESTER", "DEBUGGER", "DEVOPS", "DOCS",
  "REFACTOR", "REVIEW", "ORCHESTRATOR", "ZERO-TELEMETRY",
];

const INSTALL_CMD = "curl -fsSL https://cli.darshj.ai/install.sh | bash";

function useTypewriter(text: string, speed: number = 65, delay: number = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return { displayed, done: displayed.length >= text.length };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function WatermarkColumns() {
  const [cols, setCols] = useState(6);

  useEffect(() => {
    function calc() {
      setCols(Math.ceil(window.innerWidth / 200));
    }
    calc();
    let timer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(timer);
      timer = setTimeout(calc, 250);
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  const columns = useMemo(() => {
    return Array.from({ length: cols }, () => shuffle(WATERMARK_WORDS));
  }, [cols]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex">
      {columns.map((words, i) => (
        <div
          key={i}
          className="flex-1 overflow-hidden"
          style={{ opacity: 1 }}
        >
          <div
            className="font-mono text-xs leading-6"
            style={{
              color: "rgba(255, 215, 0, 0.04)",
              animation: `scrollTextUp ${20 + i * 2}s linear infinite`,
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...words, ...words].map((w, j) => (
              <div key={j} className="whitespace-nowrap py-1">
                {w}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const { displayed, done } = useTypewriter(
    "The last coding CLI you'll ever need.",
    65,
    1200
  );

  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      {/* Background watermark */}
      <WatermarkColumns />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* ASCII Art Banner */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="hidden sm:block font-mono font-bold text-gold leading-none mb-8"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.85rem)",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
          }}
          aria-label="DJcode"
        >
          {ASCII_ART}
        </motion.pre>

        {/* Mobile fallback */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sm:hidden font-mono font-bold text-gold text-4xl mb-6"
          style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
        >
          DJCODE
        </motion.h1>

        {/* Typewriter tagline */}
        <div className="mb-6 min-h-[3rem] md:min-h-[4rem]">
          <h2
            className="font-mono font-extrabold text-white"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {displayed}
            <span
              className="inline-block w-[3px] ml-0.5 bg-gold align-baseline"
              style={{
                height: "0.85em",
                animation: done ? "blink 0.8s step-end infinite" : "none",
              }}
            />
          </h2>
        </div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8, ease: "easeOut" }}
          className="text-text-secondary text-lg leading-relaxed max-w-xl mb-10"
        >
          22 agents. 9 providers. 3-tier memory. Zero telemetry. Runs on your
          machine.
        </motion.p>

        {/* Install box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.2, ease: "easeOut" }}
          className="glass-card w-full max-w-lg px-5 py-4 flex items-center justify-between gap-3"
          style={{ animation: "glowPulse 3s ease-in-out infinite" }}
        >
          <code className="font-mono text-sm md:text-base truncate flex-1 text-left">
            <span className="text-green">$</span>{" "}
            <span className="text-text-code">{INSTALL_CMD}</span>
          </code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-md hover:bg-white/5 transition-colors duration-150 text-text-muted hover:text-gold"
            aria-label="Copy install command"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown
          className="w-6 h-6 text-text-muted"
          style={{ animation: "bounce-slow 1.5s ease-in-out infinite" }}
        />
      </motion.div>
    </section>
  );
}
