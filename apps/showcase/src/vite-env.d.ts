type Point = [number, number];

declare module "robust-point-in-polygon" {
  type PolygonPoint = readonly [number, number];

  /** 1 = inside, 0 = on boundary, -1 = outside */
  export default function inPolygon(
    polygon: readonly PolygonPoint[],
    point: PolygonPoint,
  ): -1 | 0 | 1;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.css";

declare module "*.json" {
  const value: Record<string, unknown>;
  export default value;
}
