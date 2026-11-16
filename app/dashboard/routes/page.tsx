"use client"

import { useMemo, useState } from "react"
import Sidebar from "@/app/components/organizationSidebar"
import {
  saveDashboardRoutes,
  useDashboardRoutes,
  useDashboardVehicles,
} from "../dashboard-data"
import type { DashboardRoute } from "../dashboard-data"
import RouteDialog from "./route-dialog"
import RouteDetails from "./route-details"
import RouteHeader from "./route-header"
import RouteOverview from "./route-overview"
import RouteTable from "./route-table"

export default function RoutesPage() {
  const routes = useDashboardRoutes()
  const vehicles = useDashboardVehicles()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<DashboardRoute | null>(
    null,
  )
  const [detailsRoute, setDetailsRoute] = useState<DashboardRoute | null>(null)

  const sortedRoutes = useMemo(
    () =>
      [...routes].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      ),
    [routes],
  )

  const handleAddRoute = () => {
    setSelectedRoute(null)
    setDialogOpen(true)
  }

  const handleEditRoute = (route: DashboardRoute) => {
    setSelectedRoute(route)
    setDialogOpen(true)
  }

  const handleSaveRoute = (route: DashboardRoute) => {
    const routeExists = routes.some((item) => item.id === route.id)

    const updatedRoutes = routeExists
      ? routes.map((item) => (item.id === route.id ? route : item))
      : [route, ...routes]

    saveDashboardRoutes(updatedRoutes)
    setDialogOpen(false)
    setSelectedRoute(null)
  }

  const handleDeleteRoute = (route: DashboardRoute) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${route.name}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    saveDashboardRoutes(routes.filter((item) => item.id !== route.id))

    if (detailsRoute?.id === route.id) {
      setDetailsRoute(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:ml-[260px] lg:px-8 lg:py-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 motion-safe:animate-[route-page-in_400ms_ease-out]">
          <RouteHeader onAddRoute={handleAddRoute} />

          <RouteOverview routes={routes} />

          <RouteTable
            routes={sortedRoutes}
            vehicles={vehicles}
            onView={setDetailsRoute}
            onEdit={handleEditRoute}
            onDelete={handleDeleteRoute}
          />
        </div>
      </main>

      <RouteDialog
        key={dialogOpen ? (selectedRoute?.id ?? "new") : "closed"}
        open={dialogOpen}
        route={selectedRoute}
        vehicles={vehicles}
        onClose={() => {
          setDialogOpen(false)
          setSelectedRoute(null)
        }}
        onSave={handleSaveRoute}
      />

      <RouteDetails
        route={detailsRoute}
        vehicles={vehicles}
        onClose={() => setDetailsRoute(null)}
      />

      <style jsx global>{`
        @keyframes route-page-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}