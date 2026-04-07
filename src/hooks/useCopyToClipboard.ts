"use client";

import { useState, useCallback } from "react";

/**
 * Copy text to clipboard with a temporary "Copied!" feedback state.
 * `copied` resets to false after `duration` ms (default 2000).
 */
export function useCopyToClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [duration]
  );

  return { copied, copy };
}
