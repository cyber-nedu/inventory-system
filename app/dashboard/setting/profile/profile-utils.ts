import type { User } from "@supabase/supabase-js"
import type {
  ProfileRole,
} from "./profile-types"

export const AVATAR_BUCKET =
  "avatars"

export const SUPPORT_EMAIL = ""; // TODO: set my support email

export function getAvatarUrl(
  user: User,
): string | null {
  const metadata =
    user.user_metadata ?? {}

  if (
    Object.prototype.hasOwnProperty.call(
      metadata,
      "profile_photo_url",
    )
  ) {
    const profilePhotoUrl =
      typeof metadata.profile_photo_url ===
      "string"
        ? metadata.profile_photo_url
        : ""

    return profilePhotoUrl || null
  }

  const providerAvatar =
    typeof metadata.avatar_url ===
    "string"
      ? metadata.avatar_url
      : typeof metadata.picture ===
          "string"
        ? metadata.picture
        : ""

  return providerAvatar || null
}

export function getOwnedPath(
  user: User,
): string | null {
  const value =
    user.user_metadata
      ?.profile_photo_path

  if (
    typeof value !== "string" ||
    !value
  ) {
    return null
  }

  const prefix = `${user.id}/`

  if (!value.startsWith(prefix)) {
    return null
  }

  return value
}

export function canRenameWorkspace(
  role: ProfileRole,
): boolean {
  return (
    role === "owner" ||
    role === "admin"
  )
}

export function validateOrganizationName(
  value: string,
): string {
  const trimmed = value.trim()

  if (trimmed.length < 2) {
    return "Workspace name must be at least 2 characters."
  }

  if (trimmed.length > 60) {
    return "Workspace name must be 60 characters or fewer."
  }

  return ""
}

export function getActiveWorkspaceId():
  | string
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null
  }

  const keys = [
    "kyyp-active-workspace",
    "active-workspace-id",
    "activeWorkspaceId",
  ]

  for (const key of keys) {
    const value =
      window.localStorage.getItem(
        key,
      )

    if (value) {
      return value
    }
  }

  return null
}

export function emitWorkspaceUpdated(
  workspace: {
    id: string
    name: string
  },
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(
      "kyyp:workspace-updated",
      {
        detail: workspace,
      },
    ),
  )
}

export function getRoleLabel(
  role: ProfileRole,
): string {
  switch (role) {
    case "owner":
      return "Owner"
    case "admin":
      return "Administrator"
    case "manager":
      return "Manager"
    default:
      return "Staff"
  }
}