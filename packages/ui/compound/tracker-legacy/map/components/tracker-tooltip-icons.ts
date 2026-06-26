const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const TRACKER_TOOLTIP_ICONS = {
  camera: `<svg ${svgAttrs}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  mapPin: `<svg ${svgAttrs}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  speed: `<svg ${svgAttrs}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  calendar: `<svg ${svgAttrs}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  road: `<svg ${svgAttrs}><path d="M16.75 12h3.632a1 1 0 0 0 .74-1.673l-2.895-4.18A2 2 0 0 0 16.158 6H7.842a2 2 0 0 0-1.667.847l-2.895 4.18A1 1 0 0 0 4.018 12H7.75"/><circle cx="12" cy="13" r="2"/><path d="M12 15v6"/></svg>`,
  violation: `<svg ${svgAttrs}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  alert: `<svg ${svgAttrs}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
} as const;

export type TrackerTooltipIcon = keyof typeof TRACKER_TOOLTIP_ICONS;
