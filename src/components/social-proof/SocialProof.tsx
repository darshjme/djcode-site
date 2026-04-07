"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Terminal, Cloud, Shield } from "lucide-react";

function useCountUp(end: number, duration: number = 1200, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }, [active, end, duration]);

  return value;
}

function useTypeOut(text: string, duration: number = 400, active: boolean) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;
    const perChar = duration / text.length;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, perChar);
    return () => clearInterval(interval);
  }, [active, text, duration]);

  return displayed;
}

const stats = [
  { label: "Agents", value: 22, icon: Brain, type: "number" as const },
  { label: "Commands", value: 38, icon: Terminal, type: "number" as const },
  { label: "Providers", value: 9, icon: Cloud, type: "number" as const },
  { label: "Telemetry", value: 0, icon: Shield, type: "text" as const, text: "Zero" },
];

function StatItem({
  stat,
  active,
}: {
  stat: (typeof stats)[number];
  active: boolean;
}) {
  const count = useCountUp(stat.value, 1200, active && stat.type === "number");
  const typed = useTypeOut("Zero", 400, active && stat.type === "text");

  const Icon = stat.icon;

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <Icon className="w-5 h-5 text-gold mb-1" />
      <span
        className="font-extrabold text-gold"
        style={{
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {stat.type === "text" ? typed : count}
      </span>
      <span className="text-text-secondary text-sm font-medium">
        {stat.label}
      </span>
    </div>
  );
}

export function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      id="proof"
      className="w-full py-6"
    >
      <div className="glass-card max-w-5xl mx-auto px-6 py-8">
        {/* Desktop: row with separators */}
        <div className="hidden sm:flex items-center justify-evenly">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div
                  className="h-10 mx-6 lg:mx-10"
                  style={{
                    width: "1px",
                    background: "rgba(255, 215, 0, 0.10)",
                  }}
                />
              )}
              <StatItem stat={stat} active={inView} />
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 gap-6 sm:hidden">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
