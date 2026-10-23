"use client"

import { CheckCircle2, Clock3, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/app/components/organizationSidebar"
import { createClient } from "@/app/lib/supabase/client"
import InviteMembers from "./invite-members"

type Invitation = {
  id: string
  email: string
  role: string
  status: string
  created_at: string
}

const pageContent = {
  eyebrow: "Organization",
  title: "Members",
  description:
    "Manage the people who work with your organization and control their access.",
  addMember: "Add member",
  emptyTitle: "No members yet",
  emptyDescription:
    "Add your first member to start building your organization.",
  loadingMembers: "Loading members...",
  membersTitle: "Organization members",
  membersDescription: "People invited to join your organization.",
  pending: "Pending",
  accepted: "Accepted",
}

export default function Members() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)

  const loadInvitations = async () => {
    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setIsLoadingMembers(false)
      return
    }

    const { data: memberships, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)

    if (
      membershipError ||
      !memberships ||
      memberships.length === 0
    ) {
      setIsLoadingMembers(false)
      return
    }

    const { data, error: invitationError } = await supabase
      .from("invitations")
      .select("id, email, role, status, created_at")
      .eq("organization_id", memberships[0].organization_id)
      .order("created_at", { ascending: false })

    if (invitationError) {
      setIsLoadingMembers(false)
      return
    }

    setInvitations(data || [])
    setIsLoadingMembers(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadMembers = async () => {
      const supabase = createClient()

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        if (isMounted) {
          setIsLoadingMembers(false)
        }

        return
      }

      const { data: memberships, error: membershipError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)

      if (
        membershipError ||
        !memberships ||
        memberships.length === 0
      ) {
        if (isMounted) {
          setIsLoadingMembers(false)
        }

        return
      }

      const { data, error: invitationError } = await supabase
        .from("invitations")
        .select("id, email, role, status, created_at")
        .eq("organization_id", memberships[0].organization_id)
        .order("created_at", { ascending: false })

      if (invitationError) {
        if (isMounted) {
          setIsLoadingMembers(false)
        }

        return
      }

      if (isMounted) {
        setInvitations(data || [])
        setIsLoadingMembers(false)
      }
    }

    loadMembers()

    return () => {
      isMounted = false
    }
  }, [])

  const handleInvitationSent = async () => {
    await loadInvitations()
  }

  return (
    <main>
      <Sidebar />

      <div className="min-h-screen bg-secondary p-6 lg:ml-[260px]">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-6 max-[639px]:flex-col">
            <div>
              <p className="text-sm font-medium text-primary-dark">
                {pageContent.eyebrow}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text">
                {pageContent.title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {pageContent.description}
              </p>
            </div>

            <InviteMembers
              onInvitationSent={handleInvitationSent}
            />
          </div>

          <div className="mt-8 overflow-hidden border border-border bg-foreground">
            {isLoadingMembers ? (
              <div className="flex min-h-[360px] items-center justify-center px-6">
                <p className="text-sm text-muted">
                  {pageContent.loadingMembers}
                </p>
              </div>
            ) : invitations.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center bg-primary-light text-primary-dark">
                  <UserPlus className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-text">
                  {pageContent.emptyTitle}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                  {pageContent.emptyDescription}
                </p>

                <InviteMembers
                  onInvitationSent={handleInvitationSent}
                  triggerClassName="mt-6"
                />
              </div>
            ) : (
              <div>
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-sm font-semibold text-text">
                    {pageContent.membersTitle}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {pageContent.membersDescription}
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {invitations.map((invitation) => {
                    const isAccepted = invitation.status === "accepted"

                    return (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between gap-4 px-5 py-4 max-[639px]:items-start"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
                            {isAccepted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Clock3 className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text">
                              {invitation.email}
                            </p>

                            <p className="mt-1 text-xs capitalize text-muted">
                              {invitation.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${
                              isAccepted
                                ? "bg-primary-light text-primary-dark"
                                : "bg-secondary text-muted"
                            }`}
                          >
                            {isAccepted ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock3 className="h-3.5 w-3.5" />
                            )}

                            {isAccepted
                              ? pageContent.accepted
                              : pageContent.pending}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}