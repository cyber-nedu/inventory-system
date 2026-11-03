"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import type {
  DashboardRoute,
  DashboardVehicle,
  RouteStatus,
} from "../dashboard-data"

type RouteDialogProps = {
  open: boolean
  route: DashboardRoute | null
  vehicles: DashboardVehicle[]
  onClose: () => void
  onSave: (route: DashboardRoute) => void
}

type RouteFormData = {
  name: string
  origin: string
  destination: string
  distance: string
  estimatedDuration: string
  status: RouteStatus
  assignedVehicleIds: string[]
}

const emptyForm: RouteFormData = {
  name: "",
  origin: "",
  destination: "",
  distance: "",
  estimatedDuration: "",
  status: "Active",
  assignedVehicleIds: [],
}

export default function RouteDialog({
  open,
  route,
  vehicles,
  onClose,
  onSave,
}: RouteDialogProps) {
  const [form, setForm] = useState<RouteFormData>(() =>
    route
      ? {
          name: route.name,
          origin: route.origin,
          destination: route.destination,
          distance: String(route.distance),
          estimatedDuration: route.estimatedDuration,
          status: route.status,
          assignedVehicleIds: [...route.assignedVehicleIds],
        }
      : emptyForm,
  )

  const [error, setError] = useState("")

  if (!open) return null

  const updateField = <K extends keyof RouteFormData>(
    field: K,
    value: RouteFormData[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const toggleVehicle = (vehicleId: string) => {
    setForm((current) => ({
      ...current,
      assignedVehicleIds: current.assignedVehicleIds.includes(vehicleId)
        ? current.assignedVehicleIds.filter((id) => id !== vehicleId)
        : [...current.assignedVehicleIds, vehicleId],
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const distance = Number(form.distance)

    if (
      !form.name.trim() ||
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.distance.trim() ||
      !form.estimatedDuration.trim()
    ) {
      setError("Please complete all required fields.")
      return
    }

    if (!Number.isFinite(distance) || distance <= 0) {
      setError("Enter a valid distance greater than zero.")
      return
    }

    const now = new Date().toISOString()

    onSave({
      id: route?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      distance,
      estimatedDuration: form.estimatedDuration.trim(),
      status: form.status,
      assignedVehicleIds: form.assignedVehicleIds,
      createdAt: route?.createdAt ?? now,
      updatedAt: now,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="route-dialog-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col border border-border bg-foreground shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2
              id="route-dialog-title"
              className="text-lg font-semibold text-text"
            >
              {route ? "Edit route" : "Add a route"}
            </h2>

            <p className="mt-1 text-xs text-muted">
              {route
                ? "Update the details and vehicle assignments for this route."
                : "Enter the route details and assign vehicles if available."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center text-muted hover:bg-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="route-name"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Route name <span className="text-primary">*</span>
                </label>

                <input
                  id="route-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Lagos Mainland to Lekki"
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="route-origin"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Starting location <span className="text-primary">*</span>
                </label>

                <input
                  id="route-origin"
                  value={form.origin}
                  onChange={(event) =>
                    updateField("origin", event.target.value)
                  }
                  placeholder="e.g. Ikeja"
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="route-destination"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Destination <span className="text-primary">*</span>
                </label>

                <input
                  id="route-destination"
                  value={form.destination}
                  onChange={(event) =>
                    updateField("destination", event.target.value)
                  }
                  placeholder="e.g. Lekki"
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="route-distance"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Distance (km) <span className="text-primary">*</span>
                </label>

                <input
                  id="route-distance"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.distance}
                  onChange={(event) =>
                    updateField("distance", event.target.value)
                  }
                  placeholder="e.g. 18.5"
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="route-duration"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Estimated duration <span className="text-primary">*</span>
                </label>

                <input
                  id="route-duration"
                  value={form.estimatedDuration}
                  onChange={(event) =>
                    updateField("estimatedDuration", event.target.value)
                  }
                  placeholder="e.g. 45 minutes"
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="route-status"
                  className="mb-2 block text-xs font-semibold text-text"
                >
                  Route status
                </label>

                <select
                  id="route-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as RouteStatus)
                  }
                  className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none focus:border-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-text">
                    Assign vehicles
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    Select the vehicles that operate on this route.
                  </p>
                </div>

                <span className="shrink-0 text-xs font-medium text-primary">
                  {form.assignedVehicleIds.length} selected
                </span>
              </div>

              {vehicles.length === 0 ? (
                <div className="mt-4 border border-dashed border-border bg-background px-4 py-5 text-center">
                  <p className="text-xs font-medium text-text">
                    No vehicles available
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Add vehicles from the Vehicles page before assigning them
                    to routes.
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-48 divide-y divide-border overflow-y-auto border border-border">
                  {vehicles.map((vehicle) => {
                    const selected = form.assignedVehicleIds.includes(
                      vehicle.id,
                    )

                    return (
                      <label
                        key={vehicle.id}
                        className="flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors hover:bg-background"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleVehicle(vehicle.id)}
                          className="h-4 w-4 accent-primary"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-text">
                            {vehicle.registrationNumber}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-muted">
                            {vehicle.make} {vehicle.model} · {vehicle.type}
                          </p>
                        </div>

                        <span className="text-[10px] text-muted">
                          {vehicle.status}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 border border-border bg-background px-3 py-2 text-xs text-primary">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 border border-border px-5 text-sm font-medium text-text transition-colors hover:bg-background"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Check className="h-4 w-4" />
              {route ? "Save changes" : "Create route"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}