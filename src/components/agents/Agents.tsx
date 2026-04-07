"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
    icon: "\uD83C\uDFAF",
    type: "orchestrator",
    oneLiner: "Decomposes. Delegates. Never codes.",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Decomposes tasks, delegates to agents, enforces quality gates. Never writes code directly.",
  },
  {
    name: "Prometheus",
    role: "Coder",
    icon: "\uD83D\uDCBB",
    type: "action",
    oneLiner: "Full-stack across 6 languages",
    tools: "All 8 tools",
    temp: "0.4",
    capabilities:
      "Python/TS/Rust/Go/Java/C++. Prefers surgical edits. Reads existing code first.",
  },
  {
    name: "Sherlock",
    role: "Debugger",
    icon: "\uD83D\uDD0D",
    type: "action",
    oneLiner: "5-step root cause methodology",
    tools: "All 8 tools",
    temp: "0.2",
    capabilities:
      "Reproduce, isolate, hypothesize, verify, fix. Always checks git diff.",
  },
  {
    name: "Vishwakarma",
    role: "Architect",
    icon: "\uD83D\uDCD0",
    type: "planner",
    oneLiner: "Structured plans with risk analysis",
    tools: "5 (read-only)",
    temp: "0.5",
    capabilities:
      "Produces structured plans: goal, constraints, design, phases, risks, acceptance criteria.",
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
    name: "Agni",
    role: "Tester",
    icon: "\uD83E\uDDEA",
    type: "action",
    oneLiner: "Happy, edge, error, boundary cases",
    tools: "All 8 tools",
    temp: "0.3",
    capabilities:
      "Happy path + edge cases + error cases + boundary conditions. Runs tests after writing.",
  },
  {
    name: "Garuda",
    role: "Scout",
    icon: "\uD83D\uDD0E",
    type: "trigger",
    oneLiner: "Read-only recon, 30 tool rounds",
    tools: "5 (read-only)",
    temp: "0.3",
    capabilities:
      "Reports: summary, key files, patterns, issues, recommendations. 30 tool rounds max.",
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
    icon: "\uD83D\uDCDD",
    type: "action",
    oneLiner: "README to architecture docs",
    tools: "All 8 tools",
    temp: "0.6",
    capabilities:
      "README, API docs, architecture docs, changelogs, tutorials, inline comments.",
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
];

const contentAgents: Agent[] = [
  {
    name: "Narada",
    role: "Campaign Director",
    icon: "\uD83D\uDCE2",
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
    icon: "\uD83D\uDCF1",
    type: "action",
    oneLiner: "Platform-native content for 6 networks",
  },
  {
    name: "Maya",
    role: "Image Prompter",
    icon: "\uD83C\uDFA8",
    type: "action",
    oneLiner: "Midjourney, DALL-E 3, Stable Diffusion",
  },
  {
    name: "Kubera",
    role: "Video Director",
    icon: "\uD83C\uDFAC",
    type: "action",
    oneLiner: "Runway, Kling, Sora shot lists",
  },
  {
    name: "Tvastar",
    role: "ComfyUI Expert",
    icon: "\uD83D\uDD27",
    type: "planner",
    oneLiner: "Node-based workflow architect",
  },
  {
    name: "Gandharva",
    role: "Audio Prompter",
    icon: "\uD83C\uDFB5",
    type: "action",
    oneLiner: "Suno, Udio, ElevenLabs TTS",
  },
  {
    name: "Brihaspati",
    role: "SEO Analyst",
    icon: "\uD83D\uDCCA",
    type: "condition",
    oneLiner: "Keywords, meta tags, schema markup",
  },
  {
    name: "Saraswati",
    role: "Brand Voice",
    icon: "\uD83D\uDCD6",
    type: "condition",
    oneLiner: "Tone guardian and brand guidelines",
  },
  {
    name: "Vishvakarma",
    role: "Thumbnail Designer",
    icon: "\uD83D\uDDBC\uFE0F",
    type: "action",
    oneLiner: "Click psychology, A/B variants",
  },
  {
    name: "Hanuman",
    role: "Content Repurposer",
    icon: "\uD83D\uDD01",
    type: "trigger",
    oneLiner: "One piece to ten formats",
  },
  {
    name: "Garuda",
    role: "Trend Scout",
    icon: "\uD83E\uDD85",
    type: "trigger",
    oneLiner: "Viral patterns, competitor analysis",
  },
];

