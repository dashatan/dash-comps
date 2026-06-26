import React from "react";
import { createRoot, Root } from "react-dom/client";
import { EChartsTooltipManager } from "./tooltip-manager";

export type TooltipContentGenerator = (
  params: any,
) => React.ReactElement | string | null;

/**
 * ECharts Tooltip Service - generates and manages tooltip content for ECharts
 */
export class EChartsTooltipService {
  private static instance: EChartsTooltipService;
  private tooltipManager = EChartsTooltipManager.getInstance();
  private activeRoot: Root | null = null;
  private lastParams: any = null;
  private lastContent: React.ReactElement | string | null = null;
  private lastHoveredAreaName: string | null = null;
  private lastTooltipPosition: { x: number; y: number } | null = null;
  private hideTimeout: NodeJS.Timeout | null = null;
  private showTimeout: NodeJS.Timeout | null = null;
  private currentConfig: {
    showDelay: number;
    hideDelay: number;
    followMouse: boolean;
  } = {
    showDelay: 300,
    hideDelay: 300,
    followMouse: false,
  };

  public static getInstance(): EChartsTooltipService {
    if (!EChartsTooltipService.instance) {
      EChartsTooltipService.instance = new EChartsTooltipService();
    }
    return EChartsTooltipService.instance;
  }

  /**
   * Show tooltip with React component content
   */
  public showTooltip(
    content: React.ReactElement,
    position: { x: number; y: number },
    containerId?: string,
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
  ): void {
    // Clean up previous root if exists - defer to avoid unmounting during render
    if (this.activeRoot) {
      const rootToUnmount = this.activeRoot;
      this.activeRoot = null;

      // Use requestAnimationFrame to defer unmounting outside of React's render cycle
      requestAnimationFrame(() => {
        try {
          rootToUnmount.unmount();
        } catch (error) {
          // Silently handle unmount errors (e.g., if already unmounted)
          console.warn("Error unmounting tooltip root:", error);
        }
      });
    }

    // Create container for React content
    const container = document.createElement("div");
    container.id = containerId || "echarts-tooltip-container";

    // Create root and render React component
    this.activeRoot = createRoot(container);
    this.activeRoot.render(content);

    // Show tooltip with the container
    this.tooltipManager.showTooltip(container, position, options);
  }

  /**
   * Show tooltip with HTML string content
   */
  public showTooltipHTML(
    html: string,
    position: { x: number; y: number },
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
  ): void {
    this.tooltipManager.showTooltip(html, position, options);
  }

  /**
   * Hide tooltip
   */
  public hideTooltip(): void {
    // Clean up React root - defer to avoid unmounting during render
    if (this.activeRoot) {
      const rootToUnmount = this.activeRoot;
      this.activeRoot = null;

      // Use requestAnimationFrame to defer unmounting outside of React's render cycle
      requestAnimationFrame(() => {
        try {
          rootToUnmount.unmount();
        } catch (error) {
          // Silently handle unmount errors (e.g., if already unmounted)
          console.warn("Error unmounting tooltip root:", error);
        }
      });
    }

    // Reset tracking
    this.lastParams = null;
    this.lastContent = null;
    this.lastHoveredAreaName = null;
    this.lastTooltipPosition = null;
    this.clearHideTimeout();
    this.clearShowTimeout();

    this.tooltipManager.hideTooltip();
  }

