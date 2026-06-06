const carouselBase = "/carousel";

export const showcaseCarouselImages = {
  hero: {
    workspace: `${carouselBase}/hero-workspace.jpg`,
    travel: `${carouselBase}/hero-travel.jpg`,
    food: `${carouselBase}/hero-food.jpg`,
    retail: `${carouselBase}/hero-retail.jpg`,
    team: `${carouselBase}/hero-team.jpg`,
  },
  card: {
    city: `${carouselBase}/card-city.jpg`,
    interior: `${carouselBase}/card-interior.jpg`,
    coast: `${carouselBase}/card-coast.jpg`,
  },
  product: {
    watch: `${carouselBase}/product-watch.jpg`,
    headphones: `${carouselBase}/product-headphones.jpg`,
    camera: `${carouselBase}/product-camera.jpg`,
    sneaker: `${carouselBase}/product-sneaker.jpg`,
    chair: `${carouselBase}/product-chair.jpg`,
    plant: `${carouselBase}/product-plant.jpg`,
  },
  banner: {
    release: `${carouselBase}/banner-release.jpg`,
    event: `${carouselBase}/banner-event.jpg`,
  },
  thumb: {
    coffee: `${carouselBase}/thumb-coffee.jpg`,
    desk: `${carouselBase}/thumb-desk.jpg`,
    fitness: `${carouselBase}/thumb-fitness.jpg`,
  },
} as const;

export const showcaseCarouselHeroImages = Object.values(
  showcaseCarouselImages.hero,
);

export const showcaseCarouselCardImages = Object.values(
  showcaseCarouselImages.card,
);

export const showcaseCarouselProductImages = Object.values(
  showcaseCarouselImages.product,
);

export const showcaseCarouselBannerImages = Object.values(
  showcaseCarouselImages.banner,
);

export const showcaseCarouselThumbImages = Object.values(
  showcaseCarouselImages.thumb,
);

export type ShowcaseCarouselProductKey = keyof typeof showcaseCarouselImages.product;

export const showcaseCarouselProductKeys = Object.keys(
  showcaseCarouselImages.product,
) as ShowcaseCarouselProductKey[];

export type ShowcaseCarouselHeroKey = keyof typeof showcaseCarouselImages.hero;

export const showcaseCarouselHeroKeys = Object.keys(
  showcaseCarouselImages.hero,
) as ShowcaseCarouselHeroKey[];

export type ShowcaseCarouselCardKey = keyof typeof showcaseCarouselImages.card;

export const showcaseCarouselCardKeys = Object.keys(
  showcaseCarouselImages.card,
) as ShowcaseCarouselCardKey[];

export type ShowcaseCarouselThumbKey = keyof typeof showcaseCarouselImages.thumb;

export const showcaseCarouselThumbKeys = Object.keys(
  showcaseCarouselImages.thumb,
) as ShowcaseCarouselThumbKey[];

export const showcaseCarouselSizes = ["sm", "md", "lg"] as const;

export const showcaseCarouselTransitions = ["slide", "fade"] as const;

export const showcaseCarouselIndicatorVariants = [
  "dots",
  "bars",
  "pills",
  "fraction",
  "progress",
] as const;

export const showcaseCarouselControlVariants = [
  "ghost",
  "outline",
  "solid",
] as const;

export const showcaseCarouselRounded = ["md", "xl", "2xl"] as const;

export const showcaseCarouselSlidesPerView = [2, 3, 4] as const;

export const showcaseCarouselSlideCount = 6;
