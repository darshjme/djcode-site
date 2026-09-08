"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Copy, Check, ChevronDown, Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";

const Nucleus = dynamic(() => import("@/components/ui/Nucleus"), { ssr: false });

const INSTALL_CMD = "curl -fsSL https://cli.darshj.ai/install.sh | bash";

/* ---- Log entry types & color map ---- */
type LogType =
  | "ENHANCE"
  | "ROUTE"
  | "TOOL"
  | "THINK"
  | "TEST"
  | "REVIEW"
  | "COMMIT"
  | "STATS"
  | "LAUNCH"
  | "CONTENT";

const TYPE_COLORS: Record<LogType, string> = {
  ENHANCE: "#4ADE80",
  ROUTE: "#A78BFA",
  TOOL: "#22D3EE",
  THINK: "#666666",
  TEST: "#4ADE80",
  REVIEW: "#60A5FA",
  COMMIT: "#FFBD2E",
  STATS: "#888888",
  LAUNCH: "#FF5F56",
  CONTENT: "#34D399",
};

interface LogEntry {
  type: LogType;
  text: string;
}

const LOG_ENTRIES: LogEntry[] = [
  { type: "ENHANCE", text: "*enhanced* +git state, project info [debug mode]" },
  { type: "ROUTE", text: "Semantic router -> Sherlock (debugger) [cosine: 0.94]" },
  { type: "TOOL", text: 'Sherlock -> grep "TypeError" in ./src' },
  { type: "TOOL", text: "Sherlock -> file_read src/auth/login.py" },
  { type: "THINK", text: "thinking... root cause: null check missing at line 42" },
  { type: "TOOL", text: "Prometheus -> file_edit src/auth/login.py" },
  { type: "TEST", text: "Agni -> pytest tests/ -v (14/14 passed)" },
  { type: "REVIEW", text: "Dharma -> [LOW] style: line 42 could use early return" },
  { type: "COMMIT", text: 'git commit -m "fix: add null guard in auth handler"' },
  { type: "STATS", text: "Session: 3.2k tokens | 4 tools | 12s" },
  { type: "LAUNCH", text: "/launch DarshjDB -> Narada planning campaign..." },
  { type: "CONTENT", text: "Valmiki: writing launch blog..." },
  { type: "CONTENT", text: "Maya: generating hero image prompts..." },
  { type: "CONTENT", text: "Chitragupta: drafting 20 tweets..." },
];

const TYPE_ICONS: Record<LogType, string> = {
  ENHANCE: "\u2728",
  ROUTE: "\u27A1",
  TOOL: "\uD83D\uDD0E",
  THINK: "\u2728",
  TEST: "\uD83E\uDDEA",
  REVIEW: "\u2705",
  COMMIT: "\uD83D\uDD00",
  STATS: "\uD83D\uDCCA",
  LAUNCH: "\uD83D\uDE80",
  CONTENT: "\uD83D\uDCE2",
};

const MAX_VISIBLE = 12;