  /**
   * Update tooltip position
   */
  public updatePosition(
    position: { x: number; y: number },
    options?: {
      offsetX?: number;
      offsetY?: number;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
  ): void {
    this.tooltipManager.updatePosition(position, options);
  }

  /**
   * Schedule tooltip to hide after delay
   */
  public scheduleHide(): void {
    this.tooltipManager.scheduleHideWithDelay(this.currentConfig.hideDelay);
  }

  /**
   * Get active tooltip element
   */
  public getActiveTooltipElement(): HTMLElement | null {
    return this.tooltipManager.getActiveTooltip();
  }

  /**
   * Get mouse position from ECharts event or use current mouse position
   */
  private getMousePosition(
    chartInstance: any,
    params: any,
  ): { x: number; y: number } {
    // Try to get position from event if available
    if (params?.event?.event) {
      const event = params.event.event as MouseEvent;
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }

    // Fallback: get position from zrender instance
    if (chartInstance?.getZr) {
      const zr = chartInstance.getZr();
      const handler = zr.handler;
      if (
        handler &&
        handler.lastX !== undefined &&
        handler.lastY !== undefined
      ) {
        const dom = chartInstance.getDom();
        if (dom) {
          const rect = dom.getBoundingClientRect();
          return {
            x: rect.left + handler.lastX,
            y: rect.top + handler.lastY,
          };
        }
      }
    }

    // Last resort: use center of viewport
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  /**
   * Check if params have changed significantly (requiring content re-render)
   */
  private hasParamsChanged(oldParams: any, newParams: any): boolean {
    if (!oldParams) return true;

    // Compare key properties that would affect content
    const oldData = oldParams.data;
    const newData = newParams.data;

    if (!oldData || !newData) return oldData !== newData;

    // Compare data properties that typically affect tooltip content
    return (
      oldData.name !== newData.name ||
      oldData.value !== newData.value ||
      oldParams.seriesIndex !== newParams.seriesIndex ||
      oldParams.dataIndex !== newParams.dataIndex
    );
  }

  /**
   * Create event handler for mouseover event
   */
  public createMouseOverHandler(
    contentGenerator: TooltipContentGenerator,
    chartInstance: any,
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
    isMousemoveMode: boolean = false,
    config?: {
      showDelay?: number;
      hideDelay?: number;
      followMouse?: boolean;
    },
  ): (params: any) => void {
    // Update current config
    if (config) {
      this.currentConfig = {
        showDelay: config.showDelay ?? this.currentConfig.showDelay,
        hideDelay: config.hideDelay ?? this.currentConfig.hideDelay,
        followMouse: config.followMouse ?? this.currentConfig.followMouse,
      };
    }
    return (params: any) => {
      // Cancel any pending hide timeout - we're hovering over the same area or its label
      this.clearHideTimeout();

      const areaName = params?.data?.name || params?.name;

      // If we're hovering over the same area (including its label)
      if (
        areaName &&
        areaName === this.lastHoveredAreaName &&
        this.tooltipManager.getActiveTooltip()
      ) {
        // If followMouse is enabled, update position; otherwise keep it fixed
        if (this.currentConfig.followMouse) {
          const position = this.getMousePosition(chartInstance, params);
          this.updatePosition(position, options);
        }
        // Otherwise keep tooltip at the same position, don't move it
        return;
      }

      const position = this.getMousePosition(chartInstance, params);
      const activeTooltip = this.tooltipManager.getActiveTooltip();

      // For mousemove mode: only re-render if params changed, otherwise keep position fixed
      if (
        isMousemoveMode &&
        activeTooltip &&
        !this.hasParamsChanged(this.lastParams, params)
      ) {
        // Keep tooltip at the same position, don't move it
        return;
      }

      // Generate new content
      const content = contentGenerator(params);

      if (!content) {
        this.hideTooltip();
        this.lastParams = null;
        this.lastContent = null;
        this.lastHoveredAreaName = null;
        return;
      }

      // Check if content actually changed (for React elements, compare keys/props)
      if (isMousemoveMode && activeTooltip && this.lastContent) {
        if (
          React.isValidElement(content) &&
          React.isValidElement(this.lastContent)
        ) {
          // Simple comparison - if same type and key props, don't re-render
          const contentKey =
            (content as any).key || JSON.stringify((content as any).props);
          const lastKey =
            (this.lastContent as any).key ||
            JSON.stringify((this.lastContent as any).props);
          if (
            contentKey === lastKey &&
            !this.hasParamsChanged(this.lastParams, params)
          ) {
            // Content hasn't changed
            if (this.currentConfig.followMouse) {
              this.updatePosition(position, options);
            }
            return;
          }
        } else if (
          typeof content === "string" &&
          typeof this.lastContent === "string"
        ) {
          if (
            content === this.lastContent &&
            !this.hasParamsChanged(this.lastParams, params)
          ) {
            // Content hasn't changed, keep position fixed
            return;
          }
        }
      }

      // Store current params and content
      this.lastParams = params;
      this.lastContent = content;
      this.lastHoveredAreaName = areaName;

      // Clear any existing show timeout
      this.clearShowTimeout();

      // Delay showing tooltip by configured delay
      this.showTimeout = setTimeout(() => {
        // Store the initial position for this area (tooltip will stay fixed at this position unless followMouse is true)
        if (!this.currentConfig.followMouse) {
          this.lastTooltipPosition = position;
        }

        // Render new content
        if (React.isValidElement(content)) {
          this.showTooltip(content, position, undefined, options);
        } else if (typeof content === "string") {
          this.showTooltipHTML(content, position, options);
        }
        this.showTimeout = null;
      }, this.currentConfig.showDelay);
    };
  }

  /**
   * Create event handler for mouseout event
   */
  public createMouseOutHandler(config?: {
    hideDelay?: number;
  }): (params: any) => void {
    const hideDelay = config?.hideDelay ?? this.currentConfig.hideDelay;
    return (params: any) => {
      // Clear any pending show timeout
      this.clearShowTimeout();

      // Reset tracking
      this.lastHoveredAreaName = null;
      this.lastTooltipPosition = null;

      // Schedule hide with configured delay
      this.tooltipManager.scheduleHideWithDelay(hideDelay);
    };
  }

  /**
   * Clear hide timeout
   */
  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Clear show timeout
   */
  private clearShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  /**
   * Create event handler for mousemove event
   */
  public createMouseMoveHandler(
    chartInstance: any,
    options?: {
      offsetX?: number;
      offsetY?: number;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
    config?: {
      followMouse?: boolean;
    },
  ): (params: any) => void {
    const followMouse = config?.followMouse ?? this.currentConfig.followMouse;
    return (params: any) => {
      const activeTooltip = this.tooltipManager.getActiveTooltip();
      if (activeTooltip) {
        if (followMouse) {
          // Update position to follow mouse
          const position = this.getMousePosition(chartInstance, params);
          this.updatePosition(position, options);
        } else if (this.lastTooltipPosition) {
          // Keep tooltip at the fixed position, don't move it with mouse
          this.updatePosition(this.lastTooltipPosition, options);
        }
      }
    };
  }

  /**
   * Create event handler for click event
   */
  public createClickHandler(
    contentGenerator: TooltipContentGenerator,
    chartInstance: any,
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
    config?: {
      showDelay?: number;
      hideDelay?: number;
      followMouse?: boolean;
    },
  ): (params: any) => void {
    // Update current config
    if (config) {
      this.currentConfig = {
        showDelay: config.showDelay ?? this.currentConfig.showDelay,
        hideDelay: config.hideDelay ?? this.currentConfig.hideDelay,
        followMouse: config.followMouse ?? this.currentConfig.followMouse,
      };
    }
    return (params: any) => {
      // Cancel any pending hide timeout
      this.clearHideTimeout();

      const areaName = params?.data?.name || params?.name;
      const position = this.getMousePosition(chartInstance, params);
      const activeTooltip = this.tooltipManager.getActiveTooltip();

      // If clicking the same area and tooltip is already shown, hide it
      if (areaName && areaName === this.lastHoveredAreaName && activeTooltip) {
        this.hideTooltip();
        this.lastHoveredAreaName = null;
        this.lastTooltipPosition = null;
        return;
      }

      // Generate new content
      const content = contentGenerator(params);

      if (!content) {
        this.hideTooltip();
        this.lastParams = null;
        this.lastContent = null;
        this.lastHoveredAreaName = null;
        return;
      }

      // Store current params and content
      this.lastParams = params;
      this.lastContent = content;
      this.lastHoveredAreaName = areaName;

      // Clear any existing show timeout
      this.clearShowTimeout();

      // Show tooltip immediately or with delay
      if (this.currentConfig.showDelay > 0) {
        this.showTimeout = setTimeout(() => {
          if (!this.currentConfig.followMouse) {
            this.lastTooltipPosition = position;
          }
          if (React.isValidElement(content)) {
            this.showTooltip(content, position, undefined, options);
          } else if (typeof content === "string") {
            this.showTooltipHTML(content, position, options);
          }
          this.showTimeout = null;
        }, this.currentConfig.showDelay);
      } else {
        if (!this.currentConfig.followMouse) {
          this.lastTooltipPosition = position;
        }
        if (React.isValidElement(content)) {
          this.showTooltip(content, position, undefined, options);
        } else if (typeof content === "string") {
          this.showTooltipHTML(content, position, options);
        }
      }
    };
  }

  /**
   * Create event handler for right click event
   */
  public createRightClickHandler(
    contentGenerator: TooltipContentGenerator,
    chartInstance: any,
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
    config?: {
      showDelay?: number;
      hideDelay?: number;
      followMouse?: boolean;
    },
  ): (params: any) => void {
    // Update current config
    if (config) {
      this.currentConfig = {
        showDelay: config.showDelay ?? this.currentConfig.showDelay,
        hideDelay: config.hideDelay ?? this.currentConfig.hideDelay,
        followMouse: config.followMouse ?? this.currentConfig.followMouse,
      };
    }
    return (params: any) => {
      // Prevent default context menu
      if (params?.event?.event) {
        params.event.event.preventDefault();
      }

      // Cancel any pending hide timeout
      this.clearHideTimeout();

      const areaName = params?.data?.name || params?.name;
      const position = this.getMousePosition(chartInstance, params);
      const activeTooltip = this.tooltipManager.getActiveTooltip();

      // If right-clicking the same area and tooltip is already shown, hide it
      if (areaName && areaName === this.lastHoveredAreaName && activeTooltip) {
        this.hideTooltip();
        this.lastHoveredAreaName = null;
        this.lastTooltipPosition = null;
        return;
      }

      // Generate new content
      const content = contentGenerator(params);

      if (!content) {
        this.hideTooltip();
        this.lastParams = null;
        this.lastContent = null;
        this.lastHoveredAreaName = null;
        return;
      }

      // Store current params and content
      this.lastParams = params;
      this.lastContent = content;
      this.lastHoveredAreaName = areaName;

      // Clear any existing show timeout
      this.clearShowTimeout();

      // Show tooltip immediately or with delay
      if (this.currentConfig.showDelay > 0) {
        this.showTimeout = setTimeout(() => {
          if (!this.currentConfig.followMouse) {
            this.lastTooltipPosition = position;
          }
          if (React.isValidElement(content)) {
            this.showTooltip(content, position, undefined, options);
          } else if (typeof content === "string") {
            this.showTooltipHTML(content, position, options);
          }
          this.showTimeout = null;
        }, this.currentConfig.showDelay);
      } else {
        if (!this.currentConfig.followMouse) {
          this.lastTooltipPosition = position;
        }
        if (React.isValidElement(content)) {
          this.showTooltip(content, position, undefined, options);
        } else if (typeof content === "string") {
          this.showTooltipHTML(content, position, options);
        }
      }
    };
  }
}
