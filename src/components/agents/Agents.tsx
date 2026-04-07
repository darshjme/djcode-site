"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ============================================
   Agent Types & Data
   ============================================ */

type NodeType = "orchestrator" | "action" | "condition" | "planner" | "trigger";

interface Agent {
  name: string;
  role: string;
  icon: string;
  type: NodeType;
  oneLiner: string;
  tools?: string;
  temp?: string;
  capabilities?: string;
}

const NODE_COLORS: Record<NodeType, string> = {
  orchestrator: "#FFD700",
  action: "#60A5FA",
  condition: "#FFAA00",
  planner: "#A78BFA",
  trigger: "#34D399",
};

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  orchestrator: "Orchestrator",
  action: "Action",
  condition: "Condition",
  planner: "Planner",
  trigger: "Trigger",
};

const devAgents: Agent[] = [
  {
    name: "Vyasa",
    role: "Orchestrator",
    icon: "\u{1F3AF}",
    type: "orchestrator",
    oneLiner: "Decomposes. Delegates. Never codes.",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Decomposes tasks, delegates to agents, enforces quality gates. Never writes code directly.",
  },
  {
    name: "Garuda",
    role: "Scout",
    icon: "\u{1F50E}",
    type: "trigger",
    oneLiner: "Read-only recon, 30 tool rounds",
    tools: "5 (read-only)",
    temp: "0.3",
    capabilities:
      "Reports: summary, key files, patterns, issues, recommendations. 30 tool rounds max.",
  },
  {
    name: "Vishwakarma",
    role: "Architect",
    icon: "\u{1F4D0}",
    type: "planner",
    oneLiner: "Structured plans with risk analysis",
    tools: "5 (read-only)",
    temp: "0.5",
    capabilities:
      "Produces structured plans: goal, constraints, design, phases, risks, acceptance criteria.",
  },
  {
    name: "Prometheus",
    role: "Coder",
    icon: "\u{1F4BB}",
    type: "action",
    oneLiner: "Full-stack across 6 languages",
    tools: "All 8 tools",
    temp: "0.4",
    capabilities:
      "Python/TS/Rust/Go/Java/C++. Prefers surgical edits. Reads existing code first.",
  },
  {
    name: "Agni",
    role: "Tester",
    icon: "\u{1F9EA}",
    type: "action",
    oneLiner: "Happy, edge, error, boundary cases",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Happy path + edge cases + error cases + boundary conditions. Runs tests after writing.",
  },
  {
    name: "Dharma",
    role: "Reviewer",
    icon: "\u2705",
    type: "condition",
    oneLiner: "7-point code review checklist",
    tools: "5 (read-only)",
    temp: "0.3",
    capabilities:
      "Correctness, security, performance, error handling, style, tests, dependencies.",
  },
  {
    name: "Shiva",
    role: "Refactorer",
    icon: "\u267B\uFE0F",
    type: "action",
    oneLiner: "Zero behavior changes. Tests first.",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Zero behavior changes guaranteed. Writes tests first if none exist. Atomic commits.",
  },
  {
    name: "Vayu",
    role: "DevOps",
    icon: "\u2601\uFE0F",
    type: "action",
    oneLiner: "Docker, CI/CD, K8s, Terraform",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Docker, CI/CD, Kubernetes, Terraform, monitoring, secrets management.",
  },
  {
    name: "Saraswati",
    role: "Docs",
    icon: "\u{1F4DD}",
    type: "action",
    oneLiner: "README to architecture docs",
    tools: "All 8 tools",
    temp: "0.6",
    capabilities:
      "README, API docs, architecture docs, changelogs, tutorials, inline comments.",
  },
  {
    name: "Sherlock",
    role: "Debugger",
    icon: "\u{1F50D}",
    type: "action",
    oneLiner: "5-step root cause methodology",
    tools: "All 8 tools",
    temp: "0.2",
    capabilities:
      "Reproduce, isolate, hypothesize, verify, fix. Always checks git diff.",
  },
];

