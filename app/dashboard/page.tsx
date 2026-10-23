"use client"

import { useEffect, useState } from "react"
import { Bell, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import Sidebar from "@/app/components/organizationSidebar"

type Organization = {
  id: string
  name: string
  owner_id: string
}

type OrganizationMember = {
  organization_id: string
  role: "owner" | "admin" | "manager" | "staff"
}

export default function DashboardPage() {
  const router = useRouter()

  const [organization, setOrganization] =
    useState<Organization | null>(null)
  const [role, setRole] = useState<
    "owner" | "admin" | "manager" | "staff" | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadOrganization = async () => {
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
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", user.id)

      if (membershipsError) {
        setMessage(membershipsError.message)
        setLoading(false)
        return
      }

      if (!memberships || memberships.length === 0) {
        router.push("/workspace/create-workspace")
        return
      }

      const membership = memberships[0] as OrganizationMember

      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, owner_id")
        .eq("id", membership.organization_id)
        .single()

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setOrganization(data)
      setRole(membership.role)
      setLoading(false)
    }

    loadOrganization()
  }, [router])

  if (loading) {
    return (
      <main>
        <Sidebar />

        <div className="flex min-h-screen items-center justify-center bg-secondary lg:ml-[260px]">
          <p className="text-sm text-muted">Loading organization...</p>
        </div>
      </main>
    )
  }

  if (message) {
    return (
      <main>
        <div className="flex min-h-screen items-center justify-center bg-secondary px-5">
          <p className="text-sm text-muted">{message}</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Sidebar />

      <div className="min-h-screen bg-secondary lg:ml-[260px]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <header className="flex min-h-[76px] items-center justify-between rounded-full border border-border bg-foreground px-4 shadow-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-primary-dark">
                <UserCircle className="h-6 w-6" strokeWidth={1.7} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                  {role}
                </p>

                <p className="truncate text-sm font-semibold text-text sm:text-[15px]">
                  {organization?.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:bg-secondary hover:text-text"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </header>

          <section className="pt-10 sm:pt-12">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-primary-dark">
                Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Manage your transportation operations, keep your team
                organized, and stay on top of everything happening across your
                organization.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}