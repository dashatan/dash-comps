import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type {
  avatarFallbackVariants,
  avatarStatusVariants,
  avatarVariants,
} from "@/components/common/avatar/variants";

export type AvatarUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar?: string | null;
};

export type PresetAvatarSize = NonNullable<
  VariantProps<typeof avatarVariants>["size"]
>;

export type AvatarSize = PresetAvatarSize | number | string;

export type AvatarSeverity = NonNullable<
  VariantProps<typeof avatarFallbackVariants>["severity"]
>;

export type AvatarShape = NonNullable<
  VariantProps<typeof avatarVariants>["shape"]
>;

export type AvatarBorder = NonNullable<
  VariantProps<typeof avatarVariants>["border"]
>;

export type AvatarStatus = NonNullable<
  VariantProps<typeof avatarStatusVariants>["status"]
>;

export type AvatarStatusPosition = NonNullable<
  VariantProps<typeof avatarStatusVariants>["position"]
>;

export type AvatarInitialsMode = "single" | "dual";

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  Omit<VariantProps<typeof avatarVariants>, "size"> & {
    size?: AvatarSize;
    src?: string | null;
    alt?: string;
    user?: AvatarUser;
    name?: string;
    fallback?: ReactNode;
    initials?: AvatarInitialsMode;
    severity?: AvatarSeverity;
    autoSeverity?: boolean;
    status?: AvatarStatus;
    statusPosition?: AvatarStatusPosition;
    loading?: boolean;
    icon?: LucideIcon;
    imageClassName?: string;
    fallbackClassName?: string;
    /** @deprecated Use `border="default"` instead */
    showBorder?: boolean;
    /** @deprecated Use `className` on the root instead */
    containerClassName?: string;
    /** @deprecated Use `src` instead */
    avatar?: string | null;
  };

export type AvatarGroupProps = {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  border?: AvatarBorder;
  spacing?: "overlap" | "gap";
  className?: string;
  overflowClassName?: string;
};

export type UserAvatarProps = Pick<
  AvatarProps,
  | "user"
  | "avatar"
  | "size"
  | "className"
  | "containerClassName"
  | "showBorder"
  | "src"
  | "severity"
  | "status"
  | "initials"
>;
