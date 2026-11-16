"use client"

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Route as RouteIcon,
  Truck,
} from "lucide-react"
import { useMemo, useState } from "react"
import type {
  DashboardRoute,
  DashboardVehicle,
} from "../dashboard-data"
import {
  formatDate,
  formatDistance,
  formatInteger,
  type ReportTab,
  type SortDirection,
  type SortState,
} from "./report-utils"

type RouteReportsProps = {
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
  activeTab: ReportTab
  onTabChange: (tab: ReportTab) => void
}

type RouteSortKey =
  | "name"
  | "origin"
  | "destination"
  | "distance"
  | "duration"
  | "vehicles"
  | "status"
  | "createdAt"

type UtilisationSortKey =
  | "vehicle"
  | "routes"
  | "distance"
  | "routeCount"

function compareValues(
  first: string | number,
  second: string | number,
  direction: SortDirection,
): number {
  let result = 0

  if (
    typeof first === "number" &&
    typeof second === "number"
  ) {
    result = first - second
  } else {
    result = String(first).localeCompare(String(second))
  }

  return direction === "asc" ? result : -result
}

function SortButton({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: string
  sort: SortState
  onSort: (key: string) => void
}) {
  const active = sort.key === sortKey

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex min-h-8 items-center gap-1 text-left text-[10px] font-semibold uppercase tracking-wider text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Sort by ${label}`}
      aria-sort={
        active
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      {label}

      {active ? (
        sort.direction === "asc" ? (
          <ArrowUp className="h-3 w-3 text-primary" />
        ) : (
          <ArrowDown className="h-3 w-3 text-primary" />
        )
      ) : (
        <ChevronsUpDown className="h-3 w-3" />
      )}
    </button>
  )
}

function RouteTable({
  routes,
  vehicles,
}: {
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
}) {
  const [sort, setSort] = useState<SortState>({
    key: "createdAt",
    direction: "desc",
  })

  const sortedRoutes = useMemo(() => {
    return [...routes].sort((first, second) => {
      const key = sort.key as RouteSortKey

      switch (key) {
        case "name":
          return compareValues(
            first.name,
            second.name,
            sort.direction,
          )

        case "origin":
          return compareValues(
            first.origin,
            second.origin,
            sort.direction,
          )

        case "destination":
          return compareValues(
            first.destination,
            second.destination,
            sort.direction,
          )

        case "distance":
          return compareValues(
            first.distance,
            second.distance,
            sort.direction,
          )

        case "duration":
          return compareValues(
            first.estimatedDuration,
            second.estimatedDuration,
            sort.direction,
          )

        case "vehicles":
          return compareValues(
            first.assignedVehicleIds.length,
            second.assignedVehicleIds.length,
            sort.direction,
          )

        case "status":
          return compareValues(
            first.status,
            second.status,
            sort.direction,
          )

        case "createdAt":
        default:
          return compareValues(
            new Date(first.createdAt).getTime(),
            new Date(second.createdAt).getTime(),
            sort.direction,
          )
      }
    })
  }, [routes, sort])

  const handleSort = (key: string) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-background">
            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Route"
                sortKey="name"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Origin"
                sortKey="origin"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Destination"
                sortKey="destination"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Distance"
                sortKey="distance"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Duration"
                sortKey="duration"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Vehicles"
                sortKey="vehicles"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Status"
                sortKey="status"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Created"
                sortKey="createdAt"
                sort={sort}
                onSort={handleSort}
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedRoutes.map((route) => {
            const assignedVehicles = route.assignedVehicleIds
              .map((id) =>
                vehicles.find((vehicle) => vehicle.id === id),
              )
              .filter(
                (
                  vehicle,
                ): vehicle is DashboardVehicle =>
                  Boolean(vehicle),
              )

            return (
              <tr
                key={route.id}
                className="border-b border-border last:border-b-0 hover:bg-background"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary">
                      <RouteIcon className="h-4 w-4" />
                    </div>

                    <span className="text-xs font-semibold text-text">
                      {route.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {route.origin}
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {route.destination}
                </td>

                <td className="px-4 py-4 text-xs font-semibold text-text">
                  {formatDistance(route.distance)}
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {route.estimatedDuration}
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text">
                    <Truck className="h-3.5 w-3.5 text-muted" />
                    {assignedVehicles.length}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold ${
                      route.status === "Active"
                        ? "text-emerald-700"
                        : "text-muted"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        route.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-muted"
                      }`}
                    />
                    {route.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {formatDate(route.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {sortedRoutes.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-text">
            No routes match the current filters
          </p>

          <p className="mt-1 text-xs text-muted">
            Adjust the report filters to see route records.
          </p>
        </div>
      )}
    </div>
  )
}

