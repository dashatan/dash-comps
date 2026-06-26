import React from "react";
import { Event } from "../../types";
import { MAP_STYLES } from "../config/constants";
import { cn } from "@/lib";

interface CircleMarkerProps {
  event: Event;
  isActive: boolean;
}

export const CircleMarker: React.FC<CircleMarkerProps> = ({
  event,
  isActive,
}) => {
  const className = cn(
    "border border-foreground bg-primary rounded-full cursor-pointer hover:scale-125 transition-all",
    {
      "bg-error": event.error,
      "bg-warning": event.miss,
    },
  );

  return (
    <div
      className={className}
      style={{
        width: `${MAP_STYLES.CIRCLE_POINT_SIZE}px`,
        height: `${MAP_STYLES.CIRCLE_POINT_SIZE}px`,
        borderWidth: `${MAP_STYLES.CIRCLE_POINT_BORDER}px`,
      }}
      role="button"
      aria-label={event.name || "event-marker"}
    />
  );
};
