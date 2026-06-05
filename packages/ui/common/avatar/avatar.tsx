"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib";
import {
  avatarFallbackVariants,
  avatarStatusVariants,
  avatarVariants,
} from "@/components/common/avatar/variants";
import type { AvatarProps } from "@/components/common/avatar/types";
import {
  getAutoSeverity,
  getInitials,
  isPresetAvatarSize,
  resolveAvatarSrc,
  resolveCustomAvatarSize,
  resolveDisplayName,
} from "@/components/common/avatar/utils";

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      avatar,
      alt,
      user,
      name,
      fallback,
      initials = "single",
      severity = "muted",
      autoSeverity = false,
      status,
      statusPosition = "bottom-end",
      loading = false,
      icon: Icon,
      size = "md",
      shape,
      border,
      interactive,
      disabled,
      showBorder,
      containerClassName,
      className,
      imageClassName,
      fallbackClassName,
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const resolvedSrc = resolveAvatarSrc(src, avatar, user);
    const displayName = resolveDisplayName(user, name);
    const initialsText = getInitials(user, name, initials);
    const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
      resolvedSrc ? "loading" : "error",
    );

    useEffect(() => {
      setImageState(resolvedSrc ? "loading" : "error");
    }, [resolvedSrc]);

    const resolvedSeverity = useMemo(() => {
      if (autoSeverity) {
        return getAutoSeverity(
          displayName ?? user?.username ?? initialsText ?? "user",
        );
      }

      return severity;
    }, [autoSeverity, displayName, initialsText, severity, user?.username]);

    const presetSize = isPresetAvatarSize(size) ? size : undefined;
    const customSizeStyle = presetSize
      ? undefined
      : resolveCustomAvatarSize(size as number | string);
    const statusSize = presetSize ?? "md";

    const resolvedBorder = showBorder ? "default" : border;
    const isInteractive = interactive ?? Boolean(onClick);
    const showImage = Boolean(resolvedSrc) && imageState !== "error";
    const showFallback = !showImage;
    const isLoading = loading || (showImage && imageState === "loading");

    const rootStyle: CSSProperties = {
      ...style,
      ...customSizeStyle,
    };

    return (
      <span
        ref={ref}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-label={displayName ?? alt ?? initialsText}
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || undefined}
        data-slot="avatar"
        className={cn(
          avatarVariants({
            size: presetSize,
            shape,
            border: resolvedBorder,
            interactive: isInteractive,
            disabled,
          }),
          containerClassName,
          className,
        )}
        style={rootStyle}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          isInteractive && !disabled
            ? (event: KeyboardEvent<HTMLSpanElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onClick?.(event as unknown as MouseEvent<HTMLSpanElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        {showImage ? (
          <img
            src={resolvedSrc}
            alt={alt ?? displayName ?? "Avatar"}
            className={cn("h-full w-full object-cover", imageClassName)}
            onLoad={() => setImageState("loaded")}
            onError={() => setImageState("error")}
          />
        ) : null}

        {showFallback ? (
          fallback ?? (
            <span
              data-slot="avatar-fallback"
              className={cn(
                avatarFallbackVariants({ severity: resolvedSeverity }),
                fallbackClassName,
              )}
            >
              {Icon ? (
                <Icon className="size-[55%] shrink-0" aria-hidden />
              ) : (
                initialsText
              )}
            </span>
          )
        ) : null}

        {isLoading ? (
          <span
            aria-hidden
            className="bg-background/70 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]"
          >
            <Loader2 className="text-muted-foreground size-[45%] animate-spin" />
          </span>
        ) : null}

        {status ? (
          <span
            aria-hidden
            data-slot="avatar-status"
            className={avatarStatusVariants({
              status,
              size: statusSize,
              position: statusPosition,
            })}
          />
        ) : null}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
