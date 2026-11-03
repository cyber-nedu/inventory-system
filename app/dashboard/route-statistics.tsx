import Link from "next/link"
import { ArrowRight, MapPin, Route } from "lucide-react"

const recentRoutes = [
  {
    id: "RT-001",
    name: "Lagos Mainland – Island",
    origin: "Ikeja",
    destination: "Victoria Island",
    distance: "24 km",
    status: "Active",
  },
  {
    id: "RT-002",
    name: "Lagos – Ibadan Express",
    origin: "Ojota",
    destination: "Ibadan",
    distance: "128 km",
    status: "Active",
  },
  {
    id: "RT-003",
    name: "Lekki – Epe Corridor",
    origin: "Lekki",
    destination: "Epe",
    distance: "42 km",
    status: "Inactive",
  },
  {
    id: "RT-004",
    name: "Airport Transfer Route",
    origin: "Ikeja",
    destination: "Lagos Airport",
    distance: "12 km",
    status: "Active",
  },
]

export default function RouteStatistics() {
  return (
    <section className="border border-border bg-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Route management
            </p>
          </div>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-text">
            Recent routes
          </h2>

          <p className="mt-1 text-xs text-muted">
            A summary of your configured transportation routes.
          </p>
        </div>

        <Link
          href="/dashboard/routes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          View all routes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {recentRoutes.map((route) => (
          <div
            key={route.id}
            className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
                <MapPin className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-text">
                  {route.name}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  {route.id} · {route.distance}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {route.origin} <span className="px-1">→</span>{" "}
                  {route.destination}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
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

              <span className="text-xs font-medium text-muted">
                {route.distance}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-3 sm:px-6">
        <Link
          href="/dashboard/routes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          Manage routes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  )
}