export function calcAngle(startPoint: [number, number], endPoint: [number, number]): number {
  return (
    Math.atan2(endPoint[1] - startPoint[1], endPoint[0] - startPoint[0]) * (180 / Math.PI)
  );
}

export function calculateBearing(from: [number, number], to: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const lat1 = toRad(from[0]);
  const lat2 = toRad(to[0]);
  const dLon = toRad(to[1] - from[1]);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function interpolate(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
