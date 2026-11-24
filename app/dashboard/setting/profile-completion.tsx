"use client"

import Link from "next/link"
import { Check, Plus } from "lucide-react"

type ProfileCompletionProps = {
  hasProfilePhoto: boolean
}

export default function ProfileCompletion({
  hasProfilePhoto,
}: ProfileCompletionProps) {
  if (hasProfilePhoto) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-foreground px-4 py-3 text-sm text-text">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-primary">
          <Check className="h-4 w-4" />
        </span>
        <span>Your profile is complete.</span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-foreground p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text">
            Profile completion
          </h2>
          <p className="mt-1 text-xs text-muted">
            Add your profile photo to complete your profile.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
          67%
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <span className="h-1.5 rounded-full bg-primary" />
        <span className="h-1.5 rounded-full bg-primary" />
        <span className="h-1.5 rounded-full bg-secondary" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-medium text-text">
            Account created
          </p>
          <p className="mt-1 text-xs text-muted">Done</p>
        </div>

        <div>
          <p className="text-xs font-medium text-text">
            Workspace created
          </p>
          <p className="mt-1 text-xs text-muted">Done</p>
        </div>

        <div>
          <p className="text-xs font-medium text-text">
            Profile photo
          </p>
          <Link
            href="/dashboard/setting/profile"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark"
          >
            <Plus className="h-3 w-3" />
            Add photo
          </Link>
        </div>
      </div>
    </div>
  )
}