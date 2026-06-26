import type { ColumnProps } from "../types";

export type ResolvedFrozen = NonNullable<ColumnProps["frozen"]> & {
  stickySide: "left" | "right";
};

export function getFrozenGroupIndices(columns: ColumnProps[]) {
  const start: number[] = [];
  const end: number[] = [];

  for (let i = 0; i < columns.length; i++) {
    if (!columns[i]?.frozen) break;
    start.push(i);
  }

  for (let i = columns.length - 1; i >= 0; i--) {
    if (!columns[i]?.frozen) break;
    end.push(i);
  }

  const startSet = new Set(start);
  return {
    start,
    end: end.filter((i) => !startSet.has(i)),
  };
}

export function resolveFrozenColumns(
  cols: ColumnProps[] | undefined,
  isRtl: boolean,
  getNumericWidth: (
    col: ColumnProps,
    index: number,
    all: ColumnProps[],
  ) => number | undefined,
): ColumnProps[] | undefined {
  if (!cols?.some((c) => c.frozen)) return cols;

  const { start, end } = getFrozenGroupIndices(cols);
  const resolved = new Map<number, ResolvedFrozen>();

  const resolveGroup = (indices: number[], mode: "start" | "end") => {
    if (!indices.length) return;

    const stickySide: "left" | "right" =
      mode === "start" ? (isRtl ? "right" : "left") : isRtl ? "left" : "right";

    indices.forEach((colIndex, orderInGroup) => {
      const col = cols[colIndex];
      if (!col?.frozen) return;

      let distance = 0;

      if (mode === "start") {
        for (let k = 0; k < orderInGroup; k++) {
          const width = getNumericWidth(cols[indices[k]], indices[k], cols);
          if (width === undefined) return;
          distance += width;
        }
      } else {
        for (let k = orderInGroup + 1; k < indices.length; k++) {
          const width = getNumericWidth(cols[indices[k]], indices[k], cols);
          if (width === undefined) return;
          distance += width;
        }
      }

      resolved.set(colIndex, {
        ...col.frozen,
        distance,
        edge:
          mode === "start"
            ? orderInGroup === 0
            : orderInGroup === indices.length - 1,
        stickySide,
      });
    });
  };

  resolveGroup(start, "start");
  resolveGroup(end, "end");

  return cols.map((col, i) => {
    if (!col.frozen) return col;
    const frozen = resolved.get(i);
    if (!frozen) return col;
    return { ...col, frozen };
  });
}

export function getFrozenStickySide(
  frozen: NonNullable<ColumnProps["frozen"]>,
): "left" | "right" {
  return frozen.stickySide ?? frozen.pos;
}
