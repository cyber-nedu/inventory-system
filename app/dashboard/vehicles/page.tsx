"use client"

import { useState } from "react"
import Sidebar from "@/app/components/organizationSidebar"
import DashboardBackground from "../dashboard-background"
import {
  DashboardVehicle,
  saveDashboardRoutes,
  saveDashboardVehicles,
  useDashboardRoutes,
  useDashboardVehicles,
} from "../dashboard-data"
import VehicleHeader from "./vehicle-header"
import FleetOverview from "./fleet-overview"
import VehiclesTable from "./vehicles-table"
import VehicleDialog from "./vehicle-dialog"
import VehicleDetails from "./vehicles-details"

type VehicleDialogState = {
  open: boolean
  vehicle: DashboardVehicle | null
}

export default function VehiclesPage() {
  const vehicles = useDashboardVehicles()
  const routes = useDashboardRoutes()

  const [organizationName] = useState("GIG LOGISTICS")

  const [dialog, setDialog] = useState<VehicleDialogState>({
    open: false,
    vehicle: null,
  })

  const [detailsVehicle, setDetailsVehicle] =
    useState<DashboardVehicle | null>(null)

  const openAddVehicle = () => {
    setDialog({
      open: true,
      vehicle: null,
    })
  }

  const openEditVehicle = (vehicle: DashboardVehicle) => {
    setDialog({
      open: true,
      vehicle,
    })
  }

  const closeDialog = () => {
    setDialog({
      open: false,
      vehicle: null,
    })
  }

  const handleSaveVehicle = (vehicle: DashboardVehicle) => {
    const existingVehicle = vehicles.some(
      (item) => item.id === vehicle.id,
    )

    const nextVehicles = existingVehicle
      ? vehicles.map((item) =>
          item.id === vehicle.id ? vehicle : item,
        )
      : [...vehicles, vehicle]

    saveDashboardVehicles(nextVehicles)
    closeDialog()
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    )

    if (!confirmed) {
      return
    }

    const nextVehicles = vehicles.filter(
      (vehicle) => vehicle.id !== vehicleId,
    )

    const nextRoutes = routes.map((route) => ({
      ...route,
      assignedVehicleIds: route.assignedVehicleIds.filter(
        (id) => id !== vehicleId,
      ),
    }))

    saveDashboardVehicles(nextVehicles)
    saveDashboardRoutes(nextRoutes)

    if (detailsVehicle?.id === vehicleId) {
      setDetailsVehicle(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Sidebar organizationName={organizationName} />

      <div className="relative min-h-screen overflow-hidden lg:ml-[260px]">
        <DashboardBackground />

        <div className="relative mx-auto w-full max-w-[1560px] px-3 py-3 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
          <div className="space-y-5 sm:space-y-6">
            <VehicleHeader
              vehicleCount={vehicles.length}
              onAddVehicle={openAddVehicle}
            />

            <FleetOverview vehicles={vehicles} />

            <VehiclesTable
              vehicles={vehicles}
              onView={setDetailsVehicle}
              onEdit={openEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          </div>
        </div>
      </div>

      <VehicleDialog
        open={dialog.open}
        vehicle={dialog.vehicle}
        onClose={closeDialog}
        onSave={handleSaveVehicle}
      />

      <VehicleDetails
        vehicle={detailsVehicle}
        onClose={() => setDetailsVehicle(null)}
        onEdit={(vehicle) => {
          setDetailsVehicle(null)
          openEditVehicle(vehicle)
        }}
      />
    </main>
  )
}