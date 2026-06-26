import { Event } from "../../types";
import { Translation } from "@/lib";
import React from "react";
import { renderToString } from "react-dom/server";
import { TooltipContent } from "../components/tooltip-content";

/**
 * Tooltip content generation service
 */
export class TooltipService {
  private static instance: TooltipService;

  public static getInstance(): TooltipService {
    if (!TooltipService.instance) {
      TooltipService.instance = new TooltipService();
    }
    return TooltipService.instance;
  }

  /**
   * Generate tooltip content using ReactDOMServer and return as HTML string
   */
  public generateTooltipContent(
    event: Event,
    events: Event[],
    t: Translation,
    locale: string,
  ): string {
    const htmlString = renderToString(
      React.createElement(TooltipContent, {
        event: event,
        events: events,
        t: t,
        locale: locale,
      }),
    );

    return htmlString;
  }

  /**
   * Create a tooltip content generator function for a specific event
   */
  public createTooltipGenerator(
    event: Event,
    events: Event[],
    t: Translation,
    locale: string,
  ): () => string {
    return () => this.generateTooltipContent(event, events, t, locale);
  }
}
