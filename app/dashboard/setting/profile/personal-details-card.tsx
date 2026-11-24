"use client"

import {
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function PersonalDetailsCard({
  user,
}: {
  user: User
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-base font-semibold text-text">
          Sign-in and security
        </h2>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
          Manage how you sign in to KYYP.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-foreground">
        <div className="flex items-center gap-4 border-b border-border p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <Mail
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              Email
            </p>

            <p className="mt-1 truncate text-sm text-muted">
              {user.email ??
                "No email address"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-border p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <LockKeyhole
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              Password
            </p>

            <p className="mt-1 text-sm text-muted">
              Your account password is managed
              securely by KYYP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <KeyRound
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              Sign-in method
            </p>

            <p className="mt-1 text-sm text-muted">
              {user.identities
                ?.map(
                  (identity) =>
                    identity.provider,
                )
                .join(", ") ||
                "Email"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}