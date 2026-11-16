"use client"

import {
  Plus,
  Search,
  SlidersHorizontal,
  Truck,
} from "lucide-react"

type VehicleHeaderProps = {
  vehicleCount: number
  onAddVehicle: () => void
}

export default function VehicleHeader({
  vehicleCount,
  onAddVehicle,
}: VehicleHeaderProps) {
  return (
    <header className="relative overflow-hidden border border-border bg-foreground shadow-[0_14px_40px_-30px_rgba(15,23,42,0.4)]">
      <div className="absolute right-0 top-0 h-full w-[35%] bg-[radial-gradient(circle_at_right_top,rgba(1,78,141,0.1),transparent_65%)]" />

      <div className="relative flex flex-col gap-6 px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center bg-primary-light text-primary-dark">
                <Truck
                  className="h-3.5 w-3.5"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Fleet management
              </p>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Vehicles
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Manage your fleet, monitor vehicle status, and keep your
              transportation operations organized.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddVehicle}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(1,78,141,0.8)] transition-all duration-200 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-5"
          >
            <Plus
              className="h-4 w-4"
              strokeWidth={2}
              aria-hidden="true"
            />
            Add vehicle
          </button>
        </div>

        <div className="grid grid-cols-2 border border-border bg-background sm:grid-cols-4">
          <div className="border-r border-border px-4 py-3 sm:px-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Fleet size
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-text">
              {vehicleCount}
            </p>
          </div>

          <div className="border-r border-border px-4 py-3 sm:px-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Available
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-emerald-700">
              31
            </p>
          </div>

          <div className="border-r-0 px-4 py-3 sm:border-r sm:px-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Assigned
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-primary">
              06
            </p>
          </div>

          <div className="col-span-2 border-t border-border px-4 py-3 sm:col-span-1 sm:border-t-0 sm:px-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Maintenance
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-amber-700">
              05
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Search
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            <span>
              Search, filter, and manage your vehicle inventory
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            <SlidersHorizontal
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Fleet controls
          </div>
        </div>
      </div>
    </header>
  )
}