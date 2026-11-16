"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowDownUp,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Route as RouteIcon,
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

  useEffect(() => {
    if (!openMenu) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [openMenu])

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

  const isSearching = search.trim().length > 0 || filter !== "All"

  return (
    <section className="overflow-hidden border border-border bg-foreground shadow-sm">
      <div className="border-b border-border px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center bg-secondary text-primary">
                <RouteIcon
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-text">
                  All routes
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  View and manage your configured transportation routes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-60">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search routes..."
                aria-label="Search routes"
                className="h-10 w-full border border-border bg-background pl-9 pr-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="relative min-w-0 sm:w-40">
              <ArrowDownUp
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as RouteFilter)
                }
                aria-label="Filter routes by status"
                className="h-10 w-full appearance-none border border-border bg-background pl-9 pr-9 text-sm text-text outline-none transition-all duration-200 hover:border-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredRoutes.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-14 text-center">
          {routes.length === 0 ? (
            <>
              <div className="relative flex h-16 w-16 items-center justify-center bg-primary/5 text-primary">
                <div className="absolute inset-3 border border-primary/20" />

                <RouteIcon
                  className="relative h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-text">
                No routes yet
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
                Your transportation routes will appear here once you create
                your first route.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center bg-secondary text-muted">
                <Search
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-text">
                No matching routes
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
                No routes match your current search or status filter. Try
                changing the search term or selecting another status.
              </p>

              {isSearching ? (
                <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-primary">
                  Adjust your filters above
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-background/70">
                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Route
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Distance
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Duration
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Vehicles
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
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
                      className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-background/70"
                    >
                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text">
                            {route.name}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                            <span className="max-w-28 truncate">
                              {route.origin}
                            </span>

                            <span className="flex items-center gap-0.5 text-primary">
                              <span className="h-px w-4 bg-primary/30" />
                              <span className="h-1 w-1 bg-primary" />
                            </span>

                            <span className="max-w-28 truncate">
                              {route.destination}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-text">
                        {route.distance.toLocaleString()} km
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {route.estimatedDuration}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center bg-secondary text-muted">
                            <Truck
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </div>

                          <span className="text-sm font-medium text-text">
                            {getVehicleCount(route)}
                          </span>
                        </div>

                        {vehicleNames.length > 0 && (
                          <p className="mt-1.5 max-w-40 truncate text-[11px] text-muted">
                            {vehicleNames.join(", ")}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[11px] font-semibold ${
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
                      </td>

                      <td className="px-5 py-4">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            aria-label={`Actions for ${route.name}`}
                            aria-expanded={openMenu === route.id}
                            onClick={() =>
                              setOpenMenu(
                                openMenu === route.id ? null : route.id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <MoreHorizontal
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>

                          {openMenu === route.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close actions menu"
                                onClick={() => setOpenMenu(null)}
                                className="fixed inset-0 z-10 cursor-default"
                              />

                              <div className="absolute right-0 top-11 z-20 w-44 border border-border bg-foreground py-1.5 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onView(route)
                                  }}
                                  className="flex min-h-10 w-full items-center gap-2.5 px-3 text-left text-xs font-medium text-text transition-colors hover:bg-background focus-visible:bg-background focus-visible:outline-none"
                                >
                                  <Eye
                                    className="h-4 w-4 text-muted"
                                    aria-hidden="true"
                                  />
                                  View details
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onEdit(route)
                                  }}
                                  className="flex min-h-10 w-full items-center gap-2.5 px-3 text-left text-xs font-medium text-text transition-colors hover:bg-background focus-visible:bg-background focus-visible:outline-none"
                                >
                                  <Pencil
                                    className="h-4 w-4 text-muted"
                                    aria-hidden="true"
                                  />
                                  Edit route
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null)
                                    onDelete(route)
                                  }}
                                  className="flex min-h-10 w-full items-center gap-2.5 px-3 text-left text-xs font-medium text-red-600 transition-colors hover:bg-background focus-visible:bg-background focus-visible:outline-none"
                                >
                                  <Trash2
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
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
              <article
                key={route.id}
                className="p-4 transition-colors hover:bg-background/60 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">
                      {route.name}
                    </h3>

                    <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-muted">
                      <span className="truncate">{route.origin}</span>

                      <span className="flex shrink-0 items-center gap-0.5 text-primary">
                        <span className="h-px w-3 bg-primary/30" />
                        <span className="h-1 w-1 bg-primary" />
                      </span>

                      <span className="truncate">{route.destination}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 text-[10px] font-semibold ${
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

                <div className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                      Distance
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {route.distance.toLocaleString()} km
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                      Duration
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-text">
                      {route.estimatedDuration}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                      Vehicles
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {getVehicleCount(route)}
                    </p>
                  </div>
                </div>

                {getVehicleNames(route).length > 0 && (
                  <div className="mt-4 flex items-start gap-2">
                    <Truck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted"
                      aria-hidden="true"
                    />

                    <p className="min-w-0 truncate text-[11px] text-muted">
                      {getVehicleNames(route).join(", ")}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(route)}
                    className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-xs font-medium text-text transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Eye
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(route)}
                    className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-xs font-medium text-text transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Pencil
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(route)}
                    className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-xs font-medium text-red-600 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Trash2
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-border bg-background/50 px-4 py-3 sm:px-5">
        <p className="text-xs text-muted">
          Showing{" "}
          <span className="font-medium text-text">{filteredRoutes.length}</span>{" "}
          of <span className="font-medium text-text">{routes.length}</span>{" "}
          routes
        </p>
      </div>
    </section>
  )
}