const contentAgents: Agent[] = [
  {
    name: "Narada",
    role: "Campaign Director",
    icon: "\u{1F4E2}",
    type: "orchestrator",
    oneLiner: "Orchestrates full marketing campaigns",
  },
  {
    name: "Valmiki",
    role: "Script Writer",
    icon: "\u270D\uFE0F",
    type: "action",
    oneLiner: "Blog posts, video scripts, ad copy",
  },
  {
    name: "Chitragupta",
    role: "Social Strategist",
    icon: "\u{1F4F1}",
    type: "action",
    oneLiner: "Platform-native content for 6 networks",
  },
  {
    name: "Maya",
    role: "Image Prompter",
    icon: "\u{1F3A8}",
    type: "action",
    oneLiner: "Midjourney, DALL-E 3, Stable Diffusion",
  },
  {
    name: "Vishvakarma",
    role: "Thumbnail Designer",
    icon: "\u{1F5BC}\uFE0F",
    type: "action",
    oneLiner: "Click psychology, A/B variants",
  },
  {
    name: "Kubera",
    role: "Video Director",
    icon: "\u{1F3AC}",
    type: "action",
    oneLiner: "Runway, Kling, Sora shot lists",
  },
  {
    name: "Gandharva",
    role: "Audio Prompter",
    icon: "\u{1F3B5}",
    type: "action",
    oneLiner: "Suno, Udio, ElevenLabs TTS",
  },
  {
    name: "Brihaspati",
    role: "SEO Analyst",
    icon: "\u{1F4CA}",
    type: "condition",
    oneLiner: "Keywords, meta tags, schema markup",
  },
  {
    name: "Hanuman",
    role: "Content Repurposer",
    icon: "\u{1F501}",
    type: "trigger",
    oneLiner: "One piece to ten formats",
  },
  {
    name: "Garuda",
    role: "Trend Scout",
    icon: "\u{1F985}",
    type: "trigger",
    oneLiner: "Viral patterns, competitor analysis",
  },
  {
    name: "Saraswati",
    role: "Brand Voice",
    icon: "\u{1F4D6}",
    type: "condition",
    oneLiner: "Tone guardian and brand guidelines",
  },
];

/* ============================================
   Node positions for workflow canvas
   ============================================ */

const NODE_W = 220;
const NODE_H = 72;

interface NodePos {
  x: number;
  y: number;
}

// Dev agent positions — workflow layout
// Index matches devAgents order: 0=Vyasa, 1=Garuda, 2=Vishwakarma, 3=Prometheus, 4=Agni, 5=Dharma, 6=Shiva, 7=Vayu, 8=Saraswati, 9=Sherlock
const devPositions: NodePos[] = [
  { x: 40, y: 60 },      // 0: Vyasa
  { x: 320, y: 60 },     // 1: Garuda
  { x: 600, y: 60 },     // 2: Vishwakarma
  { x: 880, y: 60 },     // 3: Prometheus
  { x: 1160, y: 60 },    // 4: Agni
  { x: 880, y: 180 },    // 5: Dharma
  { x: 1160, y: 180 },   // 6: Shiva
  { x: 880, y: 300 },    // 7: Vayu
  { x: 1160, y: 300 },   // 8: Saraswati
  { x: 320, y: 200 },    // 9: Sherlock (standalone from Vyasa)
];

interface Connection {
  from: number;
  to: number;
}

const devConnections: Connection[] = [
  { from: 0, to: 1 },  // Vyasa -> Garuda
  { from: 1, to: 2 },  // Garuda -> Vishwakarma
  { from: 2, to: 3 },  // Vishwakarma -> Prometheus
  { from: 3, to: 4 },  // Prometheus -> Agni
  { from: 3, to: 5 },  // Prometheus -> Dharma (down)
  { from: 5, to: 6 },  // Dharma -> Shiva
  { from: 5, to: 7 },  // Dharma -> Vayu (down)
  { from: 7, to: 8 },  // Vayu -> Saraswati
  { from: 0, to: 9 },  // Vyasa -> Sherlock (standalone)
];

// Content agent positions — campaign pipeline
// 0=Narada, 1=Valmiki, 2=Chitragupta, 3=Maya, 4=Vishvakarma, 5=Kubera, 6=Gandharva, 7=Brihaspati, 8=Hanuman, 9=Garuda, 10=Saraswati
const contentPositions: NodePos[] = [
  { x: 40, y: 120 },     // 0: Narada
  { x: 340, y: 0 },      // 1: Valmiki
  { x: 640, y: 0 },      // 2: Chitragupta
  { x: 340, y: 100 },    // 3: Maya
  { x: 640, y: 100 },    // 4: Vishvakarma
  { x: 340, y: 200 },    // 5: Kubera
  { x: 640, y: 200 },    // 6: Gandharva
  { x: 340, y: 300 },    // 7: Brihaspati
  { x: 340, y: 400 },    // 8: Hanuman
  { x: 340, y: 500 },    // 9: Garuda (Trend Scout)
  { x: 640, y: 500 },    // 10: Saraswati (Brand Voice)
];

