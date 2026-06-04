export const CHIP_GAP = 8;
export const OVERFLOW_BADGE_RESERVE = 64;

function isSameRow(a: number, b: number) {
  return Math.abs(a - b) <= 2;
}

export function measureVisibleChipCount(
  container: HTMLElement,
  chipElements: HTMLElement[],
  chipRowsCount: number,
) {
  if (!chipElements.length) return 0;

  if (chipRowsCount === 1) {
    const containerWidth = container.clientWidth;
    let count = 0;

    for (let i = 0; i < chipElements.length; i++) {
      const chip = chipElements[i];
      const chipRight = chip.offsetLeft + chip.offsetWidth;
      const hasHidden = i < chipElements.length - 1;
      const limit = containerWidth - (hasHidden ? OVERFLOW_BADGE_RESERVE : 0);

      if (chipRight > limit) {
        return Math.max(1, count);
      }
      count++;
    }

    return count;
  }

  const rowTops: number[] = [];
  let count = 0;

  for (const el of chipElements) {
    const top = el.offsetTop;
    const rowIndex = rowTops.findIndex((rowTop) => isSameRow(rowTop, top));
    if (rowIndex === -1) rowTops.push(top);
    if (rowTops.length > chipRowsCount) break;
    count++;
  }

  return count;
}
