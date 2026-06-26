import { Loader2 } from "lucide-react";
import { cn } from "@/lib";
import type { LoadingIndicatorProps } from "@/components/common/loading/types";
import {
  loadingSeverityVariants,
  LOADING_SIZE_PX,
} from "@/components/common/loading/variants";

function getBarWidth(sizePx: number) {
  return Math.max(3, Math.round(sizePx / 6));
}

function getDotSize(sizePx: number) {
  return Math.max(4, Math.round(sizePx / 5));
}

export function LoadingIndicator({
  variant,
  size,
  severity,
  className,
}: LoadingIndicatorProps) {
  const sizePx = LOADING_SIZE_PX[size];
  const colorClass = loadingSeverityVariants({ severity });

  switch (variant) {
    case "spinner":
      return (
        <Loader2
          className={cn("animate-spin", colorClass, className)}
          style={{ width: sizePx, height: sizePx }}
          aria-hidden="true"
        />
      );

    case "dots": {
      const dotSize = getDotSize(sizePx);
      return (
        <div
          className={cn("flex items-center", colorClass, className)}
          style={{ gap: Math.max(2, Math.round(sizePx / 8)) }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="loading-dot rounded-full bg-current"
              style={{
                width: dotSize,
                height: dotSize,
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
      );
    }

    case "pulse":
      return (
        <span
          className={cn(
            "loading-pulse relative inline-flex rounded-full bg-current",
            colorClass,
            className,
          )}
          style={{ width: sizePx, height: sizePx }}
          aria-hidden="true"
        />
      );

    case "bars": {
      const barWidth = getBarWidth(sizePx);
      return (
        <div
          className={cn("flex items-end", colorClass, className)}
          style={{
            height: sizePx,
            gap: Math.max(2, Math.round(sizePx / 10)),
          }}
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className="loading-bar rounded-full bg-current"
              style={{
                width: barWidth,
                height: sizePx,
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>
      );
    }

    case "ring":
      return (
        <span
          className={cn(
            "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent",
            colorClass,
            className,
          )}
          style={{ width: sizePx, height: sizePx }}
          aria-hidden="true"
        />
      );

    case "orbit":
      return (
        <span
          className={cn("loading-orbit relative inline-flex", className)}
          style={{ width: sizePx, height: sizePx }}
          aria-hidden="true"
        >
          <span
            className={cn(
              "loading-orbit-dot absolute top-1/2 left-1/2 rounded-full bg-current",
              colorClass,
            )}
            style={{
              width: Math.max(4, Math.round(sizePx / 5)),
              height: Math.max(4, Math.round(sizePx / 5)),
              ["--orbit-radius" as string]: `${Math.round(sizePx / 2.8)}px`,
            }}
          />
          <span
            className={cn(
              "loading-orbit-dot absolute top-1/2 left-1/2 rounded-full bg-current opacity-60",
              colorClass,
            )}
            style={{
              width: Math.max(3, Math.round(sizePx / 6)),
              height: Math.max(3, Math.round(sizePx / 6)),
              ["--orbit-radius" as string]: `${Math.round(sizePx / 3.5)}px`,
              animationDelay: "-0.6s",
            }}
          />
        </span>
      );

    case "ripple":
      return (
        <span
          className={cn(
            "loading-ripple relative inline-flex",
            colorClass,
            className,
          )}
          style={{ width: sizePx, height: sizePx }}
          aria-hidden="true"
        >
          {[0, 1].map((index) => (
            <span
              key={index}
              className="loading-ripple-ring absolute inset-0 rounded-full border-2 border-current"
              style={{ animationDelay: `${index * 0.7}s` }}
            />
          ))}
        </span>
      );

    case "line":
      return (
        <span
          className={cn(
            "loading-line-track relative inline-flex overflow-hidden rounded-full bg-current/15",
            colorClass,
            className,
          )}
          style={{
            width: sizePx * 2.5,
            height: Math.max(3, Math.round(sizePx / 8)),
          }}
          aria-hidden="true"
        >
          <span className="loading-line-indeterminate absolute inset-y-0 w-1/3 rounded-full bg-current" />
        </span>
      );
  }
}
