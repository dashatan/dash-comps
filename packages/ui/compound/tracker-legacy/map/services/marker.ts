import mapLibreGl from "maplibre-gl";
import { Event } from "../../types";
import { ANIMATION_CONFIG } from "../config/constants";
import { ArrowMarkerConfig, EventClickHandler } from "../types";
import React from "react";
import { renderToString } from "react-dom/server";
import { CircleMarker } from "../components/circle-marker";
import { ArrowMarker } from "../components/arrow-marker";

// Global tooltip manager for handling multiple tooltips
class TooltipManager {
  private static instance: TooltipManager;
  private activeTooltip: HTMLDivElement | null = null;
  private hideTimeout: NodeJS.Timeout | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

  public static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }
    return TooltipManager.instance;
  }

  public showTooltip(
    element: HTMLElement,
    getHtml: () => string,
    positionFn: (el: HTMLElement, tooltip: HTMLDivElement) => void,
  ): void {
    // Clear any existing hide timeout
    this.clearHideTimeout();

    // Hide previous tooltip immediately when showing a new one
    if (this.activeTooltip && this.activeTooltip.parentNode) {
      this.hideTooltip();
    }

    // Create new tooltip
    const tooltipDiv = document.createElement("div");
    tooltipDiv.innerHTML = getHtml();

    // Style the tooltip
    Object.assign(tooltipDiv.style, {
      position: "absolute",
      zIndex: "1000",
      pointerEvents: "auto",
      background: "none",
      boxShadow: "none",
      border: "none",
      padding: "0",
      margin: "0",
      minWidth: "unset",
      maxWidth: "unset",
      width: "fit-content",
      whiteSpace: "nowrap",
    });

    document.body.appendChild(tooltipDiv);
    this.activeTooltip = tooltipDiv;

    // Position tooltip
    positionFn(element, tooltipDiv);

    // Set up positioning listeners
    this.scrollListener = () => positionFn(element, tooltipDiv);
    this.resizeListener = () => positionFn(element, tooltipDiv);
    window.addEventListener("scroll", this.scrollListener, true);
    window.addEventListener("resize", this.resizeListener);

    // Add tooltip hover events to keep it interactive
    tooltipDiv.addEventListener("mouseenter", () => {
      this.clearHideTimeout();
    });

    tooltipDiv.addEventListener("mouseleave", () => {
      this.scheduleHide();
    });
  }

  public scheduleHide(): void {
    this.clearHideTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, ANIMATION_CONFIG.TOOLTIP_HIDE_DELAY);
  }

  public clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

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

  public getActiveTooltip(): HTMLDivElement | null {
    return this.activeTooltip;
  }
}

/**
 * Marker and tooltip management service
 */
export class MarkerManager {
  private static instance: MarkerManager;
  private tooltipManager = TooltipManager.getInstance();

  public static getInstance(): MarkerManager {
    if (!MarkerManager.instance) {
      MarkerManager.instance = new MarkerManager();
    }
    return MarkerManager.instance;
  }

  /**
   * Create a circle marker element for events using React component
   */
  public createCircleMarkerElement(
    event: Event,
    isActive: boolean,
  ): HTMLDivElement {
    // Render the React component to HTML string
    const htmlString = renderToString(
      React.createElement(CircleMarker, {
        event: event,
        isActive: isActive,
      }),
    );

    const el = document.createElement("div");
    el.innerHTML = htmlString;
    el.style.cursor = "pointer";
    el.style.pointerEvents = "auto";
    return el;
  }

  /**
   * Create an arrow marker element for moving indicators using React component
   */
  public createArrowElement(config: ArrowMarkerConfig): HTMLDivElement {
    // Render the React component to HTML string
    const htmlString = renderToString(
      React.createElement(ArrowMarker, {
        config: config,
      }),
    );

    const el = document.createElement("div");
    el.innerHTML = htmlString;
    el.style.pointerEvents = "none";
    el.style.zIndex = config.zIndex.toString();

    return el;
  }