function UtilisationTable({
  routes,
  vehicles,
}: {
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
}) {
  const [sort, setSort] = useState<SortState>({
    key: "routeCount",
    direction: "desc",
  })

  const rows = useMemo(() => {
    return vehicles.map((vehicle) => {
      const assignedRoutes = routes.filter((route) =>
        route.assignedVehicleIds.includes(vehicle.id),
      )

      return {
        vehicle,
        assignedRoutes,
        routeCount: assignedRoutes.length,
        distance: assignedRoutes.reduce(
          (sum, route) => sum + route.distance,
          0,
        ),
      }
    })
  }, [routes, vehicles])

  const sortedRows = useMemo(() => {
    return [...rows].sort((first, second) => {
      const key = sort.key as UtilisationSortKey

      switch (key) {
        case "vehicle":
          return compareValues(
            `${first.vehicle.make} ${first.vehicle.model}`,
            `${second.vehicle.make} ${second.vehicle.model}`,
            sort.direction,
          )

        case "routes":
        case "routeCount":
          return compareValues(
            first.routeCount,
            second.routeCount,
            sort.direction,
          )

        case "distance":
        default:
          return compareValues(
            first.distance,
            second.distance,
            sort.direction,
          )
      }
    })
  }, [rows, sort])

  const handleSort = (key: string) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-background">
            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Vehicle"
                sortKey="vehicle"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Routes served"
                sortKey="routeCount"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Total distance"
                sortKey="distance"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              Route assignments
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={row.vehicle.id}
              className="border-b border-border last:border-b-0 hover:bg-background"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary">
                    <Truck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-text">
                      {row.vehicle.make} {row.vehicle.model}
                    </p>

                    <p className="mt-1 text-[11px] text-muted">
                      {row.vehicle.registrationNumber}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-xs font-semibold text-text">
                {row.routeCount}
              </td>

              <td className="px-4 py-4 text-xs font-semibold text-text">
                {formatDistance(row.distance)}
              </td>

              <td className="px-4 py-4">
                {row.assignedRoutes.length === 0 ? (
                  <span className="text-xs text-muted">
                    No routes assigned
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {row.assignedRoutes.map((route) => (
                      <span
                        key={route.id}
                        className="bg-secondary px-2 py-1 text-[10px] font-medium text-text"
                      >
                        {route.name}
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedRows.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-text">
            No utilisation data available
          </p>

          <p className="mt-1 text-xs text-muted">
            Add vehicles and routes to generate utilisation data.
          </p>
        </div>
      )}
    </div>
  )
}

export default function RouteReports({
  routes,
  vehicles,
  activeTab,
  onTabChange,
}: RouteReportsProps) {
  return (
    <section className="border border-border bg-foreground shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-base font-bold text-text">
            Detailed reports
          </h2>

          <p className="mt-1 text-xs text-muted">
            Sortable operational records from the current filters.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Report type"
          className="grid grid-cols-3 border border-border bg-background"
        >
          {[
            {
              id: "routes" as const,
              label: "Routes report",
            },
            {
              id: "vehicles" as const,
              label: "Vehicles report",
            },
            {
              id: "utilisation" as const,
              label: "Utilisation",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-10 px-3 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4 sm:text-xs ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-secondary hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        aria-label={`${activeTab} report`}
        className="p-0"
      >
        {activeTab === "routes" && (
          <RouteTable
            routes={routes}
            vehicles={vehicles}
          />
        )}

        {activeTab === "utilisation" && (
          <UtilisationTable
            routes={routes}
            vehicles={vehicles}
          />
        )}
      </div>
    </section>
  )
}