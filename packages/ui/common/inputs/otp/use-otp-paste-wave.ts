"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildOtpFromWave,
  DEFAULT_PASTE_DURATION_MS,
  getEasedPasteProgress,
  getWaveFront,
} from "@/components/common/inputs/otp/paste-wave";

type UseOtpPasteWaveOptions = {
  length: number;
  pasteDurationMs?: number;
  numericOnly: boolean;
  onChange?: (value: string) => void;
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
};

export function useOtpPasteWave({
  length,
  pasteDurationMs = DEFAULT_PASTE_DURATION_MS,
  numericOnly,
  onChange,
  setOtp,
  inputRefs,
}: UseOtpPasteWaveOptions) {
  const [pasteProgress, setPasteProgress] = useState<number | null>(null);
  const [pasteCharCount, setPasteCharCount] = useState(0);
  const [risingCell, setRisingCell] = useState<number | null>(null);

  const pasteFrameRef = useRef<number | null>(null);
  const pasteRunIdRef = useRef(0);
  const isPastingRef = useRef(false);
  const lastFilledCountRef = useRef(0);

  const isPasting = pasteProgress !== null;

  const waveFront =
    pasteProgress !== null ? getWaveFront(pasteProgress, pasteCharCount) : 0;

  useEffect(() => {
    return () => {
      if (pasteFrameRef.current !== null) {
        cancelAnimationFrame(pasteFrameRef.current);
      }
    };
  }, []);

  const cancelPasteAnimation = useCallback(() => {
    pasteRunIdRef.current += 1;
    if (pasteFrameRef.current !== null) {
      cancelAnimationFrame(pasteFrameRef.current);
      pasteFrameRef.current = null;
    }
    isPastingRef.current = false;
    lastFilledCountRef.current = 0;
    setPasteProgress(null);
    setPasteCharCount(0);
    setRisingCell(null);
  }, []);

  const resetPasteVisuals = useCallback(() => {
    cancelPasteAnimation();
  }, [cancelPasteAnimation]);

  const applyPastedValue = useCallback(
    (pastedData: string) => {
      const trimmed = pastedData.slice(0, length);
      if (numericOnly && !/^\d*$/.test(trimmed)) return;

      const chars = trimmed.split("").slice(0, length);
      if (chars.length === 0) return;

      cancelPasteAnimation();
      const runId = pasteRunIdRef.current;
      isPastingRef.current = true;
      lastFilledCountRef.current = 0;
      setPasteCharCount(chars.length);
      setPasteProgress(0);
      setOtp(Array.from({ length }, () => ""));

      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (runId !== pasteRunIdRef.current) return;

        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const linear = Math.min(elapsed / pasteDurationMs, 1);
        const progress = getEasedPasteProgress(linear);
        const front = getWaveFront(progress, chars.length);

        const nextOtp = buildOtpFromWave(chars, length, front);
        const filledCount = nextOtp.filter(Boolean).length;

        if (filledCount > lastFilledCountRef.current) {
          setRisingCell(filledCount - 1);
          lastFilledCountRef.current = filledCount;
        }

        setPasteProgress(progress);
        setOtp(nextOtp);

        if (linear < 1) {
          pasteFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const finalOtp = Array.from(
          { length },
          (_, index) => chars[index] ?? "",
        );

        setOtp(finalOtp);
        setPasteProgress(null);
        isPastingRef.current = false;
        setRisingCell(null);
        onChange?.(chars.join(""));

        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement &&
          inputRefs.current.includes(active)
        ) {
          active.blur();
        }
      };

      pasteFrameRef.current = requestAnimationFrame(animate);
    },
    [
      cancelPasteAnimation,
      inputRefs,
      length,
      numericOnly,
      onChange,
      pasteDurationMs,
      setOtp,
    ],
  );

  return {
    isPastingRef,
    isPasting,
    pasteCharCount,
    waveFront,
    risingCell,
    applyPastedValue,
    cancelPasteAnimation,
    resetPasteVisuals,
  };
}
