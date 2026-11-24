"use client"

import {
  ChevronDown,
  Loader2,
  UserRound,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  getAvatarUrl,
} from "./profile/profile-utils"
import type { ProfileRole } from "./profile/profile-types"
import type { SettingsWorkspace } from "./_shared/use-settings-data"

type SettingsHeaderProps = {
  user: User
  organization: {
    id: string
    name: string
  }
  role: ProfileRole
  workspaceCount: number
  workspaces: SettingsWorkspace[]
}

function getWorkspaceInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return "K"
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function storeActiveWorkspaceId(id: string): void {
  window.localStorage.setItem(
    "kyyp-active-workspace",
    id,
  )

  window.localStorage.setItem(
    "active-workspace-id",
    id,
  )

  window.localStorage.setItem(
    "activeWorkspaceId",
    id,
  )
}

export default function SettingsHeader({
  user,
  organization,
  workspaces,
}: SettingsHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [switchingId, setSwitchingId] = useState<string | null>(
    null,
  )
  const [switchError, setSwitchError] = useState<string | null>(
    null,
  )
  const menuRef = useRef<HTMLDivElement>(null)

  const avatarUrl = getAvatarUrl(user)
  const initials = getWorkspaceInitials(organization.name)

  const otherWorkspaces = workspaces.filter(
    (workspace) => workspace.id !== organization.id,
  )

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      )
    }
  }, [])

  function switchWorkspace(id: string) {
    setSwitchError(null)
    setSwitchingId(id)

    try {
      storeActiveWorkspaceId(id)
      window.location.assign("/dashboard")
    } catch {
      setSwitchingId(null)
      setSwitchError(
        "We couldn't switch workspace. Please try again.",
      )
    }
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
        <div className="min-w-0">
          <div className="mb-1 text-xs text-muted">
            Dashboard / Setting
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1 text-sm text-muted">
            Manage your workspace and how KYYP works for you.
          </p>
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open workspace menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-border bg-foreground p-1.5 transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-muted">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${organization.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>

            <span className="hidden max-w-32 truncate text-sm font-medium text-text sm:block">
              {organization.name}
            </span>

            <ChevronDown className="mr-1 h-4 w-4 text-muted" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-border p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-muted">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${organization.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {organization.name}
                  </p>

                  <p className="truncate text-xs text-muted">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="p-2">
                <Link
                  href="/dashboard/setting/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text transition hover:bg-secondary"
                >
                  <UserRound className="h-4 w-4 text-muted" />
                  Profile
                </Link>

                {workspaces.length === 1 ? (
                  <Link
                    href="/workspace/create-workspace"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-text transition hover:bg-secondary"
                  >
                    <span>Create new workspace</span>
                  </Link>
                ) : null}

                {workspaces.length === 2 &&
                otherWorkspaces[0] ? (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={switchingId !== null}
                    onClick={() =>
                      switchWorkspace(otherWorkspaces[0].id)
                    }
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-text transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>
                      {switchingId === otherWorkspaces[0].id
                        ? "Switching..."
                        : `Switch to ${otherWorkspaces[0].name}`}
                    </span>

                    {switchingId === otherWorkspaces[0].id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted" />
                    ) : null}
                  </button>
                ) : null}

                {workspaces.length >= 3 ? (
                  <Link
                    href="/workspace"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-text transition hover:bg-secondary"
                  >
                    <span>Switch workspace</span>
                  </Link>
                ) : null}

                {switchError ? (
                  <p
                    role="alert"
                    className="px-3 py-2 text-xs text-red-600"
                  >
                    {switchError}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}