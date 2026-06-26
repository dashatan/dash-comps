"use client";

import { cn } from "@dash/core";
import { ChevronRight } from "lucide-react";
import { ArrowRight, SidebarRight } from "iconsax-reactjs";
import { useDashboardDirection } from "@dash/ui/layout/dashboard/direction/use-dashboard-direction";
import {
  getBackArrowRotation,
  getChevronRotation,
  getSidebarToggleRotation,
  type DirectionalIconState,
} from "@dash/ui/layout/dashboard/direction/rotation";

const transitionClass = "transition-transform duration-300 ease-in-out";

type DirectionalChevronProps = {
  variant: "forward" | "menu" | "flyout";
  open?: boolean;
  className?: string;
  size?: number;
};

export function DirectionalChevron({
  variant,
  open,
  className,
  size = 16,
}: DirectionalChevronProps) {
  const { isRtl } = useDashboardDirection();
  const rotation = getChevronRotation(variant, isRtl, { open });

  return (
    <ChevronRight
      size={size}
      className={cn(transitionClass, className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}

type DirectionalBackArrowProps = {
  className?: string;
  size?: number;
};

export function DirectionalBackArrow({
  className,
  size = 32,
}: DirectionalBackArrowProps) {
  const { isRtl } = useDashboardDirection();
  const rotation = getBackArrowRotation(isRtl);

  return (
    <ArrowRight
      variant="Linear"
      size={size}
      className={cn(transitionClass, className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}

type SidebarToggleIconProps = {
  expanded: boolean;
  className?: string;
  size?: number;
};

export function SidebarToggleIcon({
  expanded,
  className,
  size = 24,
}: SidebarToggleIconProps) {
  const { isRtl } = useDashboardDirection();
  const rotation = getSidebarToggleRotation(isRtl, expanded);

  return (
    <SidebarRight
      size={size}
      className={cn(transitionClass, className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}

export type { DirectionalIconState };
