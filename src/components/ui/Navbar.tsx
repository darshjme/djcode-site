"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Models", href: "#models" },
  { label: "Docs", href: "/docs" },
  { label: "Compare", href: "#compare" },
];

const SECTION_IDS = NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) =>
  l.href.replace("#", "")
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  /* ---- Scroll detection ---- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---- Intersection Observer for active section ---- */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
          ${
            scrolled
              ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              : "bg-transparent"
          }
        `}
        style={{ height: "64px" }}
      >
        <div className="mx-auto max-w-[1280px] h-full px-6 md:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo group */}
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-extrabold tracking-tight">
                <span
                  className="text-[#FFD700]"
                  style={{ textShadow: "0 0 20px rgba(255,215,0,0.2)" }}
                >
                  DJ
                </span>
                <span className="text-white">code</span>
              </span>
              <span
                className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full
                border border-[#FFD700]/30 text-[#FFD700]/80 bg-[#FFD700]/[0.05]"
              >
                v4.2.1
              </span>
            </div>
            <span className="text-[10px] text-[#FFD700]/50 font-medium tracking-wide -mt-0.5 ml-0.5">
              project by Darshan Kumar Joshi
            </span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive =
                link.href.startsWith("#") && activeSection === sectionId;

              return (
                <a
                  key={link.href}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  className={`
                    relative px-4 py-2 text-[13px] font-medium transition-colors duration-200 rounded-lg
                    ${
                      isActive
                        ? "text-[#FFD700]"
                        : "text-[#999] hover:text-white hover:bg-white/[0.03]"
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #FFD700, #FFAA00)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* GitHub + star count */}
            <a
              href="https://github.com/darshjme/djcode"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#999] hover:text-white
                hover:bg-white/[0.04] transition-all duration-200"
              aria-label="View on GitHub"
            >
              <GithubIcon size={18} />
              <div className="flex items-center gap-1 text-xs font-medium">

                <span>Source</span>
              </div>
            </a>

            {/* Install CTA */}
            <Link
              href="/#install"
              className="hidden md:inline-flex items-center px-6 py-2 rounded-lg text-sm font-bold
                bg-[#FFD700] text-[#0a0a0a] hover:bg-[#FFE55C] transition-all duration-200
                shadow-[0_2px_16px_rgba(255,215,0,0.15)] hover:shadow-[0_4px_30px_rgba(255,215,0,0.25)]"
            >
              Install
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[#999] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Narrative text at top */}
            <motion.p
              className="absolute top-24 text-xs text-[#FFD700]/40 font-mono tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              project by Darshan Kumar Joshi
            </motion.p>

            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                onClick={handleLinkClick}
                className="text-3xl font-bold text-white hover:text-[#FFD700] transition-colors tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              className="flex flex-col items-center gap-4 mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06 + 0.1, duration: 0.3 }}
            >
              <Link
                href="/#install"
                onClick={handleLinkClick}
                className="px-10 py-3.5 rounded-xl text-lg font-extrabold bg-[#FFD700] text-[#0a0a0a]
                  hover:bg-[#FFE55C] transition-colors shadow-[0_4px_30px_rgba(255,215,0,0.2)]"
              >
                Install DJcode
              </Link>
              <a
                href="https://github.com/darshjme/djcode"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
              >
                <GithubIcon size={16} />
                <span>View source on GitHub</span>
              </a>
            </motion.div>

            {/* Bottom narrative */}
            <motion.p
              className="absolute bottom-12 text-[10px] text-[#555] font-mono text-center max-w-xs leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Local-first coding. Your choice of model.
              <br />
              Read. Reason. Build. Verify.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
