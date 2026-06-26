import { cn } from "@/lib";

export default function Indicator(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "min-size-2 size-2 rounded-sm bg-background",
        props.className,
      )}
    />
  );
}
