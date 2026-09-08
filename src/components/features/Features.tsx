"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  HardDrive,
  Cpu,
  ShieldCheck,
  Sparkles,
  Users,
  Database,
} from "lucide-react";

/* ============================================
   Feature Data
   ============================================ */

interface Feature {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
  miniVisual: "lock" | "chip" | "binary" | "nodes" | "morph" | "bars";
}

const features: Feature[] = [
  {
    icon: HardDrive,
    title: "Local First",
    description:
      "Run inference on your hardware with Ollama or MLX. Local models need no cloud API key. Hosted providers are an explicit choice.",
    miniVisual: "lock",
  },
  {
    icon: Cpu,
    title: "Apple Silicon Native",
    description:
      "MLX backend runs models natively on M-series chips. No emulation. No CUDA. Pure Metal performance.",
    miniVisual: "chip",
  },
  {
    icon: ShieldCheck,
    title: "Zero Telemetry",
    description:
      "DJcode has no built-in usage analytics. Sessions and memory are stored locally. Hosted models receive the context you send them.",
    miniVisual: "binary",
  },
  {
    icon: Users,
    title: "Specialist Agents",
    description:
      "Coding, debugging, testing, architecture and review specialists. Coordinate work through multi-agent pipelines and a shared context bus.",
    miniVisual: "nodes",
  },
  {
    icon: Sparkles,
    title: "Smart Prompt Enhancer",
    description:
      "8 intent modes detect what you're trying to do. Auto-injects git state, project files, referenced code. Your one-liner becomes a precise instruction.",
    miniVisual: "morph",
  },
  {
    icon: Database,
    title: "3-Tier Memory",
    description:
      "Session memory, persistent facts, and ChromaDB semantic vectors. DJcode remembers across sessions. Retrieve relevant saved context for your next task.",
    miniVisual: "bars",
  },
];

/* ============================================
   Mini Visuals (animated on hover)
   ============================================ */

function MiniLock({ hovered }: { hovered: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.rect
        x="20"
        y="35"
        width="40"
        height="30"
        rx="4"
        stroke="#4ADE80"
        strokeWidth="2"
        fill="none"
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M28 35V28C28 21.4 33.4 16 40 16C46.6 16 52 21.4 52 28V35"
        stroke="#4ADE80"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="40"
        cy="50"
        r="4"
        fill="#4ADE80"
        animate={{
          scale: hovered ? [1, 1.3, 1] : 1,
          opacity: hovered ? 1 : 0.5,
        }}
        transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
      />
    </svg>
  );
}

function MiniChip({ hovered }: { hovered: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.rect
        x="22"
        y="22"
        width="36"
        height="36"
        rx="6"
        stroke="#FFD700"
        strokeWidth="2"
        fill="none"
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />
      {/* Connection pins */}
      {[30, 40, 50].map((pos) => (
        <g key={`pin-${pos}`}>
          <motion.line
            x1={pos}
            y1="22"
            x2={pos}
            y2="12"
            stroke="#FFD700"
            strokeWidth="2"
            animate={{ opacity: hovered ? 0.8 : 0.3 }}
          />
          <motion.line
            x1={pos}
            y1="58"
            x2={pos}
            y2="68"
            stroke="#FFD700"
            strokeWidth="2"
            animate={{ opacity: hovered ? 0.8 : 0.3 }}
          />
          <motion.line
            x1="22"
            y1={pos}
            x2="12"
            y2={pos}
            stroke="#FFD700"
            strokeWidth="2"
            animate={{ opacity: hovered ? 0.8 : 0.3 }}
          />
          <motion.line
            x1="58"
            y1={pos}
            x2="68"
            y2={pos}
            stroke="#FFD700"
            strokeWidth="2"
            animate={{ opacity: hovered ? 0.8 : 0.3 }}
          />
        </g>
      ))}
      {/* Inner glow lines */}
      <motion.rect
        x="30"
        y="30"
        width="20"
        height="20"
        rx="2"
        stroke="#FFD700"
        strokeWidth="1"
        fill="none"
        animate={{
          opacity: hovered ? [0.3, 0.8, 0.3] : 0.2,
        }}
        transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
      />
    </svg>
  );
}

function MiniBinary({ hovered }: { hovered: boolean }) {
  const chars = ["0", "1", "0", "0", "1", "0", "1", "1", "0"];
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {chars.map((char, i) => (
        <motion.text
          key={i}
          x={15 + (i % 3) * 22}
          y={25 + Math.floor(i / 3) * 20}
          fill="#4ADE80"
          fontSize="14"
          fontFamily="var(--font-mono)"
          animate={{
            opacity: hovered ? [0.2, 0.8, 0.2] : 0.3,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.08,
            repeat: hovered ? Infinity : 0,
          }}
        >
          {char}
        </motion.text>
      ))}
      {hovered && (
        <motion.text
          x="14"
          y="75"
          fill="#4ADE80"
          fontSize="11"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          0 bytes
        </motion.text>
      )}
    </svg>
  );
}

