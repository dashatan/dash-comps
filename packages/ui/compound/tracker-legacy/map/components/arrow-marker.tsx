import type { ArrowMarkerConfig } from "../types";
import { ANIMATION_CONFIG } from "../config/constants";
import pointerIcon from "./pointer-2.svg";

interface ArrowMarkerProps {
  config: ArrowMarkerConfig;
}

export function ArrowMarker({ config }: ArrowMarkerProps) {
  const rotation = config.angle + ANIMATION_CONFIG.ARROW_BEARING_OFFSET;

  return (
    <div className="tracker-arrow-rotator flex size-16 items-center justify-center">
      <img
        src={pointerIcon}
        className="size-16"
        width={55}
        height={55}
        alt=""
        draggable={false}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
}
