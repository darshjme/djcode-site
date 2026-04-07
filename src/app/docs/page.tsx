"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#FFD700";

interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

function CodeBlock({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <pre className="bg-[#111] border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono">
      <code>{children}</code>
    </pre>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#999] leading-relaxed mb-4">{children}</p>;
}

function Badge({ children, color = GOLD }: { children: string; color?: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-mono font-semibold mr-2 mb-1"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  );
}

const SECTIONS: DocSection[] = [
  {
    id: "install",
    title: "Installation",
    icon: "📦",
    content: (
      <>
        <H2>📦 Installation</H2>
        <P>One command. Zero config. Works on macOS, Linux, and WSL.</P>

        <H3>Quick Install (recommended)</H3>
        <CodeBlock>{`curl -fsSL https://cli.darshj.ai/install.sh | bash`}</CodeBlock>

        <H3>From source</H3>
        <CodeBlock>{`git clone https://github.com/darshjme/djcode
cd djcode
uv sync
uv run python -m djcode`}</CodeBlock>

        <H3>Prerequisites</H3>
        <ul className="list-disc list-inside text-[#999] space-y-1 mb-4">
          <li>Python 3.12+</li>
          <li><a href="https://ollama.com" className="text-[#FFD700] hover:underline">Ollama</a> with at least one model pulled</li>
          <li>macOS or Linux (WSL on Windows)</li>
        </ul>

        <H3>Pull a model</H3>
        <CodeBlock>{`ollama pull gemma4        # Default, 9.6GB
ollama pull qwen2.5-coder:7b  # Fast, 4.7GB
ollama pull dolphin3      # Uncensored, 4.9GB`}</CodeBlock>
      </>
    ),
  },
  {
    id: "quickstart",
    title: "Quick Start",
    icon: "🚀",
    content: (
      <>
        <H2>🚀 Quick Start</H2>

        <H3>Interactive REPL</H3>
        <CodeBlock>{`djcode`}</CodeBlock>
        <P>Opens the interactive REPL with model info, buddy greeting, and status bar.</P>

        <H3>One-shot mode</H3>
        <CodeBlock>{`djcode "write a REST API with auth in FastAPI"
djcode --model qwen2.5-coder:7b "binary search in Rust"
djcode --raw "explain this error" 2>/dev/null`}</CodeBlock>

        <H3>CLI flags</H3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-[#FFD700] font-mono">Flag</th>
                <th className="py-2 pr-4 text-white">Description</th>
                <th className="py-2 text-[#666]">Default</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["--model, -m", "Model name", "gemma4"],
                ["--provider, -p", "LLM provider", "ollama"],
                ["--thinking / --no-thinking", "Show model reasoning", "on"],
                ["--bypass-rlhf", "Unrestricted mode", "off"],
                ["--auto-accept", "Skip tool confirmations", "off"],
                ["--raw", "No Rich formatting", "off"],
              ].map(([flag, desc, def]) => (
                <tr key={flag} className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono text-white">{flag}</td>
                  <td className="py-2 pr-4">{desc}</td>
                  <td className="py-2 text-[#666]">{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "commands",
    title: "Commands",
    icon: "⌨️",
    content: (
      <>
        <H2>⌨️ Slash Commands</H2>
        <P>Type these in the REPL. Use bare <code className="text-[#FFD700]">/</code> for an interactive picker.</P>

        <H3>🏗️ Build &amp; Ship</H3>
        {[
          ["/orchestra <task>", "Multi-agent orchestration — auto-dispatches to best agents"],
          ["/review <code>", "Code review via Dharma agent (security, perf, style)"],
          ["/debug <issue>", "Root cause analysis via Sherlock agent"],
          ["/test <target>", "Write tests via Agni agent"],
          ["/refactor <code>", "Restructure via Shiva agent (zero behavior change)"],
          ["/devops <task>", "Docker/CI/CD via Vayu agent"],
          ["/docs <target>", "Generate docs via Saraswati agent"],
        ].map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-3 mb-2">
            <code className="text-[#FFD700] font-mono text-sm whitespace-nowrap">{cmd}</code>
            <span className="text-[#999] text-sm">{desc}</span>
          </div>
        ))}

        <H3>📢 Content &amp; Marketing</H3>
        {[
          ["/launch <product>", "Full pipeline: build → ship → campaign"],
          ["/campaign <brief>", "Content campaign via Narada + 12 agents"],
          ["/image <concept>", "Image prompts via Maya agent"],
          ["/video <concept>", "Cinematic video prompts via Kubera agent"],
          ["/social <topic>", "Social media content via Chitragupta agent"],
        ].map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-3 mb-2">
            <code className="text-[#FFD700] font-mono text-sm whitespace-nowrap">{cmd}</code>
            <span className="text-[#999] text-sm">{desc}</span>
          </div>
        ))}

        <H3>🔧 Tools &amp; Config</H3>
        {[
          ["/model [name]", "Interactive model picker or switch to specific model"],
          ["/provider [name]", "Switch provider (ollama, mlx, openai, etc.)"],
          ["/auth", "Configure API keys"],
          ["/config", "Show current configuration"],
          ["/set k=v", "Set a config value"],
          ["/auto", "Toggle auto-accept tool calls"],
          ["/stats [7d|30d]", "Usage dashboard with activity heatmap"],
          ["/agents", "Show all 22 agents roster"],
          ["/memory", "Show memory tier stats"],
          ["/buddy", "Show your dharmic ASCII buddy"],
          ["/skill list|add|remove", "Manage teachable skills"],
          ["/shortcuts", "Show keyboard shortcut reference"],
          ["/clear", "Clear conversation"],
          ["/save", "Save conversation to disk"],
          ["/exit", "Exit DJcode"],
        ].map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-3 mb-2">
            <code className="text-[#FFD700] font-mono text-sm whitespace-nowrap">{cmd}</code>
            <span className="text-[#999] text-sm">{desc}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    icon: "🎹",
    content: (
      <>
        <H2>🎹 Keyboard Shortcuts</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-[#FFD700] font-mono">Key</th>
                <th className="py-2 text-white">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["Ctrl+O", "Toggle thinking/verbose mode"],
                ["Ctrl+P", "Toggle Plan mode / Act mode"],
                ["Ctrl+L", "Clear screen"],
                ["Ctrl+T", "Toggle auto-accept tools"],
                ["Ctrl+R", "Rerun last command"],
                ["Ctrl+K", "Kill current generation"],
                ["/", "Interactive command picker"],
                ["Escape", "Cancel current input"],
              ].map(([key, action]) => (
                <tr key={key} className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-white">{key}</kbd>
                  </td>
                  <td className="py-2">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "agents",
    title: "Agents",
    icon: "🎯",
    content: (
      <>
        <H2>🎯 Agent Registry</H2>
        <P>22 specialist agents dispatched by semantic routing based on your intent.</P>

        <H3>Dev Agents (10)</H3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            ["🎯 Vyasa", "Orchestrator", "Decomposes, delegates, synthesizes. Never writes code.", "0.3"],
            ["💻 Prometheus", "Coder", "Production code across 6+ languages.", "0.4"],
            ["🔎 Sherlock", "Debugger", "5-step root cause methodology.", "0.2"],
            ["📐 Vishwakarma", "Architect", "System design and ADRs. Read-only.", "0.5"],
            ["✅ Dharma", "Reviewer", "Security, perf, style review with severity ratings.", "0.3"],
            ["🧪 Agni", "Tester", "Happy path, edge cases, boundary conditions.", "0.3"],
            ["🔍 Garuda", "Scout", "Read-only codebase recon.", "0.3"],
            ["🚀 Vayu", "DevOps", "Docker, CI/CD, K8s, Terraform.", "0.3"],
            ["📝 Saraswati", "Docs", "READMEs, API docs, changelogs.", "0.6"],
            ["🔄 Shiva", "Refactorer", "Zero behavior change. Tests first.", "0.3"],
          ].map(([name, role, desc, temp]) => (
            <div key={name} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{name}</span>
                <Badge>{role}</Badge>
              </div>
              <p className="text-[#777] text-xs">{desc}</p>
              <span className="text-[#555] text-xs font-mono">t={temp}</span>
            </div>
          ))}
        </div>

        <H3>Content Agents (12)</H3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            ["📢 Narada", "Campaign Director"],
            ["✍️ Valmiki", "Script Writer"],
            ["📱 Chitragupta", "Social Strategist"],
            ["🎨 Maya", "Image Prompter"],
            ["🎬 Kubera", "Video Director"],
            ["🔧 Tvastar", "ComfyUI Expert"],
            ["🎵 Gandharva", "Audio Prompter"],
            ["📊 Brihaspati", "SEO Analyst"],
            ["📖 Saraswati", "Brand Voice"],
            ["🖼️ Vishvakarma", "Thumbnail Designer"],
            ["🔁 Hanuman", "Content Repurposer"],
            ["🦅 Garuda", "Trend Scout"],
          ].map(([name, role]) => (
            <div key={name} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg p-2">
              <span className="font-semibold text-white text-sm">{name}</span>
              <Badge color="#34D399">{role}</Badge>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "providers",
    title: "Providers",
    icon: "🔌",
    content: (
      <>
        <H2>🔌 Providers</H2>
        <P>DJcode supports 9 LLM providers. Local-first by default, cloud when you need it.</P>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-[#FFD700]">Provider</th>
                <th className="py-2 pr-4 text-white">Type</th>
                <th className="py-2 text-[#666]">API Key</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["Ollama", "Local", "None"],
                ["MLX", "Local (Apple Silicon)", "None"],
                ["OpenAI", "Cloud", "Required"],
                ["Anthropic", "Cloud", "Required"],
                ["NVIDIA NIM", "Cloud", "Required"],
                ["Google AI", "Cloud", "Required"],
                ["Groq", "Cloud", "Required"],
                ["Together AI", "Cloud", "Required"],
                ["OpenRouter", "Cloud", "Required"],
              ].map(([name, type, key]) => (
                <tr key={name} className="border-b border-white/5">
                  <td className="py-2 pr-4 font-semibold text-white">{name}</td>
                  <td className="py-2 pr-4">{type}</td>
                  <td className="py-2 text-[#666]">{key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock>{`# Switch provider
djcode --provider openai --model gpt-4o "explain closures"
djcode --provider anthropic --model claude-sonnet-4-20250514 "review my code"
djcode --provider mlx "local Apple Silicon inference"`}</CodeBlock>
      </>
    ),
  },
  {
    id: "models",
    title: "Models",
    icon: "🧠",
    content: (
      <>
        <H2>🧠 Supported Models</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-[#FFD700]">Model</th>
                <th className="py-2 pr-4 text-white">Size</th>
                <th className="py-2 pr-4">Best For</th>
                <th className="py-2">Tools</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["gemma4", "9.6 GB", "General coding (default)", "✅"],
                ["qwen2.5-coder:7b", "4.7 GB", "Fast coding tasks", "✅"],
                ["deepseek-coder-v2:lite", "8.9 GB", "Code generation", "✅"],
                ["dolphin3", "4.9 GB", "Uncensored, no refusals", "❌"],
                ["gemma4:26b", "16 GB", "Complex reasoning (32GB+)", "✅"],
                ["qwen3:32b", "20 GB", "128K context window", "✅"],
              ].map(([model, size, best, tools]) => (
                <tr key={model} className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono text-white">{model}</td>
                  <td className="py-2 pr-4">{size}</td>
                  <td className="py-2 pr-4">{best}</td>
                  <td className="py-2">{tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P><strong className="text-white">RAM guide:</strong> 8GB → 7B models · 16GB → 9-12B models · 32GB → 26B MoE / 32B · 64GB+ → 70B+</P>
      </>
    ),
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: "🏗️",
    content: (
      <>
        <H2>🏗️ Architecture</H2>
        <P>DJcode is a modular Python CLI with 40+ source files.</P>
        <CodeBlock lang="text">{`src/djcode/
├── cli.py              # Click entry point
├── repl.py             # Interactive REPL (prompt-toolkit + Rich)
├── provider.py         # 9 providers with auto-fallback
├── prompt.py           # Expert system prompt + reasoning framework
├── prompt_enhancer.py  # 8-intent smart prompt enrichment
├── buddy.py            # 5 dharmic ASCII species + 3D + glitch
├── tui.py              # Keyboard shortcuts + mode system + progress
├── stats.py            # Usage dashboard with heatmap
├── errors.py           # 16-pattern error classifier + fallback
├── permissions.py      # Access control + dangerous command detection
├── context_file.py     # djcode.md auto-save on exit
├── skills.py           # Teachable .skill.md system
├── voice.py            # Whisper transcription (3 backends)
├── installer.py        # Software installer (brew/apt/pip)
├── config.py           # ~/.djcode/config.json
├── auth.py             # 9 provider auth registry
├── status.py           # Bottom toolbar with mode indicator
├── onboarding.py       # First-run wizard
├── updater.py          # Auto-update checker
├── tools/              # 8 async tools (bash, file ops, grep, glob, git, web)
├── memory/             # 3-tier memory (session, persistent, semantic)
├── agents/             # 10 dev + 12 content agent registries
└── orchestrator/       # Engine + semantic router + vector context + context bus`}</CodeBlock>
      </>
    ),
  },
  {
    id: "memory",
    title: "Memory System",
    icon: "💾",
    content: (
      <>
        <H2>💾 3-Tier Memory</H2>

        <H3>Tier 1 — Session Memory (Hot)</H3>
        <P>Current conversation. Messages, tool results, thinking context. Cleared on /clear or exit.</P>

        <H3>Tier 2 — Persistent Facts (Warm)</H3>
        <P>Key-value facts that survive across sessions. Stored at ~/.djcode/memory/ as JSON.</P>
        <CodeBlock>{`/remember db_host=localhost:5432
/recall db_host
/forget db_host`}</CodeBlock>

        <H3>Tier 3 — Semantic Vectors (Deep)</H3>
        <P>ChromaDB-backed vector search across all past sessions. Finds relevant context by meaning using all-MiniLM-L6-v2 embeddings.</P>

        <H3>Context File</H3>
        <P>DJcode auto-saves <code className="text-[#FFD700]">djcode.md</code> on exit with project info, session summary, and detected frameworks. Loaded on next startup for instant context.</P>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: "🔒",
    content: (
      <>
        <H2>🔒 Privacy &amp; Security</H2>
        <P>DJcode is built on one principle: your code stays on your machine.</P>
        <ul className="list-disc list-inside text-[#999] space-y-2 mb-4">
          <li>DO_NOT_TRACK=1 set by default</li>
          <li>Zero analytics, zero phone-home, zero telemetry</li>
          <li>No account required. No sign-up. No email.</li>
          <li>All inference runs locally via Ollama/MLX</li>
          <li>Cloud providers are opt-in (you bring your own API key)</li>
          <li>Permission system warns before every file write and command execution</li>
          <li>Dangerous command detection (rm -rf, sudo, curl|bash, etc.)</li>
          <li>djcode.md stays in YOUR project directory, not uploaded anywhere</li>
        </ul>
      </>
    ),
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("install");

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#666] mb-4">Documentation</h2>
            <ul className="space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setActiveSection(s.id);
                      document.getElementById(`doc-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeSection === s.id
                        ? "bg-[#FFD700]/10 text-[#FFD700] font-medium"
                        : "text-[#888] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s.icon} {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#FFD700]">DJ</span>code Documentation
              </h1>
              <p className="text-[#888] text-lg mb-8">
                Everything you need to know about the last coding CLI you&apos;ll ever need.
              </p>
            </motion.div>

            {SECTIONS.map((section, i) => (
              <motion.section
                key={section.id}
                id={`doc-${section.id}`}
                className="pb-12 border-b border-white/5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                onViewportEnter={() => setActiveSection(section.id)}
              >
                {section.content}
              </motion.section>
            ))}

            {/* Footer */}
            <div className="text-center py-12 text-[#666] text-sm">
              <p>Built with 🪔 by <a href="https://darshj.ai" className="text-[#FFD700] hover:underline">DarshJ.AI</a></p>
              <p className="mt-1">
                <a href="https://github.com/darshjme/djcode" className="hover:text-white">GitHub</a>
                {" · "}
                <a href="/" className="hover:text-white">Home</a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
