"use client";

import { cn } from "@/lib";
import { Circle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  tabs?: { header?: string; content?: ReactNode }[];
  activeTab?: number;
  className?: { container?: string; tab?: string };
  withoutIndicator?: boolean;
  onChange?: (index: number) => void;
}

export default function Segments(props: Props) {
  const [active, setActive] = useState(props.activeTab || 0);

  useEffect(() => {
    props.onChange && props.onChange(active);
  }, [active]);

  return (
    <div
      className={cn(
        "flex h-14 w-full items-center overflow-hidden rounded-lg border border-border transition-all",
        props.className?.container,
      )}
    >
      {props.tabs?.map((tab, index) => {
        return (
          <div
            key={index}
            id={`segment-${index}`}
            onClick={() => setActive(index)}
            className={cn(
              "relative flex h-full w-full cursor-pointer items-center select-none",
              "justify-center text-xs font-medium text-nowrap text-foreground transition-all",
              {
                "bg-background font-bold": active === index,
                "border-none": index === 0,
              },
              props.className?.tab,
            )}
          >
            {!props.withoutIndicator && (
              <Circle
                className={cn(
                  "absolute right-1 ms-1 w-2 fill-foreground opacity-0 transition-all",
                  {
                    "opacity-100": active === index,
                  },
                )}
              />
            )}

            {tab.header}
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
