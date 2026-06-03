import { Divider } from "@/components/common/divider";
import { formatPersianDate, formatPersianTime } from "@/lib";

export default function DateField(val?: number | null) {
  if (!val) return <>-</>;
  const date = formatPersianDate(val);
  const time = formatPersianTime(val);
  return (
    <div className="flex items-center gap-2">
      <span>{time}</span>
      <Divider orientation="vertical" />
      <span>{date}</span>
    </div>
  );
}
