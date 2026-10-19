"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  CirclePile,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react"
import { createClient } from "@/app/lib/supabase/client"

const pageContent = {
  eyebrow: "Organization setup",
  title: "Create your organization",
  description:
    "Set up your organization to start managing your transportation operations with KYYP.",
  organizationNameLabel: "Organization name",
  organizationNamePlaceholder: "Enter your organization name",
  submitLabel: "Create organization",
  submittingLabel: "Creating organization...",
  footerText: "You can update your organization details later.",
}

export default function CreateWorkspacePage() {
  const router = useRouter()

  const [organizationName, setOrganizationName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const createOrganization = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    const trimmedOrganizationName = organizationName.trim()

    if (!trimmedOrganizationName) {
      setMessage("Please enter your organization name.")
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
      setMessage(userError?.message || "Your session has expired.")
      setLoading(false)
      return
    }

    const { data: organization, error: organizationError } = await supabase
      .from("workspaces")
      .insert({
        name: trimmedOrganizationName,
        owner_id: user.id,
        type: "organization",
      })
      .select("id")
      .single()

    if (organizationError || !organization) {
      setMessage(
        organizationError?.message || "Unable to create your organization."
      )
      setLoading(false)
      return
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: organization.id,
        user_id: user.id,
      })

    if (memberError) {
      await supabase
        .from("workspaces")
        .delete()
        .eq("id", organization.id)

      setMessage(memberError.message)
      setLoading(false)
      return
    }

    router.replace("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-[1440px]">
        <div className="mx-auto w-full max-w-[560px]">
          <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-dark text-foreground shadow-lg shadow-primary-dark/10 sm:h-13 sm:w-13">
              <CirclePile className="h-6 w-6 sm:h-6.5 sm:w-6.5" />
            </div>

            <div className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              KYYP<span className="text-primary-dark">.</span>
            </div>
          </div>

          <div className="border border-border/70 bg-foreground/75 p-5 shadow-2xl shadow-text/5 backdrop-blur-xl sm:p-8 md:p-9">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold tracking-wide text-primary-dark">
                {pageContent.eyebrow}
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                {pageContent.title}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                {pageContent.description}
              </p>
            </div>

            <form onSubmit={createOrganization} className="space-y-5">
              <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                <legend className="ml-3 px-2 text-xs font-medium text-muted">
                  {pageContent.organizationNameLabel}
                </legend>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                  <input
                    id="organization-name"
                    type="text"
                    placeholder={pageContent.organizationNamePlaceholder}
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-13 w-full bg-transparent px-12 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
                  />
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={loading || !organizationName.trim()}
                className="group flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-14"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
                    {pageContent.submittingLabel}
                  </>
                ) : (
                  <>
                    {pageContent.submitLabel}

                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className="mt-6 border border-primary/20 bg-primary-light px-4 py-3 text-center text-sm leading-5 text-primary-dark">
                {message}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted sm:mt-7">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>{pageContent.footerText}</span>
          </div>
        </div>
      </div>
    </main>
  )
}