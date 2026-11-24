"use client"

import { Loader2, Save, X } from "lucide-react"
import {
  PrimaryButton,
  SecondaryButton,
} from "./_shared/ui"

type UnsavedBarProps = {
  saving: boolean
  onSave: () => void
  onDiscard: () => void
}

export default function UnsavedBar({
  saving,
  onSave,
  onDiscard,
}: UnsavedBarProps) {
  return (
    <div className="kyyp-bar-in fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-border bg-foreground p-3 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text">
            You have unsaved changes.
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Save your preferences or discard the changes.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <SecondaryButton
            onClick={onDiscard}
            disabled={saving}
          >
            <X className="h-4 w-4" />
            Discard
          </SecondaryButton>

          <PrimaryButton
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}