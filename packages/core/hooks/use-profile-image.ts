"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store";
import { generateProfileImageHash } from "@/lib/utils/profile-hash";
import type { ProfileUser } from "@/store/types";

export function useProfileImage(user: ProfileUser | undefined): string | null {
  const profileImages = useAppStore((state) => state.preferences.profileImages);

  return useMemo(() => {
    if (!user) return null;

    const hash = generateProfileImageHash(user.first_name, user.last_name, user.username);
    return profileImages[hash] || null;
  }, [user, profileImages]);
}
