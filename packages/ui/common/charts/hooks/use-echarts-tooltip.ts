import { useEffect, useRef } from "react";
import type { ECharts } from "echarts";
import {
  EChartsTooltipService,
  TooltipContentGenerator,
} from "../services/tooltip";

export interface UseEChartsTooltipOptions {
  /**
   * Function to generate tooltip content from ECharts params
   */
  contentGenerator: TooltipContentGenerator;
  /**
   * Whether to enable the tooltip
   */
  enabled?: boolean;
  /**
   * Event type to listen to (default: 'mouseover')
   */
  eventType?: "mouseover" | "mousemove" | "click";
  /**
   * Delay in milliseconds before showing tooltip (default: 300)
   */
  showDelay?: number;
  /**
   * Delay in milliseconds before hiding tooltip (default: 300)
   */
  hideDelay?: number;
  /**
   * Whether tooltip should follow mouse or stay fixed at initial position (default: false - fixed)
   */
  followMouse?: boolean;
  /**
   * Whether to trigger tooltip on click instead of hover (default: false - hover)
   */
  triggerOnClick?: boolean;
  /**
   * Whether to trigger tooltip on right click (default: false)
   */
  triggerOnRightClick?: boolean;
  /**
   * Custom tooltip options
   */
  tooltipOptions?: {
    offsetX?: number;
    offsetY?: number;
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
    position?: "right" | "left" | "top" | "bottom" | "auto";
  };
}

/**
 * Hook to attach custom tooltips to ECharts instance
 */
export function useEChartsTooltip(
  chartInstance: ECharts | null,
  options: UseEChartsTooltipOptions,
): void {
  const {
    contentGenerator,
    enabled = true,
    eventType = "mouseover",
    showDelay = 0,
    hideDelay = 300,
    followMouse = false,
    triggerOnClick = false,
    triggerOnRightClick = false,
    tooltipOptions,
  } = options;
  const tooltipService = EChartsTooltipService.getInstance();
  const handlersRef = useRef<{
    mouseover?: (params: any) => void;
    mouseout?: (params: any) => void;
    mousemove?: (params: any) => void;
    click?: (params: any) => void;
    contextmenu?: (params: any) => void;
  }>({});

  useEffect(() => {
    if (!chartInstance || !enabled) {
      return;
    }

    // Determine the actual trigger event
    const actualEventType =
      triggerOnClick || triggerOnRightClick ? "click" : eventType;
    const isClickMode = triggerOnClick || triggerOnRightClick;

    // Create event handlers with configuration
    const isMousemoveMode = actualEventType === "mousemove";
    const mouseOverHandler = tooltipService.createMouseOverHandler(
      contentGenerator,
      chartInstance,
      tooltipOptions,
      isMousemoveMode,
      {
        showDelay,
        hideDelay,
        followMouse,
      },
    );
    const mouseOutHandler = tooltipService.createMouseOutHandler({ hideDelay });
    const mouseMoveHandler = tooltipService.createMouseMoveHandler(
      chartInstance,
      tooltipOptions,
      { followMouse },
    );
    const clickHandler = triggerOnClick
      ? tooltipService.createClickHandler(
          contentGenerator,
          chartInstance,
          tooltipOptions,
          {
            showDelay,
            hideDelay,
            followMouse,
          },
        )
      : undefined;
    const rightClickHandler = triggerOnRightClick
      ? tooltipService.createRightClickHandler(
          contentGenerator,
          chartInstance,
          tooltipOptions,
          {
            showDelay,
            hideDelay,
            followMouse,
          },
        )
      : undefined;

    // Store handlers for cleanup
    handlersRef.current = {
      mouseover: mouseOverHandler,
      mouseout: mouseOutHandler,
      mousemove: mouseMoveHandler,
      click: clickHandler,
      contextmenu: rightClickHandler,
    };

    // Attach event listeners
    if (triggerOnClick) {
      chartInstance.on("click", clickHandler!);
    }
    if (triggerOnRightClick) {
      chartInstance.on("contextmenu", rightClickHandler!);
    }
    if (!isClickMode) {
      chartInstance.on(actualEventType, mouseOverHandler);
      chartInstance.on("mouseout", mouseOutHandler);

      // When using mousemove mode, also listen to mouseover to catch label hovers
      if (actualEventType === "mousemove") {
        chartInstance.on("mousemove", mouseMoveHandler);
        chartInstance.on("mouseover", mouseOverHandler);
      }
    }

    // Also listen to globalout to hide tooltip when mouse leaves chart (only for hover modes)
    if (!isClickMode) {
      chartInstance.on("globalout", mouseOutHandler);
    }

    // For click/right-click mode, hide tooltip when clicking outside the tooltip
    let handleDocumentClick: ((e: MouseEvent) => void) | null = null;
    if (isClickMode) {
      handleDocumentClick = (e: MouseEvent) => {
        const tooltipElement = tooltipService.getActiveTooltipElement();
        // Hide tooltip if click is outside the tooltip element
        // Using capture phase so this runs before chart handlers
        if (tooltipElement && !tooltipElement.contains(e.target as Node)) {
          tooltipService.hideTooltip();
        }
      };
      document.addEventListener("click", handleDocumentClick, true);
      document.addEventListener("contextmenu", handleDocumentClick, true);
    }

    // Cleanup
    return () => {
      if (isClickMode) {
        if (handlersRef.current.click) {
          chartInstance.off("click", handlersRef.current.click);
        }
        if (handlersRef.current.contextmenu) {
          chartInstance.off("contextmenu", handlersRef.current.contextmenu);
        }
        if (handleDocumentClick) {
          document.removeEventListener("click", handleDocumentClick);
          document.removeEventListener("contextmenu", handleDocumentClick);
        }
      } else {
        if (handlersRef.current.mouseover) {
          chartInstance.off(actualEventType, handlersRef.current.mouseover);
          if (actualEventType === "mousemove") {
            chartInstance.off("mouseover", handlersRef.current.mouseover);
          }
        }
        if (handlersRef.current.mouseout) {
          chartInstance.off("mouseout", handlersRef.current.mouseout);
          chartInstance.off("globalout", handlersRef.current.mouseout);
        }
        if (handlersRef.current.mousemove && actualEventType === "mousemove") {
          chartInstance.off("mousemove", handlersRef.current.mousemove);
        }
      }

      // Hide tooltip on cleanup
      tooltipService.hideTooltip();
    };
  }, [
    chartInstance,
    enabled,
    eventType,
    triggerOnClick,
    triggerOnRightClick,
    showDelay,
    hideDelay,
    followMouse,
    contentGenerator,
    tooltipOptions,
    tooltipService,
  ]);
}
