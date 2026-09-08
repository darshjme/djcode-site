import { ArrowUpRight, Feather } from "lucide-react";

export default function Featherless() {
  return (
    <section id="featherless" className="px-6 py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#e6ce83]/20 bg-gradient-to-br from-[#211e15] via-[#12120f] to-[#101110] p-7 md:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 text-[#eed16a]/[.035]"><Feather size={330} strokeWidth={0.6} /></div>
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-5">HOSTED INFERENCE · YOUR CHOICE</p>
            <h2 className="text-3xl font-semibold tracking-[-.04em] md:text-5xl">Open models.<br /><span className="text-gradient-gold">Without the GPU.</span></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#aaa99f]">Connect DJcode to Featherless for hosted open-weight models through its OpenAI-compatible API. Choose a model from their catalog and keep the same coding workflow.</p>
            <a href="https://featherless.ai" target="_blank" rel="noopener noreferrer" className="primary-action mt-7">Explore Featherless <ArrowUpRight size={16} /></a>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between text-xs text-[#bfb8a3]"><span className="flex items-center gap-2"><Feather size={16} /> Featherless setup</span><span className="font-mono text-[10px] text-[#8d8a7e]">DJCODE / CLOUD</span></div>
            <p className="mb-4 text-xs leading-6 text-[#99988f]">Add your API key as <code className="text-[#e7ce88]">FEATHERLESS_API_KEY</code>, then replace <code>MODEL_ID</code> with your selected model.</p>
            <pre className="overflow-x-auto rounded-lg border border-white/[.05] bg-[#0b0c0a] p-4 text-xs leading-7 text-[#ded9c7]"><code>{'djcode --provider featherless \\\n  --model MODEL_ID \\\n  "review this project"'}</code></pre>
            <p className="mt-4 text-xs leading-6 text-[#8d8c83]">A Featherless account and API key are required. Provider charges apply. Prompts and selected code context are sent to Featherless. Tool support varies by model.</p>
            <a className="mt-4 inline-flex items-center gap-2 text-xs text-[#e7ce88] hover:underline" href="https://featherless.ai/docs/quickstart-guide" target="_blank" rel="noopener noreferrer">Official setup guide <ArrowUpRight size={13} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
