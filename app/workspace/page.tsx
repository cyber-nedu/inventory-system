import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, ChevronRight } from "lucide-react"
import { createClient } from "@/app/lib/supabase/server"

type Organization = {
  id: string
  name: string
  owner_id: string
}

export default async function Workspace() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)

  if (membershipError) {
    throw new Error(membershipError.message)
  }

  const organizationIds =
    memberships?.map((membership) => membership.organization_id) ?? []

  if (organizationIds.length === 0) {
    redirect("/workspace/create-workspace")
  }

  if (organizationIds.length === 1) {
    redirect("/dashboard")
  }

  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("id, name, owner_id")
    .in("id", organizationIds)
    .order("created_at", { ascending: false })

  if (organizationError) {
    throw new Error(organizationError.message)
  }

  if (!organizations || organizations.length === 0) {
    redirect("/workspace/create-workspace")
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="max-w-xl">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light text-primary-dark">
            <Building2 className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-primary-dark">
            Your organizations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Select an organization
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">
            Choose the organization you want to continue to.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {organizations.map((organization: Organization) => (
            <Link
              key={organization.id}
              href={`/dashboard?organization=${organization.id}`}
              className="group flex items-center gap-4 border border-border bg-foreground p-4 transition-colors duration-200 hover:border-primary sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary-dark">
                <Building2 className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text">
                  {organization.name}
                </p>

                <p className="mt-1 text-xs text-muted sm:text-sm">
                  {organization.owner_id === user.id
                    ? "Owner"
                    : "Organization member"}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center text-muted transition-colors duration-200 group-hover:text-primary-dark">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}