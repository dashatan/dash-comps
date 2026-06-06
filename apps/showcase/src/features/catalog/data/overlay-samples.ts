import { showcaseAvatarImages } from "@/features/catalog/data/avatar-samples";
import { showcaseCardImages } from "@/features/catalog/data/card-samples";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";

export const showcaseSheetSides = ["top", "bottom", "left", "right"] as const;
export type ShowcaseSheetSide = (typeof showcaseSheetSides)[number];

export const showcasePopoverAligns = ["start", "center", "end"] as const;
export type ShowcasePopoverAlign = (typeof showcasePopoverAligns)[number];

export const showcaseOverlayImages = {
  workspace: showcaseCardImages.workspace,
  analytics: showcaseCardImages.analytics,
  team: showcaseCardImages.team,
  business: showcaseCardImages.business,
  heroTravel: showcaseCarouselImages.hero.travel,
  productWatch: showcaseCarouselImages.product.watch,
  productHeadphones: showcaseCarouselImages.product.headphones,
  productCamera: showcaseCarouselImages.product.camera,
} as const;

export const showcaseOverlayMember = {
  src: showcaseAvatarImages.sara,
  user: { first_name: "Sara", last_name: "Ahmadi", username: "sara" },
  email: "sara.ahmadi@example.com",
  projects: 12,
  tasks: 48,
} as const;

export type ShowcaseNotificationKey = "deploy" | "comment" | "invite";

export const showcaseOverlayNotifications: ReadonlyArray<{
  key: ShowcaseNotificationKey;
  avatar: string;
  user: { first_name: string; last_name: string; username: string };
  time: string;
  unread?: boolean;
}> = [
  {
    key: "deploy",
    avatar: showcaseAvatarImages.mina,
    user: { first_name: "Mina", last_name: "Rahmani", username: "mina" },
    time: "2m",
    unread: true,
  },
  {
    key: "comment",
    avatar: showcaseAvatarImages.ali,
    user: { first_name: "Ali", last_name: "Hosseini", username: "ali" },
    time: "18m",
  },
  {
    key: "invite",
    avatar: showcaseAvatarImages.reza,
    user: { first_name: "Reza", last_name: "Karimi", username: "reza" },
    time: "1h",
  },
] as const;

export type ShowcaseCartItemKey = "watch" | "headphones";

export const showcaseOverlayCartItems: ReadonlyArray<{
  key: ShowcaseCartItemKey;
  image: string;
  price: number;
  quantity: number;
}> = [
  {
    key: "watch",
    image: showcaseCarouselImages.product.watch,
    price: 249,
    quantity: 1,
  },
  {
    key: "headphones",
    image: showcaseCarouselImages.product.headphones,
    price: 129,
    quantity: 2,
  },
] as const;

export const showcaseOverlayFilterOptions = [
  "electronics",
  "furniture",
  "travel",
  "workspace",
] as const;

export type ShowcaseOverlayFilterOption =
  (typeof showcaseOverlayFilterOptions)[number];

export const showcaseOverlayStats = [
  { key: "revenue", value: "$48.2k" },
  { key: "sessions", value: "12.4k" },
  { key: "conversion", value: "3.8%" },
] as const;

export type ShowcaseOverlayStatKey =
  (typeof showcaseOverlayStats)[number]["key"];
