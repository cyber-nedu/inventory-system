"use client"

import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Pencil,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react"
import type { DashboardVehicle } from "../dashboard-data"

type VehicleDetailsProps = {
  vehicle: DashboardVehicle | null
  onClose: () => void
  onEdit: (vehicle: DashboardVehicle) => void
}

function getStatusStyle(status: DashboardVehicle["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700"

    case "Assigned":
      return "bg-primary-light text-primary-dark"

    case "Maintenance":
      return "bg-amber-50 text-amber-700"
  }
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Not available"
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default function VehicleDetails({
  vehicle,
  onClose,
  onEdit,
}: VehicleDetailsProps) {
  if (!vehicle) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/35 p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Close vehicle details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-details-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-foreground shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
              <Truck
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Vehicle details
              </p>

              <h2
                id="vehicle-details-title"
                className="mt-1 truncate text-lg font-bold tracking-tight text-text"
              >
                {vehicle.make} {vehicle.model}
              </h2>

              <p className="mt-1 font-mono text-[10px] text-muted">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                  Current status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(vehicle.status)}`}
                  >
                    {vehicle.status === "Available" && (
                      <CheckCircle2
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    )}

                    {vehicle.status === "Assigned" && (
                      <Truck
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    )}

                    {vehicle.status === "Maintenance" && (
                      <Wrench
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    )}

                    {vehicle.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-border bg-foreground px-4 text-xs font-semibold text-text transition-colors hover:bg-secondary"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit vehicle
              </button>
            </div>

            <div className="mt-5 grid border border-border sm:grid-cols-2">
              <div className="border-b border-border p-5 sm:border-r">
                <div className="flex items-center gap-2">
                  <Truck
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Vehicle type
                  </p>
                </div>

                <p className="mt-3 text-base font-bold text-text">
                  {vehicle.type}
                </p>
              </div>

              <div className="border-b border-border p-5 sm:border-b-0">
                <div className="flex items-center gap-2">
                  <Users
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Passenger capacity
                  </p>
                </div>

                <p className="mt-3 text-base font-bold text-text">
                  {vehicle.passengerCapacity}
                  <span className="ml-1 text-xs font-medium text-muted">
                    passengers
                  </span>
                </p>
              </div>

              <div className="border-b border-border p-5 sm:border-r sm:border-b-0">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Added
                  </p>
                </div>

                <p className="mt-3 text-sm font-bold text-text">
                  {formatDate(vehicle.createdAt)}
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <CircleAlert
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Last updated
                  </p>
                </div>

                <p className="mt-3 text-sm font-bold text-text">
                  {formatDate(vehicle.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 border border-border">
              <div className="border-b border-border px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                  Vehicle information
                </p>
              </div>

              <div className="divide-y divide-border">
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs text-muted">
                    Make
                  </span>

                  <span className="text-xs font-semibold text-text">
                    {vehicle.make}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs text-muted">
                    Model
                  </span>

                  <span className="text-xs font-semibold text-text">
                    {vehicle.model}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs text-muted">
                    Registration
                  </span>

                  <span className="font-mono text-xs font-semibold text-text">
                    {vehicle.registrationNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs text-muted">
                    Vehicle ID
                  </span>

                  <span className="max-w-[55%] truncate font-mono text-[10px] font-medium text-muted">
                    {vehicle.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border bg-background px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 border border-border bg-foreground px-4 text-xs font-semibold text-text transition-colors hover:bg-secondary"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}