"use client"

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Truck,
} from "lucide-react"
import { useMemo, useState } from "react"
import type { DashboardVehicle } from "../dashboard-data"
import {
  formatDate,
  formatInteger,
  type SortState,
} from "./report-utils"
import type { DashboardRoute } from "../dashboard-data"

type VehiclesReportsProps = {
  vehicles: DashboardVehicle[]
  routes: DashboardRoute[]
}

type VehicleSortKey =
  | "vehicle"
  | "registration"
  | "type"
  | "capacity"
  | "status"
  | "routes"
  | "createdAt"

function compareValues(
  first: string | number,
  second: string | number,
  direction: "asc" | "desc",
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

function getStatusClass(
  status: DashboardVehicle["status"],
): string {
  switch (status) {
    case "Available":
      return "text-emerald-700"

    case "Assigned":
      return "text-primary"

    case "Maintenance":
      return "text-amber-700"
  }
}

export default function VehiclesReports({
  vehicles,
  routes,
}: VehiclesReportsProps) {
  const [sort, setSort] = useState<SortState>({
    key: "createdAt",
    direction: "desc",
  })

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((first, second) => {
      const firstRoutes = routes.filter((route) =>
        route.assignedVehicleIds.includes(first.id),
      ).length

      const secondRoutes = routes.filter((route) =>
        route.assignedVehicleIds.includes(second.id),
      ).length

      const key = sort.key as VehicleSortKey

      switch (key) {
        case "vehicle":
          return compareValues(
            `${first.make} ${first.model}`,
            `${second.make} ${second.model}`,
            sort.direction,
          )

        case "registration":
          return compareValues(
            first.registrationNumber,
            second.registrationNumber,
            sort.direction,
          )

        case "type":
          return compareValues(
            first.type,
            second.type,
            sort.direction,
          )

        case "capacity":
          return compareValues(
            first.passengerCapacity,
            second.passengerCapacity,
            sort.direction,
          )

        case "status":
          return compareValues(
            first.status,
            second.status,
            sort.direction,
          )

        case "routes":
          return compareValues(
            firstRoutes,
            secondRoutes,
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
  }, [routes, sort, vehicles])

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
                label="Vehicle"
                sortKey="vehicle"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Registration"
                sortKey="registration"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Type"
                sortKey="type"
                sort={sort}
                onSort={handleSort}
              />
            </th>

            <th scope="col" className="px-4 py-3 text-left">
              <SortButton
                label="Capacity"
                sortKey="capacity"
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
                label="Routes"
                sortKey="routes"
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
          {sortedVehicles.map((vehicle) => {
            const assignedRoutes = routes.filter((route) =>
              route.assignedVehicleIds.includes(vehicle.id),
            )

            return (
              <tr
                key={vehicle.id}
                className="border-b border-border last:border-b-0 hover:bg-background"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary">
                      <Truck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-text">
                        {vehicle.make} {vehicle.model}
                      </p>

                      <p className="mt-1 text-[11px] text-muted">
                        {vehicle.type}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex bg-secondary px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-text">
                    {vehicle.registrationNumber}
                  </span>
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {vehicle.type}
                </td>

                <td className="px-4 py-4 text-xs font-semibold text-text">
                  {formatInteger(vehicle.passengerCapacity)}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold ${getStatusClass(
                      vehicle.status,
                    )}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        vehicle.status === "Available"
                          ? "bg-emerald-500"
                          : vehicle.status === "Assigned"
                            ? "bg-primary"
                            : "bg-amber-500"
                      }`}
                    />

                    {vehicle.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-xs font-semibold text-text">
                  {assignedRoutes.length}
                </td>

                <td className="px-4 py-4 text-xs text-muted">
                  {formatDate(vehicle.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {sortedVehicles.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-text">
            No vehicles match the current filters
          </p>

          <p className="mt-1 text-xs text-muted">
            Adjust the report filters to see vehicle records.
          </p>
        </div>
      )}
    </div>
  )
}