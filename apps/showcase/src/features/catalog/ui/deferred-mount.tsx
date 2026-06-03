import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferredMountProps = {
  children: ReactNode;
  /** Placeholder height before content mounts (avoids layout jump). */
  minHeight?: number;
  /** Load slightly before the block enters the viewport. */
  rootMargin?: string;
};

/**
 * Mounts children only when near the viewport. Use for heavy catalog demos
 * (date pickers, selects, virtualized lists) on long showcase pages.
 */
export function DeferredMount({
  children,
  minHeight = 160,
  rootMargin = "320px 0px",
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div
      ref={ref}
      className="w-full min-w-0"
      style={mounted ? undefined : { minHeight }}
    >
      {mounted ? children : null}
    </div>
  );
}
