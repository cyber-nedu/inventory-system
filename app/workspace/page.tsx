import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server"

export default async function Workspace() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)

  if (membershipError) {
    throw new Error(membershipError.message)
  }

  const membershipWorkspaceIds =
    memberships?.map((membership) => membership.workspace_id) ?? []

  const { data: ownedWorkspaces, error: ownerError } = await supabase
    .from("workspaces")
    .select("id, name, type")
    .eq("owner_id", user.id)

  if (ownerError) {
    throw new Error(ownerError.message)
  }

  const memberWorkspaces =
    membershipWorkspaceIds.length > 0
      ? (
          await supabase
            .from("workspaces")
            .select("id, name, type")
            .in("id", membershipWorkspaceIds)
        ).data ?? []
      : []

  const workspaces = [
    ...(ownedWorkspaces ?? []),
    ...memberWorkspaces,
  ].filter(
    (workspace, index, array) =>
      array.findIndex((item) => item.id === workspace.id) === index
  )

  if (workspaces.length === 0) {
    redirect("/workspace/create")
  }

  if (workspaces.length === 1) {
    const workspace = workspaces[0]

    redirect(`/workspace/${workspace.id}/${workspace.type}`)
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div>
          <p className="text-sm font-medium text-primary-dark">
            Your workspaces
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Select a workspace
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Choose the workspace you want to continue to.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${workspace.id}/${workspace.type}`}
              className="group flex items-center justify-between border border-border bg-foreground p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-text">
                  {workspace.name}
                </p>

                <p className="mt-1 text-sm capitalize text-muted">
                  {workspace.type}
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm font-medium text-primary-dark transition-transform duration-200 group-hover:translate-x-1">
                Open
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}