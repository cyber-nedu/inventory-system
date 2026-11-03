import { Activity, Route, Truck, XCircle } from "lucide-react"
import type { DashboardRoute } from "../dashboard-data"

type RouteOverviewProps = {
  routes: DashboardRoute[]
}

export default function RouteOverview({ routes }: RouteOverviewProps) {
  const activeRoutes = routes.filter((route) => route.status === "Active").length
  const inactiveRoutes = routes.filter(
    (route) => route.status === "Inactive",
  ).length

  const assignedVehicles = routes.reduce(
    (total, route) => total + route.assignedVehicleIds.length,
    0,
  )

  const stats = [
    {
      label: "Total routes",
      value: routes.length,
      description: "All configured routes",
      icon: Route,
    },
    {
      label: "Active routes",
      value: activeRoutes,
      description: "Currently active",
      icon: Activity,
    },
    {
      label: "Inactive routes",
      value: inactiveRoutes,
      description: "Currently inactive",
      icon: XCircle,
    },
    {
      label: "Vehicle assignments",
      value: assignedVehicles,
      description: "Across all routes",
      icon: Truck,
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            key={stat.label}
            className="border border-border bg-foreground p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted">{stat.label}</p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted">{stat.description}</p>
          </article>
        )
      })}
    </section>
  )
}