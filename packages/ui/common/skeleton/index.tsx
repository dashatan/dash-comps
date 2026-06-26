import { cn } from "@/lib";

export default function Skeleton(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "skeleton-shimmer h-10 w-full rounded-lg bg-muted/60",
        props.className,
      )}
    ></div>
  );
}
