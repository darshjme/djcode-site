"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";

/* -------------------------------------------------- */
/*  Types                                             */
/* -------------------------------------------------- */

interface ModelCard {
  name: string;
  provider: string;
  providerColor: string;
  quant: string;
  context: string;
  ram: number;
  maxRam: number;
  status: string;
  statusColor: string;
  statusDot: boolean;
  pullCmd: string;
  usageCmd: string;
  note?: string;
}

/* -------------------------------------------------- */
/*  Data                                              */
/* -------------------------------------------------- */

const MODELS: ModelCard[] = [
  {
    name: "Gemma 4 E4B",
    provider: "Ollama",
    providerColor: "#34D399",
    quant: "4-bit quantized",
    context: "32K context",
    ram: 4,
    maxRam: 24,
    status: "Active",
    statusColor: "#34D399",
    statusDot: true,
    pullCmd: "ollama pull gemma4",
    usageCmd: "djcode --model gemma4",
  },
  {
    name: "Gemma 4 26B MoE",
    provider: "Ollama",
    providerColor: "#34D399",
    quant: "4-bit quantized",
    context: "32K context",
    ram: 16,
    maxRam: 24,
    status: "Pro",
    statusColor: "#A78BFA",
    statusDot: false,
    pullCmd: "ollama pull gemma4:26b",
    usageCmd: "djcode --model gemma4:26b",
  },
  {
    name: "Gemma 4 E4B 8-bit",
    provider: "MLX",
    providerColor: "#FFD700",
    quant: "8-bit quantized",
    context: "32K context",
    ram: 8,
    maxRam: 24,
    status: "Native",
    statusColor: "#FFD700",
    statusDot: false,
    pullCmd: "pip install mlx-vlm",
    usageCmd: "djcode --provider mlx",
    note: "Apple Silicon only",
  },
  {
    name: "Qwen 3 32B",
    provider: "Ollama",
    providerColor: "#34D399",
    quant: "4-bit quantized",
    context: "128K context",
    ram: 20,
    maxRam: 24,
    status: "128K",
    statusColor: "#60A5FA",
    statusDot: false,
    pullCmd: "ollama pull qwen3:32b",
    usageCmd: "djcode --model qwen3:32b",
  },
];

/* -------------------------------------------------- */
/*  Geometric shapes generator                        */
/* -------------------------------------------------- */

type ShapeKind = "circle" | "triangle" | "square";

interface GeoShape {
  kind: ShapeKind;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
}

function generateShapes(seed: number): GeoShape[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };

  const kinds: ShapeKind[] = ["circle", "triangle", "square"];
  const count = 6 + Math.floor(rand() * 3);
  const shapes: GeoShape[] = [];

  for (let i = 0; i < count; i++) {
    shapes.push({
      kind: kinds[Math.floor(rand() * kinds.length)],
      x: 10 + rand() * 80,
      y: 10 + rand() * 70,
      size: 20 + rand() * 30,
      rotation: rand() * 360,
      delay: rand() * 0.5,
    });
  }
  return shapes;
}

/* -------------------------------------------------- */
/*  Single Shape SVG                                  */
/* -------------------------------------------------- */

