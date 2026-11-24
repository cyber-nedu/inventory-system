"use client"

import {
  Download,
  Loader2,
  Save,
  X,
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import Sidebar from "@/app/components/organizationSidebar"
import {
  useDashboardRoutes,
  useDashboardVehicles,
} from "../../dashboard-data"
import { createClient } from "@/app/lib/supabase/client"
import PersonalDetailsCard from "./personal-details-card"
import ProfilePreview from "./profile-preview"
import type {
  PendingPhoto,
  ProfileAlert,
  ProfileData,
  ProfileMode,
  ProfileRole,
  ProfileWorkspace,
} from "./profile-types"
import {
  AVATAR_BUCKET,
  SUPPORT_EMAIL,
  canRenameWorkspace,
  emitWorkspaceUpdated,
  getActiveWorkspaceId,
  getOwnedPath,
  validateOrganizationName,
} from "./profile-utils"
import WorkspaceCard from "./workspace-card"

type ProfileStatus =
  | "loading"
  | "ready"
  | "error"

type OpenDiscardState = boolean

type SaveFailure = {
  area: "photo" | "workspace"
  message: string
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-6 sm:px-6 sm:py-8 motion-reduce:animate-none">
      <div className="h-8 w-40 rounded-lg bg-secondary" />

      <div className="mt-3 h-4 w-72 max-w-full rounded bg-secondary" />

      <div className="mt-8 h-64 rounded-2xl border border-border bg-foreground" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="h-5 w-28 rounded bg-secondary" />

          <div className="mt-3 h-4 w-52 max-w-full rounded bg-secondary" />
        </div>

        <div className="h-40 rounded-2xl border border-border bg-foreground" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="h-5 w-40 rounded bg-secondary" />

          <div className="mt-3 h-4 w-56 max-w-full rounded bg-secondary" />
        </div>

        <div className="h-52 rounded-2xl border border-border bg-foreground" />
      </div>
    </div>
  )
}

function getRoleFromMembership(
  value: string,
): ProfileRole {
  if (
    value === "owner" ||
    value === "admin" ||
    value === "manager"
  ) {
    return value
  }

  return "staff"
}

function HeaderActions({
  mode,
  dirty,
  saving,
  onEdit,
  onCancel,
  onSave,
}: {
  mode: ProfileMode
  dirty: boolean
  saving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}) {
  if (mode === "view") {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
      >
        Edit Profile
      </button>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 sm:w-auto"
      >
        <X
          className="h-4 w-4"
          aria-hidden="true"
        />

        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />

            Saving…
          </>
        ) : (
          <>
            <Save
              className="h-4 w-4"
              aria-hidden="true"
            />

            Save changes
          </>
        )}
      </button>
    </div>
  )
}

