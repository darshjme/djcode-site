"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
    tools: "Scoped tools",
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
    tools: "Read-only tools",
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
    tools: "Read-only tools",
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
    tools: "Scoped tools",
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
    tools: "Scoped tools",
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
    tools: "Read-only tools",
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
    tools: "Scoped tools",
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
    tools: "Scoped tools",
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
    tools: "Scoped tools",
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
    tools: "Scoped tools",
    temp: "0.2",
    capabilities:
      "Reproduce, isolate, hypothesize, verify, fix. Always checks git diff.",
  },
];

const extendedAgents: Agent[] = [
  {
    "name": "Chanakya",
    "role": "Product Strategist",
    "icon": "\u25c7",
    "type": "planner",
    "oneLiner": "Product Strategist specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Kavach",
    "role": "Security Compliance",
    "icon": "\u25c7",
    "type": "condition",
    "oneLiner": "Security Compliance specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Aryabhata",
    "role": "Data Scientist",
    "icon": "\u25c7",
    "type": "planner",
    "oneLiner": "Data Scientist specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Indra",
    "role": "Sre",
    "icon": "\u25c7",
    "type": "condition",
    "oneLiner": "Sre specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Kubera",
    "role": "Cost Optimizer",
    "icon": "\u25c7",
    "type": "planner",
    "oneLiner": "Cost Optimizer specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Hermes",
    "role": "Integration",
    "icon": "\u25c7",
    "type": "planner",
    "oneLiner": "Integration specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Kamadeva",
    "role": "Ux Workflow",
    "icon": "\u25c7",
    "type": "planner",
    "oneLiner": "Ux Workflow specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Mitra",
    "role": "Legal Intelligence",
    "icon": "\u25c7",
    "type": "condition",
    "oneLiner": "Legal Intelligence specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  },
  {
    "name": "Varuna",
    "role": "Risk Engine",
    "icon": "\u25c7",
    "type": "condition",
    "oneLiner": "Risk Engine specialist",
    "capabilities": "Scoped specialist workflow coordinated by the core orchestrator."
  }
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
  {
    name: "Tvastar",
    role: "ComfyUI Expert",
    icon: "\u{1F4C8}",
    type: "planner",
    oneLiner: "ComfyUI workflow planning",
  },
];

/* ============================================
   Agent Card Component
   ============================================ */

function AgentCard({
  agent,
  index,
  isOrchestrator = false,
}: {
  agent: Agent;
  index: number;
  isOrchestrator?: boolean;
}) {
  const color = NODE_COLORS[agent.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.4,
        delay: 0.05 + index * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 32px ${color}18, 0 0 16px ${color}12`,
      }}
      className={`group relative cursor-default overflow-hidden rounded-xl transition-all duration-200 ${
        isOrchestrator ? "col-span-full sm:col-span-2 lg:col-span-2" : ""
      }`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${color}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at 50% 50%, ${color}08, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <span className="mt-0.5 text-xl leading-none shrink-0">{agent.icon}</span>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white/90">{agent.name}</span>
            <span
              className="shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                color,
                backgroundColor: `${color}12`,
                border: `1px solid ${color}20`,
              }}
            >
              {agent.role}
            </span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-white/40">
            {agent.oneLiner}
          </p>
          {agent.tools && (
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/30">
                {agent.tools}
              </span>
              {agent.temp && (
                <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/30">
                  T={agent.temp}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================
   Flow Divider (dashed gold line between rows)
   ============================================ */

function FlowDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div
        className="h-0 flex-1"
        style={{
          borderBottom: "1px dashed rgba(255, 215, 0, 0.15)",
        }}
      />
      <div
        className="mx-3 flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          background: "rgba(255, 215, 0, 0.06)",
          border: "1px solid rgba(255, 215, 0, 0.15)",
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="rgba(255, 215, 0, 0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M5 2v6M3 6l2 2 2-2" />
        </svg>
      </div>
      <div
        className="h-0 flex-1"
        style={{
          borderBottom: "1px dashed rgba(255, 215, 0, 0.15)",
        }}
      />
    </div>
  );
}

/* ============================================
   Type Legend
   ============================================ */

function TypeLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {(Object.entries(NODE_TYPE_LABELS) as [NodeType, string][]).map(
        ([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: NODE_COLORS[type] }}
            />
            <span className="text-[11px] font-medium text-white/40">{label}</span>
          </div>
        )
      )}
    </div>
  );
}

/* ============================================
   Agent Grid Section
   ============================================ */

function AgentGrid({
  title,
  subtitle,
  agents,
  orchestrator,
  columns,
}: {
  title: string;
  subtitle: string;
  agents: Agent[];
  orchestrator: Agent;
  columns: string; // tailwind grid cols class
}) {
  const nonOrchestrator = agents.filter((a) => a.type !== "orchestrator");

  // Split into rows for flow dividers
  const colCount = columns.includes("5") ? 5 : 4;
  const rows: Agent[][] = [];
  for (let i = 0; i < nonOrchestrator.length; i += colCount) {
    rows.push(nonOrchestrator.slice(i, i + colCount));
  }

  return (
    <div className="mb-16">
      <div className="mb-6">
        <h3
          className="mb-1 text-lg font-bold text-white/90"
          style={{ letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="text-sm text-white/40">{subtitle}</p>
      </div>

      {/* Orchestrator card (wider, centered) */}
      <div className="mb-4 flex justify-center">
        <div className="w-full max-w-md">
          <AgentCard agent={orchestrator} index={0} isOrchestrator />
        </div>
      </div>

      <FlowDivider />

      {/* Grid rows with dividers between them */}
      <div className="mt-4">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx}>
            {rowIdx > 0 && <FlowDivider />}
            <div
              className={`grid gap-3 ${columns}`}
            >
              {row.map((agent, i) => (
                <AgentCard
                  key={`${agent.name}-${agent.role}`}
                  agent={agent}
                  index={rowIdx * colCount + i + 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Main Agents Section
   ============================================ */

export function Agents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const devOrchestrator = devAgents.find((a) => a.type === "orchestrator")!;
  const contentOrchestrator = contentAgents.find(
    (a) => a.type === "orchestrator"
  )!;

  return (
    <section
      id="agents"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px ellipse at 50% 20%, rgba(255, 215, 0, 0.03), transparent 70%)",
        }}
      />

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12 text-center"
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
          19 core specialists, plus content workflows. Match the task to the right role and coordinate the work.
        </p>
      </motion.div>

      {/* Legend bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10"
      >
        <TypeLegend />
      </motion.div>

      {/* === Dev Agents === */}
      <AgentGrid
        title="Dev Agents"
        subtitle="10 specialists that build your product"
        agents={devAgents}
        orchestrator={devOrchestrator}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      />

      <div className="mb-16"><h3 className="mb-2 text-lg font-bold">Architecture &amp; assurance specialists</h3><p className="mb-6 text-sm text-text-secondary">Nine additional core roles for product, risk, reliability, cost, integration, and user experience.</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{extendedAgents.map(agent => <AgentCard key={agent.name} agent={agent} index={0} />)}</div></div>
      {/* === Content Agents === */}
      <AgentGrid
        title="Content Agents"
        subtitle="12 roles for campaign plans, copy, and creative prompts"
        agents={contentAgents}
        orchestrator={contentOrchestrator}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />

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
