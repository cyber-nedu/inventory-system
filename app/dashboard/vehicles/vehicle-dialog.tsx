"use client"

import { useState } from "react"
import { Check, Truck, X } from "lucide-react"
import type {
  DashboardVehicle,
  VehicleStatus,
} from "../dashboard-data"

type VehicleDialogProps = {
  open: boolean
  vehicle: DashboardVehicle | null
  onClose: () => void
  onSave: (vehicle: DashboardVehicle) => void
}

type VehicleFormData = {
  make: string
  model: string
  registrationNumber: string
  type: string
  passengerCapacity: string
  status: VehicleStatus
}

const emptyForm: VehicleFormData = {
  make: "",
  model: "",
  registrationNumber: "",
  type: "",
  passengerCapacity: "",
  status: "Available",
}

type VehicleFormProps = {
  vehicle: DashboardVehicle | null
  onClose: () => void
  onSave: (vehicle: DashboardVehicle) => void
}

function VehicleForm({
  vehicle,
  onClose,
  onSave,
}: VehicleFormProps) {
  const [form, setForm] = useState<VehicleFormData>(() =>
    vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          registrationNumber:
            vehicle.registrationNumber,
          type: vehicle.type,
          passengerCapacity: String(
            vehicle.passengerCapacity,
          ),
          status: vehicle.status,
        }
      : emptyForm,
  )

  const [error, setError] = useState("")

  const updateField = <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const capacity = Number(form.passengerCapacity)

    if (
      !form.make.trim() ||
      !form.model.trim() ||
      !form.registrationNumber.trim() ||
      !form.type.trim() ||
      !form.passengerCapacity.trim()
    ) {
      setError("Please complete all required fields.")
      return
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError(
        "Enter a valid passenger capacity greater than zero.",
      )
      return
    }

    const now = new Date().toISOString()

    onSave({
      id: vehicle?.id ?? crypto.randomUUID(),
      make: form.make.trim(),
      model: form.model.trim(),
      registrationNumber:
        form.registrationNumber.trim().toUpperCase(),
      type: form.type.trim(),
      passengerCapacity: capacity,
      status: form.status,
      createdAt: vehicle?.createdAt ?? now,
      updatedAt: now,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/35 p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Close vehicle dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-foreground shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
              <Truck
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Fleet management
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-text">
                {vehicle ? "Edit vehicle" : "Add vehicle"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted">
                {vehicle
                  ? "Update the vehicle information below."
                  : "Add a vehicle to your fleet inventory."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition-colors hover:bg-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 overflow-y-auto"
        >
          <div className="space-y-6 p-5 sm:p-6">
            <div>
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Vehicle information
                </p>

                <p className="mt-1 text-xs text-muted">
                  Enter the identifying details for this vehicle.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="vehicle-make"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Make
                  </label>

                  <input
                    id="vehicle-make"
                    value={form.make}
                    onChange={(event) =>
                      updateField(
                        "make",
                        event.target.value,
                      )
                    }
                    placeholder="Toyota"
                    className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-model"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Model
                  </label>

                  <input
                    id="vehicle-model"
                    value={form.model}
                    onChange={(event) =>
                      updateField(
                        "model",
                        event.target.value,
                      )
                    }
                    placeholder="Hiace"
                    className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-registration"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Registration number
                  </label>

                  <input
                    id="vehicle-registration"
                    value={form.registrationNumber}
                    onChange={(event) =>
                      updateField(
                        "registrationNumber",
                        event.target.value,
                      )
                    }
                    placeholder="LND-204-KJ"
                    className="h-11 w-full border border-border bg-background px-3 font-mono text-sm uppercase text-text outline-none transition-colors placeholder:font-sans placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-type"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Vehicle type
                  </label>

                  <input
                    id="vehicle-type"
                    value={form.type}
                    onChange={(event) =>
                      updateField(
                        "type",
                        event.target.value,
                      )
                    }
                    placeholder="Bus"
                    className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-capacity"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Passenger capacity
                  </label>

                  <input
                    id="vehicle-capacity"
                    type="number"
                    min="1"
                    value={form.passengerCapacity}
                    onChange={(event) =>
                      updateField(
                        "passengerCapacity",
                        event.target.value,
                      )
                    }
                    placeholder="18"
                    className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-status"
                    className="mb-2 block text-xs font-semibold text-text"
                  >
                    Status
                  </label>

                  <select
                    id="vehicle-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as VehicleStatus,
                      )
                    }
                    className="h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Available">
                      Available
                    </option>
                    <option value="Assigned">
                      Assigned
                    </option>
                    <option value="Maintenance">
                      Maintenance
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 border border-border bg-foreground px-4 text-xs font-semibold text-text transition-colors hover:bg-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Check
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {vehicle ? "Save changes" : "Add vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VehicleDialog({
  open,
  vehicle,
  onClose,
  onSave,
}: VehicleDialogProps) {
  if (!open) {
    return null
  }

  const formKey = vehicle?.id ?? "new"

  return (
    <VehicleForm
      key={formKey}
      vehicle={vehicle}
      onClose={onClose}
      onSave={onSave}
    />
  )
}