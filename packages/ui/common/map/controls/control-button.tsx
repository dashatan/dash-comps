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
            "bg-card hover:bg-card-hover text-card-foreground flex aspect-square w-full cursor-pointer items-center justify-center transition-all",
            { "cursor-not-allowed opacity-60": disabled },
            props.className,
          )}
        />
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        className="bg-popover text-popover-foreground flex w-auto min-w-10 justify-center gap-2 p-2 text-sm font-bold"
      >
        <span>{tooltip ?? ""}</span>
      </HoverCardContent>
    </HoverCard>
  );
}
