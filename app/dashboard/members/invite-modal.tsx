"use client"

import { CheckCircle2, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/app/lib/supabase/client"

type InviteModalProps = {
  onInvitationSent: () => void
  trigger: React.ReactNode
}

const pageContent = {
  modalTitle: "Add member",
  modalDescription:
    "Invite someone to join your organization and give them the right level of access.",
  emailLabel: "Email address",
  emailPlaceholder: "person@example.com",
  roleLabel: "Role",
  rolePlaceholder: "Select a role",
  cancel: "Cancel",
  sendInvitation: "Send invitation",
  sendingInvitation: "Sending invitation...",
  successTitle: "Invitation sent",
  successDescription:
    "The invitation has been sent successfully. They can now join your organization.",
  errorFallback: "Something went wrong. Please try again.",
}

const roles = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "staff",
    label: "Staff",
  },
]

export default function InviteModal({
  onInvitationSent,
  trigger,
}: InviteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setError("")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
    setEmail("")
    setRole("")
    setError("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !role || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("Your session has expired. Please sign in again.")
      setIsSubmitting(false)
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
      setError(
        membershipError?.message ||
          "We could not find your organization membership."
      )
      setIsSubmitting(false)
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: existingInvitation } = await supabase
      .from("invitations")
      .select("id")
      .eq("organization_id", memberships[0].organization_id)
      .eq("email", normalizedEmail)
      .eq("status", "pending")
      .limit(1)

    if (existingInvitation && existingInvitation.length > 0) {
      setError("A pending invitation already exists for this email.")
      setIsSubmitting(false)
      return
    }

    const { data: invitation, error: invitationError } = await supabase
  .from("invitations")
  .insert({
    organization_id: memberships[0].organization_id,
    email: normalizedEmail,
    role,
    invited_by: user.id,
  })
  .select("token")
  .single()

if (invitationError) {
  setError(invitationError.message)
  setIsSubmitting(false)
  return
}

const response = await fetch("/api/invitations/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    token: invitation.token,
  }),
})

const emailResult = await response.json()

if (!response.ok) {
  setError(emailResult.error || pageContent.errorFallback)
  setIsSubmitting(false)
  return
}
    await onInvitationSent()

    setIsModalOpen(false)
    setEmail("")
    setRole("")
    setError("")
    setIsSubmitting(false)
    setIsSuccessOpen(true)

    window.setTimeout(() => {
      setIsSuccessOpen(false)
    }, 2000)
  }

  return (
    <>
      <div onClick={openModal}>{trigger}</div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal()
          }
        }}
      >
        <DialogContent className="max-w-lg gap-0 overflow-hidden border border-border bg-foreground p-0 shadow-xl">
          <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-6">
            <div className="min-w-0">
              <div className="flex h-10 w-10 items-center justify-center bg-primary-light text-primary-dark">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-text">
                {pageContent.modalTitle}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                {pageContent.modalDescription}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 px-6 py-6">
              <div>
                <label
                  htmlFor="member-email"
                  className="text-sm font-medium text-text"
                >
                  {pageContent.emailLabel}
                </label>

                <Input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={pageContent.emailPlaceholder}
                  required
                  className="mt-2 h-11 border-border bg-background px-3.5 text-sm shadow-none transition-colors focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="member-role"
                  className="text-sm font-medium text-text"
                >
                  {pageContent.roleLabel}
                </label>

                <select
                  id="member-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  required
                  className="mt-2 h-11 w-full border border-border bg-background px-3.5 text-sm text-text shadow-none outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>
                    {pageContent.rolePlaceholder}
                  </option>

                  {roles.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <p className="text-sm leading-5 text-destructive">
                    {error || pageContent.errorFallback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-secondary/40 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                disabled={isSubmitting}
                className="min-w-20 text-text hover:bg-secondary"
              >
                {pageContent.cancel}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-36 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {pageContent.sendingInvitation}
                  </>
                ) : (
                  pageContent.sendInvitation
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-sm border border-border bg-foreground text-center shadow-xl">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center bg-primary-light text-primary-dark">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold tracking-tight text-text">
              {pageContent.successTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              {pageContent.successDescription}
            </p>

            <Button
              type="button"
              onClick={() => setIsSuccessOpen(false)}
              className="mt-6 min-w-28"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}