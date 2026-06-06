import Loading from "@/components/common/loading";
import type { LoadingProps } from "@/components/common/loading/types";

type SpinnerLoadingProps = Pick<
  LoadingProps,
  "className" | "indicatorClassName" | "label" | "size" | "severity"
>;

/** @deprecated Prefer `Loading` with `mode="overlay"`. */
export default function SpinnerLoading({
  className,
  indicatorClassName,
  label,
  size = "md",
  severity = "primary",
}: SpinnerLoadingProps) {
  return (
    <Loading
      variant="spinner"
      mode="overlay"
      backdrop="subtle"
      size={size}
      severity={severity}
      label={label}
      className={className}
      indicatorClassName={indicatorClassName}
    />
  );
}
