"use client"

import { useState } from "react"
import { LoaderCircle, Trash2, X } from "lucide-react"
import { useFormStatus } from "react-dom"
import { deleteWorkspace } from "./action"

type DeleteWorkspaceBtnProps = {
  workspaceId: string
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-10 w-full items-center justify-center gap-2 bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete organization
        </>
      )}
    </button>
  )
}

export default function DeleteWorkspaceBtn({
  workspaceId,
}: DeleteWorkspaceBtnProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-foreground p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center text-muted transition-colors duration-200 hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-semibold tracking-tight text-text">
                Delete organization?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Are you sure you want to delete this organization? This action
                cannot be undone.
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-10 border border-border px-5 text-sm font-medium text-text transition-colors duration-200 hover:bg-secondary"
              >
                Cancel
              </button>

              <form action={deleteWorkspace}>
                <input
                  type="hidden"
                  name="workspaceId"
                  value={workspaceId}
                />

                <DeleteButton />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}