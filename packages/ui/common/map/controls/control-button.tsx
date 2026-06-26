"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/common/hover-card";
import { cn } from "@/lib";

type MapControlButtonProps = DIV & {
  tooltip?: string;
  disabled?: boolean;
};

export default function MapControlButton({
  tooltip,
  disabled,
  ...props
}: MapControlButtonProps) {
  return (
    <HoverCard closeDelay={0} openDelay={0}>
      <HoverCardTrigger asChild>
        <div
          {...props}
          className={cn(
            "flex aspect-square w-full cursor-pointer items-center justify-center bg-card text-card-foreground transition-all hover:bg-card-hover",
            { "cursor-not-allowed opacity-60": disabled },
            props.className,
          )}
        />
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        className="flex w-auto min-w-10 justify-center gap-2 bg-popover p-2 text-sm font-bold text-popover-foreground"
      >
        <span>{tooltip ?? ""}</span>
      </HoverCardContent>
    </HoverCard>
  );
}
