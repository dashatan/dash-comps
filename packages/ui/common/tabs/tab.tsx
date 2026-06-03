"use client";

import Button from "@/components/common/buttons";
import { cn } from "@/lib";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export type Tab = {
  name?: string;
  content?: string | number | ReactNode;
};

export type TabsProps = {
  tabs?: Tab[];
  activeTab?: number;
  className?: {
    container?: string;
    tab?: string;
    slider?: string;
    scrollContainer?: string;
  };
  onChange?: (index: number) => void;
  disabled?: boolean;
  onTabClick?: (e: React.MouseEvent, index: number) => void;
  enableScroll?: boolean;
  defaultActiveTab?: number;
};

export default function Tabs(props: TabsProps) {
  const [active, setActive] = useState(props.defaultActiveTab ?? props.activeTab ?? 0);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width, ref: resizeRef } = useResizeDetector();
  const enableScroll = props.enableScroll ?? false;

  useEffect(() => {
    props.onChange && props.onChange(active);
  }, [active]);

  useEffect(() => {
    if (props.activeTab !== undefined) {
      setActive(props.activeTab);
    }
  }, [props.activeTab]);

  // Update slider position when active tab changes
  useEffect(() => {
    if (tabRefs.current[active] && containerRef.current) {
      const activeTab = tabRefs.current[active];
      const container = containerRef.current;

      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setSliderStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [active, props.tabs, width]);

  // Check scroll state
  const checkScrollState = () => {
    if (scrollContainerRef.current && enableScroll) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > -(scrollWidth - clientWidth - 1));
      setCanScrollRight(scrollLeft < 0);
    }
  };

  useEffect(() => {
    if (!enableScroll) return;
    checkScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", checkScrollState);
      return () => {
        container.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", checkScrollState);
      };
    }
  }, [props.tabs, enableScroll]);

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableScroll || !scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || !enableScroll) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableScroll || !scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current || !enableScroll) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Prevent tab clicks when dragging
  const handleTabClick = (e: React.MouseEvent, index: number) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    if (props.onTabClick) {
      props.onTabClick(e, index);
    } else {
      !props.disabled && setActive(index);
    }
  };

  const tabsContent = (
    <div
      ref={containerRef}
      className={cn(
        "bg-tab-background border-tab-border relative grid h-12",
        "w-fit overflow-hidden rounded-sm border p-1 select-none",
        enableScroll && "m-6",
        props.className?.container,
      )}
      style={{
        gridTemplateColumns: `repeat(${props.tabs?.length || 0}, 1fr)`, //grid-cols-[n] is not supported for more than 5 counts
      }}
    >
      {/* Sliding background */}
      <div
        className={cn(
          "bg-tab-active-background absolute top-1 bottom-1 rounded-xs transition-all duration-100 ease-out",
          props.className?.slider,
        )}
        style={{
          left: sliderStyle.left,
          width: sliderStyle.width,
        }}
      />
      {props.tabs?.map((tab, index) => {
        return (
          <div
            key={index}
            id={`tab-${tab.name || index}`}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={(e) => handleTabClick(e, index)}
            className={cn(
              "relative z-2 flex items-center justify-center whitespace-nowrap",
              "text-sm font-semibold",
              "cursor-pointer px-6 transition-colors duration-300",
              "rounded-xs",
              {
                "text-tab-active-foreground": active === index,
                "text-tab-inactive-foreground hover:text-tab-inactive-hover-foreground":
                  active !== index,
                "text-foreground": active !== index && props.disabled,
                "cursor-default": props.disabled,
              },
              props.className?.tab,
            )}
          >
            {tab.content || tab.name}
          </div>
        );
      })}
    </div>
  );

  if (enableScroll) {
    return (
      <div ref={resizeRef} className="relative max-h-fit min-w-0 flex-1 select-none">
        {canScrollLeft && (
          <Button
            variant="contained"
            severity="info"
            size={32}
            rounded="full"
            className="bg-muted/90 hover:bg-muted absolute top-1/2 left-1 z-5 -translate-y-1/2"
            onClick={() =>
              scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" })
            }
            icon={<ArrowLeft2 className="text-tab size-4" />}
          />
        )}
        {canScrollRight && (
          <Button
            variant="contained"
            severity="info"
            size={32}
            rounded="full"
            className="hover:bg-muted bg-muted/90 absolute top-1/2 right-1 z-5 -translate-y-1/2"
            onClick={() =>
              scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" })
            }
            icon={<ArrowRight2 className="text-tab size-4" />}
          />
        )}
        <div
          ref={scrollContainerRef}
          className={cn(
            "hide-scrollbar relative max-h-fit overflow-x-auto",
            props.className?.scrollContainer,
          )}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {tabsContent}
        </div>
      </div>
    );
  }

  return tabsContent;
}