/* ============================================
   Connection data for SVG lines (dev agents)
   ============================================ */

interface Connection {
  from: number;
  to: number;
}

const devConnections: Connection[] = [
  { from: 0, to: 1 }, // Vyasa -> Prometheus
  { from: 0, to: 2 }, // Vyasa -> Sherlock
  { from: 0, to: 3 }, // Vyasa -> Vishwakarma
  { from: 0, to: 6 }, // Vyasa -> Garuda
  { from: 6, to: 3 }, // Garuda -> Vishwakarma
  { from: 3, to: 1 }, // Vishwakarma -> Prometheus
  { from: 1, to: 5 }, // Prometheus -> Agni
  { from: 2, to: 1 }, // Sherlock -> Prometheus
  { from: 1, to: 4 }, // Prometheus -> Dharma
];

/* ============================================
   Agent Node Component (Desktop)
   ============================================ */

function AgentNode({
  agent,
  index,
  isExpanded,
  onClick,
  onHover,
  nodeRef,
}: {
  agent: Agent;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
  nodeRef: (el: HTMLDivElement | null) => void;
}) {
  const color = NODE_COLORS[agent.type];

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      className="glass-card relative cursor-pointer select-none overflow-hidden transition-all duration-300"
      style={{
        borderLeft: `3px solid ${color}`,
        minWidth: 0,
      }}
    >
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg leading-none">{agent.icon}</span>
          <span className="text-sm font-bold text-text-primary">
            {agent.name}
          </span>
          <span
            className="ml-auto shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color,
              backgroundColor: `${color}15`,
            }}
          >
            {agent.role}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          {agent.oneLiner}
        </p>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && agent.capabilities && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-3">
              <p className="mb-2 text-xs leading-relaxed text-text-secondary">
                {agent.capabilities}
              </p>
              <div className="flex flex-wrap gap-2">
                {agent.tools && (
                  <span className="rounded-sm bg-white/5 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                    Tools: {agent.tools}
                  </span>
                )}
                {agent.temp && (
                  <span className="rounded-sm bg-white/5 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                    Temp: {agent.temp}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================
   Mobile Agent List Item
   ============================================ */

function MobileAgentItem({
  agent,
  index,
  isLast,
}: {
  agent: Agent;
  index: number;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = NODE_COLORS[agent.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative flex gap-3"
    >
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center">
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        {!isLast && (
          <div
            className="w-px flex-1"
            style={{ backgroundColor: `${color}30` }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="mb-3 flex-1 cursor-pointer rounded-lg border border-white/5 bg-white/[0.02] p-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{agent.icon}</span>
          <span className="text-sm font-bold text-text-primary">
            {agent.name}
          </span>
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ color }}
          >
            {agent.role}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">{agent.oneLiner}</p>

        <AnimatePresence>
          {expanded && agent.capabilities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="mt-2 border-t border-white/5 pt-2 text-xs leading-relaxed text-text-secondary">
                {agent.capabilities}
              </p>
              {agent.tools && (
                <span className="mt-1 inline-block rounded-sm bg-white/5 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                  Tools: {agent.tools}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ============================================
   SVG Connection Lines (Desktop)
   ============================================ */

function ConnectionLines({
  connections,
  nodeRefs,
  containerRef,
  hoveredIndex,
}: {
  connections: Connection[];
  nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredIndex: number | null;
}) {
  const [paths, setPaths] = useState<
    { d: string; from: number; to: number }[]
  >([]);

  const computePaths = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPaths: { d: string; from: number; to: number }[] = [];

    for (const conn of connections) {
      const fromEl = nodeRefs.current[conn.from];
      const toEl = nodeRefs.current[conn.to];
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
      const y1 = fromRect.top + fromRect.height - containerRect.top;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left;
      const y2 = toRect.top - containerRect.top;

      const midY = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      newPaths.push({ d, from: conn.from, to: conn.to });
    }

    setPaths(newPaths);
  }, [connections, nodeRefs, containerRef]);

  useEffect(() => {
    // Delay to ensure layout is settled after mount animations
    const timer = setTimeout(computePaths, 800);
    const handleResize = () => computePaths();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [computePaths]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker
          id="arrowGold"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="#FFD70050" />
        </marker>
      </defs>
      {paths.map((path, i) => {
        const isHighlighted =
          hoveredIndex !== null &&
          (path.from === hoveredIndex || path.to === hoveredIndex);

        return (
          <g key={i}>
            <motion.path
              d={path.d}
              fill="none"
              stroke="#FFD700"
              strokeWidth={isHighlighted ? 1.5 : 1}
              strokeDasharray="5 5"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: isHighlighted ? 0.6 : 0.15,
                pathLength: 1,
                strokeDashoffset: [0, -10],
              }}
              transition={{
                pathLength: { duration: 1, delay: 0.8 + i * 0.1 },
                opacity: { duration: 0.3 },
                strokeDashoffset: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              markerEnd="url(#arrowGold)"
            />
            {/* Pulse dot traveling along path */}
            {isHighlighted && (
              <circle r="3" fill="#FFD700" opacity="0.8">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={path.d}
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================
   Agent Group Component
   ============================================ */

function AgentGroup({
  title,
  subtitle,
  agents,
  connections,
  gridCols,
}: {
  title: string;
  subtitle: string;
  agents: Agent[];
  connections?: Connection[];
  gridCols: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const groupInView = useInView(containerRef, { once: true, amount: 0.1 });

  const setNodeRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      nodeRefs.current[index] = el;
    },
    []
  );

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h3
          className="mb-1 text-xl font-bold text-text-primary"
          style={{ letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="text-sm text-text-secondary">{subtitle}</p>
      </div>

      {/* Desktop: Grid with SVG connections */}
      <div className="relative hidden md:block" ref={containerRef}>
        {connections && groupInView && (
          <ConnectionLines
            connections={connections}
            nodeRefs={nodeRefs}
            containerRef={containerRef}
            hoveredIndex={hoveredIndex}
          />
        )}
        <div className={`grid gap-3 ${gridCols}`}>
          {agents.map((agent, i) => (
            <AgentNode
              key={agent.name + agent.role}
              agent={agent}
              index={i}
              isExpanded={expandedIndex === i}
              onClick={() =>
                setExpandedIndex(expandedIndex === i ? null : i)
              }
              onHover={(h) => setHoveredIndex(h ? i : null)}
              nodeRef={setNodeRef(i)}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Vertical list */}
      <div className="block md:hidden">
        {agents.map((agent, i) => (
          <MobileAgentItem
            key={agent.name + agent.role}
            agent={agent}
            index={i}
            isLast={i === agents.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Type Legend
   ============================================ */

function TypeLegend() {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {(Object.entries(NODE_TYPE_LABELS) as [NodeType, string][]).map(
        ([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: NODE_COLORS[type] }}
            />
            <span className="text-xs text-text-muted">{label}</span>
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
      className="relative mx-auto w-full max-w-[1200px] px-6 py-24 sm:px-8 lg:px-12"
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

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center"
      >
        <TypeLegend />
      </motion.div>

      {/* Dev Agents */}
      <AgentGroup
        title="Dev Agents"
        subtitle="10 specialists that build your product"
        agents={devAgents}
        connections={devConnections}
        gridCols="grid-cols-2 lg:grid-cols-5"
      />

      {/* Content Agents */}
      <AgentGroup
        title="Content Agents"
        subtitle="12 specialists that make it go viral"
        agents={contentAgents}
        gridCols="grid-cols-2 lg:grid-cols-4"
      />

      {/* Bottom callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="glass-card mx-auto mt-8 max-w-2xl p-6 text-center"
        style={{ borderColor: "rgba(255, 215, 0, 0.12)" }}
      >
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className="font-semibold text-gold">Semantic routing</span>{" "}
          analyzes your prompt and dispatches the right agent automatically.
          Type naturally -- the orchestrator figures out who to call.
        </p>
      </motion.div>
    </section>
  );
}
