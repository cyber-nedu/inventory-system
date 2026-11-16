import Link from "next/link"
import {
  ArrowRight,
  MapPin,
  Route,
} from "lucide-react"

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
    <section className="border border-border bg-foreground shadow-[0_8px_30px_-28px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
            <Route
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Routes
            </p>

            <h2 className="mt-1 text-base font-bold tracking-tight text-text">
              Recent routes
            </h2>
          </div>
        </div>

        <Link
          href="/dashboard/routes"
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 px-2 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {recentRoutes.map((route) => (
          <div
            key={route.id}
            className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-secondary text-muted transition-colors group-hover:bg-primary-light group-hover:text-primary-dark">
                <MapPin
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-text">
                    {route.name}
                  </h3>

                  <span className="text-[9px] font-medium uppercase tracking-wider text-muted">
                    {route.id}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted">
                  {route.origin}
                  <span className="mx-1.5 text-primary">
                    →
                  </span>
                  {route.destination}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 pl-12 sm:justify-end sm:pl-0">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  route.status === "Active"
                    ? "text-emerald-700"
                    : "text-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 ${
                    route.status === "Active"
                      ? "bg-emerald-600"
                      : "bg-muted"
                  }`}
                />
                {route.status}
              </span>

              <span className="text-xs font-bold text-text">
                {route.distance}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-background px-5 py-3 sm:px-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          4 configured routes
        </p>

        <Link
          href="/dashboard/routes"
          className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary hover:text-primary-dark"
        >
          Manage routes
        </Link>
      </div>
    </section>
  )
}