const contentConnections: Connection[] = [
  { from: 0, to: 1 },   // Narada -> Valmiki
  { from: 1, to: 2 },   // Valmiki -> Chitragupta
  { from: 0, to: 3 },   // Narada -> Maya
  { from: 3, to: 4 },   // Maya -> Vishvakarma
  { from: 0, to: 5 },   // Narada -> Kubera
  { from: 5, to: 6 },   // Kubera -> Gandharva
  { from: 0, to: 7 },   // Narada -> Brihaspati
  { from: 0, to: 8 },   // Narada -> Hanuman
  { from: 0, to: 9 },   // Narada -> Garuda
  { from: 9, to: 10 },  // Garuda -> Saraswati
];

/* ============================================
   SVG Bezier Connection Line
   ============================================ */

function ConnectionLine({
  fromPos,
  toPos,
  index,
  isHighlighted,
}: {
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  index: number;
  isHighlighted: boolean;
}) {
  // Output port is at right-center of source node
  const x1 = fromPos.x + NODE_W + 6;
  const y1 = fromPos.y + NODE_H / 2;
  // Input port is at left-center of target node
  const x2 = toPos.x - 6;
  const y2 = toPos.y + NODE_H / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  // For connections going downward from right side, use different routing
  let d: string;
  if (Math.abs(dx) < 40 && Math.abs(dy) > 40) {
    // Vertical connection: go from bottom of source to top of target
    const sx = fromPos.x + NODE_W / 2;
    const sy = fromPos.y + NODE_H + 6;
    const ex = toPos.x + NODE_W / 2;
    const ey = toPos.y - 6;
    const cpy = Math.abs(ey - sy) * 0.5;
    d = `M ${sx},${sy} C ${sx},${sy + cpy} ${ex},${ey - cpy} ${ex},${ey}`;
  } else if (dx < -40) {
    // Going backward — route around
    const cp = Math.abs(dx) * 0.4;
    d = `M ${x1},${y1} C ${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`;
  } else {
    // Normal horizontal bezier
    const cp = Math.max(Math.abs(dx) * 0.5, 60);
    d = `M ${x1},${y1} C ${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`;
  }

  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="#FFD700"
        strokeWidth={isHighlighted ? 2 : 1.5}
        strokeDasharray="6 4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{
          opacity: isHighlighted ? 0.6 : 0.2,
          pathLength: 1,
          strokeDashoffset: [0, -20],
        }}
        transition={{
          pathLength: { duration: 0.8, delay: 0.5 + index * 0.08 },
          opacity: { duration: 0.3 },
          strokeDashoffset: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
      {isHighlighted && (
        <circle r="3" fill="#FFD700" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}

/* ============================================
   Workflow Node Block
   ============================================ */

function WorkflowNode({
  agent,
  pos,
  index,
  hoveredIndex,
  onHover,
}: {
  agent: Agent;
  pos: NodePos;
  index: number;
  hoveredIndex: number | null;
  onHover: (idx: number | null) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = NODE_COLORS[agent.type];
  const isHovered = hoveredIndex === index;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="absolute select-none"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: NODE_W,
        height: NODE_H,
      }}
      onMouseEnter={() => {
        onHover(index);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        onHover(null);
        setShowTooltip(false);
      }}
    >
      {/* Node block */}
      <div
        className="relative h-full w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderTopWidth: "2px",
          borderTopColor: color,
          boxShadow: isHovered
            ? `0 0 20px ${color}20, 0 4px 20px rgba(0,0,0,0.3)`
            : "0 2px 10px rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Input port (left) */}
        <div
          className="absolute -left-[7px] top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full"
          style={{
            border: `2px solid ${color}`,
            backgroundColor: "#0a0a0a",
          }}
        />

        {/* Output port (right) */}
        <div
          className="absolute -right-[7px] top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full"
          style={{
            border: `2px solid ${color}`,
            backgroundColor: color,
          }}
        />

        {/* Content */}
        <div className="flex h-full flex-col justify-center px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{agent.icon}</span>
            <span className="text-[13px] font-bold text-white/90">
              {agent.name}
            </span>
            <span
              className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
              style={{
                color,
                backgroundColor: `${color}15`,
                border: `1px solid ${color}25`,
              }}
            >
              {agent.role}
            </span>
          </div>
          <p className="mt-1 truncate text-[11px] leading-snug text-white/40">
            {agent.oneLiner}
          </p>
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {showTooltip && agent.capabilities && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3"
            style={{
              top: NODE_H + 10,
              width: 260,
              background: "rgba(20,20,20,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-[11px] leading-relaxed text-white/70">
              {agent.capabilities || agent.oneLiner}
            </p>
            {agent.tools && (
              <div className="mt-2 flex gap-2">
                <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/40">
                  Tools: {agent.tools}
                </span>
                {agent.temp && (
                  <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/40">
                    Temp: {agent.temp}
                  </span>
                )}
              </div>
            )}
            {/* Tooltip arrow */}
            <div
              className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45"
              style={{
                background: "rgba(20,20,20,0.95)",
                borderLeft: "1px solid rgba(255,255,255,0.12)",
                borderTop: "1px solid rgba(255,255,255,0.12)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================
   Workflow Canvas
   ============================================ */

function WorkflowCanvas({
  agents,
  positions,
  connections,
  canvasWidth,
  canvasHeight,
  label,
}: {
  agents: Agent[];
  positions: NodePos[];
  connections: Connection[];
  canvasWidth: number;
  canvasHeight: number;
  label: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inView = useInView(canvasRef, { once: true, amount: 0.1 });

  // Determine which connections are highlighted
  const highlightedConnections = useMemo(() => {
    if (hoveredIndex === null) return new Set<number>();
    const set = new Set<number>();
    connections.forEach((c, i) => {
      if (c.from === hoveredIndex || c.to === hoveredIndex) set.add(i);
    });
    return set;
  }, [hoveredIndex, connections]);

  return (
    <div
      ref={canvasRef}
      className="relative overflow-x-auto overflow-y-visible rounded-xl"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.015) 0%, transparent 70%)",
      }}
    >
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Canvas area */}
      <div
        className="relative"
        style={{
          width: canvasWidth,
          minHeight: canvasHeight,
        }}
      >
        {/* SVG Connection lines */}
        {inView && (
          <svg
            className="pointer-events-none absolute inset-0"
            width={canvasWidth}
            height={canvasHeight}
            style={{ overflow: "visible" }}
          >
            {connections.map((conn, i) => (
              <ConnectionLine
                key={`${label}-conn-${i}`}
                fromPos={positions[conn.from]}
                toPos={positions[conn.to]}
                index={i}
                isHighlighted={highlightedConnections.has(i)}
              />
            ))}
          </svg>
        )}

        {/* Nodes */}
        {agents.map((agent, i) => (
          <WorkflowNode
            key={`${label}-${agent.name}-${agent.role}`}
            agent={agent}
            pos={positions[i]}
            index={i}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
          />
        ))}
      </div>

      {/* Zoom controls (cosmetic) */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-white/30 transition-colors hover:text-white/60"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          +
        </button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-white/30 transition-colors hover:text-white/60"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          -
        </button>
      </div>

      {/* Mini-map (cosmetic) */}
      <div
        className="absolute bottom-3 right-3 z-20 rounded-md"
        style={{
          width: 100,
          height: 60,
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <svg
          width="100"
          height="60"
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {positions.map((pos, i) => (
            <rect
              key={i}
              x={pos.x}
              y={pos.y}
              width={NODE_W}
              height={NODE_H}
              rx={4}
              fill={NODE_COLORS[agents[i]?.type || "action"]}
              opacity={0.4}
            />
          ))}
          {connections.map((conn, i) => {
            const fp = positions[conn.from];
            const tp = positions[conn.to];
            return (
              <line
                key={i}
                x1={fp.x + NODE_W}
                y1={fp.y + NODE_H / 2}
                x2={tp.x}
                y2={tp.y + NODE_H / 2}
                stroke="#FFD700"
                strokeWidth={8}
                opacity={0.2}
              />
            );
          })}
          {/* Viewport indicator */}
          <rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={8}
            rx={4}
          />
        </svg>
      </div>
    </div>
  );
}

/* ============================================
   Mobile Agent Card (vertical list)
   ============================================ */

function MobileAgentCard({
  agent,
  index,
}: {
  agent: Agent;
  index: number;
}) {
  const color = NODE_COLORS[agent.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="flex items-center gap-3 rounded-lg p-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Type dot */}
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-base leading-none">{agent.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white/90">{agent.name}</span>
          <span
            className="text-[9px] font-semibold uppercase"
            style={{ color }}
          >
            {agent.role}
          </span>
        </div>
        <p className="truncate text-[11px] text-white/40">{agent.oneLiner}</p>
      </div>
    </motion.div>
  );
}

/* ============================================
   Tablet Grid (2-col, no SVG lines)
   ============================================ */

function TabletGrid({ agents }: { agents: Agent[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {agents.map((agent, i) => {
        const color = NODE_COLORS[agent.type];
        return (
          <motion.div
            key={agent.name + agent.role}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}
            className="relative overflow-hidden rounded-lg p-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: `2px solid ${color}`,
            }}
          >
            {/* Ports (cosmetic) */}
            <div
              className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
              style={{ border: `2px solid ${color}`, backgroundColor: "#0a0a0a" }}
            />
            <div
              className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
              style={{ border: `2px solid ${color}`, backgroundColor: color }}
            />

            <div className="flex items-center gap-2">
              <span className="text-base">{agent.icon}</span>
              <span className="text-[13px] font-bold text-white/90">
                {agent.name}
              </span>
              <span
                className="ml-auto text-[9px] font-semibold uppercase"
                style={{ color }}
              >
                {agent.role}
              </span>
            </div>
            <p className="mt-1 truncate text-[11px] text-white/40">
              {agent.oneLiner}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================
   Type Legend
   ============================================ */

function TypeLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {(Object.entries(NODE_TYPE_LABELS) as [NodeType, string][]).map(
        ([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NODE_COLORS[type] }}
            />
            <span className="text-[11px] text-white/40">{label}</span>
          </div>
        )
      )}
    </div>
  );
}

/* ============================================
   Main Agents Section
   ============================================ */

export function Agents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="agents"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12"
    >
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 text-center"
      >
        <h6 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
          Agent Army
        </h6>
        <h2
          className="mb-4 text-gradient-gold font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
          }}
        >
          Your agent army
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
          22 specialists. One orchestrator. Semantic routing dispatches the right
          mind for the job.
        </p>
      </motion.div>

      {/* Legend bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8 flex justify-center"
      >
        <TypeLegend />
      </motion.div>

      {/* === Dev Agents === */}
      <div className="mb-16">
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-bold text-white/90" style={{ letterSpacing: "-0.01em" }}>
            Dev Agents
          </h3>
          <p className="text-sm text-white/40">
            10 specialists that build your product
          </p>
        </div>

        {/* Desktop: full canvas workflow */}
        <div className="hidden xl:block">
          <WorkflowCanvas
            agents={devAgents}
            positions={devPositions}
            connections={devConnections}
            canvasWidth={1400}
            canvasHeight={420}
            label="dev"
          />
        </div>

        {/* Tablet: 2-column grid */}
        <div className="hidden md:block xl:hidden">
          <TabletGrid agents={devAgents} />
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-2 md:hidden">
          {devAgents.map((agent, i) => (
            <MobileAgentCard key={agent.name + agent.role} agent={agent} index={i} />
          ))}
        </div>
      </div>

      {/* === Content Agents === */}
      <div className="mb-12">
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-bold text-white/90" style={{ letterSpacing: "-0.01em" }}>
            Content Agents
          </h3>
          <p className="text-sm text-white/40">
            12 specialists that make it go viral
          </p>
        </div>

        {/* Desktop: full canvas workflow */}
        <div className="hidden xl:block">
          <WorkflowCanvas
            agents={contentAgents}
            positions={contentPositions}
            connections={contentConnections}
            canvasWidth={900}
            canvasHeight={620}
            label="content"
          />
        </div>

        {/* Tablet: 2-column grid */}
        <div className="hidden md:block xl:hidden">
          <TabletGrid agents={contentAgents} />
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-2 md:hidden">
          {contentAgents.map((agent, i) => (
            <MobileAgentCard key={agent.name + agent.role} agent={agent} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-8 max-w-2xl rounded-xl p-6 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,215,0,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-sm leading-relaxed text-white/60">
          <span className="font-semibold text-gold">Semantic routing</span>{" "}
          analyzes your prompt and dispatches the right agent automatically.
          Type naturally — DJcode picks the specialist.
        </p>
      </motion.div>
    </section>
  );
}
