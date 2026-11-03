"use client"

import { useMemo, useState } from "react"
import {
  ChevronDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Truck,
} from "lucide-react"
import { DashboardVehicle } from "../dashboard-data"

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
      return "bg-blue-50 text-blue-700"

    case "Maintenance":
      return "bg-amber-50 text-amber-700"
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

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.make.toLowerCase().includes(searchValue) ||
        vehicle.model.toLowerCase().includes(searchValue) ||
        vehicle.registrationNumber.toLowerCase().includes(searchValue) ||
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
    <section className="border border-border bg-foreground">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-text">
              Vehicle inventory
            </h2>

            <p className="mt-1 text-xs text-muted">
              View and manage all vehicles in your fleet.
            </p>
          </div>

          <span className="text-xs font-medium text-muted">
            {filteredVehicles.length} of {vehicles.length} vehicles
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vehicles..."
              className="h-11 w-full border border-border bg-background pl-10 pr-4 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${
                  filter === item
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-secondary text-muted">
            <Truck className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-text">
            No vehicles found
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-6 text-muted">
            Try changing your search or status filter to find a vehicle.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Registration
                  </th>

                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Type
                  </th>

                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Capacity
                  </th>

                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-background/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-muted">
                          <Truck className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-text">
                            {vehicle.make} {vehicle.model}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {vehicle.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-text">
                        {vehicle.registrationNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted">
                      {vehicle.type}
                    </td>

                    <td className="px-6 py-4 text-sm text-text">
                      {vehicle.passengerCapacity} passengers
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(vehicle.status)}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === vehicle.id ? null : vehicle.id,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text"
                        aria-label={`Actions for ${vehicle.registrationNumber}`}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {openMenu === vehicle.id && (
                        <div className="absolute right-8 top-12 z-20 w-40 border border-border bg-foreground py-1 text-left shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              onView(vehicle)
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-text hover:bg-secondary"
                          >
                            <Eye className="h-4 w-4" />
                            View details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onEdit(vehicle)
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-text hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit vehicle
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onDelete(vehicle.id)
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete vehicle
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border md:hidden">
            {filteredVehicles.map((vehicle) => (
              <article key={vehicle.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-muted">
                      <Truck className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text">
                        {vehicle.make} {vehicle.model}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {vehicle.registrationNumber}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(vehicle.status)}`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      Vehicle type
                    </p>

                    <p className="mt-1 text-xs font-medium text-text">
                      {vehicle.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      Capacity
                    </p>

                    <p className="mt-1 text-xs font-medium text-text">
                      {vehicle.passengerCapacity} passengers
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(vehicle)}
                    className="inline-flex min-h-9 items-center gap-2 border border-border px-3 text-xs font-semibold text-text hover:bg-secondary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(vehicle)}
                    className="inline-flex min-h-9 items-center gap-2 border border-border px-3 text-xs font-semibold text-text hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(vehicle.id)}
                    className="inline-flex min-h-9 items-center gap-2 border border-border px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}