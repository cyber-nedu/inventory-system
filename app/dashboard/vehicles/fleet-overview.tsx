import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  Wrench,
} from "lucide-react"
import { DashboardVehicle } from "../dashboard-data"

type FleetOverviewProps = {
  vehicles: DashboardVehicle[]
}

export default function FleetOverview({
  vehicles,
}: FleetOverviewProps) {
  const totalVehicles = vehicles.length

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Available",
  ).length

  const assignedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Assigned",
  ).length

  const maintenanceVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Maintenance",
  ).length

  const stats = [
    {
      label: "Total vehicles",
      value: totalVehicles,
      description: "Vehicles in your fleet",
      icon: Truck,
    },
    {
      label: "Available",
      value: availableVehicles,
      description: "Ready for assignment",
      icon: CheckCircle2,
    },
    {
      label: "Assigned",
      value: assignedVehicles,
      description: "Currently assigned",
      icon: AlertTriangle,
    },
    {
      label: "Maintenance",
      value: maintenanceVehicles,
      description: "Under maintenance",
      icon: Wrench,
    },
  ]

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-text">
            Fleet overview
          </h2>

          <p className="mt-1 text-xs text-muted">
            A summary of your vehicle fleet.
          </p>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Fleet statistics
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              key={stat.label}
              className="border border-border bg-foreground p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-text">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-primary-light text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted">
                {stat.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}