"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import Sidebar from "@/app/components/organizationSidebar"
import DashboardBackground from "./dashboard-background"
import DashboardHeader from "./dashboard-header"
import OverviewStats from "./overview-stats"
import OperationalStats from "./operational-stats"
import RouteStatistics from "./route-statistics"
import VehicleStatistics from "./vehicle-statistics"
import RecentActivities from "./recent-activities"

type Role = "owner" | "admin" | "manager" | "staff"

type Organization = {
  id: string
  name: string
  owner_id: string
}

type OrganizationMember = {
  organization_id: string
  role: Role
}

export default function DashboardPage() {
  const router = useRouter()

  const [organization, setOrganization] =
    useState<Organization | null>(null)

  const [role, setRole] = useState<Role | null>(null)

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

      const { data: memberships, error: membershipsError } =
        await supabase
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

      const membership =
        memberships[0] as OrganizationMember

      setRole(membership.role)

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
      setLoading(false)
    }

    void loadOrganization()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Sidebar />

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 lg:ml-[260px]">
          <DashboardBackground />

          <div className="relative flex items-center gap-3 text-sm text-muted">
            <span
              className="h-4 w-4 animate-spin border-2 border-border border-t-primary"
              aria-hidden="true"
            />

            Loading organization...
          </div>
        </div>
      </main>
    )
  }

  if (message) {
    return (
      <main className="min-h-screen bg-background">
        <Sidebar />

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 lg:ml-[260px]">
          <DashboardBackground />

          <div className="relative w-full max-w-md border border-border bg-foreground p-6 text-center shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="mx-auto flex h-10 w-10 items-center justify-center bg-red-50 text-red-600">
              <span
                className="font-bold"
                aria-hidden="true"
              >
                !
              </span>
            </div>

            <p className="mt-5 text-sm font-bold text-text">
              Unable to load dashboard
            </p>

            <p className="mt-2 text-sm leading-6 text-muted">
              {message}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!organization || !role) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Sidebar organizationName={organization.name} />

      <div className="relative min-h-screen overflow-hidden lg:ml-[260px]">
        <DashboardBackground />

        <div className="relative mx-auto w-full max-w-[1560px] px-3 py-3 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
          <DashboardHeader
            organizationName={organization.name}
            role={role}
          />

          <section className="py-7 sm:py-9">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Transportation operations
                  </p>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-[36px]">
                  Operations at a glance.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  Monitor your routes, fleet availability, and
                  operational activity from one workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 border border-border bg-foreground sm:w-auto">
                <div className="border-r border-border px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Routes
                  </p>

                  <p className="mt-1 text-lg font-bold text-text">
                    24
                  </p>
                </div>

                <div className="px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Fleet
                  </p>

                  <p className="mt-1 text-lg font-bold text-text">
                    42
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-5 pb-10 sm:space-y-6">
            <OverviewStats />

            <OperationalStats />

            <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_0.85fr]">
              <RouteStatistics />

              <VehicleStatistics />
            </div>

            <RecentActivities />
          </div>
        </div>
      </div>
    </main>
  )
}