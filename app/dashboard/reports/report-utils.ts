import type {
  DashboardRoute,
  DashboardVehicle,
} from "../dashboard-data"

export type DateRangePreset =
  | "7"
  | "30"
  | "90"
  | "all"
  | "custom"

export type RouteStatusFilter = "All" | DashboardRoute["status"]

export type VehicleStatusFilter =
  | "All"
  | DashboardVehicle["status"]

export type ReportTab = "routes" | "vehicles" | "utilisation"

export type SortDirection = "asc" | "desc"

export type SortState = {
  key: string
  direction: SortDirection
}

export type ReportFilters = {
  dateRange: DateRangePreset
  customStart: string
  customEnd: string
  routeStatus: RouteStatusFilter
  vehicleStatus: VehicleStatusFilter
  vehicleType: string
}

export type OperationalInsight = {
  title: string
  description: string
  tone: "info" | "warning" | "success"
  type:
    | "unassigned-route"
    | "unassigned-vehicle"
    | "inconsistent-vehicle"
    | "multi-route-vehicle"
    | "longest-route"
    | "shortest-route"
    | "common-vehicle-type"
    | "success"
}

export type GrowthPoint = {
  label: string
  routes: number
  vehicles: number
}

export function safeDivide(
  numerator: number,
  denominator: number,
): number {
  if (!denominator) {
    return 0
  }

  return numerator / denominator
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-NG", {
    maximumFractionDigits: 1,
  })
}

export function formatInteger(value: number): string {
  return value.toLocaleString("en-NG")
}

export function formatDistance(value: number): string {
  return `${value.toLocaleString("en-NG", {
    maximumFractionDigits: 1,
  })} km`
}

export function formatDate(
  value: string,
  includeTime = false,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date)
}

export function formatDateInput(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function startOfDay(date: Date): Date {
  const result = new Date(date)

  result.setHours(0, 0, 0, 0)

  return result
}

function endOfDay(date: Date): Date {
  const result = new Date(date)

  result.setHours(23, 59, 59, 999)

  return result
}

export function getDateRange(
  filters: ReportFilters,
): {
  start: Date | null
  end: Date | null
  label: string
} {
  const now = new Date()

  if (filters.dateRange === "all") {
    return {
      start: null,
      end: null,
      label: "All time",
    }
  }

  if (filters.dateRange === "custom") {
    const start = filters.customStart
      ? startOfDay(new Date(`${filters.customStart}T00:00:00`))
      : null

    const end = filters.customEnd
      ? endOfDay(new Date(`${filters.customEnd}T00:00:00`))
      : null

    return {
      start,
      end,
      label:
        start && end
          ? `${formatDate(filters.customStart)} – ${formatDate(
              filters.customEnd,
            )}`
          : start
            ? `From ${formatDate(filters.customStart)}`
            : end
              ? `Until ${formatDate(filters.customEnd)}`
              : "Custom range",
    }
  }

  const days = Number(filters.dateRange)
  const start = startOfDay(new Date(now))

  start.setDate(start.getDate() - (days - 1))

  return {
    start,
    end: endOfDay(now),
    label: `Last ${days} days`,
  }
}

export function isDateInRange(
  value: string,
  range: {
    start: Date | null
    end: Date | null
  },
): boolean {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  if (range.start && date < range.start) {
    return false
  }

  if (range.end && date > range.end) {
    return false
  }

  return true
}

export function filterRoutes(
  routes: DashboardRoute[],
  filters: ReportFilters,
): DashboardRoute[] {
  const range = getDateRange(filters)

  return routes.filter((route) => {
    if (!isDateInRange(route.createdAt, range)) {
      return false
    }

    if (
      filters.routeStatus !== "All" &&
      route.status !== filters.routeStatus
    ) {
      return false
    }

    return true
  })
}

export function filterVehicles(
  vehicles: DashboardVehicle[],
  filters: ReportFilters,
): DashboardVehicle[] {
  const range = getDateRange(filters)

  return vehicles.filter((vehicle) => {
    if (!isDateInRange(vehicle.createdAt, range)) {
      return false
    }

    if (
      filters.vehicleStatus !== "All" &&
      vehicle.status !== filters.vehicleStatus
    ) {
      return false
    }

    if (
      filters.vehicleType !== "All" &&
      vehicle.type !== filters.vehicleType
    ) {
      return false
    }

    return true
  })
}

export function getVehicleTypes(
  vehicles: DashboardVehicle[],
): string[] {
  return Array.from(
    new Set(vehicles.map((vehicle) => vehicle.type).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))
}

function getPeriodStart(
  date: Date,
  useMonthlyGrouping: boolean,
): Date {
  const result = new Date(date)

  if (useMonthlyGrouping) {
    result.setDate(1)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const day = result.getDay()
  const difference = day === 0 ? 6 : day - 1

  result.setDate(result.getDate() - difference)
  result.setHours(0, 0, 0, 0)

  return result
}

function formatPeriodLabel(
  date: Date,
  useMonthlyGrouping: boolean,
): string {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    ...(useMonthlyGrouping
      ? { year: "2-digit" }
      : { day: "numeric" }),
  }).format(date)
}

