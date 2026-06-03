import { addDays, clearTime, subtractDays } from "@/lib";
import { setObservesSearchParams } from "@dash/features/observe-details";
import Button from "@/components/common/buttons";
import { PlateValueRequestParams } from "@/components/compound/license-plate/types";
import { makePlateValue } from "@/components/compound/license-plate/utils";
import { Navigation } from "lucide-react";
import { useRouter } from "next/navigation";

export function TrackButton({
  date,
  duration,
  plate,
}: {
  date: number;
  duration: number;
  plate: Partial<PlateValueRequestParams>;
}) {
  const router = useRouter();

  function handleTrackOnRoute() {
    const from_date = subtractDays(clearTime(date), 1).getTime();
    const to_date = addDays(from_date, duration).getTime();
    setObservesSearchParams({
      plate: makePlateValue(plate),
      date: [from_date, to_date],
      type: "plate",
    });
    router.push("/tracker");
  }

  return (
    <div className="flex justify-center">
      <Button
        variant="outlined"
        severity="success"
        className="size-10 p-0"
        rounded="lg"
        onClick={handleTrackOnRoute}
      >
        <Navigation className="size-5" />
      </Button>
    </div>
  );
}
