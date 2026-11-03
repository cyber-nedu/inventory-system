import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Truck,
  Wrench,
} from "lucide-react"

const vehicleStatuses = [
  {
    label: "Available",
    count: 31,
    percentage: 74,
    icon: CheckCircle2,
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
  },
  {
    label: "Assigned",
    count: 6,
    percentage: 14,
    icon: Truck,
    color: "bg-primary",
    textColor: "text-primary",
  },
  {
    label: "Maintenance",
    count: 5,
    percentage: 12,
    icon: Wrench,
    color: "bg-amber-500",
    textColor: "text-amber-700",
  },
]

export default function VehicleStatistics() {
  return (
    <section className="border border-border bg-foreground">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Fleet management
            </p>
          </div>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-text">
            Vehicle availability
          </h2>

          <p className="mt-1 text-xs text-muted">
            Current breakdown of your fleet.
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center bg-primary-light text-primary-dark">
          <Truck className="h-4 w-4" />
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted">
              Total vehicles
            </p>

            <p className="mt-1 text-4xl font-bold tracking-tight text-text">
              42
            </p>
          </div>

          <p className="pb-1 text-xs text-muted">
            Across your fleet
          </p>
        </div>

        <div className="mt-6 flex h-2.5 w-full overflow-hidden bg-secondary">
          {vehicleStatuses.map((status) => (
            <div
              key={status.label}
              className={`${status.color} h-full`}
              style={{ width: `${status.percentage}%` }}
            />
          ))}
        </div>

        <div className="mt-6 space-y-5">
          {vehicleStatuses.map((status) => {
            const Icon = status.icon

            return (
              <div
                key={status.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center bg-secondary ${status.textColor}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-text">
                      {status.label}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted">
                      {status.percentage}% of fleet
                    </p>
                  </div>
                </div>

                <p className="text-lg font-bold text-text">
                  {status.count.toString().padStart(2, "0")}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            View fleet
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}