"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const tools = [
  { name: "DJcode", focus: "Local-first specialist workflows", models: "Ollama, MLX and hosted providers", workflow: "Terminal UI, REPL, tools and agent orchestration", href: "https://github.com/darshjme/djcode" },
  { name: "Claude Code", focus: "Agentic development with Claude", models: "Anthropic and supported third-party providers", workflow: "Terminal, IDE, desktop and web", href: "https://code.claude.com/docs/en/overview" },
  { name: "Gemini CLI", focus: "Gemini in the terminal", models: "Gemini authentication and API options", workflow: "Terminal agent with tools and extensions", href: "https://github.com/google-gemini/gemini-cli" },
  { name: "Aider", focus: "AI pair programming", models: "Hosted APIs and local Ollama models", workflow: "Terminal editing and Git integration", href: "https://aider.chat/docs/llms/ollama.html" },
  { name: "OpenCode", focus: "Provider-flexible coding", models: "Hosted APIs and local providers", workflow: "Terminal tools, configurable agents and permissions", href: "https://opencode.ai/docs/providers/" },
  { name: "Goose", focus: "Extensible development automation", models: "Multiple model providers", workflow: "CLI and desktop agent with extensions", href: "https://github.com/block/goose" },
];

export default function Comparison() {
  return (
    <section id="compare" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 md:mb-14">
          <p className="eyebrow mb-4">A PLACE IN YOUR TOOLKIT</p>
          <h2 className="text-3xl font-semibold tracking-[-.04em] md:text-5xl">Choose your way to build.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">Great tools take different approaches. DJcode brings local inference, specialist workflows, and persistent context together in your terminal.</p>
        </motion.div>
        <div className="glass-card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Coding CLI approaches and official documentation</caption>
            <thead className="border-b border-white/10 text-[10px] uppercase tracking-[.15em] text-[#98968c]"><tr><th scope="col" className="px-6 py-5">Tool</th><th scope="col" className="px-6 py-5">Focus</th><th scope="col" className="px-6 py-5">Model choice</th><th scope="col" className="px-6 py-5">Workflow</th></tr></thead>
            <tbody>{tools.map((tool, i) => <tr key={tool.name} className={`border-b border-white/[.05] last:border-0 ${i === 0 ? "bg-[#e7ce83]/[.055]" : "hover:bg-white/[.02]"}`}><th scope="row" className="whitespace-nowrap px-6 py-6 font-semibold"><a className={`inline-flex items-center gap-2 ${i === 0 ? "text-[#efd68e]" : "text-[#dedbd2]"}`} href={tool.href} target="_blank" rel="noopener noreferrer">{tool.name}<ArrowUpRight size={12} /></a></th><td className="px-6 py-6 text-[#bcb9ae]">{tool.focus}</td><td className="px-6 py-6 text-[#a09e95]">{tool.models}</td><td className="px-6 py-6 text-[#a09e95]">{tool.workflow}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-5 text-xs leading-6 text-[#8d8c83]">Each tool links to its official documentation. Capabilities and provider terms change; this is an overview, not a performance benchmark. DJcode is MIT licensed; hosted inference may incur provider charges.</p>
      </div>
    </section>
  );
}
