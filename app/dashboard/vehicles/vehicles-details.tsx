"use client"

import {
  CalendarDays,
  CheckCircle2,
  Pencil,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react"
import { DashboardVehicle } from "../dashboard-data"

type VehiclesDetailsProps = {
  open: boolean
  vehicle: DashboardVehicle | null
  onClose: () => void
  onEdit: () => void
}

function getStatusStyle(status: DashboardVehicle["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700"

    case "Assigned":
      return "bg-blue-50 text-blue-700"

    case "Maintenance":
      return "bg-amber-50 text-amber-700"
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available"
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function VehiclesDetails({
  open,
  vehicle,
  onClose,
  onEdit,
}: VehiclesDetailsProps) {
  if (!open || !vehicle) {
    return null
  }

  const statusIcon =
    vehicle.status === "Available"
      ? CheckCircle2
      : vehicle.status === "Assigned"
        ? Truck
        : Wrench

  const StatusIcon = statusIcon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-lg border border-border bg-foreground shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center bg-primary-light text-primary">
              <Truck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-text">
                {vehicle.make} {vehicle.model}
              </h2>

              <p className="mt-1 text-xs text-muted">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-muted hover:bg-secondary hover:text-text"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Current status
            </p>

            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${getStatusStyle(vehicle.status)}`}
              >
                <StatusIcon className="h-4 w-4" />
                {vehicle.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border p-4">
              <div className="flex items-center gap-2 text-muted">
                <Truck className="h-4 w-4" />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Vehicle type
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-text">
                {vehicle.type}
              </p>
            </div>

            <div className="border border-border p-4">
              <div className="flex items-center gap-2 text-muted">
                <Users className="h-4 w-4" />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Capacity
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-text">
                {vehicle.passengerCapacity} passengers
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays className="h-4 w-4" />

                <span className="text-xs">
                  Date added
                </span>
              </div>

              <span className="text-xs font-medium text-text">
                {formatDate(vehicle.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays className="h-4 w-4" />

                <span className="text-xs">
                  Last updated
                </span>
              </div>

              <span className="text-xs font-medium text-text">
                {formatDate(vehicle.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border bg-background p-5 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 border border-border px-5 text-xs font-semibold text-text hover:bg-secondary"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit vehicle
          </button>
        </div>
      </div>
    </div>
  )
}