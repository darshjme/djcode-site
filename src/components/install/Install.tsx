"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Copy, Check } from "lucide-react";

const PRIMARY_CMD = "curl -fsSL https://cli.darshj.ai/install.sh | bash";
const SOURCE_CMD = "git clone https://github.com/darshjme/djcode && cd djcode && uv sync";
const PIP_CMD = "pip install djcode";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 p-2 rounded-md hover:bg-white/5 transition-colors duration-150 text-text-muted hover:text-gold"
      aria-label="Copy command"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

export function Install() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      id="install"
      className="w-full py-20 md:py-32 px-6"
    >
      <div className="max-w-[700px] mx-auto flex flex-col items-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-extrabold text-center mb-12"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #FFD700, #FFAA00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Get started in 10 seconds
        </motion.h2>

        {/* Primary install box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full glass-card px-5 py-5 flex items-center justify-between gap-3 mb-6"
          style={{
            borderWidth: "2px",
            borderColor: "rgba(255, 215, 0, 0.3)",
            animation: inView ? "glowPulseStrong 3s ease-in-out infinite" : "none",
          }}
        >
          <code className="font-mono text-text-code truncate flex-1 text-left" style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}>
            <span className="text-green">$</span> {PRIMARY_CMD}
          </code>
          <CopyButton text={PRIMARY_CMD} />
        </motion.div>

        {/* Alternative installs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="w-full space-y-3 mb-8"
        >
          {/* From source */}
          <div className="glass-card px-4 py-3 flex items-center justify-between gap-3">
            <code className="font-mono text-sm text-text-secondary truncate flex-1 text-left">
              <span className="text-text-muted">#</span>{" "}
              <span className="text-text-muted">From source</span>
              <br />
              <span className="text-green">$</span>{" "}
              <span className="text-text-code opacity-70">{SOURCE_CMD}</span>
            </code>
            <CopyButton text={SOURCE_CMD} />
          </div>

          {/* pip */}
          <div className="glass-card px-4 py-3 flex items-center justify-between gap-3">
            <code className="font-mono text-sm text-text-secondary truncate flex-1 text-left">
              <span className="text-text-muted">#</span>{" "}
              <span className="text-text-muted">pip</span>
              <br />
              <span className="text-green">$</span>{" "}
              <span className="text-text-code opacity-70">{PIP_CMD}</span>
            </code>
            <CopyButton text={PIP_CMD} />
          </div>
        </motion.div>

        {/* Prerequisites */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-text-muted text-sm text-center"
        >
          Requires{" "}
          <a
            href="https://python.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-bright underline underline-offset-2 transition-colors"
          >
            Python 3.12+
          </a>{" "}
          and{" "}
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-bright underline underline-offset-2 transition-colors"
          >
            Ollama
          </a>
        </motion.p>
      </div>
    </section>
  );
}