  /**
   * Create and add markers to the map
   */
  public createMarkersForEvents(
    map: mapLibreGl.Map,
    events: Event[],
    activeEventIndex: number,
    onEventClick: EventClickHandler,
    getTooltipContent: (event: Event) => string,
  ): mapLibreGl.Marker[] {
    const markers: mapLibreGl.Marker[] = [];

    events.forEach((event, index) => {
      const isActive = index === activeEventIndex;
      const markerEl = this.createCircleMarkerElement(event, isActive);

      // Attach tooltip
      this.attachTooltip(markerEl, () => getTooltipContent(event));

      // Add click handler (select event + move arrow)
      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        onEventClick(index);
      });

      // Create and add marker
      const marker = new mapLibreGl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([event.latlng[1], event.latlng[0]] as [number, number])
        .addTo(map);

      markers.push(marker);
    });

    return markers;
  }

  /**
   * Attach tooltip functionality to an element
   */
  public attachTooltip(
    el: HTMLElement,
    getHtml: () => string,
    map?: mapLibreGl.Map,
  ): void {
    const showTooltip = () => {
      this.tooltipManager.showTooltip(
        el,
        getHtml,
        this.positionTooltip.bind(this),
      );
    };

    const scheduleHideTooltip = () => {
      this.tooltipManager.scheduleHide();
    };
    const hideTooltip = () => {
      this.tooltipManager.hideTooltip();
    };

    // Attach element event listeners
    el.addEventListener("mouseenter", showTooltip);
    el.addEventListener("mouseleave", scheduleHideTooltip);
    el.addEventListener("mousemove", () => {
      // Update position if tooltip is active and belongs to this element
      const activeTooltip = this.tooltipManager.getActiveTooltip();
      if (activeTooltip) {
        this.positionTooltip(el, activeTooltip);
      }
    });
    map?.on?.("drag", hideTooltip);
  }

  /**
   * Position tooltip relative to element with viewport boundary handling
   */
  private positionTooltip(
    el: HTMLElement,
    tooltipDiv: HTMLDivElement | null,
  ): void {
    if (!tooltipDiv) return;

    const rect = el.getBoundingClientRect();
    const tooltipRect = tooltipDiv.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const margin = 16;

    // Calculate preferred position (above the element, centered)
    let left = rect.left + rect.width / 2;
    let top = rect.top - margin;
    let transform = "translate(-50%, -100%)";

    // Check if tooltip would go outside viewport horizontally
    const tooltipWidth = tooltipRect.width || 200; // fallback width
    const tooltipLeft = left - tooltipWidth / 2;
    const tooltipRight = left + tooltipWidth / 2;
    if (tooltipLeft < margin) {
      // Too far left, align to left edge
      left = margin + tooltipWidth / 2;
      transform = "translate(-50%, -100%)";
    } else if (tooltipRight > viewport.width - margin) {
      // Too far right, align to right edge
      left = viewport.width - margin - tooltipWidth / 2;
      transform = "translate(-50%, -100%)";
    }

    // Check if tooltip would go outside viewport vertically
    const tooltipHeight = tooltipRect.height || 100; // fallback height
    const tooltipTop = top - tooltipHeight;

    if (tooltipTop < margin) {
      // Not enough space above, show below
      top = rect.bottom + margin;
      transform = transform.replace("-100%", "0%");
    }

    // Apply positioning
    tooltipDiv.style.left = `${left}px`;
    tooltipDiv.style.top = `${top}px`;
    tooltipDiv.style.transform = transform;
  }

  /**
   * Remove all markers from the map
   */
  public removeMarkers(markers: mapLibreGl.Marker[]): void {
    markers.forEach((marker) => marker.remove());
    markers.length = 0; // Clear array
  }

  /**
   * Update arrow marker rotation
   */
  public updateArrowRotation(
    arrowElement: HTMLDivElement,
    angle: number,
  ): void {
    const img = arrowElement.querySelector(
      ".tracker-arrow-rotator img",
    ) as HTMLImageElement | null;
    if (!img) return;

    const rotation = angle + ANIMATION_CONFIG.ARROW_BEARING_OFFSET;
    img.style.transform = `rotate(${rotation}deg)`;
  }
}
