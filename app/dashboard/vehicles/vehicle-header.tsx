import { Plus, Truck } from "lucide-react"

type VehicleHeaderProps = {
  onAddVehicle: () => void
}

export default function VehicleHeader({
  onAddVehicle,
}: VehicleHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
      <div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Transportation management
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Vehicles
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Manage your fleet, keep track of vehicle availability, and
          organize the vehicles assigned to your transportation routes.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddVehicle}
        className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <Plus className="h-4 w-4" />
        Add vehicle
      </button>
    </header>
  )
}