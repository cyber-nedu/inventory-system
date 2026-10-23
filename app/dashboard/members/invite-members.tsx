"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import InviteModal from "./invite-modal"

type InviteMembersProps = {
  onInvitationSent: () => void
  triggerClassName?: string
}

const pageContent = {
  addMember: "Add member",
}

export default function InviteMembers({
  onInvitationSent,
  triggerClassName,
}: InviteMembersProps) {
  return (
    <InviteModal
      onInvitationSent={onInvitationSent}
      trigger={
        <Button
          type="button"
          className={`shrink-0 gap-2 ${triggerClassName || ""}`}
        >
          <UserPlus className="h-4 w-4" />
          {pageContent.addMember}
        </Button>
      }
    />
  )
}