"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

/* ============================================
   Terminal Panel Component
   ============================================ */

function TerminalChrome({
  title,
  children,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  variant: "without" | "with";
}) {
  const borderColor =
    variant === "without"
      ? "rgba(255, 95, 86, 0.25)"
      : "rgba(255, 215, 0, 0.30)";
  const bgTint =
    variant === "without"
      ? "rgba(255, 50, 50, 0.03)"
      : "rgba(255, 215, 0, 0.04)";

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: bgTint,
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: `1px solid ${borderColor}`,
          background:
            variant === "without"
              ? "rgba(255, 50, 50, 0.04)"
              : "rgba(255, 215, 0, 0.04)",
        }}
      >
        <span
          className="h-3 w-3 rounded-full"
          style={{
            background: variant === "without" ? "#FF5F56" : "#FFD700",
          }}
        />
        <span
          className="h-3 w-3 rounded-full"
          style={{
            background:
              variant === "without"
                ? "rgba(255, 95, 86, 0.4)"
                : "rgba(255, 215, 0, 0.4)",
          }}
        />
        <span
          className="h-3 w-3 rounded-full"
          style={{
            background:
              variant === "without"
                ? "rgba(255, 95, 86, 0.2)"
                : "rgba(255, 215, 0, 0.2)",
          }}
        />
        <span
          className="ml-3 text-xs font-medium"
          style={{
            color: variant === "without" ? "#FF5F56" : "#FFD700",
            fontFamily: "var(--font-mono)",
          }}
        >
          {title}
        </span>
      </div>
      {/* Terminal body */}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

/* ============================================
   Typed Line (stagger-in terminal lines)
   ============================================ */

