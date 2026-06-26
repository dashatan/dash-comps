"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib";
import { useTrackerStore } from "@/components/compound/tracker-legacy/store";
import {
  EMPTY_MAP_OVERLAY_INSETS,
  type MapOverlayInsets,
} from "@/components/compound/tracker-legacy/types";

export type { MapOverlayInsets };
export { EMPTY_MAP_OVERLAY_INSETS };
export { getMapFitPadding } from "@/components/compound/tracker-legacy/map-fit-padding";

export type OverlaySide = "start" | "end" | "top" | "bottom";

type RegisteredPanel = {
  side: OverlaySide;
  element: HTMLElement;
};

type TrackerOverlayContextValue = {
  registerPanel: (id: string, side: OverlaySide, element: HTMLElement) => void;
  unregisterPanel: (id: string) => void;
};

const TrackerOverlayContext = createContext<TrackerOverlayContextValue | null>(
  null,
);

function insetForPanel(
  side: OverlaySide,
  container: DOMRectReadOnly,
  panel: DOMRectReadOnly,
): MapOverlayInsets {
  switch (side) {
    case "start":
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: Math.max(0, panel.right - container.left),
      };
    case "end":
      return {
        top: 0,
        right: Math.max(0, container.right - panel.left),
        bottom: 0,
        left: 0,
      };
    case "top":
      return {
        top: Math.max(0, panel.bottom - container.top),
        right: 0,
        bottom: 0,
        left: 0,
      };
    case "bottom":
      return {
        top: 0,
        right: 0,
        bottom: Math.max(0, container.bottom - panel.top),
        left: 0,
      };
  }
}

function mergeInsets(panels: MapOverlayInsets[]): MapOverlayInsets {
  return panels.reduce<MapOverlayInsets>(
    (acc, inset) => ({
      top: Math.max(acc.top, inset.top),
      right: Math.max(acc.right, inset.right),
      bottom: Math.max(acc.bottom, inset.bottom),
      left: Math.max(acc.left, inset.left),
    }),
    EMPTY_MAP_OVERLAY_INSETS,
  );
}

function mergeContainerRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref && typeof ref === "object") {
    ref.current = value;
  }
}

export type TrackerShellProps = {
  className?: string;
  containerRef?: Ref<HTMLDivElement>;
  onResize?: (size: { width: number; height: number }) => void;
  children: ReactNode;
};

export function TrackerShell({
  className,
  containerRef,
  onResize,
  children,
}: TrackerShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<Map<string, RegisteredPanel>>(new Map());
  const setMapOverlayInsets = useTrackerStore(
    (state) => state.setMapOverlayInsets,
  );

  const measureInsets = useCallback(() => {
    const container = shellRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const panelInsets = Array.from(panelsRef.current.values()).map(
      ({ side, element }) =>
        insetForPanel(side, containerRect, element.getBoundingClientRect()),
    );

    setMapOverlayInsets(mergeInsets(panelInsets));
  }, [setMapOverlayInsets]);

  const registerPanel = useCallback(
    (id: string, side: OverlaySide, element: HTMLElement) => {
      panelsRef.current.set(id, { side, element });
      measureInsets();
    },
    [measureInsets],
  );

  const unregisterPanel = useCallback(
    (id: string) => {
      panelsRef.current.delete(id);
      measureInsets();
    },
    [measureInsets],
  );

  const contextValue = useMemo(
    () => ({ registerPanel, unregisterPanel }),
    [registerPanel, unregisterPanel],
  );

  useLayoutEffect(() => {
    const container = shellRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      onResize?.({
        width: container.clientWidth,
        height: container.clientHeight,
      });
      measureInsets();
    });

    observer.observe(container);
    onResize?.({
      width: container.clientWidth,
      height: container.clientHeight,
    });
    measureInsets();

    return () => observer.disconnect();
  }, [measureInsets, onResize]);

  useEffect(() => {
    return () => setMapOverlayInsets(EMPTY_MAP_OVERLAY_INSETS);
  }, [setMapOverlayInsets]);

  return (
    <TrackerOverlayContext.Provider value={contextValue}>
      <div
        ref={(node) => {
          shellRef.current = node;
          mergeContainerRef(containerRef, node);
        }}
        className={cn(
          "relative h-full min-h-0 w-full overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </TrackerOverlayContext.Provider>
  );
}

export function TrackerMapLayer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("absolute inset-0 z-0 min-h-0 min-w-0", className)}>
      {children}
    </div>
  );
}

const OVERLAY_SIDE_CLASS: Record<OverlaySide, string> = {
  start: "absolute inset-y-0 start-0",
  end: "absolute inset-y-0 end-0",
  top: "absolute inset-x-0 top-0",
  bottom: "absolute inset-x-0 bottom-0",
};

export type TrackerOverlayPanelProps = {
  side: OverlaySide;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

export function TrackerOverlayPanel({
  side,
  className,
  style,
  children,
}: TrackerOverlayPanelProps) {
  const context = useContext(TrackerOverlayContext);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = panelRef.current;
    if (!element || !context) return;

    const observer = new ResizeObserver(() => {
      context.registerPanel(panelId, side, element);
    });

    context.registerPanel(panelId, side, element);
    observer.observe(element);

    return () => {
      observer.disconnect();
      context.unregisterPanel(panelId);
    };
  }, [context, panelId, side]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "z-10 flex min-h-0 flex-col",
        OVERLAY_SIDE_CLASS[side],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
