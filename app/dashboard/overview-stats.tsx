import {
  ArrowDownRight,
  ArrowUpRight,
  CircleCheck,
  Route,
  Truck,
  Wrench,
} from "lucide-react"

const overviewStats = [
  {
    label: "Total routes",
    value: "24",
    change: "+12.5%",
    description: "vs last month",
    trend: "up",
    icon: Route,
  },
  {
    label: "Active routes",
    value: "18",
    change: "+8.2%",
    description: "vs last month",
    trend: "up",
    icon: CircleCheck,
  },
  {
    label: "Total vehicles",
    value: "42",
    change: "+4.8%",
    description: "vs last month",
    trend: "up",
    icon: Truck,
  },
  {
    label: "Maintenance",
    value: "05",
    change: "-2.4%",
    description: "vs last month",
    trend: "down",
    icon: Wrench,
  },
]

export default function OverviewStats() {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Overview
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-text sm:text-xl">
            Operations snapshot
          </h2>
        </div>

        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Current fleet data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border xl:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon =
            stat.trend === "up" ? ArrowUpRight : ArrowDownRight

          return (
            <article
              key={stat.label}
              className="bg-foreground p-4 transition-colors duration-200 hover:bg-background sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center bg-primary-light text-primary-dark">
                  <Icon
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                    stat.trend === "up"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-muted">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-bold leading-none tracking-tight text-text sm:text-[34px]">
                  {stat.value}
                </p>

                <p className="mt-2 text-[10px] text-muted">
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