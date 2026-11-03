"use client"

import {
  CalendarDays,
  Clock3,
  MapPin,
  Route as RouteIcon,
  Truck,
  X,
} from "lucide-react"
import type { DashboardRoute, DashboardVehicle } from "../dashboard-data"

type RouteDetailsProps = {
  route: DashboardRoute | null
  vehicles: DashboardVehicle[]
  onClose: () => void
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default function RouteDetails({
  route,
  vehicles,
  onClose,
}: RouteDetailsProps) {
  if (!route) return null

  const assignedVehicles = route.assignedVehicleIds
    .map((id) => vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is DashboardVehicle => Boolean(vehicle))

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
        aria-labelledby="route-details-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-border bg-foreground shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Route information
            </p>

            <h2
              id="route-details-title"
              className="mt-1 text-lg font-semibold text-text"
            >
              {route.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close route details"
            className="flex h-9 w-9 items-center justify-center text-muted hover:bg-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-muted">Route status</p>

              <span
                className={`text-xs font-semibold ${
                  route.status === "Active" ? "text-primary" : "text-muted"
                }`}
              >
                {route.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
              <div className="relative pl-7">
                <span className="absolute left-1 top-1 h-3 w-3 rounded-full border-2 border-primary bg-foreground" />

                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Starting point
                </p>

                <p className="mt-1 text-sm font-semibold text-text">
                  {route.origin}
                </p>

                <div className="absolute bottom-[-23px] left-[10px] top-5 border-l border-dashed border-border" />

                <div className="mt-7">
                  <span className="absolute left-1 mt-0.5 h-3 w-3 bg-primary" />

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Destination
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text">
                    {route.destination}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center text-primary">
                <RouteIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="border border-border p-4">
              <div className="flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Distance</span>
              </div>

              <p className="mt-2 text-lg font-semibold text-text">
                {route.distance.toLocaleString()} km
              </p>
            </div>

            <div className="border border-border p-4">
              <div className="flex items-center gap-2 text-muted">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs">Estimated duration</span>
              </div>

              <p className="mt-2 text-lg font-semibold text-text">
                {route.estimatedDuration}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted" />

                <h3 className="text-sm font-semibold text-text">
                  Assigned vehicles
                </h3>
              </div>

              <span className="text-xs text-muted">
                {assignedVehicles.length}{" "}
                {assignedVehicles.length === 1 ? "vehicle" : "vehicles"}
              </span>
            </div>

            {assignedVehicles.length === 0 ? (
              <p className="mt-3 border border-dashed border-border px-4 py-5 text-center text-xs text-muted">
                No vehicles have been assigned to this route.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-border border border-border">
                {assignedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
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
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div>
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays className="h-3.5 w-3.5" />
                <p className="text-[10px] uppercase tracking-wide">
                  Created
                </p>
              </div>

              <p className="mt-1 text-xs font-medium text-text">
                {formatDate(route.createdAt)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays className="h-3.5 w-3.5" />
                <p className="text-[10px] uppercase tracking-wide">
                  Last updated
                </p>
              </div>

              <p className="mt-1 text-xs font-medium text-text">
                {formatDate(route.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 w-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}