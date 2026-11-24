"use client"

import { ChevronRight, LockKeyhole, Mail } from "lucide-react"
import Link from "next/link"
import {
  SectionLayout,
  SettingsCard,
} from "./_shared/ui"

export default function SecurityShortcutsCard() {
  return (
    <SectionLayout
      title="Sign-in and security"
      description="Manage the credentials you use to access your KYYP account."
    >
      <SettingsCard>
        <Link
          href="/dashboard/setting/profile"
          className="flex items-center gap-4 border-b border-border p-5 transition hover:bg-secondary/50 sm:p-6"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <Mail className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-text">
              Email address
            </span>
            <span className="mt-1 block text-xs text-muted">
              Change the email address connected to your account.
            </span>
          </span>

          <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
        </Link>

        <Link
          href="/dashboard/setting/profile"
          className="flex items-center gap-4 p-5 transition hover:bg-secondary/50 sm:p-6"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <LockKeyhole className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-text">
              Password
            </span>
            <span className="mt-1 block text-xs text-muted">
              Change the password used to sign in to KYYP.
            </span>
          </span>

          <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
        </Link>
      </SettingsCard>
    </SectionLayout>
  )
}