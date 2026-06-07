import { Traffic } from "@/features/traffic/types";
import useResources from "@/features/resources/utils/useResources";
import { timeSecondClear } from "@/components/micro/inputs/date/utils/dateFormatPersian";
import { createDate } from "@/lib/utils/date-time-helpers";
import { BreakTimeKeys, TrackerGeoType } from "@/components/macro/tracker/utils/types";

export function breakTimes({ into, dates, clearHour }: { into: BreakTimeKeys; dates: number[]; clearHour?: boolean }) {
  const times: number[] = [];
  let start = createDate(dates[0]);
  start.setSeconds(0);
  if (clearHour) start.setHours(0);

  function increase() {
    switch (into) {
      case "minutes":
        start.setMinutes(start.getMinutes() + 1);
        break;
      case "hours":
        start.setHours(start.getHours() + 1);
        break;
      case "days":
        start.setHours(start.getHours() + 24);
        break;
      case "weeks":
        start.setHours(start.getHours() + 24 * 7);
        break;
      case "months":
        start.setMonth(start.getMonth() + 1);
        break;
    }
  }

  while (start.getTime() <= dates[1]) {
    times.push(timeSecondClear(start).getTime());
    increase();
  }
  return times;
}

export function shortenTimes(array: (number | undefined)[], width: number) {
  const shortened = [];
  const length = array.length;
  const size = length <= width ? length : width;

  for (let i = 0; i < size; i++) {
    if (i === 0) shortened.push(array[0]);
    else if (i === size) shortened.push(array[length - 1]);
    else {
      const percent = 1 / size;
      const index = Math.floor(length * (i * percent));

      shortened.push(array[index]);
    }
  }
  return shortened;
}

export function useNormalizeData(data?: Traffic[]) {
  const { devices } = useResources();
  const res: TrackerGeoType[] | undefined = data?.flatMap((traffic) => {
    const device = devices?.find((x) => x.id === traffic.device);
    if (!device) return [];
    return {
      geometry: {
        geometries: [
          {
            coordinates: [parseFloat(device.lat), parseFloat(device.long)],
            type: "Point",
          },
          {
            coordinates: [parseFloat(device.lat), parseFloat(device.long)],
            type: "LineString",
          },
        ],
        type: "GeometryCollection",
      },
      properties: { color: "red", id: traffic.image, isInterpolated: 1, time: traffic.pass_date_time },
      type: "Feature",
    } as TrackerGeoType;
  });
  return res;
}

export function removeDuplicatesByProperty<T>(array: T[], property: keyof T): T[] {
  const uniqueSet = new Set();
  const uniqueArray: T[] = [];

  array.forEach((item) => {
    const propertyValue = item[property];
    if (!uniqueSet.has(propertyValue)) {
      uniqueSet.add(propertyValue);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}

export function removeDuplicates<T>(array: T[]): T[] {
  const uniqueSet = new Set();
  const uniqueArray: T[] = [];

  array.forEach((item) => {
    const propertyValue = item;
    if (!uniqueSet.has(propertyValue)) {
      uniqueSet.add(propertyValue);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}

export function generateGradientColor(startColor: string, endColor: string, step: number, totalSteps: number) {
  var R1 = parseInt(startColor.slice(1, 3), 16);
  var G1 = parseInt(startColor.slice(3, 5), 16);
  var B1 = parseInt(startColor.slice(5, 7), 16);
  var R2 = parseInt(endColor.slice(1, 3), 16);
  var G2 = parseInt(endColor.slice(3, 5), 16);
  var B2 = parseInt(endColor.slice(5, 7), 16);

  var newR = Math.floor(R1 + (step * (R2 - R1)) / totalSteps);
  var newG = Math.floor(G1 + (step * (G2 - G1)) / totalSteps);
  var newB = Math.floor(B1 + (step * (B2 - B1)) / totalSteps);

  return "#" + newR.toString(16) + newG.toString(16) + newB.toString(16);
}

export function calcAngle(startPoint: Point, endPoint: Point) {
  return Math.atan2(endPoint[1] - startPoint[1], endPoint[0] - startPoint[0]) * (180 / Math.PI);
}

export function calculateEvenlySpacedItems(totalTimes: number[], containerWidth: number, itemWidth: number): number[] {
  // If the totalTimes array is empty or containerWidth or itemWidth is zero, return an empty array.
  if (totalTimes.length === 0 || containerWidth === 0 || itemWidth === 0) {
    return [];
  }

  // Calculate the maximum number of items that can fit within the container width.
  const maxItems = Math.floor(containerWidth / itemWidth);

  // Calculate the step to select items evenly.
  // Use Math.max to ensure the step is at least 1.
  // Calculate the step size for selecting items from totalTimes array.
  // The step size determines how many items to skip between each selected item
  // to ensure that the total number of selected items does not exceed maxItems.

  // Math.max(1, ...) ensures that the step size is at least 1, preventing division by zero or negative steps.
  // Math.ceil(...) rounds up the result to ensure we do not end up with fewer items than needed.

  // (totalTimes.length - 2) is the number of items available for selection, excluding the first and last items.
  // (maxItems - 2) is the number of items we want to select, excluding the first and last items.

  // By dividing (totalTimes.length - 2) by (maxItems - 2), we get the step size needed to evenly distribute
  // the selected items across the totalTimes array.
  const step = Math.max(1, Math.ceil((totalTimes.length - 2) / (maxItems - 2)));

  // Initialize the result array with the first item from totalTimes.
  const result = [totalTimes[0]];

  // Select the middle items evenly using the calculated step.
  for (let i = step; i < totalTimes.length - 1; i += step) {
    result.push(totalTimes[i]);
  }

  // Add the last item from totalTimes to the result array.
  result.push(totalTimes[totalTimes.length - 1]);

  // Return the result array containing the evenly spaced items.
  return result;
}