function MiniNodes({ hovered }: { hovered: boolean }) {
  const nodePositions = [
    { x: 40, y: 15 },
    { x: 15, y: 45 },
    { x: 65, y: 45 },
    { x: 40, y: 65 },
  ];
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Connections */}
      {[
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
      ].map(([from, to], i) => (
        <motion.line
          key={`line-${i}`}
          x1={nodePositions[from].x}
          y1={nodePositions[from].y}
          x2={nodePositions[to].x}
          y2={nodePositions[to].y}
          stroke="#60A5FA"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          animate={{
            opacity: hovered ? 0.8 : 0.3,
            strokeDashoffset: hovered ? [0, -8] : 0,
          }}
          transition={{
            strokeDashoffset: {
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: { duration: 0.3 },
          }}
        />
      ))}
      {/* Nodes */}
      {nodePositions.map((pos, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={pos.x}
          cy={pos.y}
          r={i === 0 ? 7 : 5}
          fill={i === 0 ? "#FFD700" : "#60A5FA"}
          animate={{
            scale: hovered ? [1, 1.15, 1] : 1,
            opacity: hovered ? 1 : 0.5,
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            repeat: hovered ? Infinity : 0,
          }}
        />
      ))}
    </svg>
  );
}

function MiniMorph({ hovered }: { hovered: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Short text (before) */}
      <motion.g
        animate={{ opacity: hovered ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        <rect x="8" y="20" width="28" height="4" rx="2" fill="#888888" />
        <rect x="8" y="30" width="20" height="4" rx="2" fill="#888888" />
        <rect x="8" y="40" width="24" height="4" rx="2" fill="#888888" />
      </motion.g>
      {/* Expanded text (after) */}
      <motion.g
        animate={{ opacity: hovered ? 0.8 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <rect x="8" y="12" width="64" height="3" rx="1.5" fill="#A78BFA" />
        <rect x="8" y="20" width="60" height="3" rx="1.5" fill="#A78BFA" />
        <rect x="8" y="28" width="56" height="3" rx="1.5" fill="#60A5FA" />
        <rect x="8" y="36" width="62" height="3" rx="1.5" fill="#60A5FA" />
        <rect x="8" y="44" width="50" height="3" rx="1.5" fill="#4ADE80" />
        <rect x="8" y="52" width="58" height="3" rx="1.5" fill="#4ADE80" />
        <rect x="8" y="60" width="44" height="3" rx="1.5" fill="#4ADE80" />
        <rect x="8" y="68" width="52" height="3" rx="1.5" fill="#FFD700" />
      </motion.g>
    </svg>
  );
}

function MiniBars({ hovered }: { hovered: boolean }) {
  const bars = [
    { y: 18, color: "#34D399", label: "Session", width: 50 },
    { y: 38, color: "#60A5FA", label: "Facts", width: 40 },
    { y: 58, color: "#A78BFA", label: "Vectors", width: 60 },
  ];
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {bars.map((bar, i) => (
        <g key={i}>
          <rect
            x="8"
            y={bar.y}
            width="64"
            height="12"
            rx="6"
            fill="rgba(255,255,255,0.05)"
          />
          <motion.rect
            x="8"
            y={bar.y}
            height="12"
            rx="6"
            fill={bar.color}
            initial={{ width: 0 }}
            animate={{ width: hovered ? bar.width : bar.width * 0.3 }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ opacity: 0.7 }}
          />
        </g>
      ))}
    </svg>
  );
}

const miniVisuals: Record<
  Feature["miniVisual"],
  React.ComponentType<{ hovered: boolean }>
> = {
  lock: MiniLock,
  chip: MiniChip,
  binary: MiniBinary,
  nodes: MiniNodes,
  morph: MiniMorph,
  bars: MiniBars,
};

/* ============================================
   Feature Card
   ============================================ */

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const MiniVisual = miniVisuals[feature.miniVisual];
  const Icon = feature.icon;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty("--mouse-x", `${x}px`);
      cardRef.current.style.setProperty("--mouse-y", `${y}px`);

      // Perspective tilt (max 3deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((x - centerX) / centerX) * 3;
      const tiltY = ((y - centerY) / centerY) * -3;
      cardRef.current.style.setProperty("--tilt-x", `${tiltX}deg`);
      cardRef.current.style.setProperty("--tilt-y", `${tiltY}deg`);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--tilt-x", "0deg");
      cardRef.current.style.setProperty("--tilt-y", "0deg");
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card relative overflow-hidden p-6 cursor-default group"
      style={{
        transform: hovered
          ? "perspective(1000px) rotateY(var(--tilt-x, 0deg)) rotateX(var(--tilt-y, 0deg)) scale(1.02)"
          : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Mouse-tracking radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 215, 0, 0.05), transparent 60%)",
        }}
      />

      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(255,215,0,0.08)]">
        <Icon className="text-gold" size={24} />
      </div>

      {/* Title */}
      <h4 className="mb-2 text-lg font-bold leading-[1.4] text-text-primary">
        {feature.title}
      </h4>

      {/* Description */}
      <p className="text-sm leading-relaxed text-text-secondary">
        {feature.description}
      </p>

      {/* Mini Visual */}
      <div className="absolute bottom-3 right-3 pointer-events-none sm:block hidden">
        <MiniVisual hovered={hovered} />
      </div>
    </motion.div>
  );
}

/* ============================================
   Features Section
   ============================================ */

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1200px] px-6 py-24 sm:px-8 lg:px-12"
    >
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 text-center"
      >
        <h6 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
          Features
        </h6>
        <h2
          className="mb-4 text-gradient-gold font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
          }}
        >
          Built different
        </h2>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-text-secondary">
          Not another API wrapper. A complete autonomous coding system.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