function TermLine({
  children,
  delay,
  color = "#888888",
  mono = true,
}: {
  children: React.ReactNode;
  delay: number;
  color?: string;
  mono?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"
      style={{
        color,
        fontFamily: mono ? "var(--font-mono)" : "inherit",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Model Compatibility Table
   ============================================ */

interface ModelRow {
  name: string;
  speed: number; // 1-3
  uncensored: string;
  nativeTools: boolean;
  djcodeResult: string; // "Full Agent" | "Native"
}

const models: ModelRow[] = [
  {
    name: "dolphin3",
    speed: 3,
    uncensored: "Full",
    nativeTools: false,
    djcodeResult: "Full Agent",
  },
  {
    name: "llama3",
    speed: 3,
    uncensored: "No",
    nativeTools: false,
    djcodeResult: "Full Agent",
  },
  {
    name: "mistral",
    speed: 2,
    uncensored: "Mild",
    nativeTools: false,
    djcodeResult: "Full Agent",
  },
  {
    name: "phi3",
    speed: 3,
    uncensored: "No",
    nativeTools: false,
    djcodeResult: "Full Agent",
  },
  {
    name: "gemma4",
    speed: 2,
    uncensored: "Mild",
    nativeTools: true,
    djcodeResult: "Native",
  },
  {
    name: "qwen3",
    speed: 2,
    uncensored: "No",
    nativeTools: true,
    djcodeResult: "Native",
  },
];

function SpeedBolts({ count }: { count: number }) {
  return (
    <span className="text-amber">
      {"⚡".repeat(count)}
      <span className="opacity-20">{"⚡".repeat(3 - count)}</span>
    </span>
  );
}

function StatusCell({
  value,
  delay,
  glow,
}: {
  value: boolean;
  delay: number;
  glow?: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block text-center"
      style={{
        color: value ? "#FFD700" : "rgba(255, 95, 86, 0.6)",
        textShadow: value && glow ? "0 0 20px rgba(255, 215, 0, 0.5)" : "none",
      }}
    >
      {value ? "\u2705" : "\u274C"}
    </motion.span>
  );
}

function DJcodeCell({
  label,
  delay,
}: {
  label: string;
  delay: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold"
      style={{
        color: "#FFD700",
        textShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
      }}
    >
      <span style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.6))" }}>
        &#x2713;
      </span>{" "}
      {label}
    </motion.span>
  );
}

/* ============================================
   Arrow Transform Animation
   ============================================ */

function ArrowTransform() {
  return (
    <motion.div
      className="flex items-center justify-center py-4 lg:py-0 lg:px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-2 lg:flex-row">
        {/* X that fades out */}
        <motion.span
          className="text-2xl"
          style={{ color: "rgba(255, 95, 86, 0.6)" }}
          initial={{ opacity: 1, scale: 1 }}
          whileInView={{ opacity: 0, scale: 0.3 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          &#10060;
        </motion.span>

        {/* Arrow */}
        <motion.svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          fill="none"
          className="hidden lg:block"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left center" }}
        >
          <motion.path
            d="M2 12H42M42 12L34 5M42 12L34 19"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
          />
        </motion.svg>

        {/* Down arrow (mobile) */}
        <motion.svg
          width="24"
          height="48"
          viewBox="0 0 24 48"
          fill="none"
          className="block lg:hidden"
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center" }}
        >
          <motion.path
            d="M12 2V42M12 42L5 34M12 42L19 34"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
          />
        </motion.svg>

        {/* Check that fades in */}
        <motion.span
          className="text-2xl"
          style={{
            color: "#FFD700",
            filter: "drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))",
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          &#10003;
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ============================================
   Pulsing Gold Column Header
   ============================================ */

function PulsingHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.th
      className="px-2 py-3 text-xs sm:text-sm font-bold text-right whitespace-nowrap"
      style={{
        color: "#FFD700",
        fontFamily: "var(--font-mono)",
      }}
      animate={{
        textShadow: [
          "0 0 8px rgba(255,215,0,0.3)",
          "0 0 20px rgba(255,215,0,0.6)",
          "0 0 8px rgba(255,215,0,0.3)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.th>
  );
}

/* ============================================
   Stagger container variant
   ============================================ */

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const staggerRow: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================
   Main Component
   ============================================ */

export function ToolRouter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1200px] px-6 py-24 sm:px-8 lg:px-12"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px ellipse at 50% 30%, rgba(255, 215, 0, 0.04), transparent 70%)",
        }}
      />

      {/* ---- Heading ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-16 text-center"
      >
        <h6 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
          Tool Extraction Router
        </h6>
        <h2
          className="mb-4 text-gradient-gold font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Any model. Full agent.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
          Other CLIs need function-calling models. DJcode makes{" "}
          <span className="text-text-primary font-medium">every</span> model an
          agent — even uncensored ones.
        </p>
      </motion.div>

      {/* ---- Before / After Split ---- */}
      <div className="relative mb-20 flex flex-col items-center gap-6 lg:flex-row lg:gap-0">
        {/* LEFT: Without DJcode */}
        <motion.div
          className="w-full lg:flex-1"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <TerminalChrome title="Without DJcode" variant="without">
            <TermLine delay={0.1} color="#60A5FA">
              dolphin3&gt; create a login page
            </TermLine>
            <div className="mt-3" />
            <TermLine delay={0.3} color="#888888">
              Here&apos;s the code for index.html:
            </TermLine>
            <TermLine delay={0.45} color="#555555">
              ```html
            </TermLine>
            <TermLine delay={0.5} color="#666666">
              &lt;html&gt;&lt;head&gt;...&lt;/head&gt;
            </TermLine>
            <TermLine delay={0.55} color="#666666">
              &lt;body&gt;&lt;form class=&quot;login&quot;&gt;...
            </TermLine>
            <TermLine delay={0.6} color="#555555">
              ```
            </TermLine>
            <div className="mt-2" />
            <TermLine delay={0.7} color="#888888">
              You can save this to index.html and then run:
            </TermLine>
            <TermLine delay={0.8} color="#555555">
              ```bash
            </TermLine>
            <TermLine delay={0.85} color="#666666">
              python -m http.server
            </TermLine>
            <TermLine delay={0.9} color="#555555">
              ```
            </TermLine>

            {/* Red overlay badge */}
            <motion.div
              className="mt-5 flex items-center gap-2 rounded-lg px-4 py-2.5"
              style={{
                background: "rgba(255, 95, 86, 0.08)",
                border: "1px solid rgba(255, 95, 86, 0.20)",
              }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <span className="text-lg">&#10060;</span>
              <span
                className="text-xs sm:text-sm font-medium"
                style={{ color: "rgba(255, 95, 86, 0.9)" }}
              >
                Just text. You copy-paste manually.
              </span>
            </motion.div>
          </TerminalChrome>
        </motion.div>

        {/* Arrow Transform */}
        <ArrowTransform />

        {/* RIGHT: With DJcode */}
        <motion.div
          className="w-full lg:flex-1"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <TerminalChrome title="With DJcode" variant="with">
            <TermLine delay={0.6} color="#60A5FA">
              dolphin3&gt; create a login page
            </TermLine>
            <div className="mt-3" />
            <TermLine delay={0.9} color="#FFD700">
              <span style={{ color: "#888888" }}>[</span>
              <span style={{ color: "#FFD700" }}>ROUTER</span>
              <span style={{ color: "#888888" }}>]</span> &#128221; Detected:
              Create index.html{" "}
              <span style={{ color: "#555555" }}>(23 lines)</span>
            </TermLine>
            <TermLine delay={1.05} color="#FFD700">
              <span style={{ color: "#888888" }}>[</span>
              <span style={{ color: "#FFD700" }}>ROUTER</span>
              <span style={{ color: "#888888" }}>]</span> &#128221; Detected:
              Create style.css{" "}
              <span style={{ color: "#555555" }}>(15 lines)</span>
            </TermLine>
            <TermLine delay={1.2} color="#FFD700">
              <span style={{ color: "#888888" }}>[</span>
              <span style={{ color: "#FFD700" }}>ROUTER</span>
              <span style={{ color: "#888888" }}>]</span> &#9881;&#65039;
              Detected: Run python -m http.server
            </TermLine>
            <TermLine delay={1.35} color="#888888">
              <span style={{ color: "#FFD700" }}>[ROUTER]</span> Execute all?{" "}
              <span
                style={{
                  color: "#FFD700",
                  fontWeight: 700,
                  textShadow: "0 0 10px rgba(255,215,0,0.4)",
                }}
              >
                [Y]
              </span>
            </TermLine>
            <div className="mt-3" />
            <TermLine delay={1.55} color="#4ADE80">
              &#9989; Created index.html
            </TermLine>
            <TermLine delay={1.7} color="#4ADE80">
              &#9989; Created style.css
            </TermLine>
            <TermLine delay={1.85} color="#4ADE80">
              &#9989; Server running at localhost:8000
            </TermLine>

            {/* Gold success badge */}
            <motion.div
              className="mt-5 flex items-center gap-2 rounded-lg px-4 py-2.5"
              style={{
                background: "rgba(255, 215, 0, 0.06)",
                border: "1px solid rgba(255, 215, 0, 0.25)",
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.08)",
              }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2.0, duration: 0.4 }}
            >
              <motion.span
                className="text-lg"
                animate={{
                  filter: [
                    "drop-shadow(0 0 4px rgba(255,215,0,0.3))",
                    "drop-shadow(0 0 12px rgba(255,215,0,0.7))",
                    "drop-shadow(0 0 4px rgba(255,215,0,0.3))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &#9989;
              </motion.span>
              <span
                className="text-xs sm:text-sm font-medium"
                style={{ color: "#FFD700" }}
              >
                Files created. Commands run. Zero copy-paste.
              </span>
            </motion.div>
          </TerminalChrome>
        </motion.div>
      </div>

      {/* ---- Model Compatibility Grid ---- */}
      <div ref={tableRef} className="mb-16">
        <motion.h3
          className="mb-8 text-center text-xl sm:text-2xl font-bold text-text-primary"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Model Compatibility
        </motion.h3>

        <div className="overflow-x-auto">
          <motion.table
            className="w-full border-collapse"
            variants={staggerContainer}
            initial="hidden"
            animate={tableInView ? "visible" : "hidden"}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <th
                  className="px-2 py-3 text-left text-xs sm:text-sm font-semibold text-text-secondary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Model
                </th>
                <th
                  className="px-2 py-3 text-center text-xs sm:text-sm font-semibold text-text-secondary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Speed
                </th>
                <th
                  className="px-2 py-3 text-center text-xs sm:text-sm font-semibold text-text-secondary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Uncensored
                </th>
                <th
                  className="px-2 py-3 text-center text-xs sm:text-sm font-semibold text-text-secondary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Native&nbsp;Tools
                </th>
                <PulsingHeader>With&nbsp;DJcode&nbsp;Router</PulsingHeader>
              </tr>
            </thead>
            <tbody>
              {models.map((model, rowIdx) => (
                <motion.tr
                  key={model.name}
                  variants={staggerRow}
                  className="group"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  {/* Model name */}
                  <td
                    className="px-2 py-3 text-sm sm:text-base font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {model.name}
                  </td>

                  {/* Speed */}
                  <td className="px-2 py-3 text-center">
                    <SpeedBolts count={model.speed} />
                  </td>

                  {/* Uncensored */}
                  <td className="px-2 py-3 text-center">
                    <span
                      className="text-xs sm:text-sm"
                      style={{
                        color:
                          model.uncensored === "Full"
                            ? "#4ADE80"
                            : model.uncensored === "Mild"
                              ? "#FFAA00"
                              : "rgba(255, 95, 86, 0.5)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {model.uncensored === "Full"
                        ? "\u2713 Full"
                        : model.uncensored === "Mild"
                          ? "~ Mild"
                          : "\u2717 No"}
                    </span>
                  </td>

                  {/* Native Tools */}
                  <td className="px-2 py-3 text-center">
                    <StatusCell
                      value={model.nativeTools}
                      delay={rowIdx * 0.08 + 0.5}
                    />
                  </td>

                  {/* DJcode Router result */}
                  <td className="px-2 py-3 text-right">
                    <DJcodeCell
                      label={model.djcodeResult}
                      delay={rowIdx * 0.08 + 0.7}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>

      {/* ---- Bottom Callout ---- */}
      <motion.div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-xl p-6 sm:p-8 text-center"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 215, 0, 0.20)",
          boxShadow: "0 0 60px rgba(255, 215, 0, 0.06)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle gold radial behind text */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(400px circle at 50% 50%, rgba(255, 215, 0, 0.06), transparent 70%)",
          }}
        />

        <p className="relative text-base sm:text-lg leading-relaxed text-text-secondary">
          <span className="font-bold text-text-primary">
            The uncensored + fast combo:
          </span>{" "}
          dolphin3 at{" "}
          <span
            className="font-mono font-bold"
            style={{
              color: "#FFD700",
              textShadow: "0 0 12px rgba(255, 215, 0, 0.4)",
            }}
          >
            50+ tok/s
          </span>
          , never refuses, AND creates files, installs packages, runs commands.{" "}
          <span className="font-semibold text-text-primary">
            No other CLI does this.
          </span>
        </p>
        <p className="relative mt-3 text-sm leading-relaxed text-text-muted">
          Goose needs native tool-calling models too. DJcode&apos;s Tool Router is unique.
        </p>
      </motion.div>
    </section>
  );
}
