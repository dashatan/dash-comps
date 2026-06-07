import { isWithinIran } from "@/utils/geographic";

export { isWithinIran };

export function mapEventsToOsrmIndices(
  events: { latlng: [number, number] }[],
  osrmRoute: [number, number][],
): number[] {
  if (!osrmRoute.length || !events.length) return [];
  const osrmIndices: number[] = [];
  let lastMinIndex = 0;
  events.forEach((event) => {
    let minDist = Infinity;
    let minIndex = lastMinIndex;
    for (let i = lastMinIndex; i < osrmRoute.length; i++) {
      const d = Math.hypot(event.latlng[0] - osrmRoute[i][0], event.latlng[1] - osrmRoute[i][1]);
      if (d < minDist) {
        minDist = d;
        minIndex = i;
      }
    }
    osrmIndices.push(minIndex);
    lastMinIndex = minIndex;
  });
  return osrmIndices;
}

export function makeOsrmCoordString(events: { latlng: [number, number] }[]): string | undefined {
  const valid = events.filter(
    (e) =>
      Array.isArray(e.latlng) &&
      e.latlng.length === 2 &&
      !Number.isNaN(e.latlng[0]) &&
      !Number.isNaN(e.latlng[1]),
  );
  if (valid.length < 2) return undefined;
  return valid.map((e) => `${e.latlng[1]},${e.latlng[0]}`).join(";");
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
