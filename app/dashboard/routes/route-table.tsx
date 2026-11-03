"use client"

import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Truck,
} from "lucide-react"
import type { DashboardRoute, DashboardVehicle } from "../dashboard-data"

type RouteTableProps = {
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
  onView: (route: DashboardRoute) => void
  onEdit: (route: DashboardRoute) => void
  onDelete: (route: DashboardRoute) => void
}

type RouteFilter = "All" | "Active" | "Inactive"

export default function RouteTable({
  routes,
  vehicles,
  onView,
  onEdit,
  onDelete,
}: RouteTableProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<RouteFilter>("All")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredRoutes = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return routes.filter((route) => {
      const matchesFilter = filter === "All" || route.status === filter

      const matchesSearch =
        !searchTerm ||
        route.name.toLowerCase().includes(searchTerm) ||
        route.origin.toLowerCase().includes(searchTerm) ||
        route.destination.toLowerCase().includes(searchTerm)

      return matchesFilter && matchesSearch
    })
  }, [routes, search, filter])

  const getVehicleCount = (route: DashboardRoute) =>
    route.assignedVehicleIds.length

  const getVehicleNames = (route: DashboardRoute) => {
    return route.assignedVehicleIds
      .map((id) => {
        const vehicle = vehicles.find((item) => item.id === id)

        return vehicle?.registrationNumber
      })
      .filter(Boolean)
  }

  return (
    <section className="border border-border bg-foreground">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text">All routes</h2>

          <p className="mt-1 text-xs text-muted">
            View and manage your configured transportation routes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search routes..."
              className="h-10 w-full border border-border bg-background pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary sm:w-56"
            />
          </div>

          <div className="relative">
            <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as RouteFilter)
              }
              className="h-10 w-full appearance-none border border-border bg-background pl-9 pr-9 text-sm text-text outline-none focus:border-primary sm:w-36"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRoutes.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-secondary text-muted">
            <Search className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-text">
            {routes.length === 0 ? "No routes yet" : "No matching routes"}
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
            {routes.length === 0
              ? "Your routes will appear here when you create your first route."
              : "Try another search term or change the status filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Route
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Distance
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Duration
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Vehicles
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRoutes.map((route) => {
                  const vehicleNames = getVehicleNames(route)

                  return (
                    <tr
                      key={route.id}
                      className="border-b border-border last:border-0 hover:bg-background/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text">
                          {route.name}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {route.origin} → {route.destination}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {route.distance.toLocaleString()} km
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {route.estimatedDuration}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted" />

                          <span className="text-sm text-text">
                            {getVehicleCount(route)}
                          </span>
                        </div>

                        {vehicleNames.length > 0 && (
                          <p className="mt-1 max-w-36 truncate text-[11px] text-muted">
                            {vehicleNames.join(", ")}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-medium ${
                            route.status === "Active"
                              ? "text-emerald-700"
                              : "text-muted"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              route.status === "Active"
                                ? "bg-emerald-600"
                                : "bg-muted"
                            }`}
                          />

                          {route.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            aria-label={`Actions for ${route.name}`}
                            onClick={() =>
                              setOpenMenu(
                                openMenu === route.id ? null : route.id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {openMenu === route.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close actions menu"
                                onClick={() => setOpenMenu(null)}
                                className="fixed inset-0 z-10 cursor-default"
                              />

                              <div className="absolute right-0 top-10 z-20 w-40 border border-border bg-foreground py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onView(route)
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text hover:bg-background"
                                >
                                  <Eye className="h-4 w-4" />
                                  View details
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onEdit(route)
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text hover:bg-background"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit route
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onDelete(route)
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-background"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete route
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border md:hidden">
            {filteredRoutes.map((route) => (
              <article key={route.id} className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">
                      {route.name}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      {route.origin} → {route.destination}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-medium ${
                      route.status === "Active"
                        ? "text-emerald-700"
                        : "text-muted"
                    }`}
                  >
                    {route.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Distance
                    </p>
                    <p className="mt-1 text-sm font-medium text-text">
                      {route.distance} km
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Duration
                    </p>
                    <p className="mt-1 text-sm font-medium text-text">
                      {route.estimatedDuration}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Vehicles
                    </p>
                    <p className="mt-1 text-sm font-medium text-text">
                      {getVehicleCount(route)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => onView(route)}
                    className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium text-text hover:bg-background"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(route)}
                    className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium text-text hover:bg-background"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(route)}
                    className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium text-red-600 hover:bg-background"
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

      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted">
          Showing {filteredRoutes.length} of {routes.length} routes
        </p>
      </div>
    </section>
  )
}