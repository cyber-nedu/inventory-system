"use client"

import type { ReactNode } from "react"
import type { KyypPreferences } from "@/app/hooks/use-preferences"
import {
  SegmentedOption,
  SettingsCard,
  SectionLayout,
} from "./_shared/ui"

type PreferencesCardProps = {
  preferences: KyypPreferences
  onChange: (next: KyypPreferences) => void
  error: string | null
}

function PreferenceRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border py-5 last:border-b-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>
      </div>

      <div className="w-full sm:w-64">{children}</div>
    </div>
  )
}

export default function PreferencesCard({
  preferences,
  onChange,
  error,
}: PreferencesCardProps) {
  return (
    <SectionLayout
      title="Preferences"
      description="Choose how KYYP displays and handles everyday workspace data."
    >
      <SettingsCard className="p-5 sm:p-6">
        <PreferenceRow
          title="Table density"
          description="Control the amount of spacing used in route and vehicle tables."
        >
          <div className="flex rounded-lg border border-border bg-secondary p-1">
            <SegmentedOption
              selected={!preferences.compactTables}
              label="Comfortable"
              onClick={() =>
                onChange({
                  ...preferences,
                  compactTables: false,
                })
              }
            />

            <SegmentedOption
              selected={preferences.compactTables}
              label="Compact"
              onClick={() =>
                onChange({
                  ...preferences,
                  compactTables: true,
                })
              }
            />
          </div>
        </PreferenceRow>

        <PreferenceRow
          title="Delete confirmation"
          description="Choose whether destructive actions ask for confirmation first."
        >
          <div className="flex rounded-lg border border-border bg-secondary p-1">
            <SegmentedOption
              selected={preferences.confirmBeforeDelete}
              label="Ask first"
              onClick={() =>
                onChange({
                  ...preferences,
                  confirmBeforeDelete: true,
                })
              }
            />

            <SegmentedOption
              selected={!preferences.confirmBeforeDelete}
              label="Delete immediately"
              onClick={() =>
                onChange({
                  ...preferences,
                  confirmBeforeDelete: false,
                })
              }
            />
          </div>
        </PreferenceRow>

        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
          Deleting routes, vehicles, or other operational records can affect your workspace data. Review the item carefully before confirming deletion.
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}
      </SettingsCard>
    </SectionLayout>
  )
}