function DataPrivacySection({
  user,
  organization,
  routes,
  vehicles,
}: {
  user: User
  organization: ProfileWorkspace
  routes: ReturnType<typeof useDashboardRoutes>
  vehicles: ReturnType<typeof useDashboardVehicles>
}) {
  const supabase = useMemo(
    () => createClient(),
    [],
  )

  const [exporting, setExporting] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const handleExport = async () => {
    if (exporting) {
      return
    }

    setExporting(true)
    setMessage("")

    try {
      const {
        data,
        error,
      } = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", user.id)

      if (error) {
        throw error
      }

      const memberships = data ?? []

      const organizationIds =
        memberships.map(
          (membership) =>
            membership.organization_id,
        )

      let workspaceRows: Array<{
        id: string
        name: string
      }> = []

      if (organizationIds.length > 0) {
        const {
          data: organizations,
          error: organizationsError,
        } = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", organizationIds)

        if (organizationsError) {
          throw organizationsError
        }

        workspaceRows =
          organizations ?? []
      }

      const payload = {
        email: user.email ?? "",
        member_since: user.created_at,
        workspaces: workspaceRows.map(
          (workspace) => {
            const membership =
              memberships.find(
                (item) =>
                  item.organization_id ===
                  workspace.id,
              )

            return {
              name: workspace.name,
              role:
                membership?.role ??
                "staff",
            }
          },
        ),
        active_workspace: {
          routes,
          vehicles,
        },
      }

      const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        {
          type: "application/json",
        },
      )

      const url =
        URL.createObjectURL(blob)

      const anchor =
        document.createElement("a")

      anchor.href = url

      anchor.download = `kyyp-data-export-${new Intl.DateTimeFormat(
        "en-CA",
      ).format(new Date())}.json`

      document.body.appendChild(anchor)

      anchor.click()

      anchor.remove()

      URL.revokeObjectURL(url)

      setMessage(
        `Your KYYP data has been downloaded.`,
      )
    } catch (exportError) {
      setMessage(
        exportError instanceof Error
          ? exportError.message
          : "Your data could not be exported.",
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-base font-semibold text-text">
          Data and privacy
        </h2>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
          Your information, on your terms.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-foreground">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              Export my data
            </p>

            <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
              Download a JSON copy of your account,
              workspace, routes, and vehicles.
            </p>

            {message ? (
              <p
                role="status"
                className="mt-2 text-sm text-muted"
              >
                {message}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() =>
              void handleExport()
            }
            disabled={exporting}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <Download
              className="h-4 w-4"
              aria-hidden="true"
            />

            {exporting
              ? "Preparing…"
              : "Export data"}
          </button>
        </div>

        <div className="border-t border-border p-5 sm:p-6">
          <p className="text-sm text-muted">
            To delete your account, contact support.

            {SUPPORT_EMAIL ? (
              <>
                {" "}

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Contact support
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  )
}

export default function ProfilePage() {
  const router = useRouter()

  const supabase = useMemo(
    () => createClient(),
    [],
  )

  const routes = useDashboardRoutes()

  const vehicles =
    useDashboardVehicles()

  const [status, setStatus] =
    useState<ProfileStatus>("loading")

  const [error, setError] =
    useState("")

  const [profile, setProfile] =
    useState<ProfileData | null>(null)

  const [mode, setMode] =
    useState<ProfileMode>("view")

  const [nameDraft, setNameDraft] =
    useState("")

  const [pendingPhoto, setPendingPhoto] =
    useState<PendingPhoto | null>(null)

  const [removePhoto, setRemovePhoto] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [alert, setAlert] =
    useState<ProfileAlert | null>(null)

  const [discardOpen, setDiscardOpen] =
    useState<OpenDiscardState>(false)

  const loadProfile =
    useCallback(async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          router.replace("/auth/login")
          return
        }

        const {
          data: memberships,
          error: membershipError,
        } = await supabase
          .from("organization_members")
          .select(
            "organization_id, role",
          )
          .eq("user_id", user.id)

        if (membershipError) {
          throw membershipError
        }

        if (
          !memberships ||
          memberships.length === 0
        ) {
          router.replace(
            "/workspace/create-workspace",
          )
          return
        }

        const activeId =
          getActiveWorkspaceId()

        const membership =
          memberships.find(
            (item) =>
              item.organization_id ===
              activeId,
          ) ?? memberships[0]

        const {
          data: organization,
          error: organizationError,
        } = await supabase
          .from("organizations")
          .select(
            "id, name, owner_id, created_at",
          )
          .eq(
            "id",
            membership.organization_id,
          )
          .maybeSingle()

        if (organizationError) {
          throw organizationError
        }

        if (!organization) {
          throw new Error(
            "Your workspace could not be found.",
          )
        }

        const nextRole =
          getRoleFromMembership(
            String(membership.role),
          )

        setProfile({
          user,
          organization:
            organization as ProfileWorkspace,
          role: nextRole,
        })

        setNameDraft(organization.name)
        setStatus("ready")
        setError("")
      } catch (loadError) {
        setStatus("error")

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your profile.",
        )
      }
    }, [router, supabase])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadProfile])

  const handleRetry = () => {
    setStatus("loading")
    setError("")
    void loadProfile()
  }

  const canRename = profile
    ? canRenameWorkspace(profile.role)
    : false

  const dirty = Boolean(
    profile &&
      mode === "edit" &&
      (
        (
          canRename &&
          nameDraft.trim() !==
            profile.organization.name.trim()
        ) ||
        pendingPhoto ||
        removePhoto
      ),
  )

  useEffect(() => {
    if (!dirty) {
      return
    }

    const handleBeforeUnload = (
      event: BeforeUnloadEvent,
    ) => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    )

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      )
    }
  }, [dirty])

  const handlePhotoStage = (
    photo: PendingPhoto,
  ) => {
    setPendingPhoto((previous) => {
      if (previous) {
        URL.revokeObjectURL(
          previous.previewUrl,
        )
      }

      return photo
    })

    setRemovePhoto(false)
    setAlert(null)
  }

  const handleRemovePhoto = () => {
    if (pendingPhoto) {
      URL.revokeObjectURL(
        pendingPhoto.previewUrl,
      )

      setPendingPhoto(null)
    }

    setRemovePhoto(true)
    setAlert(null)
  }

  const handleRestorePhoto = () => {
    setRemovePhoto(false)
    setAlert(null)
  }

  const discardChanges = () => {
    if (pendingPhoto) {
      URL.revokeObjectURL(
        pendingPhoto.previewUrl,
      )
    }

    if (profile) {
      setNameDraft(
        profile.organization.name,
      )
    }

    setPendingPhoto(null)
    setRemovePhoto(false)
    setDiscardOpen(false)
    setMode("view")
    setAlert(null)
  }

  const handleCancel = () => {
    if (dirty) {
      setDiscardOpen(true)
      return
    }

    discardChanges()
  }

  const uploadPhoto = async (
    currentUser: User,
    photo: PendingPhoto,
  ): Promise<User> => {
    const previousPath =
      getOwnedPath(currentUser)

    const extension =
      photo.contentType === "image/png"
        ? "png"
        : photo.contentType ===
            "image/jpeg"
          ? "jpg"
          : "webp"

    const path = `${currentUser.id}/avatar-${Date.now()}.${extension}`

    const {
      error: uploadError,
    } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, photo.blob, {
        contentType:
          photo.contentType,
        cacheControl: "31536000",
        upsert: false,
      })

    if (uploadError) {
      throw new Error(
        `Profile photo upload failed: ${uploadError.message}`,
      )
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(path)

    const {
      data: { user: freshUser },
      error: freshUserError,
    } = await supabase.auth.getUser()

    if (
      freshUserError ||
      !freshUser
    ) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([path])

      throw new Error(
        "Your profile could not be refreshed before saving the photo.",
      )
    }

    const {
      data: updatedUserData,
      error,
    } = await supabase.auth.updateUser({
      data: {
        ...freshUser.user_metadata,
        profile_photo_url:
          publicUrlData.publicUrl,
        profile_photo_path: path,
      },
    })

    if (
      error ||
      !updatedUserData.user
    ) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([path])

      throw new Error(
        error?.message ??
          "Your profile photo could not be saved.",
      )
    }

    if (
      previousPath &&
      previousPath !== path
    ) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([previousPath])
    }

    return updatedUserData.user
  }

  const removeCurrentPhoto = async (
    currentUser: User,
  ): Promise<User> => {
    const previousPath =
      getOwnedPath(currentUser)

    const {
      data,
      error,
    } = await supabase.auth.updateUser({
      data: {
        ...currentUser.user_metadata,
        profile_photo_url: "",
        profile_photo_path: "",
      },
    })

    if (
      error ||
      !data.user
    ) {
      throw new Error(
        error?.message ??
          "Your profile photo could not be removed.",
      )
    }

    if (previousPath) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([previousPath])
    }

    return data.user
  }

  const saveChanges = async () => {
    if (
      saving ||
      !profile ||
      mode !== "edit"
    ) {
      return
    }

    setAlert(null)

    const trimmedName =
      nameDraft.trim()

    if (
      canRename &&
      trimmedName !==
        profile.organization.name.trim()
    ) {
      const validationError =
        validateOrganizationName(
          trimmedName,
        )

      if (validationError) {
        setAlert({
          type: "error",
          message: validationError,
        })

        return
      }
    }

    setSaving(true)

    let savedName =
      profile.organization.name

    const failures: SaveFailure[] = []

    let nextUser = profile.user

    let nextOrganization =
      profile.organization

    const renameChanged =
      canRename &&
      trimmedName !==
        profile.organization.name.trim()

    if (pendingPhoto) {
      try {
        nextUser = await uploadPhoto(
          nextUser,
          pendingPhoto,
        )

        URL.revokeObjectURL(
          pendingPhoto.previewUrl,
        )

        setPendingPhoto(null)
        setRemovePhoto(false)
      } catch (photoError) {
        failures.push({
          area: "photo",
          message:
            photoError instanceof Error
              ? photoError.message
              : "Profile photo could not be saved.",
        })
      }
    } else if (removePhoto) {
      try {
        nextUser =
          await removeCurrentPhoto(
            nextUser,
          )

        setRemovePhoto(false)
      } catch (photoError) {
        failures.push({
          area: "photo",
          message:
            photoError instanceof Error
              ? photoError.message
              : "Profile photo could not be removed.",
        })
      }
    }

    if (renameChanged) {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("organizations")
          .update({
            name: trimmedName,
          })
          .eq(
            "id",
            profile.organization.id,
          )
          .select("id, name")
          .maybeSingle()

        if (
          error ||
          !data
        ) {
          failures.push({
            area: "workspace",
            message:
              "You don't have permission to rename this workspace, or the change was not saved.",
          })
        } else {
          savedName = data.name

          nextOrganization = {
            ...profile.organization,
            name: data.name,
          }

          emitWorkspaceUpdated({
            id: data.id,
            name: data.name,
          })
        }
      } catch {
        failures.push({
          area: "workspace",
          message:
            "You don't have permission to rename this workspace, or the change was not saved.",
        })
      }
    }

    setProfile({
      user: nextUser,
      organization:
        nextOrganization,
      role: profile.role,
    })

    const workspaceFailed =
      failures.some(
        (failure) =>
          failure.area ===
          "workspace",
      )

    if (workspaceFailed) {
      setNameDraft(savedName)
    } else {
      setNameDraft(
        nextOrganization.name,
      )
    }

    setSaving(false)

    if (failures.length > 0) {
      const failureMessages =
        failures.map(
          (failure) =>
            failure.message,
        )

      setAlert({
        type: "error",
        message:
          failureMessages.join(" "),
      })

      setMode("edit")
      return
    }

    setMode("view")

    setAlert({
      type: "success",
      message: "Your profile was updated.",
    })
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-background">
        <Sidebar />

        <div className="min-h-screen lg:ml-[260px]">
          <ProfileSkeleton />
        </div>
      </main>
    )
  }

  if (
    status === "error" ||
    !profile
  ) {
    return (
      <main className="min-h-screen bg-background">
        <Sidebar />

        <div className="min-h-screen lg:ml-[260px]">
          <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-8 sm:px-6">
            <div className="w-full rounded-2xl border border-border bg-foreground p-6">
              <h1 className="text-lg font-semibold text-text">
                We could not load your profile
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                {error ||
                  "Something went wrong while loading your profile."}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const editable =
    mode === "edit"

  return (
    <main className="min-h-screen bg-background">
      <Sidebar
        organizationName={
          profile.organization.name
        }
      />

      <div className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Manage your profile and
                workspace details.
              </p>
            </div>

            <HeaderActions
              mode={mode}
              dirty={dirty}
              saving={saving}
              onEdit={() => {
                setMode("edit")
                setAlert(null)
              }}
              onCancel={handleCancel}
              onSave={() =>
                void saveChanges()
              }
            />
          </header>

          <div
            aria-live="polite"
            className="mt-5"
          >
            {alert ? (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  alert.type ===
                  "success"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-red-300 bg-red-50 text-red-700"
                }`}
              >
                {alert.message}
              </div>
            ) : null}
          </div>

          {discardOpen ? (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-text">
                Discard your changes?
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDiscardOpen(false)
                  }
                  className="min-h-10 rounded-xl border border-border px-3 text-sm font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Keep editing
                </button>

                <button
                  type="button"
                  onClick={discardChanges}
                  className="min-h-10 rounded-xl bg-primary px-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-8 space-y-8">
            <ProfilePreview
              user={profile.user}
              organization={
                profile.organization
              }
              role={profile.role}
              editable={editable}
              pendingPhoto={
                pendingPhoto
              }
              removePhoto={
                removePhoto
              }
              onPhotoStage={
                handlePhotoStage
              }
              onRemovePhoto={
                handleRemovePhoto
              }
              onRestorePhoto={
                handleRestorePhoto
              }
            />

            <WorkspaceCard
              organization={
                profile.organization
              }
              role={profile.role}
              editable={editable}
              nameDraft={nameDraft}
              nameError={
                editable &&
                canRename &&
                nameDraft.trim() !==
                  profile.organization.name.trim()
                  ? validateOrganizationName(
                      nameDraft,
                    )
                  : ""
              }
              onNameDraftChange={
                setNameDraft
              }
            />

            <PersonalDetailsCard
              user={profile.user}
            />

            <DataPrivacySection
              user={profile.user}
              organization={
                profile.organization
              }
              routes={routes}
              vehicles={vehicles}
            />
          </div>
        </div>
      </div>
    </main>
  )
}