export function getGrowthData(
  routes: DashboardRoute[],
  vehicles: DashboardVehicle[],
  filters: ReportFilters,
): GrowthPoint[] {
  const range = getDateRange(filters)

  const start =
    range.start ??
    [...routes, ...vehicles]
      .map((item) => new Date(item.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())[0] ??
    new Date()

  const end = range.end ?? new Date()

  const differenceInDays =
    Math.max(
      1,
      Math.ceil(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    )

  const useMonthlyGrouping = differenceInDays > 90
  const points = new Map<
    string,
    {
      date: Date
      routes: number
      vehicles: number
    }
  >()

  const current = getPeriodStart(start, useMonthlyGrouping)
  const final = getPeriodStart(end, useMonthlyGrouping)

  while (current <= final) {
    const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`

    points.set(key, {
      date: new Date(current),
      routes: 0,
      vehicles: 0,
    })

    if (useMonthlyGrouping) {
      current.setMonth(current.getMonth() + 1)
    } else {
      current.setDate(current.getDate() + 7)
    }
  }

  routes.forEach((route) => {
    const date = new Date(route.createdAt)

    if (Number.isNaN(date.getTime())) {
      return
    }

    const period = getPeriodStart(date, useMonthlyGrouping)
    const key = `${period.getFullYear()}-${period.getMonth()}-${period.getDate()}`
    const point = points.get(key)

    if (point) {
      point.routes += 1
    }
  })

  vehicles.forEach((vehicle) => {
    const date = new Date(vehicle.createdAt)

    if (Number.isNaN(date.getTime())) {
      return
    }

    const period = getPeriodStart(date, useMonthlyGrouping)
    const key = `${period.getFullYear()}-${period.getMonth()}-${period.getDate()}`
    const point = points.get(key)

    if (point) {
      point.vehicles += 1
    }
  })

  return Array.from(points.values()).map((point) => ({
    label: formatPeriodLabel(point.date, useMonthlyGrouping),
    routes: point.routes,
    vehicles: point.vehicles,
  }))
}

export function getOperationalInsights(
  routes: DashboardRoute[],
  vehicles: DashboardVehicle[],
): OperationalInsight[] {
  const insights: OperationalInsight[] = []

  const vehicleAssignments = new Map<string, number>()

  routes.forEach((route) => {
    route.assignedVehicleIds.forEach((vehicleId) => {
      vehicleAssignments.set(
        vehicleId,
        (vehicleAssignments.get(vehicleId) ?? 0) + 1,
      )
    })
  })

  const unassignedRoutes = routes.filter(
    (route) => route.assignedVehicleIds.length === 0,
  )

  if (unassignedRoutes.length > 0) {
    const names = unassignedRoutes
      .slice(0, 2)
      .map((route) => route.name)
      .join(", ")

    const remaining = unassignedRoutes.length - 2

    insights.push({
      title: "Routes without vehicles",
      description:
        remaining > 0
          ? `${unassignedRoutes.length} routes have no assigned vehicles, including ${names} and ${remaining} more.`
          : `${unassignedRoutes.length} routes have no assigned vehicles, including ${names}.`,
      tone: "warning",
      type: "unassigned-route",
    })
  }

  const unassignedVehicles = vehicles.filter(
    (vehicle) => !vehicleAssignments.has(vehicle.id),
  )

  if (unassignedVehicles.length > 0) {
    insights.push({
      title: "Vehicles not assigned",
      description: `${unassignedVehicles.length} ${unassignedVehicles.length === 1 ? "vehicle is" : "vehicles are"} not currently assigned to any route.`,
      tone: "info",
      type: "unassigned-vehicle",
    })
  }

  const inconsistentVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status === "Assigned" &&
      !vehicleAssignments.has(vehicle.id),
  )

  if (inconsistentVehicles.length > 0) {
    insights.push({
      title: "Assignment mismatch",
      description: `${inconsistentVehicles.length} vehicle${inconsistentVehicles.length === 1 ? "" : "s"} marked as Assigned ${inconsistentVehicles.length === 1 ? "is" : "are"} not attached to any route.`,
      tone: "warning",
      type: "inconsistent-vehicle",
    })
  }

  const multiRouteVehicles = vehicles.filter(
    (vehicle) => (vehicleAssignments.get(vehicle.id) ?? 0) > 1,
  )

  if (multiRouteVehicles.length > 0) {
    insights.push({
      title: "Vehicles serving multiple routes",
      description: `${multiRouteVehicles.length} vehicle${multiRouteVehicles.length === 1 ? " is" : "s are"} currently assigned to more than one route.`,
      tone: "info",
      type: "multi-route-vehicle",
    })
  }

  if (routes.length > 0) {
    const longest = routes.reduce((current, route) =>
      route.distance > current.distance ? route : current,
    )

    const shortest = routes.reduce((current, route) =>
      route.distance < current.distance ? route : current,
    )

    insights.push({
      title: "Longest route",
      description: `${longest.name} is the longest route at ${formatDistance(longest.distance)}.`,
      tone: "info",
      type: "longest-route",
    })

    if (routes.length > 1) {
      insights.push({
        title: "Shortest route",
        description: `${shortest.name} is the shortest route at ${formatDistance(shortest.distance)}.`,
        tone: "info",
        type: "shortest-route",
      })
    }
  }

  if (vehicles.length > 0) {
    const counts = new Map<string, number>()

    vehicles.forEach((vehicle) => {
      counts.set(vehicle.type, (counts.get(vehicle.type) ?? 0) + 1)
    })

    const mostCommon = Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0]

    if (mostCommon) {
      insights.push({
        title: "Most common vehicle type",
        description: `${mostCommon[0]} is the most common vehicle type with ${mostCommon[1]} ${mostCommon[1] === 1 ? "vehicle" : "vehicles"}.`,
        tone: "info",
        type: "common-vehicle-type",
      })
    }
  }

  if (
    !insights.some(
      (insight) =>
        insight.tone === "warning" ||
        insight.type === "unassigned-route",
    )
  ) {
    insights.push({
      title: "Everything looks good",
      description:
        "No route or vehicle assignment issues were detected in the current data.",
      tone: "success",
      type: "success",
    })
  }

  return insights
}

export function escapeCsvCell(value: unknown): string {
  const stringValue = String(value ?? "")

  const protectedValue = /^[=+\-@]/.test(stringValue)
    ? `'${stringValue}`
    : stringValue

  return `"${protectedValue.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`
}

export function buildCsv(
  headers: string[],
  rows: unknown[][],
): string {
  const headerRow = headers.map(escapeCsvCell).join(",")

  const dataRows = rows.map((row) =>
    row.map(escapeCsvCell).join(","),
  )

  return [headerRow, ...dataRows].join("\r\n")
}

export function downloadCsv(
  content: string,
  filename: string,
): void {
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

export function getCsvFilename(
  tab: ReportTab,
  date = new Date(),
): string {
  const dateString = formatDateInput(date)

  return `kyyp-${tab}-report-${dateString}.csv`
}