function ShapeSVG({ shape, hovered }: { shape: GeoShape; hovered: boolean }) {
  const baseOpacity = hovered ? 0.35 : 0.1;
  const scale = hovered ? 1.1 : 1;
  const filter = hovered
    ? "drop-shadow(0 0 6px rgba(255,215,0,0.4))"
    : "none";

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: shape.size,
    height: shape.size,
    opacity: baseOpacity,
    transform: `rotate(${shape.rotation}deg) scale(${scale})`,
    filter,
    transition: "opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease",
    transitionDelay: `${shape.delay * 0.1}s`,
  };

  if (shape.kind === "circle") {
    return (
      <svg style={style} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="#FFD700" strokeWidth="1.5" />
      </svg>
    );
  }
  if (shape.kind === "triangle") {
    return (
      <svg style={style} viewBox="0 0 40 40" fill="none">
        <polygon
          points="20,4 36,36 4,36"
          stroke="#FFAA00"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg style={style} viewBox="0 0 40 40" fill="none">
      <rect
        x="6"
        y="6"
        width="28"
        height="28"
        stroke="#FF8C00"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
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
/*  RAM bar color                                     */
/* -------------------------------------------------- */

function ramColor(ram: number): string {
  if (ram <= 8) return "#4ADE80";
  if (ram <= 16) return "#FFAA00";
  return "#FF5F56";
}

/* -------------------------------------------------- */
/*  Single Model Card                                 */
/* -------------------------------------------------- */

function ModelCardComponent({
  model,
  index,
  inView,
}: {
  model: ModelCard;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const shapes = useMemo(() => generateShapes((index + 1) * 7919), [index]);
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

  const ramPct = Math.min((model.ram / model.maxRam) * 100, 100);

  return (
    <motion.div
      ref={cardRef}
      className="glass-card group relative flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status pill */}
      <div
        className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-sm px-2 py-0.5"
        style={{ backgroundColor: `${model.statusColor}15` }}
      >
        {model.statusDot && (
          <span
            className="status-dot inline-block h-1.5 w-1.5 rounded-full"
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

      {/* Geometric header */}
      <div
        className="relative h-[160px] overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,215,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {shapes.map((shape, si) => (
          <ShapeSVG key={si} shape={shape} hovered={hovered} />
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Provider badge */}
        <span
          className="inline-block w-fit rounded px-2 py-0.5 font-sans text-[11px] font-semibold"
          style={{
            backgroundColor: `${model.providerColor}15`,
            color: model.providerColor,
          }}
        >
          {model.provider}
        </span>

        {/* Model name */}
        <h4 className="font-sans text-lg font-bold text-text-primary">
          {model.name}
        </h4>

        {/* Quant + context */}
        <p className="text-xs text-text-muted">
          {model.quant} | {model.context}
        </p>

        {model.note && (
          <p className="text-xs font-medium text-gold-dim">{model.note}</p>
        )}

        {/* RAM bar */}
        <div className="mt-auto">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">RAM</span>
            <span className="text-[11px] font-medium text-text-secondary">
              ~{model.ram}GB
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: barAnimated ? `${ramPct}%` : "0%",
                background: `linear-gradient(90deg, ${ramColor(model.ram)}, ${ramColor(model.ram)}cc)`,
                transition: "width 1500ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* Pull command */}
        <div className="flex items-center gap-2 overflow-hidden rounded-md bg-bg-code px-3 py-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-text-code">
            {model.pullCmd}
          </code>
          <CopyButton text={model.pullCmd} />
        </div>

        {/* Usage command */}
        <div className="flex items-center gap-2 overflow-hidden rounded-md bg-bg-code px-3 py-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-text-code">
            {model.usageCmd}
          </code>
          <CopyButton text={model.usageCmd} />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------- */
/*  Main Component                                    */
/* -------------------------------------------------- */

export default function Models() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="models" className="relative py-16 md:py-24" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gradient-gold mb-4 font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            Run quantized models locally
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-text-secondary">
            No API key. No internet. Just your machine and a model.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2">
          {MODELS.map((model, i) => (
            <ModelCardComponent
              key={model.name}
              model={model}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* RAM Guide callout */}
        <motion.div
          className="mx-auto mt-10 max-w-[1000px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="glass-card flex items-start gap-3 border-l-[3px] border-l-gold p-5">
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
              8GB Mac = Gemma 4 E4B. 16GB = Gemma 4 26B MoE. 32GB+ = Qwen 3
              32B. Apple Silicon users: try the MLX backend for native Metal
              performance.
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .status-dot {
          animation: statusPulse 2s ease infinite;
        }
        @keyframes statusPulse {
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
      `}</style>
    </section>
  );
}
