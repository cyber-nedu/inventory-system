"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server"

export async function deleteWorkspace(formData: FormData) {
  const workspaceId = formData.get("workspaceId")

  if (typeof workspaceId !== "string" || !workspaceId) {
    throw new Error("Invalid organization.")
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Your session has expired. Please sign in again.")
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)
    .eq("owner_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  redirect("/workspace")
}