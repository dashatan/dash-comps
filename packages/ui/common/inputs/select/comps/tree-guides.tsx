import { cn } from "@/lib";

/** Row connectors for single-select tree (recursive-select-item-single). */
export function TreeRowGuidesSingle({ last }: { last?: boolean }) {
  return (
    <>
      <div className="ms-0.5 h-px w-8.5 bg-border" />
      <div
        className={cn("absolute inset-s-0.5 top-0 h-full w-px bg-border", {
          "h-1/2": last,
        })}
      />
    </>
  );
}

/** Row connectors for multi-select tree (recursive-select-item). */
export function TreeRowGuidesMulti({
  depth,
  last,
}: {
  depth: number;
  last?: boolean;
}) {
  return (
    <div>
      <div
        className={cn("ms-0.5 h-px w-10 bg-border", { "ms-6 w-6": depth > 2 })}
      />
      <div
        className={cn("absolute inset-0.5 top-0 h-full w-px bg-border", {
          "h-1/2": last,
          "right-6": depth > 2,
        })}
      />
    </div>
  );
}

/** Vertical line continuing through nested children. */
export function TreeChildrenContinuation() {
  return (
    <div className={cn("absolute inset-s-0 top-0 h-full w-px bg-border")} />
  );
}
