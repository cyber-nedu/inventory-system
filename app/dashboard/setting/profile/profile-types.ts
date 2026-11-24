import type { User } from "@supabase/supabase-js"

export type ProfileWorkspace = {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export type ProfileRole =
  | "owner"
  | "admin"
  | "manager"
  | "staff"

export type ProfileMode =
  | "view"
  | "edit"

export type PendingPhoto = {
  blob: Blob
  contentType: string
  previewUrl: string
}

export type ProfileData = {
  user: User
  organization: ProfileWorkspace
  role: ProfileRole
}

export type ProfileAlert = {
  type: "success" | "error"
  message: string
}