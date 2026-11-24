"use client"

import {
  CalendarDays,
  Camera,
  Mail,
  Trash2,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import {
  ChangeEvent,
  useRef,
  useState,
} from "react"
import AvatarCard from "./avatar-card"
import type {
  PendingPhoto,
  ProfileRole,
  ProfileWorkspace,
} from "./profile-types"
import {
  getAvatarUrl,
  getRoleLabel,
} from "./profile-utils"

const MAX_FILE_SIZE =
  5 * 1024 * 1024

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

function validateImageFile(
  file: File,
): string | null {
  if (
    !ACCEPTED_TYPES.includes(
      file.type,
    )
  ) {
    return "Choose a JPG, PNG, or WebP image."
  }

  if (file.size > MAX_FILE_SIZE) {
    return "The image must be 5 MB or smaller."
  }

  return null
}

function formatJoinedDate(
  date: string,
): string {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date))
}

export default function ProfilePreview({
  user,
  organization,
  role,
  editable,
  pendingPhoto,
  removePhoto,
  onPhotoStage,
  onRemovePhoto,
  onRestorePhoto,
}: {
  user: User
  organization: ProfileWorkspace
  role: ProfileRole
  editable: boolean
  pendingPhoto: PendingPhoto | null
  removePhoto: boolean
  onPhotoStage: (
    photo: PendingPhoto,
  ) => void
  onRemovePhoto: () => void
  onRestorePhoto: () => void
}) {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const [fileError, setFileError] =
    useState("")

  const existingPhotoUrl =
    getAvatarUrl(user)

  const previewUrl =
    pendingPhoto?.previewUrl ??
    (!removePhoto
      ? existingPhotoUrl
      : null)

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }

    const validationError =
      validateImageFile(file)

    if (validationError) {
      setFileError(
        validationError,
      )
      return
    }

    setFileError("")

    const previewUrl =
      URL.createObjectURL(file)

    onPhotoStage({
      blob: file,
      contentType: file.type,
      previewUrl,
    })
  }

  const handleChoosePhoto = () => {
    if (!editable) {
      return
    }

    setFileError("")
    inputRef.current?.click()
  }

  const handleRemove = () => {
    setFileError("")
    onRemovePhoto()
  }

  const handleRestore = () => {
    setFileError("")
    onRestorePhoto()
  }

  const roleLabel =
    getRoleLabel(role)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-foreground">
      <div className="relative h-32 overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-light sm:h-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize:
              "22px 22px",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -right-8 top-5 h-36 w-36 rotate-12 rounded-3xl border border-white/20 bg-white/10"
        />

        <div
          aria-hidden="true"
          className="absolute right-24 -top-10 h-32 w-32 -rotate-12 rounded-3xl border border-white/15 bg-white/5"
        />

        <div
          aria-hidden="true"
          className="absolute right-52 top-12 h-20 w-20 rotate-45 rounded-2xl border border-white/10 bg-white/5"
        />
      </div>

      <div className="px-5 pb-6 sm:px-6">
        <div className="relative -mt-14 flex flex-col items-start sm:-mt-16">
          <div className="relative h-28 w-28">
            {editable ? (
              <button
                type="button"
                onClick={
                  handleChoosePhoto
                }
                aria-label="Change profile photo"
                className="group relative block h-28 w-28 overflow-hidden rounded-full ring-4 ring-foreground shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-foreground"
              >
                <AvatarCard
                  user={user}
                  previewUrl={
                    previewUrl
                  }
                />

                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex flex-col items-center gap-1 text-xs font-semibold text-white">
                    <Camera
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    Change
                  </span>
                </span>
              </button>
            ) : (
              <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-foreground shadow-lg">
                <AvatarCard
                  user={user}
                  previewUrl={
                    previewUrl
                  }
                />
              </div>
            )}

            {editable ? (
              <button
                type="button"
                onClick={
                  handleChoosePhoto
                }
                aria-label="Change profile photo"
                className="absolute bottom-1 right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-primary text-white shadow-md transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Camera
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            ) : null}

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              className="sr-only"
              tabIndex={-1}
            />
          </div>

          <div className="mt-4 min-w-0 max-w-full">
            <h2 className="truncate text-xl font-semibold text-text sm:text-2xl">
              {user.user_metadata
                ?.full_name ||
                user.user_metadata
                  ?.name ||
                "Your profile"}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {roleLabel} at{" "}
              {organization.name}
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <Mail
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                <span className="truncate">
                  {user.email ??
                    "No email address"}
                </span>
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Joined{" "}
                {formatJoinedDate(
                  user.created_at,
                )}
              </span>
            </div>
          </div>

          {editable &&
          (previewUrl ||
            pendingPhoto) ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={
                  removePhoto
                    ? handleRestore
                    : handleRemove
                }
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {removePhoto ? (
                  "Restore photo"
                ) : (
                  <>
                    <Trash2
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Remove photo
                  </>
                )}
              </button>
            </div>
          ) : null}

          {editable &&
          pendingPhoto ? (
            <p className="mt-2 text-sm text-muted">
              New photo selected. Save changes
              to apply it.
            </p>
          ) : null}

          {editable && fileError ? (
            <p
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {fileError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}