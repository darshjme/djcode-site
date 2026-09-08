"use client";

import Link from "next/link";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GOLD = "#FFD700";
const GOLD_ACCENT = "#FFAA00";

interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="relative rounded-xl p-5 overflow-x-auto text-sm font-mono leading-relaxed mb-6 group"
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #111118 100%)",
        border: "1px solid rgba(255,215,0,0.08)",
        boxShadow: "var(--code-panel-shadow)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ background: "linear-gradient(180deg, #FFD700, #FFAA00, transparent)" }}
      />
      <code className="text-[#E0E0E0]">{children}</code>
    </pre>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-extrabold mt-12 mb-5 tracking-tight"
      style={{
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_ACCENT})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold text-white mt-8 mb-3 flex items-center gap-2">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: GOLD }}
      />
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#999] leading-relaxed mb-4 text-[15px]">{children}</p>;
}

function Badge({ children, color = GOLD }: { children: string; color?: string }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold mr-2 mb-1"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {children}
    </span>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-x-auto rounded-xl mb-6"
      style={{
        border: "1px solid rgba(255,215,0,0.08)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      {children}
    </div>
  );
}

const SECTIONS: DocSection[] = [
  {
    id: "install",
    title: "Installation",
    icon: "\uD83D\uDCE6",
    content: (
      <>
        <H2>Installation</H2>
        <P>Install the CLI, then select a local or hosted provider. Supports macOS, Linux, and WSL.</P>

        <H3>Quick Install (recommended)</H3>
        <CodeBlock>{`curl -fsSL https://cli.darshj.ai/install.sh | bash`}</CodeBlock>

        <H3>From source</H3>
        <CodeBlock>{`git clone https://github.com/darshjme/djcode
cd djcode
uv sync
uv run python -m djcode`}</CodeBlock>

        <H3>Prerequisites</H3>
        <ul className="list-none space-y-2 mb-6 ml-1">
          {[
            "Python 3.12+",
            <>
              <a href="https://ollama.com" className="text-[#FFD700] hover:text-[#FFE55C] transition-colors underline decoration-[#FFD700]/30 hover:decoration-[#FFD700]">
                Ollama
              </a>{" "}
              with a model installed for local inference, or an API key for a hosted provider
            </>,
            "macOS or Linux (WSL on Windows)",
          ].map((item, i) => (
            <li key={i} className="text-[#999] flex items-start gap-2">
              <span className="text-[#FFD700] mt-1 text-xs">&#9670;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <H3>Local models (optional download)</H3>
        <CodeBlock>{`ollama pull gemma4        # Default, 9.6GB
ollama pull qwen2.5-coder:7b  # Fast, 4.7GB
ollama pull dolphin3      # Uncensored, 4.9GB`}</CodeBlock>
      </>
    ),
  },
  {
    id: "quickstart",
    title: "Quick Start",
    icon: "\uD83D\uDE80",
    content: (
      <>
        <H2>Quick Start</H2>

        <H3>Interactive terminal</H3>
        <CodeBlock>{`djcode`}</CodeBlock>
        <P>Opens the interactive terminal interface with model information, tool output, and status. Use djcode --repl for the lightweight REPL.</P>

        <H3>Hosted models with Featherless</H3>
        <P>Set FEATHERLESS_API_KEY in your shell, then choose a model ID from the Featherless catalog. Hosted inference sends your prompt and selected project context to that provider.</P>
        <CodeBlock>{`djcode --provider featherless --model MODEL_ID "explain this project"`}</CodeBlock>
        <P><a href="https://featherless.ai/docs/quickstart-guide" className="text-gold underline">Featherless setup guide ↗</a></P>
        <H3>One-shot mode</H3>
        <CodeBlock>{`djcode "write a REST API with auth in FastAPI"
djcode --model qwen2.5-coder:7b "binary search in Rust"
djcode --no-thinking "explain this error"`}</CodeBlock>

        <H3>CLI flags</H3>
        <TableWrapper>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                <th className="py-3 px-4 text-[#FFD700] font-mono font-semibold">Flag</th>
                <th className="py-3 px-4 text-white font-semibold">Description</th>
                <th className="py-3 px-4 text-[#666] font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["--model, -m", "Model name", "gemma4"],
                ["--provider, -p", "LLM provider", "ollama"],
                ["--thinking / --no-thinking", "Show model reasoning", "on"],
                ["--bypass-rlhf", "Unrestricted mode", "off"],
                ["--auto-accept", "Skip tool confirmations", "off"],
                ["--army", "Open the specialist overview", "off"],
              ].map(([flag, desc, def]) => (
                <tr
                  key={flag}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="py-2.5 px-4 font-mono text-white text-xs">{flag}</td>
                  <td className="py-2.5 px-4">{desc}</td>
                  <td className="py-2.5 px-4 text-[#666] font-mono text-xs">{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </>
    ),
  },
  {
    id: "commands",
    title: "Commands",
    icon: "\u2328\uFE0F",
    content: (
      <>
        <H2>Slash Commands</H2>
        <P>
          Type these in the REPL. Use bare{" "}
          <code className="text-[#FFD700] bg-[#FFD700]/[0.08] px-1.5 py-0.5 rounded text-xs font-mono">/</code>{" "}
          for an interactive picker.
        </P>

        <H3>Build &amp; Ship</H3>
        <div className="space-y-1.5 mb-6">
          {[
            ["/orchestra <task>", "Multi-agent orchestration -- auto-dispatches to best agents"],
            ["/review <code>", "Code review via Dharma agent (security, perf, style)"],
            ["/debug <issue>", "Root cause analysis via Sherlock agent"],
            ["/test <target>", "Write tests via Agni agent"],
            ["/refactor <code>", "Restructure via Shiva agent (zero behavior change)"],
            ["/devops <task>", "Docker/CI/CD via Vayu agent"],
            ["/docs <target>", "Generate docs via Saraswati agent"],
          ].map(([cmd, desc]) => (
            <div key={cmd} className="flex gap-3 items-start py-1">
              <code className="text-[#FFD700] font-mono text-xs whitespace-nowrap bg-[#FFD700]/[0.06] px-2 py-0.5 rounded shrink-0">
                {cmd}
              </code>
              <span className="text-[#888] text-sm">{desc}</span>
            </div>
          ))}
        </div>

        <H3>Content &amp; Marketing</H3>
        <div className="space-y-1.5 mb-6">
          {[
            ["/launch <product>", "Full pipeline: build -> ship -> campaign"],
            ["/campaign <brief>", "Content campaign via Narada + 12 agents"],
            ["/image <concept>", "Image prompts via Maya agent"],
            ["/video <concept>", "Cinematic video prompts via Kubera agent"],
            ["/social <topic>", "Social media content via Chitragupta agent"],
          ].map(([cmd, desc]) => (
            <div key={cmd} className="flex gap-3 items-start py-1">
              <code className="text-[#34D399] font-mono text-xs whitespace-nowrap bg-[#34D399]/[0.06] px-2 py-0.5 rounded shrink-0">
                {cmd}
              </code>
              <span className="text-[#888] text-sm">{desc}</span>
            </div>
          ))}
        </div>

        <H3>Tools &amp; Config</H3>
        <div className="space-y-1.5 mb-6">
          {[
            ["/model [name]", "Interactive model picker or switch to specific model"],
            ["/provider [name]", "Switch provider (ollama, mlx, openai, etc.)"],
            ["/auth", "Configure API keys"],
            ["/config", "Show current configuration"],
            ["/set k=v", "Set a config value"],
            ["/auto", "Toggle auto-accept tool calls"],
            ["/stats [7d|30d]", "Usage dashboard with activity heatmap"],
            ["/agents", "Show agent roster"],
            ["/memory", "Show memory tier stats"],
            ["/skill list|add|remove", "Manage teachable skills"],
            ["/shortcuts", "Show keyboard shortcut reference"],
            ["/clear", "Clear conversation"],
            ["/save", "Save conversation to disk"],
            ["/exit", "Exit DJcode"],
          ].map(([cmd, desc]) => (
            <div key={cmd} className="flex gap-3 items-start py-1">
              <code className="text-[#60A5FA] font-mono text-xs whitespace-nowrap bg-[#60A5FA]/[0.06] px-2 py-0.5 rounded shrink-0">
                {cmd}
              </code>
              <span className="text-[#888] text-sm">{desc}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    icon: "\uD83C\uDFB9",
    content: (
      <>
        <H2>Keyboard Shortcuts</H2>
        <TableWrapper>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                <th className="py-3 px-4 text-[#FFD700] font-mono font-semibold">Key</th>
                <th className="py-3 px-4 text-white font-semibold">Action</th>
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
                <tr
                  key={key}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="py-2.5 px-4">
                    <kbd
                      className="px-2.5 py-1 rounded-md text-xs font-mono text-white font-medium"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,215,0,0.15)",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.3)",
                      }}
                    >
                      {key}
                    </kbd>
                  </td>
                  <td className="py-2.5 px-4">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </>
    ),
  },
  {
    id: "agents",
    title: "Agents",
    icon: "\uD83C\uDFAF",
    content: (
      <>
        <H2>Agent Registry</H2>
        <P>19 core specialists and 12 content roles. Use the agent roster to select a specialist or start an orchestrated workflow.</P>

        <H3>Dev Agents (10)</H3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[
            ["Vyasa", "Orchestrator", "Decomposes, delegates, synthesizes. Never writes code.", "0.3"],
            ["Prometheus", "Coder", "Production code across 6+ languages.", "0.4"],
            ["Sherlock", "Debugger", "5-step root cause methodology.", "0.2"],
            ["Vishwakarma", "Architect", "System design and ADRs. Read-only.", "0.5"],
            ["Dharma", "Reviewer", "Security, perf, style review with severity ratings.", "0.3"],
            ["Agni", "Tester", "Happy path, edge cases, boundary conditions.", "0.3"],
            ["Garuda", "Scout", "Read-only codebase recon.", "0.3"],
            ["Vayu", "DevOps", "Docker, CI/CD, K8s, Terraform.", "0.3"],
            ["Saraswati", "Docs", "READMEs, API docs, changelogs.", "0.6"],
            ["Shiva", "Refactorer", "Zero behavior change. Tests first.", "0.3"],
          ].map(([name, role, desc, temp]) => (
            <div
              key={name}
              className="rounded-xl p-4 transition-all duration-200 hover:border-[#FFD700]/20"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white text-sm">{name}</span>
                <Badge>{role}</Badge>
              </div>
              <p className="text-[#777] text-xs leading-relaxed">{desc}</p>
              <span className="text-[#555] text-[10px] font-mono mt-1 inline-block">t={temp}</span>
            </div>
          ))}
        </div>

        <H3>Architecture and assurance (9)</H3>
        <P>Chanakya (product strategy), Kavach (security), Aryabhata (data science), Indra (reliability), Kubera (cost), Hermes (integration), Kamadeva (UX), Mitra (legal intelligence), and Varuna (risk). These are AI role profiles; their outputs still need appropriate review.</P>
        <H3>Content Agents (12)</H3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {[
            ["Narada", "Campaign Director"],
            ["Valmiki", "Script Writer"],
            ["Chitragupta", "Social Strategist"],
            ["Maya", "Image Prompter"],
            ["Kubera", "Video Director"],
            ["Tvastar", "ComfyUI Expert"],
            ["Gandharva", "Audio Prompter"],
            ["Brihaspati", "SEO Analyst"],
            ["Saraswati", "Brand Voice"],
            ["Vishvakarma", "Thumbnail Designer"],
            ["Hanuman", "Content Repurposer"],
            ["Garuda", "Trend Scout"],
          ].map(([name, role]) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-lg p-2.5 transition-colors hover:bg-white/[0.03]"
              style={{ border: "1px solid rgba(255,255,255,0.04)" }}
            >
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
    icon: "\uD83D\uDD0C",
    content: (
      <>
        <H2>Providers</H2>
        <P>DJcode supports local, hosted, and custom OpenAI-compatible providers. Local-first by default, cloud when you need it.</P>
        <TableWrapper>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                <th className="py-3 px-4 text-[#FFD700] font-semibold">Provider</th>
                <th className="py-3 px-4 text-white font-semibold">Type</th>
                <th className="py-3 px-4 text-[#666] font-semibold">API Key</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["Ollama", "Local", "None"],
                ["MLX", "Local (Apple Silicon)", "None"],
                ["Colibri", "Existing local server", "Optional COLI_API_KEY"],
                ["OpenAI", "Cloud", "Required"],
                ["Anthropic", "Cloud", "Required"],
                ["NVIDIA NIM", "Cloud", "Required"],
                ["Google AI", "Cloud", "Required"],
                ["Groq", "Cloud", "Required"],
                ["Together AI", "Cloud", "Required"],
                ["OpenRouter", "Cloud", "Required"],
                ["Featherless", "Cloud", "FEATHERLESS_API_KEY"],
                ["Custom", "OpenAI-compatible", "Endpoint-dependent"],
              ].map(([name, type, key]) => (
                <tr
                  key={name}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="py-2.5 px-4 font-semibold text-white">{name}</td>
                  <td className="py-2.5 px-4">{type}</td>
                  <td className="py-2.5 px-4 text-[#666]">{key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
        <CodeBlock>{`# Switch provider
djcode --provider openai --model gpt-4o "explain closures"
djcode --provider anthropic --model claude-sonnet-4-20250514 "review my code"
djcode --provider mlx "local Apple Silicon inference"`}</CodeBlock>
        <H3>Optional Colibri runtime</H3>
        <P>Use an existing Colibri installation and compatible model files. DJcode adds resource planning, a guarded foreground launcher, and the coding client; it downloads no engine or weights.</P>
        <CodeBlock>{`# Inspect your existing installation and model files
djcode-colibri plan --launcher /path/to/colibri/c/coli --model-dir /models/existing-model --ram-gb 12
# Preview startup without loading weights
djcode-colibri serve --launcher /path/to/colibri/c/coli --model-dir /models/existing-model --ram-gb 12 --dry-run
# Inspect an already running local server
djcode-colibri check`}</CodeBlock>
        <P>Colibri can stream model experts from disk. Lower RAM use can mean slower generation, and dense weights, context, cache, and storage still need enough capacity. The RAM budget is not an operating-system limit or a guarantee that a model fits. The guarded launcher checks native tool support before serving.</P>
        <P><a href="https://github.com/darshjme/djcode/blob/main/docs/LOW-MEMORY-COLIBRI.md" className="text-gold underline">Colibri setup, serving commands, and limits ↗</a></P>
      </>
    ),
  },
  {
    id: "models",
    title: "Models",
    icon: "\uD83E\uDDE0",
    content: (
      <>
        <H2>Supported Models</H2>
        <TableWrapper>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                <th className="py-3 px-4 text-[#FFD700] font-semibold">Model</th>
                <th className="py-3 px-4 text-white font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold text-[#999]">Best For</th>
                <th className="py-3 px-4 font-semibold text-[#999]">Tools</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              {[
                ["gemma4", "9.6 GB", "General coding (default)", "\u2705"],
                ["qwen2.5-coder:7b", "4.7 GB", "Fast coding tasks", "\u2705"],
                ["deepseek-coder-v2:lite", "8.9 GB", "Code generation", "\u2705"],
                ["dolphin3", "4.9 GB", "Uncensored, no refusals", "\u274C"],
                ["gemma4:26b", "16 GB", "Complex reasoning (32GB+)", "\u2705"],
                ["qwen3:32b", "20 GB", "128K context window", "\u2705"],
              ].map(([model, size, best, tools]) => (
                <tr
                  key={model}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="py-2.5 px-4 font-mono text-white text-xs">{model}</td>
                  <td className="py-2.5 px-4">{size}</td>
                  <td className="py-2.5 px-4">{best}</td>
                  <td className="py-2.5 px-4">{tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
        <P>
          <strong className="text-white">RAM guide:</strong> 8GB = 7B models | 16GB = 9-12B models | 32GB = 26B MoE / 32B | 64GB+ = 70B+
        </P>
      </>
    ),
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: "\uD83C\uDFD7\uFE0F",
    content: (
      <>
        <H2>Architecture</H2>
        <P>DJcode is a modular Python CLI with 40+ source files.</P>
        <CodeBlock>{`src/djcode/
\u251C\u2500\u2500 cli.py              # Click entry point
\u251C\u2500\u2500 repl.py             # Interactive terminal (prompt-toolkit + Rich)
\u251C\u2500\u2500 provider.py         # Provider registry and routing
\u251C\u2500\u2500 prompt.py           # Expert system prompt + reasoning framework
\u251C\u2500\u2500 prompt_enhancer.py  # 8-intent smart prompt enrichment
\u251C\u2500\u2500 tui.py              # Keyboard shortcuts + mode system + progress
\u251C\u2500\u2500 stats.py            # Usage dashboard with heatmap
\u251C\u2500\u2500 errors.py           # 16-pattern error classifier + fallback
\u251C\u2500\u2500 permissions.py      # Access control + dangerous command detection
\u251C\u2500\u2500 context_file.py     # djcode.md auto-save on exit
\u251C\u2500\u2500 skills.py           # Teachable .skill.md system
\u251C\u2500\u2500 voice.py            # Whisper transcription (3 backends)
\u251C\u2500\u2500 installer.py        # Software installer (brew/apt/pip)
\u251C\u2500\u2500 config.py           # ~/.djcode/config.json
\u251C\u2500\u2500 auth.py             # 9 provider auth registry
\u251C\u2500\u2500 status.py           # Bottom toolbar with mode indicator
\u251C\u2500\u2500 onboarding.py       # First-run wizard
\u251C\u2500\u2500 updater.py          # Auto-update checker
\u251C\u2500\u2500 tools/              # 8 async tools (bash, file ops, grep, glob, git, web)
\u251C\u2500\u2500 memory/             # 3-tier memory (session, persistent, semantic)
\u251C\u2500\u2500 agents/             # 10 dev + 12 content agent registries
\u2514\u2500\u2500 orchestrator/       # Engine + semantic router + vector context + context bus`}</CodeBlock>
      </>
    ),
  },
  {
    id: "memory",
    title: "Memory System",
    icon: "\uD83D\uDCBE",
    content: (
      <>
        <H2>3-Tier Memory</H2>

        <H3>Tier 1 -- Session Memory (Hot)</H3>
        <P>Current conversation. Messages, tool results, thinking context. Cleared on /clear or exit.</P>

        <H3>Tier 2 -- Persistent Facts (Warm)</H3>
        <P>Key-value facts that survive across sessions. Stored at ~/.djcode/memory/ as JSON.</P>
        <CodeBlock>{`/remember db_host=localhost:5432
/recall db_host
/forget db_host`}</CodeBlock>

        <H3>Tier 3 -- Semantic Vectors (Deep)</H3>
        <P>ChromaDB-backed vector search across all past sessions. Finds relevant context by meaning using all-MiniLM-L6-v2 embeddings.</P>

        <H3>Context File</H3>
        <P>
          DJcode auto-saves{" "}
          <code className="text-[#FFD700] bg-[#FFD700]/[0.08] px-1.5 py-0.5 rounded text-xs font-mono">
            djcode.md
          </code>{" "}
          on exit with project info, session summary, and detected frameworks. Loaded on next startup for instant context.
        </P>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: "\uD83D\uDD12",
    content: (
      <>
        <H2>Privacy &amp; Security</H2>
        <P>Local inference keeps prompts on your machine. Choosing a hosted provider sends prompts and selected context to that service. Review its data policy before use.</P>
        <ul className="list-none space-y-3 mb-6 ml-1">
          {[
            "DO_NOT_TRACK=1 set by default",
            "Zero analytics, zero phone-home, zero telemetry",
            "No DJcode account required; hosted providers have their own accounts and billing",
            "Local inference is available via Ollama/MLX with an installed model",
            "Cloud providers are opt-in (you bring your own API key)",
            "Permission checks apply to tools; auto-accept changes the confirmation behavior",
            "Dangerous command detection (rm -rf, sudo, curl|bash, etc.)",
            "Project instructions may be included in model requests, including requests to hosted providers",
          ].map((item, i) => (
            <li key={i} className="text-[#999] flex items-start gap-3 text-[15px]">
              <span className="text-[#4ADE80] mt-1 text-xs shrink-0">&#10003;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("install");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("doc-", "");
            setActiveSection(id);
          }
        }
      },
      { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(`doc-${s.id}`);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">
          {/* Sidebar */}
          <nav
            className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "var(--sidebar-shadow)",
            }}
          >
            <h2
              className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5 font-bold"
              style={{ color: GOLD }}
            >
              Documentation
            </h2>
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setActiveSection(s.id);
                      document.getElementById(`doc-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === s.id
                        ? "font-semibold"
                        : "text-[#777] hover:text-white hover:bg-white/[0.03]"
                    }`}
                    style={
                      activeSection === s.id
                        ? {
                            background: "rgba(255,215,0,0.08)",
                            color: GOLD,
                            borderLeft: `2px solid ${GOLD}`,
                          }
                        : {}
                    }
                  >
                    {s.icon} {s.title}
                  </button>
                </li>
              ))}
            </ul>

            {/* Sidebar footer */}
            <div
              className="mt-8 pt-5 text-center"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[10px] text-[#555] font-mono leading-relaxed">
                Built for local-first coding,<br />specialist workflows,<br />and Apple Silicon
              </p>
            </div>
          </nav>

          {/* Content */}
          <main id="main-content" className="flex-1 min-w-0 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
                <span
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_ACCENT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DJ
                </span>
                <span className="text-white">code</span>{" "}
                <span className="text-white">Documentation</span>
              </h1>
              <p className="text-[#888] text-lg mb-4">
                Everything you need to know about the last coding CLI you&apos;ll ever need.
              </p>
              <p className="text-[#555] text-sm mb-10 font-mono">
                Specialist workflows for building, reviewing, and launching your product.
              </p>
            </motion.div>

            {SECTIONS.map((section) => (
              <motion.section
                key={section.id}
                id={`doc-${section.id}`}
                className="pb-12 mb-8"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                {section.content}
              </motion.section>
            ))}

            {/* Footer */}
            <div className="text-center py-16">
              <div
                className="inline-block px-8 py-6 rounded-2xl"
                style={{
                  background: "rgba(255,215,0,0.03)",
                  border: "1px solid rgba(255,215,0,0.08)",
                }}
              >
                <p className="text-sm text-[#888] mb-2">
                  Built with intention by{" "}
                  <a
                    href="https://darshj.ai"
                    className="text-[#FFD700] hover:text-[#FFE55C] transition-colors font-semibold"
                  >
                    Darshankumar Joshi
                  </a>
                </p>
                <p className="text-xs text-[#555] font-mono">
                  DJcode &gt; Claude Code, Gemini CLI, OpenCode, Aider
                </p>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#666]">
                  <a href="https://github.com/darshjme/djcode" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                  <span className="text-[#333]">|</span>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
