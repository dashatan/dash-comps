import type { CSSProperties } from "react";

export const DEFAULT_PASTE_DURATION_MS = 400;
export const WAVE_HALF_WIDTH = 0.7;
const DIGIT_LEAD = 0.12;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function getCellWaveIntensity(
  cellIndex: number,
  waveFront: number,
  halfWidth = WAVE_HALF_WIDTH,
): number {
  const delta = Math.abs(waveFront - cellIndex);
  if (delta >= halfWidth) return 0;
  const t = 1 - delta / halfWidth;
  return t * t * (3 - 2 * t);
}

export function getWaveFront(progress: number, charCount: number) {
  return progress * (charCount + WAVE_HALF_WIDTH);
}

export function buildOtpFromWave(
  chars: string[],
  length: number,
  waveFront: number,
): string[] {
  return Array.from({ length }, (_, index) => {
    if (index >= chars.length) return "";
    return waveFront >= index + DIGIT_LEAD ? (chars[index] ?? "") : "";
  });
}

export function getEasedPasteProgress(linearProgress: number) {
  return easeInOutCubic(linearProgress);
}

export function getCellWaveStyle(wave: number): CSSProperties | undefined {
  if (wave <= 0) return undefined;
  return {
    boxShadow: `inset 0 0 ${10 * wave}px color-mix(in srgb, var(--primary) ${Math.round(22 * wave)}%, transparent)`,
  };
}
