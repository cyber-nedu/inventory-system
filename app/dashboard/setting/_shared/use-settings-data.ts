"use client"

import { createClient } from "@/app/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getActiveWorkspaceId } from "../profile/profile-utils"
import type { ProfileRole } from "../profile/profile-types"

export type SettingsWorkspace = {
  id: string
  name: string
  role: ProfileRole
}

type SettingsData = {
  status: "loading" | "ready" | "error"
  user: User | null
  workspaces: SettingsWorkspace[]
  active: SettingsWorkspace | null
  errorMessage: string | null
  reload: () => void
}

function friendlyError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "We couldn't load your workspace information. Please try again."
}

function storeActiveWorkspaceId(id: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    "kyyp-active-workspace",
    id,
  )
}

function pickActiveWorkspace(
  workspaces: SettingsWorkspace[],
  activeId: string | null,
): SettingsWorkspace | null {
  if (activeId) {
    const matchingWorkspace = workspaces.find(
      (workspace) => workspace.id === activeId,
    )

    if (matchingWorkspace) {
      return matchingWorkspace
    }
  }

  return workspaces[0] ?? null
}

export function useSettingsData(): SettingsData {
  const router = useRouter()
  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading")
  const [user, setUser] = useState<User | null>(null)
  const [workspaces, setWorkspaces] = useState<
    SettingsWorkspace[]
  >([])
  const [active, setActive] =
    useState<SettingsWorkspace | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  )
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createClient()

      const userResult = await supabase.auth.getUser()

      if (userResult.error) {
        if (!cancelled) {
          setStatus("error")
          setErrorMessage(friendlyError(userResult.error))
        }

        return
      }

      const currentUser = userResult.data.user

      if (!currentUser) {
        router.replace("/login")
        return
      }

      const membershipsResult = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", currentUser.id)

      if (membershipsResult.error) {
        if (!cancelled) {
          setStatus("error")
          setErrorMessage(
            friendlyError(membershipsResult.error),
          )
        }

        return
      }

      const memberships = membershipsResult.data ?? []

      if (memberships.length === 0) {
        router.replace("/workspace/create-workspace")
        return
      }

      const ids = memberships.map(
        (membership) => membership.organization_id,
      )

      const organizationsResult = await supabase
        .from("organizations")
        .select("id, name")
        .in("id", ids)

      if (organizationsResult.error) {
        if (!cancelled) {
          setStatus("error")
          setErrorMessage(
            friendlyError(organizationsResult.error),
          )
        }

        return
      }

      const organizations = organizationsResult.data ?? []

      const nextWorkspaces = memberships
        .map((membership) => {
          const organization = organizations.find(
            (item) => item.id === membership.organization_id,
          )

          if (!organization) {
            return null
          }

          return {
            id: organization.id,
            name: organization.name,
            role: membership.role as ProfileRole,
          }
        })
        .filter(
          (workspace): workspace is SettingsWorkspace =>
            workspace !== null,
        )

      if (nextWorkspaces.length === 0) {
        if (!cancelled) {
          setStatus("error")
          setErrorMessage(
            "We couldn't find your workspace information. Please try again.",
          )
        }

        return
      }

      const activeId = getActiveWorkspaceId()
      const nextActive = pickActiveWorkspace(
        nextWorkspaces,
        activeId,
      )

      if (!activeId && nextActive) {
        storeActiveWorkspaceId(nextActive.id)
      }

      if (!cancelled) {
        setUser(currentUser)
        setWorkspaces(nextWorkspaces)
        setActive(nextActive)
        setStatus("ready")
        setErrorMessage(null)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [reloadKey, router])

  const reload = useCallback(() => {
    setStatus("loading")
    setErrorMessage(null)
    setReloadKey((value) => value + 1)
  }, [])

  return {
    status,
    user,
    workspaces,
    active,
    errorMessage,
    reload,
  }
}