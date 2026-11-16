"use client"

import { useEffect, useRef } from "react"
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
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!route) return

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
  }, [route, onClose])

  if (!route) return null

  const assignedVehicles = route.assignedVehicleIds
    .map((id) => vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is DashboardVehicle => Boolean(vehicle))

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
        aria-labelledby="route-details-title"
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-border bg-foreground shadow-2xl outline-none motion-safe:animate-[route-dialog-in_180ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/8 text-primary">
                <RouteIcon
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Route information
              </p>
            </div>

            <h2
              id="route-details-title"
              className="mt-3 truncate text-lg font-semibold tracking-tight text-text"
            >
              {route.name}
            </h2>

            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-semibold ${
                  route.status === "Active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-border bg-secondary text-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    route.status === "Active"
                      ? "bg-emerald-600"
                      : "bg-muted"
                  }`}
                  aria-hidden="true"
                />

                {route.status}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close route details"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="border border-border bg-background p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Route path
                </p>

                <p className="mt-1 text-xs text-muted">
                  Starting point to destination
                </p>
              </div>

              <RouteIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </div>

            <div className="grid grid-cols-[20px_1fr] gap-x-4">
              <div className="relative flex flex-col items-center">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-foreground" />

                <span className="my-1 w-px flex-1 border-l border-dashed border-primary/30" />

                <span className="h-3 w-3 shrink-0 bg-primary" />
              </div>

              <div className="flex min-h-32 flex-col justify-between gap-7">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Starting point
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text">
                    {route.origin}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Destination
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text">
                    {route.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border border-border bg-foreground p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted">
                <MapPin
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Distance
                </span>
              </div>

              <p className="mt-3 text-xl font-bold tracking-tight text-text">
                {route.distance.toLocaleString()}{" "}
                <span className="text-xs font-medium text-muted">km</span>
              </p>
            </div>

            <div className="border border-border bg-foreground p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted">
                <Clock3
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Duration
                </span>
              </div>

              <p className="mt-3 truncate text-xl font-bold tracking-tight text-text">
                {route.estimatedDuration}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Truck
                    className="h-4 w-4 text-muted"
                    aria-hidden="true"
                  />

                  <h3 className="text-sm font-semibold text-text">
                    Assigned vehicles
                  </h3>
                </div>

                <p className="mt-1 text-xs text-muted">
                  Vehicles operating on this route.
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-primary">
                {assignedVehicles.length}{" "}
                {assignedVehicles.length === 1 ? "vehicle" : "vehicles"}
              </span>
            </div>

            {assignedVehicles.length === 0 ? (
              <p className="mt-4 border border-dashed border-border bg-background px-4 py-6 text-center text-xs text-muted">
                No vehicles have been assigned to this route.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-border border border-border">
                {assignedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-background/70"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-secondary text-muted">
                        <Truck
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-text">
                          {vehicle.registrationNumber}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-muted">
                          {vehicle.make} {vehicle.model} · {vehicle.type}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 border px-2 py-1 text-[10px] font-semibold ${
                        vehicle.status === "Available"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-border bg-secondary text-muted"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
            <div>
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                <p className="text-[10px] font-semibold uppercase tracking-wide">
                  Created
                </p>
              </div>

              <p className="mt-2 text-xs font-medium text-text">
                {formatDate(route.createdAt)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                <p className="text-[10px] font-semibold uppercase tracking-wide">
                  Last updated
                </p>
              </div>

              <p className="mt-2 text-xs font-medium text-text">
                {formatDate(route.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background/50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 w-full bg-primary px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Close
          </button>
        </div>
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