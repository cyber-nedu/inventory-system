"use client"

import { useMemo, useState } from "react"
import Sidebar from "@/app/components/organizationSidebar"
import {
  useDashboardRoutes,
  useDashboardVehicles,
} from "../dashboard-data"
import OperationalSummary from "./operational-summary"
import ReportHeader from "./report-header"
import RouteReports from "./route-reports"
import VehiclesReports from "./vehicles-reports"
import {
  buildCsv,
  downloadCsv,
  filterRoutes,
  filterVehicles,
  formatDate,
  getCsvFilename,
  type ReportFilters,
  type ReportTab,
} from "./report-utils"

const defaultFilters: ReportFilters = {
  dateRange: "all",
  customStart: "",
  customEnd: "",
  routeStatus: "All",
  vehicleStatus: "All",
  vehicleType: "All",
}

export default function ReportsPage() {
  const routes = useDashboardRoutes()
  const vehicles = useDashboardVehicles()

  const [filters, setFilters] =
    useState<ReportFilters>(defaultFilters)

  const [activeTab, setActiveTab] =
    useState<ReportTab>("routes")

  const filteredRoutes = useMemo(
    () => filterRoutes(routes, filters),
    [filters, routes],
  )

  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, filters),
    [filters, vehicles],
  )

  const handleResetFilters = () => {
    setFilters(defaultFilters)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const date = new Date()

    if (activeTab === "routes") {
      const rows = filteredRoutes.map((route) => [
        route.name,
        route.origin,
        route.destination,
        route.distance,
        route.estimatedDuration,
        route.assignedVehicleIds.length,
        route.status,
        formatDate(route.createdAt),
      ])

      const csv = buildCsv(
        [
          "Route",
          "Origin",
          "Destination",
          "Distance (km)",
          "Duration",
          "Vehicles Assigned",
          "Status",
          "Created Date",
        ],
        rows,
      )

      downloadCsv(
        csv,
        getCsvFilename("routes", date),
      )

      return
    }

    if (activeTab === "vehicles") {
      const rows = filteredVehicles.map((vehicle) => {
        const assignedRoutes = filteredRoutes.filter((route) =>
          route.assignedVehicleIds.includes(vehicle.id),
        )

        return [
          `${vehicle.make} ${vehicle.model}`,
          vehicle.registrationNumber,
          vehicle.type,
          vehicle.passengerCapacity,
          vehicle.status,
          assignedRoutes.length,
          formatDate(vehicle.createdAt),
        ]
      })

      const csv = buildCsv(
        [
          "Vehicle",
          "Registration",
          "Type",
          "Passenger Capacity",
          "Status",
          "Routes Assigned",
          "Created Date",
        ],
        rows,
      )

      downloadCsv(
        csv,
        getCsvFilename("vehicles", date),
      )

      return
    }

    const vehicleRows = filteredVehicles.map((vehicle) => {
      const assignedRoutes = filteredRoutes.filter((route) =>
        route.assignedVehicleIds.includes(vehicle.id),
      )

      const totalDistance = assignedRoutes.reduce(
        (sum, route) => sum + route.distance,
        0,
      )

      return [
        `${vehicle.make} ${vehicle.model}`,
        vehicle.registrationNumber,
        assignedRoutes.map((route) => route.name).join("; "),
        assignedRoutes.length,
        totalDistance,
      ]
    })

    const routeRows = filteredRoutes.map((route) => {
      const assignedVehicles = filteredVehicles.filter(
        (vehicle) =>
          route.assignedVehicleIds.includes(vehicle.id),
      )

      return [
        `Route: ${route.name}`,
        "",
        assignedVehicles
          .map(
            (vehicle) =>
              `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
          )
          .join("; "),
        assignedVehicles.length,
        route.distance,
      ]
    })

    const csv = buildCsv(
      [
        "Entity",
        "Registration",
        "Assignments",
        "Route Count",
        "Total Distance (km)",
      ],
      [...vehicleRows, ...routeRows],
    )

    downloadCsv(
      csv,
      getCsvFilename("utilisation", date),
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:ml-0 print:max-w-none print:bg-white print:px-0 print:py-0">
          <ReportHeader
            onExport={handleExport}
            onPrint={handlePrint}
          />

          <div
            className="sr-only"
            aria-live="polite"
          >
            {filteredRoutes.length} routes and{" "}
            {filteredVehicles.length} vehicles match the current
            report filters.
          </div>

          <OperationalSummary
            routes={filteredRoutes}
            vehicles={filteredVehicles}
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={handleResetFilters}
        />

          <RouteReports
            routes={filteredRoutes}
            vehicles={filteredVehicles}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "vehicles" && (
            <section
              aria-label="Vehicles report"
              className="border border-border bg-foreground shadow-sm"
            >
              <div className="border-b border-border p-5 sm:p-6">
                <h2 className="text-base font-bold text-text">
                  Vehicle records
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Detailed vehicle information and route assignment
                  counts.
                </p>
              </div>

              <VehiclesReports
                vehicles={filteredVehicles}
                routes={filteredRoutes}
              />
            </section>
          )}

          <footer className="border-t border-border pt-5 pb-8 text-xs text-muted print:pb-0">
            Reports are generated from the data stored in this
            browser. Generated{" "}
            {formatDate(new Date().toISOString(), true)}.
          </footer>
        </div>
      </div>
    </main>
  )
}