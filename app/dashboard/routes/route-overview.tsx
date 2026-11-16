import { Activity, ArrowUpRight, Route, Truck, XCircle } from "lucide-react"
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

  const activeRatio =
    routes.length > 0 ? Math.round((activeRoutes / routes.length) * 100) : 0

  const stats = [
    {
      label: "Total routes",
      value: routes.length,
      description: "All configured routes",
      icon: Route,
      iconClassName: "bg-primary/8 text-primary",
      valueClassName: "text-text",
    },
    {
      label: "Active routes",
      value: activeRoutes,
      description: `${activeRatio}% of all routes`,
      icon: Activity,
      iconClassName: "bg-emerald-50 text-emerald-700",
      valueClassName: "text-text",
      indicator: true,
    },
    {
      label: "Inactive routes",
      value: inactiveRoutes,
      description: "Currently inactive",
      icon: XCircle,
      iconClassName: "bg-secondary text-muted",
      valueClassName: "text-text",
    },
    {
      label: "Vehicle assignments",
      value: assignedVehicles,
      description: "Across all routes",
      icon: Truck,
      iconClassName: "bg-primary-light text-primary",
      valueClassName: "text-text",
    },
  ]

  return (
    <section
      aria-label="Route overview"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            key={stat.label}
            className="group border border-border bg-foreground p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{stat.label}</p>

                <p
                  className={`mt-3 text-3xl font-bold tracking-tight ${stat.valueClassName}`}
                >
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105 ${stat.iconClassName}`}
              >
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-muted">{stat.description}</p>

              {stat.indicator ? (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <ArrowUpRight
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                  Active
                </div>
              ) : null}
            </div>

            {stat.indicator ? (
              <div
                className="mt-4 h-1 overflow-hidden bg-secondary"
                aria-label={`${activeRatio}% of routes are active`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={activeRatio}
              >
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${activeRatio}%` }}
                />
              </div>
            ) : null}
          </article>
        )
      })}
    </section>
  )
}