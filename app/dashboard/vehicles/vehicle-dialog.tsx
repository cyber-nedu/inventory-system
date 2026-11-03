
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { DashboardVehicle } from "../dashboard-data"

type VehicleDialogProps = {
  open: boolean
  vehicle: DashboardVehicle | null
  onClose: () => void
  onSave: (vehicle: DashboardVehicle) => void
}

type VehicleForm = {
  make: string
  model: string
  registrationNumber: string
  type: string
  passengerCapacity: string
  status: DashboardVehicle["status"]
}

const emptyForm: VehicleForm = {
  make: "",
  model: "",
  registrationNumber: "",
  type: "Bus",
  passengerCapacity: "",
  status: "Available",
}

export default function VehicleDialog({
  open,
  vehicle,
  onClose,
  onSave,
}: VehicleDialogProps) {
  const [form, setForm] = useState<VehicleForm>(() =>
    vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          registrationNumber: vehicle.registrationNumber,
          type: vehicle.type,
          passengerCapacity: String(vehicle.passengerCapacity),
          status: vehicle.status,
        }
      : emptyForm,
  )

  const [error, setError] = useState("")

  if (!open) {
    return null
  }

  const handleChange = (
    field: keyof VehicleForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setError("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const make = form.make.trim()
    const model = form.model.trim()
    const registrationNumber = form.registrationNumber
      .trim()
      .toUpperCase()
    const passengerCapacity = Number(form.passengerCapacity)

    if (
      !make ||
      !model ||
      !registrationNumber ||
      !form.type ||
      !form.passengerCapacity
    ) {
      setError("Please complete all required fields.")
      return
    }

    if (
      !Number.isInteger(passengerCapacity) ||
      passengerCapacity < 1
    ) {
      setError("Enter a valid passenger capacity.")
      return
    }

    onSave({
      id: vehicle?.id ?? crypto.randomUUID(),
      make,
      model,
      registrationNumber,
      type: form.type,
      passengerCapacity,
      status: form.status,
      createdAt: vehicle?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const inputClass =
    "mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-xl border border-border bg-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-text">
              {vehicle ? "Edit vehicle" : "Add vehicle"}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Enter the vehicle information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-muted hover:bg-secondary hover:text-text"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className="text-xs font-semibold text-text">
              Vehicle make
              <input
                value={form.make}
                onChange={(event) =>
                  handleChange("make", event.target.value)
                }
                placeholder="e.g. Toyota"
                className={inputClass}
              />
            </label>

            <label className="text-xs font-semibold text-text">
              Vehicle model
              <input
                value={form.model}
                onChange={(event) =>
                  handleChange("model", event.target.value)
                }
                placeholder="e.g. Hiace"
                className={inputClass}
              />
            </label>

            <label className="text-xs font-semibold text-text">
              Registration number
              <input
                value={form.registrationNumber}
                onChange={(event) =>
                  handleChange(
                    "registrationNumber",
                    event.target.value,
                  )
                }
                placeholder="e.g. ABC-123-XY"
                className={inputClass}
              />
            </label>

            <label className="text-xs font-semibold text-text">
              Vehicle type
              <select
                value={form.type}
                onChange={(event) =>
                  handleChange("type", event.target.value)
                }
                className={inputClass}
              >
                <option value="Bus">Bus</option>
                <option value="Minibus">Minibus</option>
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-text">
              Passenger capacity
              <input
                type="number"
                min="1"
                step="1"
                value={form.passengerCapacity}
                onChange={(event) =>
                  handleChange(
                    "passengerCapacity",
                    event.target.value,
                  )
                }
                placeholder="e.g. 14"
                className={inputClass}
              />
            </label>

            <label className="text-xs font-semibold text-text">
              Vehicle status
              <select
                value={form.status}
                onChange={(event) =>
                  handleChange("status", event.target.value)
                }
                className={inputClass}
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </label>

            {error && (
              <p className="text-xs font-medium text-red-600 sm:col-span-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 border border-border px-5 text-xs font-semibold text-text transition-colors hover:bg-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="min-h-10 bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {vehicle ? "Save changes" : "Add vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}