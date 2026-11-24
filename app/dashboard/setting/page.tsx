"use client"

import { useState } from "react"
import type { KyypPreferences } from "@/app/hooks/use-preferences"
import { usePreferences } from "@/app/hooks/use-preferences"
import Sidebar from "@/app/components/organizationSidebar"
import { ToastProvider, useToast } from "./_shared/toast"
import {
  ErrorAlert,
  LoadingCard,
  SectionLayout,
} from "./_shared/ui"
import { useSettingsData } from "./_shared/use-settings-data"
import ProfileCompletion from "./profile-completion"
import PreferencesCard from "./preferences-card"
import SecurityShortcutsCard from "./security-shortcuts-card"
import SettingsHeader from "./settings-header"
import SettingsHero from "./settings-hero"
import SupportCard from "./support-card"
import UnsavedBar from "./unsaved-bar"
import WorkspacesCard from "./workspaces-card"
import { getAvatarUrl } from "./profile/profile-utils"

function arePreferencesEqual(
  first: KyypPreferences,
  second: KyypPreferences,
): boolean {
  return (
    first.confirmBeforeDelete === second.confirmBeforeDelete &&
    first.compactTables === second.compactTables
  )
}

function SettingsContent() {
  const {
    status,
    user,
    workspaces,
    active,
    errorMessage,
    reload,
  } = useSettingsData()

  const { preferences, setPreference } = usePreferences()
  const { showToast } = useToast()

  const [draftPreferences, setDraftPreferences] =
    useState<KyypPreferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(
    null,
  )

  const displayedPreferences =
    draftPreferences ?? preferences

  const hasDraft =
    draftPreferences !== null &&
    !arePreferencesEqual(draftPreferences, preferences)

  function handlePreferencesChange(
    next: KyypPreferences,
  ) {
    setDraftPreferences(next)
    setSaveError(null)
  }

  function handleDiscard() {
    setDraftPreferences(null)
    setSaveError(null)
  }

  function handleSave() {
    if (!draftPreferences || !hasDraft) {
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      setPreference(
        "confirmBeforeDelete",
        draftPreferences.confirmBeforeDelete,
      )

      setPreference(
        "compactTables",
        draftPreferences.compactTables,
      )

      setDraftPreferences(null)
      showToast("Preferences saved successfully.")
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "We couldn't save your preferences. Please try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="lg:ml-[260px]">
          <div className="border-b border-border bg-background">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
              <div>
                <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
                <div className="mt-3 h-8 w-32 animate-pulse rounded bg-secondary" />
                <div className="mt-2 h-3 w-64 animate-pulse rounded bg-secondary" />
              </div>

              <div className="h-11 w-11 animate-pulse rounded-full bg-secondary" />
            </div>
          </div>

          <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24 sm:px-6 sm:py-8">
            <LoadingCard className="h-64" />
            <LoadingCard className="h-32" />
            <LoadingCard className="h-72" />
          </main>
        </div>
      </div>
    )
  }

  if (status === "error" || !user || !active) {
    return (
      <div className="min-h-screen bg-background">
        <div className="lg:ml-[260px]">
          <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="rounded-2xl border border-border bg-foreground p-6">
              <h1 className="text-lg font-semibold text-text">
                Settings unavailable
              </h1>

              <p className="mt-2 text-sm text-muted">
                {errorMessage ??
                  "We couldn't load your settings right now."}
              </p>

              <button
                type="button"
                onClick={reload}
                className="mt-5 h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Try again
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const hasProfilePhoto = Boolean(getAvatarUrl(user))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar organizationName={active.name} />

      <div className="lg:ml-[260px]">
        <SettingsHeader
          user={user}
          organization={active}
          role={active.role}
          workspaceCount={workspaces.length}
          workspaces={workspaces}
        />

        <main className="mx-auto max-w-4xl space-y-8 px-4 py-6 pb-28 sm:px-6 sm:py-8">
          <SettingsHero
            user={user}
            workspaceName={active.name}
          />

          <ProfileCompletion
            hasProfilePhoto={hasProfilePhoto}
          />

          <PreferencesCard
            preferences={displayedPreferences}
            onChange={handlePreferencesChange}
            error={saveError}
          />

          <SecurityShortcutsCard />

          <SectionLayout
            title="Roles & Permissions"
            description="Advanced workspace permissions will be available in a future update."
          >
            <div className="rounded-2xl border border-border bg-secondary/40 p-5 opacity-70 sm:p-6">
              <p className="text-sm font-medium text-text">
                Roles & Permissions
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Advanced workspace permissions
              </p>

              <span className="mt-4 inline-flex rounded-md border border-border bg-foreground px-2.5 py-1 text-xs font-medium text-muted">
                Coming soon
              </span>
            </div>
          </SectionLayout>

          <WorkspacesCard />

          <SupportCard />

          <footer className="pt-2 text-xs text-muted">
            KYYP © {new Date().getFullYear()}
          </footer>

          {saveError ? (
            <ErrorAlert>{saveError}</ErrorAlert>
          ) : null}
        </main>

        {hasDraft ? (
          <UnsavedBar
            saving={saving}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        ) : null}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  )
}