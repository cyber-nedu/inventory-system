"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"

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
  const searchParams = useSearchParams()
  const organizationId = searchParams.get("organization")

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
        window.location.href = "/workspace/create-workspace"
        return
      }

      const selectedMembership = organizationId
        ? memberships.find(
            (membership: OrganizationMember) =>
              membership.organization_id === organizationId
          )
        : memberships[0]

      if (!selectedMembership) {
        setMessage("You do not have access to this organization.")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, owner_id")
        .eq("id", selectedMembership.organization_id)
        .single()

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setOrganization(data)
      setRole(selectedMembership.role)
      setLoading(false)
    }

    loadOrganization()
  }, [organizationId])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading organization...</p>
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
            Organization dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-text">
            {organization?.name}
          </h1>

          <p className="mt-2 text-sm text-muted">
            You are signed in as {role}.
          </p>
        </div>
      </div>
    </main>
  )
}