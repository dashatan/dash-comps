import Divider from "@/components/common/tabs/scroller/divider";
import ScrollTabItem from "@/components/common/tabs/scroller/item";
import NextBtn from "@/components/common/tabs/scroller/next";
import PrevBtn from "@/components/common/tabs/scroller/prev";
import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";

interface TabScrollerProps {
  items: TabT[];
  visibleCount?: number;
  onSelect?: (id: string) => void;
  renderItem?: (id: string) => React.ReactNode;
  value?: string;
  scrollTo?: "center" | "value" | "start";
}

type TabT = {
  name: string;
  value: string;
};

export default function TabScroller({
  items,
  visibleCount = 6,
  value,
  onSelect,
  scrollTo = "value",
}: TabScrollerProps) {
  const parentRef = useRef(null);
  const visibles = visibleCount > items.length ? items.length : visibleCount;
  const ref = useRef(null);

  const getInitialState = () => {
    switch (scrollTo) {
      case "value":
        const findIndex = items.findIndex((item) => item.value === value);
        if (findIndex > -1) {
          const mapFindIndexToStartIndex =
            findIndex > items.length / 2
              ? findIndex + 1 - items.length / 2
              : findIndex - items.length / 2;

          if (Math.abs(mapFindIndexToStartIndex) > visibles / 2) {
            return mapFindIndexToStartIndex > 0
              ? mapFindIndexToStartIndex - visibles / 2
              : mapFindIndexToStartIndex + visibles / 2;
          }
        }
      case "center":
        return visibles === items.length || items.length % 2 === 0 ? 0 : 0.5; // for odd length of items to fix visite half of items in end and start of window should 0.5% translate

      case "start":
        return -(items.length / 2) + visibles / 2;
    }
  };
  const [startIndex, setStartIndex] = useState(getInitialState());
  const [itemWidth, setItemWidth] = useState<number>(0);

  const canScrollLeft = startIndex > -items.length / 2 + visibles / 2;
  const canScrollRight = startIndex < items.length / 2 - visibles / 2;

  const handlePrev = () => {
    if (!canScrollLeft) return;
    setStartIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!canScrollRight) return;
    setStartIndex((prev) => prev + 1);
  };

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (itemWidth && ref?.current) {
      const firstItem = ref.current.querySelector(".inline-block");
      if (firstItem) {
        const itemRect = firstItem.getBoundingClientRect();
        const itemWidth = itemRect.width;
        const containerWidth = ref.current.offsetWidth;

        const percent = ((itemWidth + 8) / containerWidth) * 100; // 8 is margin
        setStep(percent);
      }
    }
  }, [items, itemWidth, ref]);

  useEffect(() => {
    if (parentRef.current) {
      setItemWidth(
        (parentRef.current.offsetWidth - (visibles - 1) * 8) / visibles,
      );
    }
  }, [visibleCount, parentRef]);

  return (
    <div className="flex w-full items-center overflow-hidden">
      <PrevBtn disabled={!canScrollLeft} onClick={handlePrev} />

      <Divider />

      <div
        ref={parentRef}
        className="flex flex-1 justify-center overflow-hidden"
      >
        <div
          ref={ref}
          className="relative inline-flex gap-2 transition-all duration-600 ease-out"
          style={{ transform: `translateX(${startIndex * step}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={item.value}
              id={`tab-scroller-${item.value}`}
              className={cn("inline-block")}
              style={{
                width: `${itemWidth}px`,
              }}
            >
              <ScrollTabItem
                isActive={value === item.value}
                onClick={() => onSelect(item.value)}
                label={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <NextBtn disabled={!canScrollRight} onClick={handleNext} />
    </div>
  );
}
