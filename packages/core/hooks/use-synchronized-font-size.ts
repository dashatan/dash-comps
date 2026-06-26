"use client";

import { useRef, useEffect, useState } from "react";

export function useSynchronizedFontSize<T extends HTMLElement>(
  items: Array<{ value?: number; label?: string }>,
  maxFontSize: number = 56,
  labelRatio: number = 0.4,
) {
  const containerRefs = useRef<(T | null)[]>([]);
  const valueRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [labelFontSize, setLabelFontSize] = useState(maxFontSize * labelRatio);

  const calculateOptimalFontSize = (
    containerWidth: number,
    text: string,
    valueRef: HTMLParagraphElement,
  ) => {
    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.style.position = "absolute";
    tempElement.style.fontSize = `${maxFontSize}px`;
    tempElement.style.fontWeight = "600";
    tempElement.style.fontFamily = getComputedStyle(valueRef).fontFamily;
    tempElement.style.lineHeight = "1";
    tempElement.style.whiteSpace = "nowrap";
    tempElement.textContent = text;

    document.body.appendChild(tempElement);

    // Account for padding (assuming 16px padding on each side = 32px total)
    const availableWidth = containerWidth - 32;
    const targetWidth = availableWidth * 0.95; // More aggressive - use 95% of available width

    let currentFontSize = maxFontSize;
    while (tempElement.offsetWidth > targetWidth && currentFontSize > 6) {
      currentFontSize -= 0.5; // Even smaller steps for maximum precision
      tempElement.style.fontSize = `${currentFontSize}px`;
    }

    document.body.removeChild(tempElement);
    return Math.max(6, currentFontSize); // Even lower minimum for extremely long numbers
  };

  const updateFontSizes = () => {
    if (!items.length) return;

    const fontSizes: number[] = [];
    const labelFontSizes: number[] = [];

    items.forEach((item, index) => {
      const container = containerRefs.current[index];
      const valueRef = valueRefs.current[index];

      if (container && valueRef) {
        const containerWidth = container.offsetWidth;
        const valueText = item.value?.toLocaleString() || "";
        const optimalFontSize = calculateOptimalFontSize(
          containerWidth,
          valueText,
          valueRef,
        );
        fontSizes.push(optimalFontSize);
        labelFontSizes.push(optimalFontSize * labelRatio);
      }
    });

    if (fontSizes.length > 0) {
      setFontSize(Math.min(...fontSizes));
      setLabelFontSize(Math.min(...labelFontSizes));
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateFontSizes, 100);
    return () => clearTimeout(timer);
  }, [items]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateFontSizes);
    containerRefs.current.forEach((container) => {
      if (container) resizeObserver.observe(container);
    });
    return () => resizeObserver.disconnect();
  }, [items]);

  return {
    fontSize,
    labelFontSize,
    containerRefs,
    valueRefs,
  };
}
