/** Run decorative canvas work only while visible, at a bounded frame rate. */
export function visibleAnimation(element: Element, draw: (time: number) => void, fps: number) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let visible = false;
  let last = -Infinity;
  let stopped = false;
  let time = 0;
  let previous: number | null = null;

  function tick(now: number) {
    frame = 0;
    if (stopped || !visible || document.hidden) return;
    if (now - last >= 1000 / fps) {
      if (previous !== null) time += Math.min(now - previous, 100);
      previous = now;
      last = now;
      draw(time);
    }
    if (!motion.matches) frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = null;
    last = -Infinity;
    if (!stopped && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(element);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    motion.removeEventListener("change", sync);
  };
}
