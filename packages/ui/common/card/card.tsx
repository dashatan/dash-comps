"use client";

import {
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useMemo,
} from "react";
import { cn } from "@/lib";
import { CardProvider, useCardContext } from "@/components/common/card/context";
import type {
  CardActionsProps,
  CardBadgeProps,
  CardDescriptionProps,
  CardLegacyVariant,
  CardMediaProps,
  CardProps,
  CardSectionProps,
  CardTitleProps,
} from "@/components/common/card/types";
import {
  cardActionVariants,
  cardActionsVariants,
  cardBadgeVariants,
  cardDescriptionVariants,
  cardMediaVariants,
  cardSectionVariants,
  cardTitleVariants,
  cardVariants,
} from "@/components/common/card/variants";

function resolveLegacyAppearance(
  variant?: CardLegacyVariant,
): CardProps["appearance"] | undefined {
  switch (variant) {
    case "default":
      return "soft";
    case "outline":
      return "outline";
    case "ghost":
      return "ghost";
    default:
      return undefined;
  }
}

function resolveLegacySize(size: CardProps["size"] | "default" | undefined) {
  if (!size || size === "default") return "md" as const;
  return size;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      size = "md",
      severity = "default",
      appearance,
      variant,
      rounded,
      shadow,
      orientation,
      divided = false,
      interactive,
      selected = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const resolvedSize = resolveLegacySize(size);
    const resolvedAppearance =
      appearance ?? resolveLegacyAppearance(variant) ?? "soft";
    const isInteractive = interactive ?? Boolean(onClick);

    const contextValue = useMemo(
      () => ({
        size: resolvedSize ?? "md",
        divided,
        severity: severity ?? "default",
        appearance: resolvedAppearance,
      }),
      [resolvedSize, divided, severity, resolvedAppearance],
    );

    return (
      <CardProvider value={contextValue}>
        <div
          ref={ref}
          data-slot="card"
          role={isInteractive ? "button" : undefined}
          tabIndex={isInteractive ? 0 : undefined}
          aria-pressed={isInteractive ? selected : undefined}
          className={cn(
            cardVariants({
              size: resolvedSize,
              severity,
              appearance: resolvedAppearance,
              rounded,
              shadow,
              orientation,
              divided,
              interactive: isInteractive,
              selected,
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
          {children}
        </div>
      </CardProvider>
    );
  },
);

CardRoot.displayName = "Card";

function useCardSectionProps(section: "header" | "content" | "footer") {
  const { size, divided } = useCardContext();

  return cardSectionVariants({
    section,
    size,
    divided,
  });
}

const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(useCardSectionProps("header"), className)}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => {
    const { size: contextSize } = useCardContext();

    return (
      <h3
        ref={ref}
        data-slot="card-title"
        className={cn(
          cardTitleVariants({ size: size ?? contextSize }),
          className,
        )}
        {...props}
      />
    );
  },
);

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, solid, ...props }, ref) => {
    const { size: contextSize, appearance } = useCardContext();

    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn(
          cardDescriptionVariants({
            size: size ?? contextSize,
            solid: solid ?? appearance === "solid",
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

CardDescription.displayName = "CardDescription";

const CardAction = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(cardActionVariants(), className)}
      {...props}
    />
  ),
);

CardAction.displayName = "CardAction";

const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn(useCardSectionProps("content"), className)}
      {...props}
    />
  ),
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(useCardSectionProps("footer"), className)}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";

const CardBadge = forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, severity, ...props }, ref) => {
    const { severity: contextSeverity } = useCardContext();

    return (
      <span
        ref={ref}
        data-slot="card-badge"
        className={cn(
          cardBadgeVariants({ severity: severity ?? contextSeverity }),
          className,
        )}
        {...props}
      />
    );
  },
);

CardBadge.displayName = "CardBadge";

const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, src, alt, aspect, fit, position }, ref) => (
    <div
      ref={ref}
      data-slot="card-media"
      className={cn(cardMediaVariants({ aspect, fit, position }), className)}
    >
      <img src={src} alt={alt} className="size-full" loading="lazy" />
    </div>
  ),
);

CardMedia.displayName = "CardMedia";

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-actions"
      className={cn(cardActionsVariants(), className)}
      {...props}
    />
  ),
);

CardActions.displayName = "CardActions";

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Action: typeof CardAction;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Badge: typeof CardBadge;
  Media: typeof CardMedia;
  Actions: typeof CardActions;
};

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
  Badge: CardBadge,
  Media: CardMedia,
  Actions: CardActions,
}) as CardComponent;

export { Card };
export type { CardComponent };

export {
  CardRoot,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardBadge,
  CardMedia,
  CardActions,
  cardVariants,
};

export default Card;
