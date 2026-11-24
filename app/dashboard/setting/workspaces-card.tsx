"use client"

import { AlertTriangle } from "lucide-react"
import {
  ArrowLink,
  SectionLayout,
  SettingsCard,
} from "./_shared/ui"

export default function WorkspacesCard() {
  return (
    <SectionLayout
      title="Manage your workspace"
      description="Workspace management is handled separately from your preferences."
    >
      <SettingsCard>
        <div className="flex gap-4 p-5 sm:p-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted">
            <AlertTriangle className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text">
              Manage your workspace
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              If you need to delete a specific workspace, continue to workspace management.
            </p>

            <div className="mt-4">
              <ArrowLink href="/workspace">
                Go to workspace management
              </ArrowLink>
            </div>
          </div>
        </div>
      </SettingsCard>
    </SectionLayout>
  )
}  