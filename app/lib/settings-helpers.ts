export type SettingsRole = "owner" | "admin" | "manager" | "staff"

export function getDisplayName(
  user: {
    email?: string
    user_metadata?: Record<string, unknown>
  } | null,
) {
  if (!user) {
    return "User"
  }

  const metadata = user.user_metadata ?? {}

  if (typeof metadata.full_name === "string" && metadata.full_name.trim()) {
    return metadata.full_name.trim()
  }

  if (typeof metadata.name === "string" && metadata.name.trim()) {
    return metadata.name.trim()
  }

  return user.email?.split("@")[0] ?? "User"
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "User"
}

export function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return "U"
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()

  if (hour < 12) {
    return "Good morning"
  }

  if (hour < 18) {
    return "Good afternoon"
  }

  return "Good evening"
}

export function getRelativeTime(value?: string | null) {
  if (!value) {
    return "Not available"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Not available"
  }

  const difference = Date.now() - date.getTime()
  const seconds = Math.floor(difference / 1000)

  if (seconds < 60) {
    return "Just now"
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)

  if (days < 7) {
    return `${days}d ago`
  }

  return date.toLocaleDateString()
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not available"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Not available"
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function getRoleLabel(role: SettingsRole) {
  switch (role) {
    case "owner":
      return "Owner"
    case "admin":
      return "Admin"
    case "manager":
      return "Manager"
    case "staff":
      return "Staff"
    default:
      return "Staff"
  }
}

export function getRoleDescription(role: SettingsRole) {
  switch (role) {
    case "owner":
      return "Full control over the workspace and its operational configuration."
    case "admin":
      return "Administrative access to manage workspace operations and settings."
    case "manager":
      return "Operational management access for day-to-day transportation workflows."
    case "staff":
      return "Standard operational access for assigned workspace activities."
    default:
      return "Standard operational access."
  }
}

export function getProfileImage(
  user: {
    user_metadata?: Record<string, unknown>
  } | null,
) {
  if (!user) {
    return null
  }

  const metadata = user.user_metadata ?? {}

  if (typeof metadata.avatar_url === "string") {
    return metadata.avatar_url
  }

  if (typeof metadata.picture === "string") {
    return metadata.picture
  }

  return null
}

export function getRoleLevel(role: SettingsRole) {
  switch (role) {
    case "owner":
      return 4
    case "admin":
      return 3
    case "manager":
      return 2
    case "staff":
      return 1
    default:
      return 1
  }
}

export function getWorkspaceAccessLabel(role: SettingsRole) {
  switch (role) {
    case "owner":
      return "Full workspace access"
    case "admin":
      return "Administrative workspace access"
    case "manager":
      return "Operational management access"
    case "staff":
      return "Standard workspace access"
    default:
      return "Standard workspace access"
  }
}

export function getRoleTone(
  role: SettingsRole,
): "success" | "info" | "warning" | "neutral" {
  switch (role) {
    case "owner":
      return "success"
    case "admin":
      return "info"
    case "manager":
      return "warning"
    case "staff":
      return "neutral"
    default:
      return "neutral"
  }
}

export function getCompletionPercentage(values: boolean[]) {
  if (values.length === 0) {
    return 0
  }

  const completed = values.filter(Boolean).length

  return Math.round((completed / values.length) * 100)
}

export function getRoleCapabilities(role: SettingsRole) {
  switch (role) {
    case "owner":
      return [
        "Manage workspace settings",
        "Manage operational configuration",
        "Access routes and vehicles",
        "Access reports and workspace data",
      ]
    case "admin":
      return [
        "Manage workspace configuration",
        "Access routes and vehicles",
        "Access reports and operational data",
      ]
    case "manager":
      return [
        "Manage operational workflows",
        "Access routes and vehicles",
        "Access operational information",
      ]
    case "staff":
      return [
        "Access assigned operational information",
        "View routes and vehicles",
        "Use available workspace workflows",
      ]
    default:
      return []
  }
}

export function getPreferences<T extends Record<string, unknown>>(
  preferences: T | null | undefined,
) {
  return preferences ?? {}
}

export function getLastUpdatedLabel(value?: string | null) {
  if (!value) {
    return "Not available"
  }

  return formatDateTime(value)
}