"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import Sidebar from "@/app/components/organizationSidebar"
import DashboardHeader from "./dashboard-header"
import OverviewStats from "./overview-stats"
import OperationalStats from "./operational-stats"
import RouteStatistics from "./route-statistics"
import VehicleStatistics from "./vehicle-statistics"
import RecentActivities from "./recent-activities"

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

        <div className="flex min-h-screen items-center justify-center bg-secondary px-5 lg:ml-[260px]">
          <p className="text-sm text-muted">
            Loading organization...
          </p>
        </div>
      </main>
    )
  }

  if (message) {
    return (
      <main>
        <Sidebar />

        <div className="flex min-h-screen items-center justify-center bg-secondary px-5 lg:ml-[260px]">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold text-text">
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
    <main>
      <Sidebar organizationName={organization.name} />

      <div className="min-h-screen bg-secondary lg:ml-[260px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-9">
          <DashboardHeader
            organizationName={organization.name}
            role={role}
          />

          <section className="relative overflow-hidden pb-10 pt-12 sm:pb-12 sm:pt-16">
            <div className="pointer-events-none absolute right-0 top-8 hidden h-48 w-48 rounded-full border border-border/60 lg:block" />

            <div className="pointer-events-none absolute right-8 top-16 hidden h-32 w-32 rounded-full border border-border/60 lg:block" />

            <div className="relative max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                Transportation management
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-[38px]">
                Your operations, at a glance.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
                Monitor your routes, manage your vehicles, and keep your
                transportation operations organized from one place.
              </p>
            </div>
          </section>

          <div className="space-y-8 pb-12">
            <OverviewStats />

            <OperationalStats />

            <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_0.85fr]">
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