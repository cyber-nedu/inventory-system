"use client"

import type {
  ProfileRole,
  ProfileWorkspace,
} from "./profile-types"
import { getRoleLabel } from "./profile-utils"

export default function WorkspaceCard({
  organization,
  role,
  editable,
  nameDraft,
  nameError,
  onNameDraftChange,
}: {
  organization: ProfileWorkspace
  role: ProfileRole
  editable: boolean
  nameDraft: string
  nameError: string
  onNameDraftChange: (
    value: string,
  ) => void
}) {
  const canRename =
    role === "owner" ||
    role === "admin"

  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-base font-semibold text-text">
          Workspace
        </h2>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
          The name your team sees across KYYP.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-foreground">
        <div className="p-5 sm:p-6">
          <div>
            <label
              htmlFor="workspace-name"
              className="text-sm font-semibold text-text"
            >
              Workspace name
            </label>

            {editable &&
            canRename ? (
              <>
                <input
                  id="workspace-name"
                  type="text"
                  value={nameDraft}
                  onChange={(event) =>
                    onNameDraftChange(
                      event.target.value,
                    )
                  }
                  minLength={2}
                  maxLength={60}
                  autoComplete="organization"
                  aria-invalid={Boolean(
                    nameError,
                  )}
                  aria-describedby={
                    nameError
                      ? "workspace-name-error"
                      : "workspace-name-help"
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {nameError ? (
                  <p
                    id="workspace-name-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {nameError}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-sm text-text">
                {organization.name}
              </p>
            )}

            <p
              id="workspace-name-help"
              className="mt-2 text-sm leading-5 text-muted"
            >
              This name appears in the sidebar and menus
              for everyone in this workspace.
            </p>

            {!canRename ? (
              <p className="mt-3 text-sm text-muted">
                Only owners and admins can rename the
                workspace.
              </p>
            ) : null}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-semibold text-text">
              Role
            </p>

            <p className="mt-1 text-sm text-muted">
              {getRoleLabel(role)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}