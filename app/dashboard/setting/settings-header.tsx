"use client"

import {
  ChevronDown,
  LogOut,
  Settings2,
  UserRound,
  UsersRound,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Role = "owner" | "admin" | "manager" | "staff"

type Organization = {
  id: string
  name: string
  owner_id: string
}

type SettingsHeaderProps = {
  user: User
  organization: Organization
  role: Role
  workspaceCount: number
}

function getDisplayName(user: User) {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : ""

  if (fullName) {
    return fullName
  }

  if (user.email) {
    return user.email.split("@")[0]
  }

  return "User"
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "U"
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function SettingsHeader({
  user,
  organization,
  role,
  workspaceCount,
}: SettingsHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = getDisplayName(user)
  const initials = getInitials(displayName)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleSignOut() {
    const { createClient } = await import("@/app/lib/supabase/client")
    const supabase = createClient()

    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <header className="border-b border-border bg-foreground">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                KYYP Control Center
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.035em] text-text sm:text-3xl">
              Manage your workspace
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
              Configure your workspace, access, interface preferences, and
              everyday KYYP experience.
            </p>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              className="flex h-11 items-center gap-2 border border-border bg-background px-2.5 text-text transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex size-8 items-center justify-center bg-primary text-xs font-bold text-white">
                {initials}
              </span>

              <span className="hidden max-w-[150px] truncate text-sm font-semibold sm:block">
                {displayName}
              </span>

              <ChevronDown
                className={`size-4 text-muted transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-[260px] border border-border bg-foreground shadow-[0_14px_35px_rgba(15,23,42,0.12)]"
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-semibold text-text">
                    {displayName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-muted">
                    {organization.name}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="border border-primary/20 bg-primary-light px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                      {role}
                    </span>

                    {workspaceCount > 1 ? (
                      <span className="text-[11px] text-muted">
                        {workspaceCount} workspaces
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">
                        1 workspace
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-1.5">
                  <Link
                    href="/dashboard/settings/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-10 items-center gap-3 px-3 text-sm font-medium text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <UserRound className="size-4 text-muted" />
                    Profile
                  </Link>

                  <Link
                    href="/dashboard/settings/account"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-10 items-center gap-3 px-3 text-sm font-medium text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Settings2 className="size-4 text-muted" />
                    Account
                  </Link>

                  <Link
                    href="/dashboard/settings/session"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-10 items-center gap-3 px-3 text-sm font-medium text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <UsersRound className="size-4 text-muted" />
                    {workspaceCount > 1
                      ? "Switch workspace"
                      : "Workspace session"}
                  </Link>

                  <div className="my-1.5 border-t border-border" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="flex min-h-10 w-full items-center gap-3 px-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}