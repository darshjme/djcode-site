"use client";

import { useRef } from "react";
import {
  useInView as useFramerInView,
  type UseInViewOptions,
} from "framer-motion";

/**
 * Consistent scroll-trigger hook wrapping Framer Motion's useInView.
 * Defaults: triggers once when 20% of the element is visible.
 */
export function useInView(options?: UseInViewOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useFramerInView(ref, {
    once: true,
    amount: 0.2,
    ...options,
  });

  return { ref, isInView };
}
