import type {
  AvatarInitialsMode,
  AvatarSeverity,
  AvatarUser,
  PresetAvatarSize,
} from "@/components/common/avatar/types";

const PRESET_AVATAR_SIZES = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const satisfies readonly PresetAvatarSize[];

const AUTO_SEVERITIES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const satisfies readonly AvatarSeverity[];

export function resolveAvatarSrc(
  src?: string | null,
  avatar?: string | null,
  user?: AvatarUser,
): string | undefined {
  const resolved = src ?? avatar ?? user?.avatar;
  return resolved || undefined;
}

export function resolveDisplayName(
  user?: AvatarUser,
  name?: string,
): string | undefined {
  if (name) return name;

  const parts = [user?.first_name, user?.last_name].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");

  return user?.username;
}

export function getInitials(
  user?: AvatarUser,
  name?: string,
  mode: AvatarInitialsMode = "single",
): string {
  const firstName = user?.first_name?.trim();
  const lastName = user?.last_name?.trim();
  const username = user?.username?.trim();
  const displayName = name?.trim();

  if (mode === "dual") {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (displayName) {
      const segments = displayName.split(/\s+/).filter(Boolean);
      if (segments.length >= 2) {
        return `${segments[0][0]}${segments[1][0]}`.toUpperCase();
      }
      if (segments[0]) return segments[0].slice(0, 2).toUpperCase();
    }

    if (username) return username.slice(0, 2).toUpperCase();
    return "U";
  }

  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();

  if (displayName) {
    const segments = displayName.split(/\s+/).filter(Boolean);
    if (segments[0]) return segments[0][0].toUpperCase();
  }

  if (username) return username[0].toUpperCase();
  return "U";
}

export function getAutoSeverity(seed: string): AvatarSeverity {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  return AUTO_SEVERITIES[Math.abs(hash) % AUTO_SEVERITIES.length];
}

export function isPresetAvatarSize(size: unknown): size is PresetAvatarSize {
  return PRESET_AVATAR_SIZES.includes(size as PresetAvatarSize);
}

export function resolveCustomAvatarSize(size: number | string) {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return {
    width: sizeValue,
    height: sizeValue,
    minWidth: sizeValue,
    minHeight: sizeValue,
  } as const;
}
