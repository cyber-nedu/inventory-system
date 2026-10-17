"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
ArrowRight,
Building2,
CirclePile,
ShieldCheck,
UserRound,
} from "lucide-react"
import { createClient } from "@/app/lib/supabase/client"

type WorkspaceType = "personal" | "organization" | null

export default function CreateWorkspacePage() {
const router = useRouter()

const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null)
const [workspaceName, setWorkspaceName] = useState("")
const [loading, setLoading] = useState(false)
const [message, setMessage] = useState("")

const createWorkspace = async (e: React.FormEvent) => {
e.preventDefault()


if (!workspaceType) {
  setMessage("Please choose Personal or Organization.")
  return
}

if (!workspaceName.trim()) {
  setMessage("Please enter a workspace name.")
  return
}

setLoading(true)
setMessage("")

const supabase = createClient()

const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
  setMessage("Your session has expired. Please sign in again.")
  setLoading(false)
  return
}

const { data: workspace, error: workspaceError } = await supabase
  .from("workspaces")
  .insert({
    name: workspaceName.trim(),
    type: workspaceType,
    owner_id: user.id,
  })
  .select()
  .single()

if (workspaceError || !workspace) {
  setMessage(
    workspaceError?.message || "Unable to create your workspace."
  )
  setLoading(false)
  return
}

if (workspaceType === "organization") {
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    })

  if (memberError) {
    await supabase.from("workspaces").delete().eq("id", workspace.id)
    setMessage(memberError.message)
    setLoading(false)
    return
  }
}

router.push(`/workspace/${workspace.id}`)


}

return ( <main className="relative min-h-screen overflow-hidden bg-secondary"> <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-light/70 blur-3xl auth-float" />


  <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl auth-float" />

  <div className="relative flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8">
    <div className="w-full max-w-3xl auth-scale">
      <div className="mb-8 flex flex-col items-center text-center auth-fade-up">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-dark text-foreground shadow-lg shadow-primary-dark/20">
          <CirclePile className="h-7 w-7" />
        </div>

        <span className="mt-4 text-sm font-semibold text-primary-dark">
          Welcome to Inventory
        </span>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Create your workspace
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
          Choose how you want to use Inventory and create your workspace.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-foreground p-7 shadow-xl shadow-text/5 sm:p-10 auth-fade-up">
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setWorkspaceType("personal")
              setMessage("")
            }}
            className={`group rounded-2xl border p-6 text-left transition-all duration-300 ${
              workspaceType === "personal"
                ? "border-primary bg-primary-light/40 shadow-md shadow-primary/10"
                : "border-border bg-secondary hover:-translate-y-1 hover:border-primary hover:bg-primary-light/20"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                workspaceType === "personal"
                  ? "bg-primary-dark text-foreground"
                  : "bg-foreground text-primary-dark"
              }`}
            >
              <UserRound className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text">
              Personal
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Manage your own records, projects, tasks, inventory, or
              personal work.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkspaceType("organization")
              setMessage("")
            }}
            className={`group rounded-2xl border p-6 text-left transition-all duration-300 ${
              workspaceType === "organization"
                ? "border-primary bg-primary-light/40 shadow-md shadow-primary/10"
                : "border-border bg-secondary hover:-translate-y-1 hover:border-primary hover:bg-primary-light/20"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                workspaceType === "organization"
                  ? "bg-primary-dark text-foreground"
                  : "bg-foreground text-primary-dark"
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text">
              Organization
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Work with your team, invite members, and manage shared
              workspace data.
            </p>
          </button>
        </div>

        {workspaceType && (
          <form onSubmit={createWorkspace} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="workspaceName"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Workspace name
              </label>

              <input
                type="text"
                id="workspaceName"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder={
                  workspaceType === "personal"
                    ? "e.g. Ernest's Workspace"
                    : "e.g. Daniel Farms"
                }
                disabled={loading}
                className="h-14 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-text outline-none transition-all duration-300 placeholder:text-muted focus:border-primary focus:bg-foreground focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary-dark text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark/90 hover:shadow-lg hover:shadow-primary-dark/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating workspace..." : "Create my workspace"}

              {!loading && (
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary-light px-4 py-3 text-sm leading-5 text-primary-dark">
            {message}
          </div>
        )}

        <div className="mt-7 flex items-start gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />

          <p className="text-xs leading-5 text-muted">
            Personal workspaces are private to you. Organization owners
            can invite people and manage their access later.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        You can create additional workspaces later.
      </p>
    </div>
  </div>
</main>


)
}
