/**
 * Global tooltip manager for ECharts - handles positioning and showing/hiding tooltips
 */
export class EChartsTooltipManager {
  private static instance: EChartsTooltipManager;
  private activeTooltip: HTMLDivElement | null = null;
  private hideTimeout: NodeJS.Timeout | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private readonly DEFAULT_HIDE_DELAY = 300; // ms
  private lastPosition: { x: number; y: number } | null = null;
  private lastOptions: {
    offsetX?: number;
    offsetY?: number;
    position?: "right" | "left" | "top" | "bottom" | "auto";
  } | null = null;

  public static getInstance(): EChartsTooltipManager {
    if (!EChartsTooltipManager.instance) {
      EChartsTooltipManager.instance = new EChartsTooltipManager();
    }
    return EChartsTooltipManager.instance;
  }

  /**
   * Show tooltip at specified position with content
   */
  public showTooltip(
    content: string | HTMLElement,
    position: { x: number; y: number },
    options?: {
      offsetX?: number;
      offsetY?: number;
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
  ): void {
    this.clearHideTimeout();

    // Reuse existing tooltip container or create new one
    if (!this.activeTooltip || !this.activeTooltip.parentNode) {
      // Create new tooltip container
      const tooltipDiv = document.createElement("div");

      // Apply default styles
      Object.assign(tooltipDiv.style, {
        position: "fixed",
        zIndex: "10000",
        pointerEvents: "auto",
        ...options?.style,
      });

      // Apply custom className if provided
      if (options?.className) {
        tooltipDiv.className = options.className;
      }

      document.body.appendChild(tooltipDiv);
      this.activeTooltip = tooltipDiv;

      // Set up positioning listeners (only once)
      this.scrollListener = () => {
        if (this.activeTooltip && this.lastPosition) {
          this.positionTooltip(
            this.activeTooltip,
            this.lastPosition,
            this.lastOptions || undefined,
          );
        }
      };
      this.resizeListener = () => {
        if (this.activeTooltip && this.lastPosition) {
          this.positionTooltip(
            this.activeTooltip,
            this.lastPosition,
            this.lastOptions || undefined,
          );
        }
      };
      window.addEventListener("scroll", this.scrollListener, true);
      window.addEventListener("resize", this.resizeListener);

      // Add tooltip hover events to keep it interactive (only once)
      tooltipDiv.addEventListener("mouseenter", () => {
        this.clearHideTimeout();
      });

      tooltipDiv.addEventListener("mouseleave", () => {
        // Schedule hide after delay when mouse leaves tooltip
        this.scheduleHide();
      });
    }

    // Update content without recreating container
    const tooltipDiv = this.activeTooltip;
    tooltipDiv.innerHTML = ""; // Clear existing content

    if (typeof content === "string") {
      // tooltipDiv.innerHTML = content
    } else {
      tooltipDiv.appendChild(content);
    }

    // Update styles if provided
    if (options?.style) {
      Object.assign(tooltipDiv.style, options.style);
    }

    // Store position and options for scroll/resize updates
    this.lastPosition = position;
    this.lastOptions = options || null;

    // Position tooltip
    this.positionTooltip(tooltipDiv, position, options);
  }

  /**
   * Schedule tooltip to hide after delay
   */
  public scheduleHide(): void {
    this.scheduleHideWithDelay(this.DEFAULT_HIDE_DELAY);
  }

  /**
   * Schedule tooltip to hide after specified delay
   */
  public scheduleHideWithDelay(delay: number): void {
    this.clearHideTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, delay);
  }

  /**
   * Clear hide timeout
   */
  public clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Hide and remove tooltip
   */
  public hideTooltip(): void {
    if (this.activeTooltip) {
      if (this.activeTooltip.parentNode) {
        this.activeTooltip.parentNode.removeChild(this.activeTooltip);
      }
      this.activeTooltip = null;
    }

    // Clean up listeners
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = null;
    }

