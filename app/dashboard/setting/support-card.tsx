"use client"

import { LifeBuoy } from "lucide-react"
import {
  SectionLayout,
  SettingsCard,
} from "./_shared/ui"

export default function SupportCard() {
  return (
    <SectionLayout
      title="Support"
      description="Get help with your KYYP workspace when support becomes available."
    >
      <SettingsCard>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
              <LifeBuoy className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-medium text-text">
                Get support
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Direct support is coming soon.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="h-10 shrink-0 rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-muted disabled:cursor-not-allowed"
          >
            Coming soon
          </button>
        </div>
      </SettingsCard>
    </SectionLayout>
  )
}