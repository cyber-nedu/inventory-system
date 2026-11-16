import {
  CheckCircle2,
  CircleAlert,
  Truck,
  Wrench,
} from "lucide-react"
import type { DashboardVehicle } from "../dashboard-data"

type FleetOverviewProps = {
  vehicles: DashboardVehicle[]
}

const statusConfig = [
  {
    status: "Available" as const,
    label: "Available",
    icon: CheckCircle2,
    barClass: "bg-emerald-600",
    iconClass: "bg-emerald-50 text-emerald-700",
    textClass: "text-emerald-700",
  },
  {
    status: "Assigned" as const,
    label: "Assigned",
    icon: Truck,
    barClass: "bg-primary",
    iconClass: "bg-primary-light text-primary-dark",
    textClass: "text-primary",
  },
  {
    status: "Maintenance" as const,
    label: "Maintenance",
    icon: Wrench,
    barClass: "bg-amber-500",
    iconClass: "bg-amber-50 text-amber-700",
    textClass: "text-amber-700",
  },
]

export default function FleetOverview({
  vehicles,
}: FleetOverviewProps) {
  const totalVehicles = vehicles.length

  const getCount = (status: DashboardVehicle["status"]) =>
    vehicles.filter((vehicle) => vehicle.status === status).length

  const getPercentage = (count: number) =>
    totalVehicles === 0
      ? 0
      : Math.round((count / totalVehicles) * 100)

  const available = getCount("Available")
  const assigned = getCount("Assigned")
  const maintenance = getCount("Maintenance")

  const capacity = vehicles.reduce(
    (total, vehicle) => total + vehicle.passengerCapacity,
    0,
  )

  return (
    <section className="border border-border bg-foreground shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)]">
      <div className="border-b border-border px-5 py-5 sm:px-6 lg:px-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center bg-primary-light text-primary-dark">
                <Truck
                  className="h-3.5 w-3.5"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Fleet overview
              </p>
            </div>

            <h2 className="mt-2 text-lg font-bold tracking-tight text-text">
              Fleet status
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted">
              A live breakdown of the vehicles currently stored in
              this workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-border bg-background px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Fleet
              </p>

              <p className="mt-0.5 text-lg font-bold leading-none text-text">
                {totalVehicles.toString().padStart(2, "0")}
              </p>
            </div>

            <div className="border border-border bg-background px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Capacity
              </p>

              <p className="mt-0.5 text-lg font-bold leading-none text-text">
                {capacity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {totalVehicles === 0 ? (
        <div className="grid min-h-[180px] place-items-center px-5 py-10 text-center">
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-secondary text-muted">
              <CircleAlert
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-text">
              Your fleet is empty
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
              Add your first vehicle to start monitoring your fleet
              status.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 lg:p-7">
          <div
            className="flex h-2 w-full overflow-hidden bg-secondary"
            aria-label="Fleet status distribution"
          >
            {statusConfig.map((item) => {
              const count = getCount(item.status)
              const percentage = getPercentage(count)

              return (
                <div
                  key={item.status}
                  className={`${item.barClass} transition-all duration-500`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              )
            })}
          </div>

          <div className="mt-6 grid gap-0 border border-border md:grid-cols-3">
            {statusConfig.map((item) => {
              const Icon = item.icon
              const count = getCount(item.status)
              const percentage = getPercentage(count)

              return (
                <div
                  key={item.status}
                  className="border-b border-border p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center ${item.iconClass}`}
                      >
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text">
                          {item.label}
                        </p>

                        <p className="mt-1 text-[10px] text-muted">
                          {percentage}% of fleet
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xl font-bold ${item.textClass}`}
                    >
                      {count.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-4 h-1 bg-secondary">
                    <div
                      className={`h-full ${item.barClass}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}