function KineticLogStream() {
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const streamRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<{ id: number; entry: LogEntry }[]>(() =>
    LOG_ENTRIES.slice(0, 6).map((entry, id) => ({ id, entry }))
  );
  const idxRef = useRef(6);
  const idCounter = useRef(6);

  useEffect(() => {
    if (paused || reducedMotion || !streamRef.current) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let visible = false;
    function sync() {
      clearInterval(interval);
      if (!visible || document.hidden) return;
      interval = setInterval(() => {
        const entry = LOG_ENTRIES[idxRef.current++ % LOG_ENTRIES.length];
        setLogs(prev => [...prev, { id: idCounter.current++, entry }].slice(-MAX_VISIBLE));
      }, 1500);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(streamRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(interval); observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [paused, reducedMotion]);

  return (
    <div ref={streamRef} className="relative w-full h-full flex flex-col">
      {/* macOS chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <span className="ml-3 text-xs font-mono text-[#666] tracking-wide">
          djcode — illustrative session
        </span>
        <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play session demo" : "Pause session demo"} className="ml-auto rounded p-1.5 text-[#999] hover:bg-white/5 hover:text-white">{paused || reducedMotion ? <Play size={12} /> : <Pause size={12} />}</button>
      </div>

      {/* Log area */}
      <div className="flex-1 overflow-hidden px-4 py-3 relative">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-0.5">
          <AnimatePresence initial={false}>
            {logs.map(({ id, entry }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-start gap-2 font-mono text-xs leading-relaxed"
              >
                <span
                  className="inline-block min-w-[80px] text-right font-semibold shrink-0"
                  style={{ color: TYPE_COLORS[entry.type] }}
                >
                  [{entry.type}]
                </span>
                <span className="text-[#555] shrink-0">
                  {TYPE_ICONS[entry.type]}
                </span>
                <span
                  className={
                    entry.type === "THINK"
                      ? "text-[#666] italic"
                      : "text-[#ccc]"
                  }
                >
                  {entry.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}

export function Hero() {
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
      className="relative min-h-screen flex items-center justify-center px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      {/* WebGL Nucleus shader background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Nucleus />
      </div>

      {/* Main two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-28 lg:py-32">
        {/* LEFT — Marketing copy */}
        <div className="flex flex-col items-start">
          <div className="eyebrow mb-6"><span className="status-dot" /> THE LOCAL-FIRST CODING AGENT</div>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="font-mono font-extrabold tracking-tight" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}>
              <span className="text-[#FFD700]" style={{ textShadow: "0 0 40px rgba(255,215,0,0.3)" }}>DJ</span>
              <span className="text-white">code</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 font-bold text-white leading-tight tracking-[-0.045em]"
            style={{ fontSize: "clamp(2.5rem, 4.2vw, 4.25rem)" }}
          >
            Your terminal.<br />
            <span className="text-gradient-gold">An entire team.</span>
          </motion.h2>

          {/* Builder credit */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-sm text-[#888] leading-relaxed"
          >
            Built by{" "}
            <span className="text-[#FFD700] font-medium">Darshan Kumar Joshi</span>{" "}
            for the developer community.
          </motion.p>

          {/* Stats line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-2 text-[#666] text-sm font-mono"
          >
            Specialist agents. Real tools. Local or hosted models.
          </motion.p>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#aaa9a1]">From the first question to the final diff. Explore your codebase, coordinate specialists, and run the tools that move your project forward.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4"><a className="primary-action" href="#install">Start building <span aria-hidden="true">↗</span></a><a className="secondary-action" href="/docs">Read the docs <span aria-hidden="true">→</span></a></div>
          {/* Install box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-5 w-full max-w-lg"
          >
            <div
              className="glass-card px-4 py-3 flex items-center justify-between gap-3"
              style={{ animation: "glowPulse 3s ease-in-out infinite" }}
            >
              <code className="font-mono text-xs overflow-x-auto whitespace-nowrap min-w-0 flex-1 text-left">
                <span className="text-[#4ADE80]">$</span>{" "}
                <span className="text-[#E0E0E0]">{INSTALL_CMD}</span>
              </code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 px-3 py-1.5 rounded-md bg-[#FFD700] text-[#0a0a0a] text-xs font-bold hover:bg-[#FFE55C] transition-colors duration-150"
                aria-label="Copy install command"
              >
                {copied ? (
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Closer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-6 text-[#555] text-xs font-mono tracking-wide uppercase"
          >
            Read. Reason. Build. Verify.
          </motion.p>
        </div>

        {/* RIGHT — Kinetic Log Stream */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div
            className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d0d0d]/90 backdrop-blur-sm"
            style={{
              boxShadow: "var(--hero-panel-shadow)",
              minHeight: "420px",
              maxHeight: "480px",
            }}
          >
            <KineticLogStream />
          </div>
        <div className="terminal-caption"><span><i /> TOOL-AWARE WORKFLOW</span><span>Example output · results vary</span></div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown
          className="w-6 h-6 text-[#555]"
          style={{ animation: "bounce-slow 1.5s ease-in-out infinite" }}
        />
      </motion.div>
    </section>
  );
}
