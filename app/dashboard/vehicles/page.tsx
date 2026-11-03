"use client"

import { useState } from "react"
import Sidebar from "@/app/components/organizationSidebar"
import {
  DashboardVehicle,
  saveDashboardRoutes,
  saveDashboardVehicles,
  useDashboardRoutes,
  useDashboardVehicles,
} from "../dashboard-data"
import FleetOverview from "./fleet-overview"
import VehicleHeader from "./vehicle-header"
import VehicleDialog from "./vehicle-dialog"
import VehiclesDetails from "./vehicles-details"
import VehiclesTable from "./vehicles-table"

export default function VehiclesPage() {
  const vehicles = useDashboardVehicles()
  const routes = useDashboardRoutes()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] =
    useState<DashboardVehicle | null>(null)

  const handleAddVehicle = () => {
    setSelectedVehicle(null)
    setDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: DashboardVehicle) => {
    setSelectedVehicle(vehicle)
    setDialogOpen(true)
  }

  const handleViewVehicle = (vehicle: DashboardVehicle) => {
    setSelectedVehicle(vehicle)
    setDetailsOpen(true)
  }

  const handleSaveVehicle = (vehicle: DashboardVehicle) => {
    const vehicleExists = vehicles.some(
      (item) => item.id === vehicle.id,
    )

    const updatedVehicles = vehicleExists
      ? vehicles.map((item) =>
          item.id === vehicle.id ? vehicle : item,
        )
      : [vehicle, ...vehicles]

    saveDashboardVehicles(updatedVehicles)
    setDialogOpen(false)
    setSelectedVehicle(null)
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    )

    if (!confirmed) {
      return
    }

    const updatedVehicles = vehicles.filter(
      (vehicle) => vehicle.id !== vehicleId,
    )

    const updatedRoutes = routes.map((route) => ({
      ...route,
      assignedVehicleIds: route.assignedVehicleIds.filter(
        (id) => id !== vehicleId,
      ),
    }))

    saveDashboardVehicles(updatedVehicles)
    saveDashboardRoutes(updatedRoutes)

    if (selectedVehicle?.id === vehicleId) {
      setSelectedVehicle(null)
      setDetailsOpen(false)
    }
  }

  return (
    <main>
      <Sidebar />

      <div className="min-h-screen bg-secondary lg:ml-[260px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-9">
          <VehicleHeader onAddVehicle={handleAddVehicle} />

          <div className="space-y-8 pb-12">
            <FleetOverview vehicles={vehicles} />

            <VehiclesTable
              vehicles={vehicles}
              onView={handleViewVehicle}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          </div>
        </div>
      </div>

      <VehicleDialog
        key={`${dialogOpen ? "open" : "closed"}-${selectedVehicle?.id ?? "new"}`}
        open={dialogOpen}
        vehicle={selectedVehicle}
        onClose={() => {
          setDialogOpen(false)
          setSelectedVehicle(null)
        }}
        onSave={handleSaveVehicle}
      />

      <VehiclesDetails
        open={detailsOpen}
        vehicle={selectedVehicle}
        onClose={() => {
          setDetailsOpen(false)
          setSelectedVehicle(null)
        }}
        onEdit={() => {
          if (!selectedVehicle) {
            return
          }

          setDetailsOpen(false)
          setDialogOpen(true)
        }}
      />
    </main>
  )
}