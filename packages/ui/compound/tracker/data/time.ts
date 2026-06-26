import { createDate } from "@/lib";

export type BreakTimeUnit = "minutes" | "hours" | "days" | "weeks" | "months";

export function timeSecondClear(time: number): Date {
  const d = createDate(time);
  d.setSeconds(0, 0);
  return d;
}

export function timeHourClear(time: number): Date {
  const d = createDate(time);
  d.setMinutes(0, 0, 0);
  d.setSeconds(0, 0);
  return d;
}

export function breakTimes({
  into,
  dates,
  clearHour,
}: {
  into: BreakTimeUnit;
  dates: number[];
  clearHour?: boolean;
}): number[] {
  if (!dates.length || dates.length < 2) return [];
  const times: number[] = [];
  const start = createDate(dates[0]);
  start.setSeconds(0, 0);
  if (clearHour) start.setHours(0, 0, 0, 0);

  function increase() {
    switch (into) {
      case "minutes":
        start.setMinutes(start.getMinutes() + 1);
        break;
      case "hours":
        start.setHours(start.getHours() + 1);
        break;
      case "days":
        start.setDate(start.getDate() + 1);
        break;
      case "weeks":
        start.setDate(start.getDate() + 7);
        break;
      case "months":
        start.setMonth(start.getMonth() + 1);
        break;
    }
  }

  while (start.getTime() <= dates[1]) {
    times.push(timeSecondClear(start.getTime()).getTime());
    increase();
  }
  return times;
}

export function calculateEvenlySpacedItems(
  totalTimes: number[],
  containerWidth: number,
  itemWidth: number,
): number[] {
  if (totalTimes.length === 0 || containerWidth === 0 || itemWidth === 0) {
    return [];
  }
  const maxItems = Math.floor(containerWidth / itemWidth);
  const step = Math.max(
    1,
    Math.ceil((totalTimes.length - 2) / Math.max(maxItems - 2, 1)),
  );
  const result = [totalTimes[0]];
  for (let i = step; i < totalTimes.length - 1; i += step) {
    result.push(totalTimes[i]);
  }
  result.push(totalTimes[totalTimes.length - 1]);
  return result;
}
