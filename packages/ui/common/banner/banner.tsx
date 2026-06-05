"use client";

import { forwardRef, type KeyboardEvent, type MouseEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib";
import {
  bannerActionsVariants,
  bannerBadgeVariants,
  bannerDescriptionVariants,
  bannerDismissVariants,
  bannerTitleVariants,
  bannerVariants,
} from "@/components/common/banner/variants";
import type {
  BannerActionsProps,
  BannerBadgeProps,
  BannerDescriptionProps,
  BannerProps,
  BannerTitleProps,
} from "@/components/common/banner/types";
import {
  resolveBannerBackgroundPosition,
  resolveBannerBackgroundSize,
  resolveBannerBlendMode,
  resolveBannerImageOpacity,
  resolveBannerImageSrc,
} from "@/components/common/banner/utils";

const BannerRoot = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      contentClassName,
      mediaClassName,
      children,
      src,
      image,
      imageSize = "40%",
      imagePositionX,
      imagePositionY = "50%",
      imageAlign = "start",
      imageBlend = "none",
      imageOpacity = "default",
      dismissible,
      onDismiss,
      interactive,
      onClick,
      size,
      severity,
      appearance,
      rounded,
      shadow,
      layout,
      imageMode = "none",
      contentAlign = "start",
      ...props
    },
    ref,
  ) => {
    const imageSrc = resolveBannerImageSrc(src, image);
    const resolvedImageMode = imageSrc ? (imageMode ?? "decor") : "none";
    const isInteractive = interactive ?? Boolean(onClick);
    const showMedia = resolvedImageMode !== "none" && Boolean(imageSrc);

    const mediaStyle = showMedia
      ? {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: resolveBannerBackgroundSize(
            resolvedImageMode,
            imageSize,
          ),
          backgroundPosition: resolveBannerBackgroundPosition(
            imageAlign,
            imagePositionX,
            imagePositionY,
          ),
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: resolveBannerBlendMode(imageBlend),
          opacity: resolveBannerImageOpacity(imageOpacity),
        }
      : undefined;

    return (
      <div
        ref={ref}
        data-slot="banner"
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={cn(
          "relative",
          bannerVariants({
            size,
            severity,
            appearance,
            rounded,
            shadow,
            layout,
            imageMode: resolvedImageMode,
            dismissible,
            interactive: isInteractive,
          }),
          className,
        )}
        onClick={onClick}
        onKeyDown={
          isInteractive
            ? (event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        <div
          className={cn(
            "relative z-1 flex w-full min-w-0 flex-col gap-2",
            {
              "items-start": contentAlign === "start",
              "items-center": contentAlign === "center",
              "items-end": contentAlign === "end",
            },
            contentClassName,
          )}
        >
          {children}
        </div>

        {showMedia ? (
          <div
            data-banner-decor
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-0 bg-banner",
              resolvedImageMode === "cover" && "opacity-100",
              mediaClassName,
            )}
            style={mediaStyle}
          ></div>
        ) : null}

        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss banner"
            className={bannerDismissVariants({ size })}
            onClick={(event) => {
              event.stopPropagation();
              onDismiss?.();
            }}
          >
            <X className="shrink-0 stroke-[2.25]" aria-hidden />
          </button>
        ) : null}
      </div>
    );
  },
);

BannerRoot.displayName = "Banner";

const BannerBadge = forwardRef<HTMLSpanElement, BannerBadgeProps>(
  ({ className, severity, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="banner-badge"
      className={cn(bannerBadgeVariants({ severity }), className)}
      {...props}
    />
  ),
);

BannerBadge.displayName = "BannerBadge";

const BannerTitle = forwardRef<HTMLHeadingElement, BannerTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="banner-title"
      className={cn(bannerTitleVariants({ size }), className)}
      {...props}
    />
  ),
);

BannerTitle.displayName = "BannerTitle";

const BannerDescription = forwardRef<
  HTMLParagraphElement,
  BannerDescriptionProps
>(({ className, size, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="banner-description"
    className={cn(bannerDescriptionVariants({ size }), className)}
    {...props}
  />
));

BannerDescription.displayName = "BannerDescription";

const BannerActions = forwardRef<HTMLDivElement, BannerActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="banner-actions"
      className={cn(bannerActionsVariants(), className)}
      {...props}
    />
  ),
);

BannerActions.displayName = "BannerActions";

type BannerComponent = typeof BannerRoot & {
  Badge: typeof BannerBadge;
  Title: typeof BannerTitle;
  Description: typeof BannerDescription;
  Actions: typeof BannerActions;
};

export const Banner = Object.assign(BannerRoot, {
  Badge: BannerBadge,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
}) as BannerComponent;

export {
  BannerRoot,
  BannerBadge,
  BannerTitle,
  BannerDescription,
  BannerActions,
  bannerVariants,
  bannerDismissVariants,
};

export default Banner;
