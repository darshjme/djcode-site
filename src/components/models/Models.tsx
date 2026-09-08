"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

/* -------------------------------------------------- */
/*  Types                                             */
/* -------------------------------------------------- */

interface ModelData {
  name: string;
  provider: "Ollama" | "MLX";
  providerColor: string;
  whatIsIt: string;
  quant: string;
  quantLabel: string;
  ramGB: number;
  maxRamScale: number;
  context: string;
  toolCalling: boolean;
  status: string;
  statusColor: string;
  statusPulse: boolean;
  bestFor: string;
  sizeLabel: string;
  installCmd: string;
  note?: string;
}

/* -------------------------------------------------- */
/*  Funnel stages                                     */
/* -------------------------------------------------- */

interface FunnelStage {
  label: string;
  bits: string;
  reduction: string;
  description: string;
  widthPct: number;
}

const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: "Full Precision",
    bits: "32-bit",
    reduction: "100%",
    description:
      "Original model weights at full floating-point precision. A 70B model needs about 280GB for 32-bit weights alone.",
    widthPct: 100,
  },
  {
    label: "FP16 Half",
    bits: "16-bit",
    reduction: "50%",
    description:
      "Halved precision. Nearly identical quality, half the memory footprint.",
    widthPct: 72,
  },
  {
    label: "INT8 Quantized",
    bits: "8-bit",
    reduction: "25%",
    description:
      "Integer quantization. Minimal quality loss, runs on consumer GPUs.",
    widthPct: 48,
  },
  {
    label: "Q4_K_M",
    bits: "4-bit",
    reduction: "12.5%",
    description:
      "Four-bit weights use roughly one eighth of FP32 storage. A 70B model still needs about 35GB for raw weights, plus overhead.",
    widthPct: 28,
  },
];

/* -------------------------------------------------- */
/*  Models data                                       */
/* -------------------------------------------------- */

const MODELS: ModelData[] = [
  {
    name: "Gemma 4 E4B",
    provider: "Ollama",
    providerColor: "#34D399",
    whatIsIt:
      "A compact Gemma model for local workflows. Choose the exact tag for your hardware.",
    quant: "Quantized",
    quantLabel: "4-bit quantized",
    ramGB: 9.6,
    maxRamScale: 32,
    context: "128K",
    toolCalling: true,
    status: "Local",
    statusColor: "#34D399",
    statusPulse: false,
    bestFor: "General coding, daily driver",
    sizeLabel: "9.6 GB",
    installCmd: "ollama pull gemma4",
  },
  {
    name: "Gemma 4 26B MoE",
    provider: "Ollama",
    providerColor: "#34D399",
    whatIsIt:
      "Mixture-of-Experts. 26B params but only activates what it needs.",
    quant: "Quantized",
    quantLabel: "4-bit quantized",
    ramGB: 19,
    maxRamScale: 32,
    context: "256K",
    toolCalling: true,
    status: "Pro",
    statusColor: "#A78BFA",
    statusPulse: false,
    bestFor: "Complex reasoning, architecture planning",
    sizeLabel: "19 GB",
    installCmd: "ollama pull gemma4:26b",
  },
  {
    name: "Gemma 4 E4B · MLX",
    provider: "MLX",
    providerColor: "#FFD700",
    whatIsIt:
      "Native Metal acceleration via MLX. Designed for M-series hardware.",
    quant: "MLX",
    quantLabel: "8-bit quantized",
    ramGB: 9.5,
    maxRamScale: 32,
    context: "128K",
    toolCalling: true,
    status: "Native",
    statusColor: "#FFD700",
    statusPulse: false,
    bestFor: "Apple Silicon speed, batch processing",
    sizeLabel: "9.5 GB",
    installCmd: "ollama pull gemma4:e4b-mlx",
    note: "Apple Silicon only · Ollama MLX model tag",
  },
  {
    name: "Qwen 3 32B",
    provider: "Ollama",
    providerColor: "#34D399",
    whatIsIt:
      "A larger Qwen model for reasoning and coding. Context capacity depends on your runtime settings.",
    quant: "Quantized",
    quantLabel: "4-bit quantized",
    ramGB: 20,
    maxRamScale: 32,
    context: "128K",
    toolCalling: true,
    status: "128K",
    statusColor: "#60A5FA",
    statusPulse: false,
    bestFor: "Large codebases, long documents",
    sizeLabel: "20 GB",
    installCmd: "ollama pull qwen3:32b",
  },
];

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */

