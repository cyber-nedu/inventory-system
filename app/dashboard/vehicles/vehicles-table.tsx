"use client"

import { useMemo, useState } from "react"
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Truck,
} from "lucide-react"
import type { DashboardVehicle } from "../dashboard-data"

type VehiclesTableProps = {
  vehicles: DashboardVehicle[]
  onView: (vehicle: DashboardVehicle) => void
  onEdit: (vehicle: DashboardVehicle) => void
  onDelete: (vehicleId: string) => void
}

type VehicleFilter =
  | "All"
  | "Available"
  | "Assigned"
  | "Maintenance"

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

function getStatusDot(status: DashboardVehicle["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-600"

    case "Assigned":
      return "bg-primary"

    case "Maintenance":
      return "bg-amber-500"
  }
}

export default function VehiclesTable({
  vehicles,
  onView,
  onEdit,
  onDelete,
}: VehiclesTableProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<VehicleFilter>("All")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const counts = useMemo(
    () => ({
      All: vehicles.length,
      Available: vehicles.filter(
        (vehicle) => vehicle.status === "Available",
      ).length,
      Assigned: vehicles.filter(
        (vehicle) => vehicle.status === "Assigned",
      ).length,
      Maintenance: vehicles.filter(
        (vehicle) => vehicle.status === "Maintenance",
      ).length,
    }),
    [vehicles],
  )

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !searchValue ||
        vehicle.make.toLowerCase().includes(searchValue) ||
        vehicle.model.toLowerCase().includes(searchValue) ||
        vehicle.registrationNumber
          .toLowerCase()
          .includes(searchValue) ||
        vehicle.type.toLowerCase().includes(searchValue)

      const matchesFilter =
        filter === "All" || vehicle.status === filter

      return matchesSearch && matchesFilter
    })
  }, [vehicles, search, filter])

  const filters: VehicleFilter[] = [
    "All",
    "Available",
    "Assigned",
    "Maintenance",
  ]

  return (
    <section className="border border-border bg-foreground shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)]">
      <div className="border-b border-border">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:px-7 lg:py-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Truck
                  className="h-4 w-4 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Vehicle inventory
                </p>
              </div>

              <h2 className="mt-1.5 text-lg font-bold tracking-tight text-text">
                All vehicles
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted">
                Search, filter, inspect, and manage your fleet.
              </p>
            </div>

            <div className="border border-border bg-background px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Showing
              </p>

              <p className="mt-0.5 text-xs font-bold text-text">
                {filteredVehicles.length} of {vehicles.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by vehicle, registration, or type..."
                aria-label="Search vehicles"
                className="h-11 w-full border border-border bg-background pl-10 pr-4 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div
              className="flex max-w-full overflow-x-auto border-b border-border"
              role="tablist"
              aria-label="Vehicle status filters"
            >
              {filters.map((item) => {
                const active = filter === item

                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item)}
                    className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-text"
                    }`}
                  >
                    {item}

                    <span
                      className={`min-w-5 px-1 text-center text-[9px] ${
                        active
                          ? "bg-primary-light text-primary-dark"
                          : "bg-secondary text-muted"
                      }`}
                    >
                      {counts[item]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-secondary text-muted">
            <Truck className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-bold text-text">
            No vehicles found
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-6 text-muted">
            No vehicles match your current search or status filter.
          </p>

          {search || filter !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setFilter("All")
              }}
              className="mt-4 min-h-10 border border-border px-4 text-xs font-semibold text-text transition-colors hover:bg-secondary"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted lg:px-6">
                    Vehicle
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Registration
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Type
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Capacity
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-muted lg:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-background"
                  >
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-muted">
                          <Truck
                            className="h-5 w-5"
                            strokeWidth={1.7}
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-text">
                            {vehicle.make} {vehicle.model}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-muted">
                            ID · {vehicle.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-text">
                        {vehicle.registrationNumber}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-muted">
                        {vehicle.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-text">
                        {vehicle.passengerCapacity}
                      </span>

                      <span className="ml-1 text-[10px] text-muted">
                        passengers
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(vehicle.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 ${getStatusDot(vehicle.status)}`}
                        />

                        {vehicle.status}
                      </span>
                    </td>

                    <td className="relative px-5 py-4 text-right lg:px-6">
                      <button
                        type="button"
                        aria-label={`Actions for ${vehicle.registrationNumber}`}
                        aria-expanded={openMenu === vehicle.id}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === vehicle.id
                              ? null
                              : vehicle.id,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {openMenu === vehicle.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close vehicle actions"
                            onClick={() => setOpenMenu(null)}
                            className="fixed inset-0 z-10 cursor-default"
                          />

                          <div className="absolute right-6 top-12 z-20 w-44 border border-border bg-foreground py-1 text-left shadow-[0_15px_40px_-15px_rgba(15,23,42,0.35)]">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null)
                                onView(vehicle)
                              }}
                              className="flex min-h-10 w-full items-center gap-2 px-3 text-xs font-medium text-text hover:bg-background"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View details
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null)
                                onEdit(vehicle)
                              }}
                              className="flex min-h-10 w-full items-center gap-2 px-3 text-xs font-medium text-text hover:bg-background"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit vehicle
                            </button>

                            <div className="my-1 border-t border-border" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null)
                                onDelete(vehicle.id)
                              }}
                              className="flex min-h-10 w-full items-center gap-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete vehicle
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border md:hidden">
            {filteredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="p-4 transition-colors hover:bg-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-muted">
                      <Truck className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-text">
                        {vehicle.make} {vehicle.model}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-muted">
                        {vehicle.registrationNumber}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(vehicle.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 ${getStatusDot(vehicle.status)}`}
                    />

                    {vehicle.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 border-y border-border">
                  <div className="border-r border-border px-3 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                      Type
                    </p>

                    <p className="mt-1 text-xs font-semibold text-text">
                      {vehicle.type}
                    </p>
                  </div>

                  <div className="px-3 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                      Capacity
                    </p>

                    <p className="mt-1 text-xs font-semibold text-text">
                      {vehicle.passengerCapacity} passengers
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onView(vehicle)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-border px-3 text-xs font-semibold text-text transition-colors hover:bg-secondary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(vehicle)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-border px-3 text-xs font-semibold text-text transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${vehicle.registrationNumber}`}
                    onClick={() => onDelete(vehicle.id)}
                    className="inline-flex min-h-10 w-10 items-center justify-center border border-border text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-border bg-background px-5 py-3 sm:px-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </p>
      </div>
    </section>
  )
}