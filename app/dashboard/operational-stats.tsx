import {
  Activity,
  Gauge,
  Route,
  Truck,
} from "lucide-react"

const performanceStats = [
  {
    label: "Fleet availability",
    value: 74,
    count: "31 / 42",
    description: "vehicles available",
    icon: Truck,
  },
  {
    label: "Route coverage",
    value: 75,
    count: "18 / 24",
    description: "routes active",
    icon: Route,
  },
  {
    label: "Operational efficiency",
    value: 86,
    count: "86%",
    description: "sample operational score",
    icon: Gauge,
  },
]

export default function OperationalStats() {
  return (
    <section className="border border-border bg-foreground shadow-[0_8px_30px_-28px_rgba(15,23,42,0.4)]">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Performance
            </p>
          </div>

          <h2 className="mt-1.5 text-base font-bold tracking-tight text-text sm:text-lg">
            Operational performance
          </h2>
        </div>

        <span className="self-start border border-border bg-background px-2.5 py-1.5 text-[10px] font-medium text-muted sm:self-auto">
          Demo metrics
        </span>
      </div>

      <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {performanceStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.label} className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-secondary text-primary">
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-[10px] text-muted">
                      {stat.count} {stat.description}
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-text">
                  {stat.value}%
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}