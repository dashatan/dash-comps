import { cn } from "@/lib";
import { LoadingIndicator } from "@/components/common/loading/indicators";
import type { LoadingProps } from "@/components/common/loading/types";
import {
  loadingContainerVariants,
  loadingLabelVariants,
} from "@/components/common/loading/variants";

export type {
  LoadingBackdrop,
  LoadingIndicatorProps,
  LoadingMode,
  LoadingProps,
  LoadingSeverity,
  LoadingSize,
  LoadingVariant,
} from "@/components/common/loading/types";

export {
  LOADING_BACKDROPS,
  LOADING_MODES,
  LOADING_SEVERITIES,
  LOADING_SIZES,
  LOADING_VARIANTS,
} from "@/components/common/loading/types";

export function Loading({
  variant = "spinner",
  size = "md",
  severity = "primary",
  mode = "inline",
  backdrop = mode === "inline" ? "none" : "subtle",
  label,
  className,
  indicatorClassName,
  labelClassName,
  "aria-label": ariaLabel,
}: LoadingProps) {
  const resolvedBackdrop = mode === "inline" ? "none" : backdrop;
  const resolvedAriaLabel = ariaLabel ?? label ?? "Loading";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={resolvedAriaLabel}
      className={cn(
        loadingContainerVariants({ mode, backdrop: resolvedBackdrop }),
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingIndicator
          variant={variant}
          size={size}
          severity={severity}
          className={indicatorClassName}
        />
        {label ? (
          <p className={cn(loadingLabelVariants({ severity }), labelClassName)}>
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Loading;
