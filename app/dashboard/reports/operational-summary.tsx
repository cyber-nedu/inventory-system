"use client"

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleHelp,
  Route as RouteIcon,
  Truck,
  Users,
} from "lucide-react"
import { useMemo } from "react"
import type {
  DashboardRoute,
  DashboardVehicle,
} from "../dashboard-data"
import {
  filterRoutes,
  filterVehicles,
  formatDistance,
  formatInteger,
  formatNumber,
  getGrowthData,
  getOperationalInsights,
  getVehicleTypes,
  safeDivide,
  type ReportFilters,
} from "./report-utils"

type OperationalSummaryProps = {
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  onResetFilters: () => void
}

type DonutValue = {
  label: string
  value: number
  className: string
}

function DonutChart({
  title,
  description,
  values,
  ariaLabel,
}: {
  title: string
  description: string
  values: DonutValue[]
  ariaLabel: string
}) {
  const total = values.reduce((sum, item) => sum + item.value, 0)
  const radius = 42
  const circumference = 2 * Math.PI * radius

  return (
    <article className="border border-border bg-foreground p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:p-6">
      <div>
        <h3 className="text-sm font-bold text-text">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>

      {total === 0 ? (
        <div className="mt-6 flex min-h-[190px] flex-col items-center justify-center border border-dashed border-border px-5 text-center">
          <CircleHelp className="h-6 w-6 text-muted" />

          <p className="mt-3 text-sm font-semibold text-text">
            No data available
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
            There is not enough data in the selected range to generate this
            chart.
          </p>
        </div>
      ) : (
        <div
          className="mt-6 flex flex-col items-center gap-6 min-[480px]:flex-row min-[480px]:justify-center"
          role="img"
          aria-label={ariaLabel}
        >
          <div className="relative h-40 w-40 shrink-0">
            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="13"
                className="text-secondary"
              />

              {values.map((item, index) => {
                if (item.value === 0) {
                  return null
                }

                const percentage = item.value / total
                const dash = percentage * circumference
                const accumulated = values
                  .slice(0, index)
                  .reduce(
                    (sum, current) => sum + current.value / total,
                    0,
                  )
                const offset = circumference * accumulated

                return (
                  <circle
                    key={item.label}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    className={item.className}
                    strokeLinecap="butt"
                  />
                )
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-text">
                {formatInteger(total)}
              </span>

              <span className="text-[10px] uppercase tracking-wider text-muted">
                Total
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            {values.map((item) => {
              const percentage = safeDivide(item.value * 100, total)

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 ${item.className}`}
                    />

                    <span className="truncate text-xs text-muted">
                      {item.label}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-text">
                    {item.value}{" "}
                    <span className="font-normal text-muted">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}

function GrowthChart({
  data,
}: {
  data: ReturnType<typeof getGrowthData>
}) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.routes, item.vehicles]),
  )

  return (
    <article className="border border-border bg-foreground p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:p-6 lg:col-span-2">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h3 className="text-sm font-bold text-text">
            Growth over time
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted">
            Routes and vehicles added during the selected reporting period.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-2 text-muted">
            <span className="h-2.5 w-2.5 bg-primary" />
            Routes
          </span>

          <span className="flex items-center gap-2 text-muted">
            <span className="h-2.5 w-2.5 bg-emerald-500" />
            Vehicles
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-6 flex min-h-[260px] items-center justify-center border border-dashed border-border px-5 text-center">
          <div>
            <BarChart3 className="mx-auto h-6 w-6 text-muted" />

            <p className="mt-3 text-sm font-semibold text-text">
              No growth data available
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              There is not enough data in the selected range to display growth.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="mt-6"
          role="img"
          aria-label="Growth chart showing routes and vehicles added over time"
        >
          <div className="relative h-64 border-b border-l border-border">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[4, 3, 2, 1, 0].map((line) => (
                <div
                  key={line}
                  className="border-t border-dashed border-border"
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end gap-2 px-3 sm:gap-4 sm:px-5">
              {data.map((item) => {
                const routeHeight = safeDivide(
                  item.routes * 100,
                  maxValue,
                )

                const vehicleHeight = safeDivide(
                  item.vehicles * 100,
                  maxValue,
                )

                return (
                  <div
                    key={item.label}
                    className="flex min-w-0 flex-1 items-end justify-center gap-1"
                  >
                    <div
                      className="w-full max-w-5 bg-primary transition-all"
                      style={{
                        height: `${Math.max(
                          routeHeight,
                          item.routes > 0 ? 4 : 0,
                        )}%`,
                      }}
                      title={`${item.label}: ${item.routes} routes`}
                    />

                    <div
                      className="w-full max-w-5 bg-emerald-500 transition-all"
                      style={{
                        height: `${Math.max(
                          vehicleHeight,
                          item.vehicles > 0 ? 4 : 0,
                        )}%`,
                      }}
                      title={`${item.label}: ${item.vehicles} vehicles`}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex gap-2 px-3 sm:gap-4 sm:px-5">
            {data.map((item) => (
              <span
                key={item.label}
                className="min-w-0 flex-1 truncate text-center text-[10px] text-muted"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

function VehicleTypeChart({
  values,
}: {
  values: Array<{
    label: string
    value: number
  }>
}) {
  const maxValue = Math.max(1, ...values.map((item) => item.value))

  return (
    <article className="border border-border bg-foreground p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:p-6">
      <div>
        <h3 className="text-sm font-bold text-text">
          Vehicles by type
        </h3>

        <p className="mt-1 text-xs leading-5 text-muted">
          Distribution of vehicles across the fleet.
        </p>
      </div>

      {values.length === 0 ? (
        <div className="mt-6 flex min-h-[190px] flex-col items-center justify-center border border-dashed border-border px-5 text-center">
          <Truck className="h-6 w-6 text-muted" />

          <p className="mt-3 text-sm font-semibold text-text">
            No vehicle data available
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
            Add vehicles or adjust the selected filters to see the fleet
            breakdown.
          </p>
        </div>
      ) : (
        <div
          className="mt-6 space-y-4"
          role="img"
          aria-label="Horizontal bar chart showing vehicles by type"
        >
          {values.map((item) => {
            const percentage = safeDivide(
              item.value * 100,
              maxValue,
            )

            return (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="truncate text-xs font-medium text-text">
                    {item.label}
                  </span>

                  <span className="shrink-0 text-xs font-semibold text-muted">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

function FilterBar({
  filters,
  onFiltersChange,
  onReset,
  routes,
  vehicles,
}: {
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  onReset: () => void
  routes: DashboardRoute[]
  vehicles: DashboardVehicle[]
}) {
  const vehicleTypes = useMemo(
    () => getVehicleTypes(vehicles),
    [vehicles],
  )

  const rangeLabel =
    filters.dateRange === "custom"
      ? filters.customStart && filters.customEnd
        ? `${filters.customStart} → ${filters.customEnd}`
        : filters.customStart
          ? `From ${filters.customStart}`
          : filters.customEnd
            ? `Until ${filters.customEnd}`
            : "Custom range"
      : filters.dateRange === "7"
        ? "Last 7 days"
        : filters.dateRange === "30"
          ? "Last 30 days"
          : filters.dateRange === "90"
            ? "Last 90 days"
            : "All time"

  return (
    <section className="border border-border bg-foreground p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Report filters
            </p>

            <p className="mt-1 text-xs text-muted">
              Narrow the operational data shown below.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="min-h-10 self-start border border-border px-4 text-xs font-semibold text-text transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:self-auto"
          >
            Reset filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text">
              Date range
            </span>

            <select
              value={filters.dateRange}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  dateRange:
                    event.target.value as ReportFilters["dateRange"],
                })
              }
              className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          {filters.dateRange === "custom" && (
            <>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-text">
                  Start date
                </span>

                <input
                  type="date"
                  value={filters.customStart}
                  onChange={(event) =>
                    onFiltersChange({
                      ...filters,
                      customStart: event.target.value,
                    })
                  }
                  className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-text">
                  End date
                </span>

                <input
                  type="date"
                  value={filters.customEnd}
                  onChange={(event) =>
                    onFiltersChange({
                      ...filters,
                      customEnd: event.target.value,
                    })
                  }
                  className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </>
          )}

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text">
              Route status
            </span>

            <select
              value={filters.routeStatus}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  routeStatus:
                    event.target.value as ReportFilters["routeStatus"],
                })
              }
              className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All routes</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text">
              Vehicle status
            </span>

            <select
              value={filters.vehicleStatus}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  vehicleStatus:
                    event.target.value as ReportFilters["vehicleStatus"],
                })
              }
              className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All vehicles</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text">
              Vehicle type
            </span>

            <select
              value={filters.vehicleType}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  vehicleType: event.target.value,
                })
              }
              className="min-h-11 border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All types</option>

              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-border pt-4 text-xs text-muted sm:flex-row sm:items-center">
          <span>{rangeLabel}</span>

          <span aria-live="polite">
            {routes.length} routes · {vehicles.length} vehicles
          </span>
        </div>
      </div>
    </section>
  )
}

export default function OperationalSummary({
  routes,
  vehicles,
  filters,
  onFiltersChange,
  onResetFilters,
}: OperationalSummaryProps) {
  const filteredRoutes = useMemo(
    () => filterRoutes(routes, filters),
    [routes, filters],
  )

  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, filters),
    [vehicles, filters],
  )

  const routeDistance = filteredRoutes.reduce(
    (total, route) => total + route.distance,
    0,
  )

  const averageRouteDistance = safeDivide(
    routeDistance,
    filteredRoutes.length,
  )

  const totalCapacity = filteredVehicles.reduce(
    (total, vehicle) => total + vehicle.passengerCapacity,
    0,
  )

  const averageCapacity = safeDivide(
    totalCapacity,
    filteredVehicles.length,
  )

  const activeRoutes = filteredRoutes.filter(
    (route) => route.status === "Active",
  ).length

  const availableVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Available",
  ).length

  const assignedVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Assigned",
  ).length

  const maintenanceVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Maintenance",
  ).length

  const inactiveRoutes = filteredRoutes.filter(
    (route) => route.status === "Inactive",
  ).length

  const fleetStatusValues: DonutValue[] = [
    {
      label: "Available",
      value: availableVehicles,
      className: "text-emerald-500",
    },
    {
      label: "Assigned",
      value: assignedVehicles,
      className: "text-primary",
    },
    {
      label: "Maintenance",
      value: maintenanceVehicles,
      className: "text-amber-500",
    },
  ]

  const routeStatusValues: DonutValue[] = [
    {
      label: "Active",
      value: activeRoutes,
      className: "text-emerald-500",
    },
    {
      label: "Inactive",
      value: inactiveRoutes,
      className: "text-muted",
    },
  ]

  const vehicleTypeValues = useMemo(
    () =>
      Array.from(
        filteredVehicles.reduce((map, vehicle) => {
          map.set(
            vehicle.type,
            (map.get(vehicle.type) ?? 0) + 1,
          )

          return map
        }, new Map<string, number>()),
      )
        .map(([label, value]) => ({
          label,
          value,
        }))
        .sort((first, second) => second.value - first.value),
    [filteredVehicles],
  )

  const growthData = getGrowthData(
    filteredRoutes,
    filteredVehicles,
    filters,
  )

  const insights = getOperationalInsights(
    filteredRoutes,
    filteredVehicles,
  )

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
        routes={filteredRoutes}
        vehicles={filteredVehicles}
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Total routes
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatInteger(filteredRoutes.length)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <RouteIcon className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            {formatInteger(activeRoutes)} currently active
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Active routes
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatInteger(activeRoutes)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-emerald-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            {safeDivide(
              activeRoutes * 100,
              filteredRoutes.length,
            ).toFixed(0)}
            % of filtered routes
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Total vehicles
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatInteger(filteredVehicles.length)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <Truck className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            {formatInteger(availableVehicles)} currently available
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Available vehicles
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatInteger(availableVehicles)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Ready for assignment
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Total route distance
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatDistance(routeDistance)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <RouteIcon className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Across filtered routes
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Average route distance
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatDistance(averageRouteDistance)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Per filtered route
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Total passenger capacity
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatInteger(totalCapacity)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Across filtered vehicles
          </p>
        </article>

        <article className="border border-border bg-foreground p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">
                Average capacity
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                {formatNumber(averageCapacity)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Passengers per vehicle
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DonutChart
          title="Fleet status"
          description="Current status distribution of filtered vehicles."
          values={fleetStatusValues}
          ariaLabel={`Fleet status chart. ${fleetStatusValues
            .map((item) => `${item.label}: ${item.value}`)
            .join(", ")}`}
        />

        <DonutChart
          title="Route status"
          description="Current status distribution of filtered routes."
          values={routeStatusValues}
          ariaLabel={`Route status chart. ${routeStatusValues
            .map((item) => `${item.label}: ${item.value}`)
            .join(", ")}`}
        />

        <VehicleTypeChart values={vehicleTypeValues} />

        <GrowthChart data={growthData} />
      </section>

      <section className="border border-border bg-foreground p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-sm font-bold text-text">
            Operational insights
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted">
            Important relationships and potential operational issues in the
            current data.
          </p>
        </div>

        {insights.length === 0 ? (
          <div className="mt-6 flex min-h-[150px] flex-col items-center justify-center border border-dashed border-border px-5 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />

            <p className="mt-3 text-sm font-semibold text-text">
              Everything looks good
            </p>

            <p className="mt-1 max-w-md text-xs leading-5 text-muted">
              No operational warnings were found in the current route and
              vehicle data.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {insights.map((insight) => {
              const isWarning = insight.tone === "warning"
              const isSuccess = insight.tone === "success"

              return (
                <article
                  key={`${insight.type}-${insight.title}`}
                  className="border border-border bg-background p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                        isWarning
                          ? "bg-amber-50 text-amber-500"
                          : isSuccess
                            ? "bg-emerald-50 text-emerald-500"
                            : "bg-primary-light text-primary"
                      }`}
                    >
                      {isWarning ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <CircleHelp className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-text">
                        {insight.title}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}