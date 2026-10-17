"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/app/lib/supabase/client"

type Workspace = {
  id: string
  name: string
  type: "personal" | "organization"
  organization_type: string | null
  owner_id: string
}

type WorkspaceMember = {
  workspace_id: string
  role: "owner" | "admin" | "manager" | "staff"
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadWorkspaces = async () => {
      const supabase = createClient()

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage("You are not signed in.")
        setLoading(false)
        return
      }

      const { data: memberships, error: membershipsError } = await supabase
        .from("workspace_members")
        .select("workspace_id, role")
        .eq("user_id", user.id)

      if (membershipsError) {
        setMessage(membershipsError.message)
        setLoading(false)
        return
      }

      if (!memberships || memberships.length === 0) {
        setMessage("No workspace found.")
        setLoading(false)
        return
      }

      const workspaceIds = memberships.map(
        (membership: WorkspaceMember) => membership.workspace_id
      )

      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, type, organization_type, owner_id")
        .in("id", workspaceIds)
        .order("created_at", { ascending: false })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      if (!data || data.length === 0) {
        setMessage("No workspace found.")
        setLoading(false)
        return
      }

      setWorkspaces(data)
      setCurrentWorkspace(data[0])
      setLoading(false)
    }

    loadWorkspaces()
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading workspace...</p>
      </main>
    )
  }

  if (message) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <p className="text-sm text-muted">{message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-secondary p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium text-primary-dark">
            Current workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-text">
            {currentWorkspace?.name}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Workspace type: {currentWorkspace?.type}
          </p>

          {currentWorkspace?.organization_type && (
            <p className="mt-1 text-sm text-muted">
              Organization type: {currentWorkspace.organization_type}
            </p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-text">
            Your workspaces
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                onClick={() => setCurrentWorkspace(workspace)}
                className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                  currentWorkspace?.id === workspace.id
                    ? "border-primary bg-primary-light"
                    : "border-border bg-foreground hover:border-primary"
                }`}
              >
                <h3 className="font-semibold text-text">
                  {workspace.name}
                </h3>

                <p className="mt-2 text-sm capitalize text-muted">
                  {workspace.type}
                </p>

                {workspace.organization_type && (
                  <p className="mt-1 text-sm capitalize text-muted">
                    {workspace.organization_type}
                  </p>
                )}

                <p className="mt-4 text-xs font-medium text-primary-dark">
                  {workspace.owner_id ===
                  workspaces.find(
                    (item) => item.id === workspace.id
                  )?.owner_id
                    ? "Workspace"
                    : "Member"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}