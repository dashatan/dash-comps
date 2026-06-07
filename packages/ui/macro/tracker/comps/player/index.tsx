import PlateField from "@/features/traffic/comps/table/comps/body/plate";
import TrackerTimeLine from "@/components/macro/tracker/comps/player/timeline";
import { TrackerState } from "@/components/macro/tracker/utils/types";
import { useFormContext } from "react-hook-form";
import { useRef } from "react";
import ColorField, { colors, getColor } from "@/components/micro/badge/color";

export default function TrackerPlayer() {
  const { getValues } = useFormContext<TrackerState>();
  const tracks = getValues("tracks");

  const plateButtonRef = useRef<HTMLDivElement>(null);
  return (
    <section id="player" className="flex w-full">
      <div className="border-s border-gray-300">
        <div className="h-10 border-y border-gray-300"></div>
        <div ref={plateButtonRef} className="flex flex-col gap-2 p-2">
          {tracks?.map((track, i) => (
            <div key={i} className="flex items-center gap-2">
              <PlateField value={track.plate} />
              <ColorField color={getColor(colors[i])} />
            </div>
          ))}
        </div>
      </div>
      <TrackerTimeLine />
    </section>
  );
}
