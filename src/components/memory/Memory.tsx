"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* -------------------------------------------------- */
/*  Data                                              */
/* -------------------------------------------------- */

const TIERS = [
  {
    tier: 1,
    name: "Session Memory",
    badge: "Tier 1 \u00b7 Hot",
    color: "emerald",
    dotColor: "#34D399",
    borderColor: "border-emerald",
    badgeBg: "bg-emerald/15",
    badgeText: "text-emerald",
    storage: "In-process list",
    persistence: "Until exit",
    description:
      "Current conversation. Messages, tool results, context. Cleared on /clear.",
  },
  {
    tier: 2,
    name: "Persistent Facts",
    badge: "Tier 2 \u00b7 Warm",
    color: "blue",
    dotColor: "#60A5FA",
    borderColor: "border-blue",
    badgeBg: "bg-blue/15",
    badgeText: "text-blue",
    storage: "~/.djcode/memory/facts.json",
    persistence: "Forever",
    description:
      "Key-value pairs. /remember, /recall, /forget. Survives restarts.",
  },
  {
    tier: 3,
    name: "Semantic Vectors",
    badge: "Tier 3 \u00b7 Deep",
    color: "purple",
    dotColor: "#A78BFA",
    borderColor: "border-purple",
    badgeBg: "bg-purple/15",
    badgeText: "text-purple",
    storage: "~/.djcode/memory/chroma/",
    persistence: "Forever",
    description:
      "Embeddings of conversations and agent results. Cosine similarity retrieval. Cross-session intelligence.",
  },
] as const;

/* -------------------------------------------------- */
/*  Animations                                        */
/* -------------------------------------------------- */

const lineVariants = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const dotVariants = (i: number) => ({
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      delay: 0.8 + i * 0.3,
    },
  },
});

const cardVariants = (i: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      delay: 0.8 + 0.9 + i * 0.3,
    },
  },
});

const calloutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: 2.8 },
  },
};

/* -------------------------------------------------- */
/*  Vertical line (mobile)                            */
/* -------------------------------------------------- */

const verticalLineVariants = {
  hidden: { height: "0%" },
  visible: {
    height: "100%",
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/* -------------------------------------------------- */
/*  Component                                         */
/* -------------------------------------------------- */

export default function Memory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="memory"
      className="relative py-16 md:py-24"
      ref={ref}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* ---- Heading ---- */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-gradient-gold mb-4 font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            Memory that never forgets
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-text-secondary">
            Three tiers. Session to semantic. Every conversation makes it
            sharper.
          </p>
        </motion.div>

        {/* ---- Desktop Timeline (horizontal) ---- */}
        <div className="hidden md:block">
          <div className="relative mx-auto max-w-[900px]">
            {/* Animated connecting line */}
            <div className="absolute left-[calc(16.66%-6px)] right-[calc(16.66%-6px)] top-[6px] h-[2px]">
              <motion.div
                className="dash-flow h-full rounded-full"
                variants={lineVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              />
            </div>

            {/* Dots + Cards */}
            <div className="grid grid-cols-3 gap-4">
              {TIERS.map((tier, i) => (
                <div key={tier.tier} className="flex flex-col items-center">
                  {/* Pulsing Dot */}
                  <motion.div
                    className="relative z-10 mb-6"
                    variants={dotVariants(i)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <span
                      className="block h-3 w-3 rounded-full"
                      style={{ backgroundColor: tier.dotColor }}
                    />
                    <span
                      className="absolute inset-0 animate-tier-pulse rounded-full"
                      style={{ backgroundColor: tier.dotColor }}
                    />
                  </motion.div>

                  {/* Badge */}
                  <motion.span
                    className={`mb-3 inline-block rounded px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${tier.badgeBg} ${tier.badgeText}`}
                    variants={cardVariants(i)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    {tier.badge}
                  </motion.span>

                  {/* Card */}
                  <motion.div
                    className={`glass-card w-full border-t-[3px] p-5 ${tier.borderColor}`}
                    variants={cardVariants(i)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <h4 className="mb-1 font-sans text-lg font-bold text-text-primary">
                      {tier.name}
                    </h4>
                    <p className="mb-2 font-mono text-xs text-text-muted">
                      {tier.storage}
                    </p>
                    <span className="mb-3 inline-block rounded-sm bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
                      {tier.persistence}
                    </span>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {tier.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Mobile Timeline (vertical) ---- */}
        <div className="block md:hidden">
          <div className="relative pl-8">
            {/* Vertical animated line */}
            <div className="absolute left-[5px] top-0 bottom-0 w-[2px]">
              <motion.div
                className="dash-flow-vertical w-full"
                variants={verticalLineVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              />
            </div>

            <div className="flex flex-col gap-8">
              {TIERS.map((tier, i) => (
                <div key={tier.tier} className="relative">
                  {/* Dot on line */}
                  <motion.div
                    className="absolute -left-8 top-0 z-10"
                    style={{ left: "-27px" }}
                    variants={dotVariants(i)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <span
                      className="block h-3 w-3 rounded-full"
                      style={{ backgroundColor: tier.dotColor }}
                    />
                    <span
                      className="absolute inset-0 animate-tier-pulse rounded-full"
                      style={{ backgroundColor: tier.dotColor }}
                    />
                  </motion.div>

                  {/* Badge + Card */}
                  <motion.div
                    variants={cardVariants(i)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <span
                      className={`mb-2 inline-block rounded px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${tier.badgeBg} ${tier.badgeText}`}
                    >
                      {tier.badge}
                    </span>
                    <div
                      className={`glass-card border-t-[3px] p-4 ${tier.borderColor}`}
                    >
                      <h4 className="mb-1 font-sans text-base font-bold text-text-primary">
                        {tier.name}
                      </h4>
                      <p className="mb-2 font-mono text-xs text-text-muted">
                        {tier.storage}
                      </p>
                      <span className="mb-2 inline-block rounded-sm bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
                        {tier.persistence}
                      </span>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {tier.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Auto-learning callout ---- */}
        <motion.div
          className="mx-auto mt-10 max-w-[900px] md:mt-14"
          variants={calloutVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="glass-card flex items-start gap-3 border-l-[3px] border-l-gold p-5">
            <span className="mt-0.5 text-lg text-gold" aria-hidden="true">
              &#x2728;
            </span>
            <p className="text-sm leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">
                Auto-learning:
              </span>{" "}
              Every agent result is vectorized and stored. Next time you ask
              something similar, DJcode already has context from your past
              sessions.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ---- CSS for animations ---- */}
      <style jsx>{`
        @keyframes tierPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-tier-pulse {
          animation: tierPulse 2s ease infinite;
        }
        .dash-flow {
          background-image: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0px,
            rgba(255, 255, 255, 0.2) 6px,
            transparent 6px,
            transparent 12px
          );
          background-size: 200% 100%;
          animation: dashFlowX 1.5s linear infinite;
        }
        @keyframes dashFlowX {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: -24px 0;
          }
        }
        .dash-flow-vertical {
          background-image: repeating-linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.2) 0px,
            rgba(255, 255, 255, 0.2) 6px,
            transparent 6px,
            transparent 12px
          );
          background-size: 100% 200%;
          animation: dashFlowY 1.5s linear infinite;
        }
        @keyframes dashFlowY {
          0% {
            background-position: 0 0%;
          }
          100% {
            background-position: 0 -24px;
          }
        }
      `}</style>
    </section>
  );
}
