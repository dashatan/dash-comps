import TrackerSetting from "@/components/macro/tracker/comps/widgets/setting";
import dynamic from "next/dynamic";
import TrackerControls from "@/components/macro/tracker/comps/controls";
import TrackerPlayer from "@/components/macro/tracker/comps/player";
import { TrackerProps } from "@/components/macro/tracker/utils/types";
import EmphasizesPanel from "@/components/macro/tracker/comps/widgets/emphasizes";
import TracksPanel from "@/components/macro/tracker/comps/widgets/events";
import { useSignals } from "@preact/signals-react/runtime";
import { showSettings } from "@/components/macro/tracker";
const TrackerMap = dynamic(() => import("@/components/macro/tracker/comps/map"), {
  loading: () => <></>,
  ssr: false,
});

export default function TrackerContainer({
  emphasizesPanel,
}: {
  emphasizesPanel?: TrackerProps["emphasizesPanel"];
}) {
  useSignals();

  return (
    <div className="dir-ltr relative h-full w-full">
      <TrackerMap />
      <div className="absolute top-5 left-5 z-50 flex w-80 flex-col gap-4">
        <TracksPanel />
        {emphasizesPanel && <EmphasizesPanel {...emphasizesPanel} />}
        {showSettings.value && <TrackerSetting />}
      </div>

      <div className="absolute bottom-8 left-8 z-2 flex w-[calc(100%_-_64px)] flex-col gap-4 rounded-lg border border-gray-300 bg-white pt-4">
        <TrackerControls />
        <TrackerPlayer />
      </div>
    </div>
  );
}