    this.clearHideTimeout();
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
    if (this.activeTooltip) {
      this.positionTooltip(this.activeTooltip, position, options);
    }
  }

  /**
   * Calculate available space in each direction
   */
  private calculateAvailableSpace(
    position: { x: number; y: number },
    tooltipWidth: number,
    tooltipHeight: number,
    viewport: { width: number; height: number },
    defaultOffset: number = 10,
  ): {
    right: number;
    left: number;
    top: number;
    bottom: number;
  } {
    const spaceRight =
      viewport.width - position.x - defaultOffset - tooltipWidth;
    const spaceLeft = position.x - defaultOffset - tooltipWidth;
    const spaceTop = position.y - defaultOffset - tooltipHeight;
    const spaceBottom =
      viewport.height - position.y - defaultOffset - tooltipHeight;

    return {
      right: Math.max(0, spaceRight),
      left: Math.max(0, spaceLeft),
      top: Math.max(0, spaceTop),
      bottom: Math.max(0, spaceBottom),
    };
  }

  /**
   * Auto-detect best position based on available space
   */
  private detectBestPosition(
    position: { x: number; y: number },
    tooltipWidth: number,
    tooltipHeight: number,
    viewport: { width: number; height: number },
  ): "right" | "left" | "top" | "bottom" {
    const spaces = this.calculateAvailableSpace(
      position,
      tooltipWidth,
      tooltipHeight,
      viewport,
    );

    // Calculate scores for each position (considering both horizontal and vertical space)
    const scores = {
      right: spaces.right + Math.min(spaces.top, spaces.bottom) * 0.5, // Prefer right if there's vertical space too
      left: spaces.left + Math.min(spaces.top, spaces.bottom) * 0.5,
      top: spaces.top + Math.min(spaces.left, spaces.right) * 0.5,
      bottom: spaces.bottom + Math.min(spaces.left, spaces.right) * 0.5,
    };

    // Find position with highest score
    const bestPosition = Object.entries(scores).reduce((a, b) =>
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores]
        ? a
        : b,
    )[0];

    // If no position has enough space, choose the one with most space
    if (scores[bestPosition as keyof typeof scores] < 50) {
      // If all positions are constrained, prefer right or left (usually more space horizontally)
      if (
        spaces.right > spaces.left &&
        spaces.right > spaces.top &&
        spaces.right > spaces.bottom
      ) {
        return "right";
      }
      if (spaces.left > spaces.top && spaces.left > spaces.bottom) {
        return "left";
      }
      if (spaces.bottom > spaces.top) {
        return "bottom";
      }
      return "top";
    }

    return bestPosition as "right" | "left" | "top" | "bottom";
  }

  /**
   * Position tooltip with viewport boundary handling
   */
  private positionTooltip(
    tooltipDiv: HTMLDivElement,
    position: { x: number; y: number },
    options?: {
      offsetX?: number;
      offsetY?: number;
      position?: "right" | "left" | "top" | "bottom" | "auto";
    },
  ): void {
    let tooltipPosition = options?.position ?? "auto";
    const tooltipRect = tooltipDiv.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const tooltipWidth = tooltipRect.width || 200;
    const tooltipHeight = tooltipRect.height || 100;

    // Auto-detect best position if needed
    if (tooltipPosition === "auto") {
      tooltipPosition = this.detectBestPosition(
        position,
        tooltipWidth,
        tooltipHeight,
        viewport,
      );
    }

    let left: number;
    let top: number;
    let transform: string;
    let offsetX = options?.offsetX ?? 0;
    let offsetY = options?.offsetY ?? 0;

    // Determine position based on preference
    if (tooltipPosition === "right") {
      // Position to the right of cursor
      offsetX = offsetX || 10; // Default 10px to the right
      offsetY = offsetY || 0; // Center vertically
      left = position.x + offsetX;
      top = position.y + offsetY;
      transform = "translateY(-50%)"; // Center vertically, align left edge to cursor
    } else if (tooltipPosition === "left") {
      // Position to the left of cursor
      offsetX = offsetX || -10; // Default 10px to the left
      offsetY = offsetY || 0;
      left = position.x + offsetX;
      top = position.y + offsetY;
      transform = "translate(-100%, -50%)"; // Center vertically, align right edge to cursor
    } else if (tooltipPosition === "bottom") {
      // Position below cursor
      offsetX = offsetX || 0;
      offsetY = offsetY || 10; // Default 10px below
      left = position.x + offsetX;
      top = position.y + offsetY;
      transform = "translateX(-50%)"; // Center horizontally, align top edge to cursor
    } else {
      // Default: position above cursor (top/auto)
      offsetX = offsetX || 0;
      offsetY = offsetY || -8; // Default 8px above
      left = position.x + offsetX;
      top = position.y + offsetY;
      transform = "translate(-50%, -100%)"; // Center horizontally, align bottom edge to cursor
    }

    // Check if tooltip would go outside viewport horizontally
    if (tooltipPosition === "right") {
      const tooltipRight = left + tooltipWidth;
      if (tooltipRight > viewport.width - 8) {
        // Not enough space on right, flip to left
        left = position.x - tooltipWidth - (offsetX || 10);
        transform = "translate(-100%, -50%)";
      }
      if (left < 8) {
        left = 8;
      }
    } else if (tooltipPosition === "left") {
      const tooltipLeft = left - tooltipWidth;
      if (tooltipLeft < 8) {
        // Not enough space on left, flip to right
        left = position.x + (Math.abs(offsetX) || 10);
        transform = "translateY(-50%)";
      }
      if (left + tooltipWidth > viewport.width - 8) {
        left = viewport.width - 8 - tooltipWidth;
      }
    } else {
      // For top/bottom positioning, check horizontal boundaries
      const tooltipLeft = left - tooltipWidth / 2;
      const tooltipRight = left + tooltipWidth / 2;

      if (tooltipLeft < 8) {
        left = 8 + tooltipWidth / 2;
      } else if (tooltipRight > viewport.width - 8) {
        left = viewport.width - 8 - tooltipWidth / 2;
      }
    }

    // Check if tooltip would go outside viewport vertically
    if (tooltipPosition === "top") {
      const tooltipTop = top - tooltipHeight;
      if (tooltipTop < 8) {
        // Not enough space above, flip to below
        top = position.y + Math.abs(offsetY || 8);
        transform = transform.replace("-100%", "0%");
      }
    } else if (tooltipPosition === "bottom") {
      const tooltipBottom = top + tooltipHeight;
      if (tooltipBottom > viewport.height - 8) {
        // Not enough space below, flip to above
        top = position.y - tooltipHeight - (offsetY || 10);
        transform = "translate(-50%, -100%)";
      }
    } else {
      // For left/right positioning, check vertical boundaries
      const tooltipTop = top - tooltipHeight / 2;
      const tooltipBottom = top + tooltipHeight / 2;

      if (tooltipTop < 8) {
        top = 8 + tooltipHeight / 2;
      } else if (tooltipBottom > viewport.height - 8) {
        top = viewport.height - 8 - tooltipHeight / 2;
      }
    }

    // Apply positioning
    tooltipDiv.style.left = `${left}px`;
    tooltipDiv.style.top = `${top}px`;
    tooltipDiv.style.transform = transform;
  }

  /**
   * Get active tooltip element
   */
  public getActiveTooltip(): HTMLDivElement | null {
    return this.activeTooltip;
  }
}
