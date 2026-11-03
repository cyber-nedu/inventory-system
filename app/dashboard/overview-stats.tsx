import {
  ArrowDownRight,
  ArrowUpRight,
  Route,
  Truck,
  Wrench,
  CircleCheck,
} from "lucide-react"

const overviewStats = [
  {
    label: "Total routes",
    value: "24",
    change: "+12.5%",
    description: "Compared to last month",
    trend: "up",
    icon: Route,
  },
  {
    label: "Active routes",
    value: "18",
    change: "+8.2%",
    description: "Compared to last month",
    trend: "up",
    icon: CircleCheck,
  },
  {
    label: "Total vehicles",
    value: "42",
    change: "+4.8%",
    description: "Compared to last month",
    trend: "up",
    icon: Truck,
  },
  {
    label: "Under maintenance",
    value: "05",
    change: "-2.4%",
    description: "Compared to last month",
    trend: "down",
    icon: Wrench,
  },
]

export default function OverviewStats() {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            At a glance
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-text sm:text-xl">
            Operational overview
          </h2>

          <p className="mt-1 text-sm text-muted">
            A quick look at your transportation operations.
          </p>
        </div>

        <span className="text-xs font-medium text-muted">
          Sample overview data
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon =
            stat.trend === "up" ? ArrowUpRight : ArrowDownRight

          return (
            <article
              key={stat.label}
              className="border border-border bg-foreground p-5 transition-colors duration-200 hover:border-primary/30 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary-light text-primary-dark">
                  <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    stat.trend === "up"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {stat.change}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-muted">
                  {stat.label}
                </p>

                <p className="mt-1 text-[32px] font-bold leading-none tracking-tight text-text">
                  {stat.value}
                </p>

                <p className="mt-3 text-[11px] text-muted">
                  {stat.description}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}