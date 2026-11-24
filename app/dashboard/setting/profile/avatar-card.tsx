"use client"

import Image from "next/image"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getAvatarUrl } from "./profile-utils"

function getInitials(
  user: User,
): string {
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    ""

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return (
    parts[0]?.slice(0, 2).toUpperCase() ||
    "KY"
  )
}

export default function AvatarCard({
  user,
  previewUrl,
}: {
  user: User
  previewUrl?: string | null
}) {
  const [failedUrl, setFailedUrl] =
    useState<string | null>(null)

  const avatarUrl =
    previewUrl ?? getAvatarUrl(user)

  const showImage =
    Boolean(avatarUrl) &&
    failedUrl !== avatarUrl

  if (!showImage || !avatarUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-2xl font-semibold text-text">
        {getInitials(user)}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      <Image
        src={avatarUrl}
        alt=""
        fill
        sizes="112px"
        className="object-cover"
        onError={() => {
          setFailedUrl(avatarUrl)
        }}
      />
    </div>
  )
}