const base = "/table/guide";

export const showcaseTableGuideImages = {
  overview: `${base}/overview.jpg`,
  toolbar: `${base}/toolbar.jpg`,
  sorting: `${base}/sorting.jpg`,
  filtering: `${base}/filtering.jpg`,
  columns: `${base}/columns.jpg`,
  selection: `${base}/selection.jpg`,
  expansion: `${base}/expansion.jpg`,
  sidePanel: `${base}/side-panel.jpg`,
  scroll: `${base}/scroll.jpg`,
} as const;

export type ShowcaseTableGuideSectionKey = keyof typeof showcaseTableGuideImages;
