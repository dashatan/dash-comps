"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export function useAutoFontSize(
  text: string | number,
  maxFontSize: number = 24,
  minFontSize: number = 8,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const textElement = textRef.current;
    const containerWidth = container.offsetWidth;
    const containerPadding = 16; // p-2 = 8px on each side = 16px total
    const availableWidth = containerWidth - containerPadding;

    // Create a temporary element to measure text width
    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.style.position = "absolute";
    tempElement.style.fontSize = `${maxFontSize}px`;
    tempElement.style.fontWeight = getComputedStyle(textElement).fontWeight;
    tempElement.style.fontFamily = getComputedStyle(textElement).fontFamily;
    tempElement.style.lineHeight = "1";
    tempElement.style.whiteSpace = "nowrap";
    tempElement.textContent =
      typeof text === "number" ? Intl.NumberFormat().format(text) : text;

    document.body.appendChild(tempElement);

    // Binary search for optimal font size
    let low = minFontSize;
    let high = maxFontSize;
    let optimalSize = maxFontSize;

    while (low <= high) {
      const mid = (low + high) / 2;
      tempElement.style.fontSize = `${mid}px`;
      const textWidth = tempElement.offsetWidth;

      if (textWidth <= availableWidth * 0.95) {
        optimalSize = mid;
        low = mid + 0.5;
      } else {
        high = mid - 0.5;
      }
    }

    document.body.removeChild(tempElement);
    const finalSize = Math.max(minFontSize, Math.min(maxFontSize, optimalSize));
    setFontSize(finalSize);
    setIsReady(true);
  }, [text, maxFontSize, minFontSize]);

  useEffect(() => {
    // Hide during calculation (initial or when text changes)
    setIsReady(false);
    updateFontSize();
  }, [updateFontSize]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(updateFontSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateFontSize]);

  return {
    containerRef,
    textRef,
    fontSize,
    isReady,
  };
}
