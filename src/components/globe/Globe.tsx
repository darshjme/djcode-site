"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

/* ---------- cobe dynamic import (no SSR) ---------- */
let createGlobe: typeof import("cobe").default | null = null;

const MARKERS = [
  { location: [37.7749, -122.4194] as [number, number], size: 0.06 }, // San Francisco
  { location: [51.5074, -0.1278] as [number, number], size: 0.06 }, // London
  { location: [35.6762, 139.6503] as [number, number], size: 0.06 }, // Tokyo
  { location: [12.9716, 77.5946] as [number, number], size: 0.06 }, // Bangalore
  { location: [1.3521, 103.8198] as [number, number], size: 0.06 }, // Singapore
  { location: [48.8566, 2.3522] as [number, number], size: 0.06 }, // Paris
  { location: [-33.8688, 151.2093] as [number, number], size: 0.06 }, // Sydney
  { location: [52.52, 13.405] as [number, number], size: 0.06 }, // Berlin
];

const STATS = [
  { value: "100%", label: "Local inference" },
  { value: "0 bytes", label: "Sent to cloud" },
  { value: "9", label: "Providers supported" },
];

function GlobeCanvas({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const globeRef = useRef<import("cobe").Globe | null>(null);
  const rafRef = useRef<number>(0);

  const initGlobe = useCallback(async () => {
    if (!canvasRef.current) return;
    if (!createGlobe) {
      const cobe = await import("cobe");
      createGlobe = cobe.default;
    }

    if (globeRef.current) {
      globeRef.current.destroy();
      cancelAnimationFrame(rafRef.current);
    }

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [1, 0.843, 0],
      glowColor: [0.3, 0.25, 0],
      markers: MARKERS,
    });

    // Auto-rotate via update loop
    const rotate = () => {
      phiRef.current += 0.005;
      globeRef.current?.update({ phi: phiRef.current });
      rafRef.current = requestAnimationFrame(rotate);
    };
    rafRef.current = requestAnimationFrame(rotate);
  }, [size]);

  useEffect(() => {
    initGlobe();
    return () => {
      globeRef.current?.destroy();
      cancelAnimationFrame(rafRef.current);
    };
  }, [initGlobe]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, maxWidth: "100%", aspectRatio: "1" }}
      aria-label="Interactive globe showing DJcode works everywhere"
    />
  );
}

export default function Globe() {
  const { ref, isInView } = useInView({ amount: 0.15 });
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    if (isInView) setShowGlobe(true);
  }, [isInView]);

  return (
    <section
      id="global"
      ref={ref}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16">
          {/* Globe -- shows first on mobile, second on desktop */}
          <motion.div
            className="order-1 xl:order-2 flex-shrink-0 flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {showGlobe && (
              <>
                {/* Responsive globe sizes */}
                <div className="block md:hidden">
                  <GlobeCanvas size={250} />
                </div>
                <div className="hidden md:block lg:hidden">
                  <GlobeCanvas size={300} />
                </div>
                <div className="hidden lg:block xl:hidden">
                  <GlobeCanvas size={350} />
                </div>
                <div className="hidden xl:block">
                  <GlobeCanvas size={420} />
                </div>
              </>
            )}
          </motion.div>

          {/* Text + Stats */}
          <motion.div
            className="order-2 xl:order-1 flex-1 text-center xl:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2
              className="font-sans font-extrabold tracking-tight leading-[1.15]"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                background: "linear-gradient(90deg, #FFD700, #FFAA00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Works everywhere.
              <br />
              Runs nowhere but your machine.
            </h2>

            <p className="mt-6 text-text-secondary text-lg leading-relaxed max-w-lg mx-auto xl:mx-0">
              San Francisco, London, Tokyo, Bangalore, Singapore — developers
              everywhere trust DJcode for local-first AI coding. Your code never
              leaves your hardware.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto xl:mx-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center xl:text-left">
                  <div
                    className="font-extrabold tracking-tight"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "#FFD700",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-text-muted text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
