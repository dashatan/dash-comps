import { Avatar } from "@/components/common/avatar/avatar";
import type { UserAvatarProps } from "@/components/common/avatar/types";

/**
 * Convenience wrapper around Avatar for legacy user objects.
 * Prefer Avatar directly for new code.
 */
export function UserAvatar({
  user,
  avatar,
  size = 24,
  className,
  containerClassName,
  showBorder,
  src,
  severity,
  status,
  initials,
}: UserAvatarProps) {
  return (
    <Avatar
      user={user}
      src={src}
      avatar={avatar}
      size={size}
      className={className}
      containerClassName={containerClassName}
      showBorder={showBorder}
      severity={severity}
      status={status}
      initials={initials}
    />
  );
}
