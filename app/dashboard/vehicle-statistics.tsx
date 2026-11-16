import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
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
    <section className="border border-border bg-foreground shadow-[0_8px_30px_-28px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
            <Truck
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Fleet
            </p>

            <h2 className="mt-1 text-base font-bold tracking-tight text-text">
              Vehicle status
            </h2>
          </div>
        </div>

        <Link
          href="/dashboard/vehicles"
          aria-label="View all vehicles"
          className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-primary"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Total fleet
            </p>

            <p className="mt-1 text-4xl font-bold leading-none tracking-tight text-text">
              42
            </p>
          </div>

          <p className="text-right text-[10px] leading-4 text-muted">
            Vehicles
            <br />
            across all statuses
          </p>
        </div>

        <div className="mt-6 flex h-2 overflow-hidden bg-secondary">
          {vehicleStatuses.map((status) => (
            <div
              key={status.label}
              className={status.color}
              style={{
                width: `${status.percentage}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-5 divide-y divide-border">
          {vehicleStatuses.map((status) => {
            const Icon = status.icon

            return (
              <div
                key={status.label}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center bg-secondary ${status.textColor}`}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-text">
                      {status.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted">
                      {status.percentage}% of fleet
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold text-text">
                  {status.count}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}