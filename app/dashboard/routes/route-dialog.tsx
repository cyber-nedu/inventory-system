"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Check, CircleCheck, X } from "lucide-react"
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
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return

    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="route-dialog-title"
        tabIndex={-1}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col border border-border bg-foreground shadow-2xl outline-none motion-safe:animate-[route-dialog-in_180ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-primary/8 text-primary">
                <Check
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Route configuration
              </p>
            </div>

            <h2
              id="route-dialog-title"
              className="mt-3 text-lg font-semibold tracking-tight text-text"
            >
              {route ? "Edit route" : "Add a route"}
            </h2>

            <p className="mt-1 max-w-lg text-xs leading-5 text-muted">
              {route
                ? "Update the details and vehicle assignments for this route."
                : "Enter the route details and assign vehicles if available."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text">
                    Route details
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    Define the core information used to identify this route.
                  </p>
                </div>

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
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="e.g. Lagos Mainland to Lekki"
                      className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                      className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                      className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                      className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="route-duration"
                      className="mb-2 block text-xs font-semibold text-text"
                    >
                      Estimated duration{" "}
                      <span className="text-primary">*</span>
                    </label>

                    <input
                      id="route-duration"
                      value={form.estimatedDuration}
                      onChange={(event) =>
                        updateField("estimatedDuration", event.target.value)
                      }
                      placeholder="e.g. 45 minutes"
                      className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text">
                    Route status
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    Choose whether this route is currently available for
                    operations.
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 border border-border bg-background p-1"
                  role="radiogroup"
                  aria-label="Route status"
                >
                  <label
                    className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 text-xs font-semibold transition-all duration-200 ${
                      form.status === "Active"
                        ? "bg-foreground text-primary shadow-sm"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    <input
                      type="radio"
                      name="route-status"
                      value="Active"
                      checked={form.status === "Active"}
                      onChange={() => updateField("status", "Active")}
                      className="sr-only"
                    />

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        form.status === "Active"
                          ? "bg-emerald-600"
                          : "bg-muted"
                      }`}
                      aria-hidden="true"
                    />

                    Active
                  </label>

                  <label
                    className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 text-xs font-semibold transition-all duration-200 ${
                      form.status === "Inactive"
                        ? "bg-foreground text-text shadow-sm"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    <input
                      type="radio"
                      name="route-status"
                      value="Inactive"
                      checked={form.status === "Inactive"}
                      onChange={() => updateField("status", "Inactive")}
                      className="sr-only"
                    />

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        form.status === "Inactive" ? "bg-muted" : "bg-border"
                      }`}
                      aria-hidden="true"
                    />

                    Inactive
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-text">
                      Assign vehicles
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Select the vehicles that operate on this route.
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-primary">
                    {form.assignedVehicleIds.length} selected
                  </span>
                </div>

                {vehicles.length === 0 ? (
                  <div className="mt-4 border border-dashed border-border bg-background px-4 py-6 text-center">
                    <p className="text-xs font-semibold text-text">
                      No vehicles available
                    </p>

                    <p className="mt-1 max-w-sm mx-auto text-xs leading-5 text-muted">
                      Add vehicles from the Vehicles page before assigning them
                      to routes.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {vehicles.map((vehicle) => {
                      const selected = form.assignedVehicleIds.includes(
                        vehicle.id,
                      )

                      return (
                        <label
                          key={vehicle.id}
                          className={`relative flex cursor-pointer items-center gap-3 border p-3 transition-all duration-200 ${
                            selected
                              ? "border-primary/30 bg-primary/5 shadow-sm"
                              : "border-border bg-background hover:border-primary/20 hover:bg-secondary/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleVehicle(vehicle.id)}
                            className="sr-only"
                          />

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                              selected
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-foreground"
                            }`}
                            aria-hidden="true"
                          >
                            {selected ? (
                              <Check className="h-3 w-3" />
                            ) : null}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-text">
                              {vehicle.registrationNumber}
                            </p>

                            <p className="mt-1 truncate text-[11px] text-muted">
                              {vehicle.make} {vehicle.model} · {vehicle.type}
                            </p>
                          </div>

                          <span className="shrink-0 text-[10px] text-muted">
                            {vehicle.status}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />

                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-border bg-foreground px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 border border-border px-5 text-sm font-medium text-text transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground active:translate-y-px"
            >
              <CircleCheck
                className="h-4 w-4"
                aria-hidden="true"
              />
              {route ? "Save changes" : "Create route"}
            </button>
          </div>
        </form>
      </section>

      <style jsx global>{`
        @keyframes route-dialog-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes route-dialog-in {
            from {
              opacity: 1;
              transform: none;
            }

            to {
              opacity: 1;
              transform: none;
            }
          }
        }
      `}</style>
    </div>
  )
}