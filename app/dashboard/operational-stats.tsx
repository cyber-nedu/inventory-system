import { Activity, Gauge, Route, Truck } from "lucide-react"

const performanceStats = [
  {
    label: "Fleet availability",
    value: 74,
    description: "31 of 42 vehicles available",
    icon: Truck,
  },
  {
    label: "Active route coverage",
    value: 75,
    description: "18 of 24 routes active",
    icon: Route,
  },
  {
    label: "Operational efficiency",
    value: 86,
    description: "Based on sample operational data",
    icon: Gauge,
  },
]

export default function OperationalStats() {
  return (
    <section className="border border-border bg-foreground p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Performance
            </p>
          </div>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-text sm:text-xl">
            Operational performance
          </h2>

          <p className="mt-1 text-sm text-muted">
            Monitor how your routes and fleet are performing.
          </p>
        </div>

        <span className="border border-border px-3 py-2 text-[11px] font-medium text-muted">
          Demo metrics
        </span>
      </div>

      <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-6">
        {performanceStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.label}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center bg-primary-light text-primary-dark">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  <p className="text-sm font-semibold text-text">
                    {stat.label}
                  </p>
                </div>

                <span className="text-lg font-bold text-text">
                  {stat.value}%
                </span>
              </div>

              <div
                className="mt-4 h-2 overflow-hidden bg-secondary"
                role="progressbar"
                aria-label={stat.label}
                aria-valuenow={stat.value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${stat.value}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-muted">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}