function ramBarColor(gb: number): string {
  if (gb <= 10) return "#4ADE80";
  if (gb <= 16) return "#FFAA00";
  return "#FF5F56";
}

/* -------------------------------------------------- */
/*  Copy button                                       */
/* -------------------------------------------------- */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium text-text-muted transition-colors hover:bg-white/10 hover:text-text-secondary"
      aria-label={`Copy: ${text}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* -------------------------------------------------- */
/*  Funnel visualization                              */
/* -------------------------------------------------- */

function QuantFunnel({ inView }: { inView: boolean }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const stageHeight = 56;
  const gap = 6;
  const totalHeight = FUNNEL_STAGES.length * stageHeight + (FUNNEL_STAGES.length - 1) * gap;
  const svgWidth = 600;
  const svgHeight = totalHeight + 20;

  return (
    <motion.div
      className="mx-auto mb-14 w-full max-w-[640px]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="funnel-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFAA00" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="funnel-gold-hover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFAA00" stopOpacity="0.85" />
            </linearGradient>
            <filter id="funnel-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {FUNNEL_STAGES.map((stage, i) => {
            const y = i * (stageHeight + gap) + 10;
            const nextWidthPct =
              i < FUNNEL_STAGES.length - 1
                ? FUNNEL_STAGES[i + 1].widthPct
                : stage.widthPct * 0.6;

            const topW = (stage.widthPct / 100) * (svgWidth - 40);
            const botW = (nextWidthPct / 100) * (svgWidth - 40);
            const cx = svgWidth / 2;

            const topL = cx - topW / 2;
            const topR = cx + topW / 2;
            const botL = cx - botW / 2;
            const botR = cx + botW / 2;

            const isHovered = hoveredIdx === i;
            const expandPx = isHovered ? 8 : 0;

            const points = `${topL - expandPx},${y} ${topR + expandPx},${y} ${botR + expandPx * 0.6},${y + stageHeight} ${botL - expandPx * 0.6},${y + stageHeight}`;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              >
                <motion.polygon
                  points={points}
                  fill={isHovered ? "url(#funnel-gold-hover)" : "url(#funnel-gold)"}
                  opacity={isHovered ? 1 : 0.65 - i * 0.08}
                  filter={isHovered ? "url(#funnel-glow)" : undefined}
                  stroke="rgba(255,215,0,0.3)"
                  strokeWidth="1"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={
                    inView
                      ? { scaleX: 1, opacity: isHovered ? 1 : 0.65 - i * 0.08 }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: `${cx}px ${y + stageHeight / 2}px` }}
                />

                {/* Stage label */}
                <text
                  x={cx}
                  y={y + stageHeight / 2 - 8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {stage.label}
                </text>

                {/* Bits + reduction */}
                <text
                  x={cx}
                  y={y + stageHeight / 2 + 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {stage.bits} — {stage.reduction} size
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <motion.div
            className="pointer-events-none absolute left-1/2 z-30 w-72 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 px-4 py-3 text-center text-xs leading-relaxed text-text-secondary shadow-xl backdrop-blur-md"
            style={{
              top: `calc(${((hoveredIdx * (stageHeight + gap) + 10 + stageHeight) / svgHeight) * 100}% + 8px)`,
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {FUNNEL_STAGES[hoveredIdx].description}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------- */
/*  Model Card                                        */
/* -------------------------------------------------- */

function ModelCard({
  model,
  index,
  inView,
}: {
  model: ModelData;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [barAnimated, setBarAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const ramPct = Math.min((model.ramGB / model.maxRamScale) * 100, 100);

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
      style={{
        boxShadow: hovered
          ? "0 0 40px rgba(255,215,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glass highlight on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(255,215,0,0.04), transparent 60%)",
        }}
      />

      <div className="relative flex flex-1 flex-col gap-3.5 p-5">
        {/* Top row: provider + status */}
        <div className="flex items-center justify-between">
          <span
            className="inline-block rounded px-2 py-0.5 font-sans text-[11px] font-semibold"
            style={{
              backgroundColor: `${model.providerColor}15`,
              color: model.providerColor,
            }}
          >
            {model.provider}
          </span>

          <div
            className="flex items-center gap-1.5 rounded-sm px-2 py-0.5"
            style={{ backgroundColor: `${model.statusColor}15` }}
          >
            {model.statusPulse && (
              <span
                className="models-status-dot inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: model.statusColor,
                  boxShadow: `0 0 4px ${model.statusColor}`,
                }}
              />
            )}
            <span
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: model.statusColor }}
            >
              {model.status}
            </span>
          </div>
        </div>

        {/* Model name */}
        <h4 className="font-sans text-lg font-bold text-text-primary">
          {model.name}
        </h4>

        {/* What is it */}
        <p className="text-sm leading-relaxed text-text-secondary">
          {model.whatIsIt}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-gold-dim">
            {model.quant}
          </span>
          <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-text-muted">
            {model.context} ctx
          </span>
          <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-text-muted">
            {model.sizeLabel}
          </span>
          {model.toolCalling && (
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              Tool Calling
            </span>
          )}
        </div>

        {model.note && (
          <p className="text-xs font-medium text-gold-dim">{model.note}</p>
        )}

        {/* Best for */}
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-secondary">Best for:</span>{" "}
          {model.bestFor}
        </p>

        {/* RAM bar */}
        <div className="mt-auto pt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">
              Approximate model footprint
            </span>
            <span className="text-[11px] font-medium text-text-secondary">
              ~{model.ramGB} GB
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full"
              style={{
                width: barAnimated ? `${ramPct}%` : "0%",
                background: `linear-gradient(90deg, ${ramBarColor(model.ramGB)}, ${ramBarColor(model.ramGB)}cc)`,
                transition: "width 1500ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* Install command */}
        <div className="flex items-center gap-2 overflow-hidden rounded-md bg-bg-code px-3 py-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-text-code">
            {model.installCmd}
          </code>
          <CopyButton text={model.installCmd} />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------- */
/*  Main Component                                    */
/* -------------------------------------------------- */

export default function Models() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  /* Scroll-linked transforms */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Zoom: 0.85 -> 1.0 as section enters, back to 0.95 as it leaves */
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95]);

  /* Parallax: content moves at 0.95x scroll speed */
  const y = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section
      id="models"
      className="models-section relative overflow-hidden py-16 md:py-24"
      ref={sectionRef}
    >
      {/* Pulsing radial background */}
      <div className="models-bg-pulse pointer-events-none absolute inset-0" />

      <motion.div
        className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12"
        style={{ scale, y }}
      >
        {/* Section heading */}
        <motion.div
          className="mb-10 text-center md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gradient-gold mb-4 font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            Run quantized models locally
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
            Smaller weights. More room to build. Choose a model that fits your hardware and context needs.
          </p>
        </motion.div>

        {/* Quantization funnel */}
        <QuantFunnel inView={inView} />

        {/* 2x2 Model cards grid */}
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2">
          {MODELS.map((model, i) => (
            <ModelCard
              key={model.name}
              model={model}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-[1000px] text-xs leading-6 text-text-secondary">Illustrative local options. Footprints are model downloads, not total RAM requirements; context caches and runtime overhead add memory. Check current <a href="https://ollama.com/library/gemma4" className="text-gold underline">Gemma tags</a> and <a href="https://ollama.com/library/qwen3" className="text-gold underline">Qwen tags</a>. Install commands download models only when you run them.</p>
        {/* RAM guide footer */}
        <motion.div
          className="mx-auto mt-10 max-w-[1000px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl"
            style={{ borderLeftWidth: 3, borderLeftColor: "#FFD700" }}
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
            <p className="text-sm leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">
                RAM Guide:
              </span>{" "}
              8GB{" "}
              <span className="font-mono text-xs text-text-muted">→</span> 7B
              models{" · "}16GB{" "}
              <span className="font-mono text-xs text-text-muted">→</span>{" "}
              9-12B models{" · "}32GB{" "}
              <span className="font-mono text-xs text-text-muted">→</span>{" "}
              26B MoE / 32B{" · "}64GB+{" "}
              <span className="font-mono text-xs text-text-muted">→</span>{" "}
              70B+
            </p>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .models-status-dot {
          animation: modelsStatusPulse 2s ease infinite;
        }
        @keyframes modelsStatusPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
        .models-bg-pulse {
          background: radial-gradient(
            ellipse 80% 60% at 50% 50%,
            transparent 40%,
            rgba(255, 215, 0, 0.03) 100%
          );
          animation: modelsBgPulse 6s ease-in-out infinite;
        }
        @keyframes modelsBgPulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
