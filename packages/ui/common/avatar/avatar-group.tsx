"use client";

import { Children, cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib";
import { Avatar } from "@/components/common/avatar/avatar";
import { avatarGroupVariants } from "@/components/common/avatar/variants";
import type { AvatarGroupProps, AvatarProps } from "@/components/common/avatar/types";

function getChildKey(child: ReactElement, index: number) {
  return child.key ?? `avatar-group-item-${index}`;
}

export function AvatarGroup({
  children,
  max = 5,
  size,
  shape,
  border = "background",
  spacing = "overlap",
  className,
  overflowClassName,
}: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const visibleItems = max > 0 ? items.slice(0, max) : items;
  const overflowCount = Math.max(items.length - visibleItems.length, 0);
  const overlapClass = spacing === "overlap" ? "-ms-3 first:ms-0" : "";

  return (
    <div
      data-slot="avatar-group"
      className={cn(avatarGroupVariants({ spacing }), className)}
    >
      {visibleItems.map((child, index) =>
        cloneElement(child, {
          key: getChildKey(child, index),
          size: child.props.size ?? size,
          shape: child.props.shape ?? shape,
          border: child.props.border ?? border,
          className: cn(overlapClass, child.props.className),
        }),
      )}

      {overflowCount > 0 ? (
        <Avatar
          size={size ?? visibleItems[0]?.props.size ?? "md"}
          shape={shape ?? visibleItems[0]?.props.shape ?? "circle"}
          border={border}
          user={{ username: `+${overflowCount}` }}
          initials="dual"
          severity="muted"
          className={cn(overlapClass, overflowClassName)}
        />
      ) : null}
    </div>
  );
}
