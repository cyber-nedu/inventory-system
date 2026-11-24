"use client"

import { useEffect, useState } from "react"

export type RouteStatus = "Active" | "Inactive"

export type VehicleStatus = 
  | "Available"
  | "Assigned"
  | "Maintenance"

export type DashboardRoute = {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  estimatedDuration: string
  status: RouteStatus
  assignedVehicleIds: string[]
  createdAt: string
  updatedAt: string
}

export type DashboardVehicle = {
  id: string
  make: string
  model: string
  registrationNumber: string
  type: string
  passengerCapacity: number
  status: VehicleStatus
  createdAt: string
  updatedAt: string
}

const ROUTES_STORAGE_KEY = "kyyp-dashboard-routes"
const VEHICLES_STORAGE_KEY = "kyyp-dashboard-vehicles"
const DASHBOARD_DATA_EVENT = "kyyp-dashboard-data-updated"

function readStorage<T>(key: string): T[] {
  try {
    const storedData = window.localStorage.getItem(key)

    if (!storedData) {
      return []
    }

    const parsedData: unknown = JSON.parse(storedData)

    return Array.isArray(parsedData) ? (parsedData as T[]) : []
  } catch {
    return []
  }
}

function writeStorage<T>(key: string, data: T[]) {
  window.localStorage.setItem(key, JSON.stringify(data))
  window.dispatchEvent(new Event(DASHBOARD_DATA_EVENT))
}

export function saveDashboardRoutes(routes: DashboardRoute[]) {
  writeStorage(ROUTES_STORAGE_KEY, routes)
}

export function saveDashboardVehicles(vehicles: DashboardVehicle[]) {
  writeStorage(VEHICLES_STORAGE_KEY, vehicles)
}

export function useDashboardRoutes() {
  const [routes, setRoutes] = useState<DashboardRoute[]>([])

  useEffect(() => {
    const loadRoutes = () => {
      setRoutes(readStorage<DashboardRoute>(ROUTES_STORAGE_KEY))
    }

    loadRoutes()

    window.addEventListener(DASHBOARD_DATA_EVENT, loadRoutes)
    window.addEventListener("storage", loadRoutes)

    return () => {
      window.removeEventListener(DASHBOARD_DATA_EVENT, loadRoutes)
      window.removeEventListener("storage", loadRoutes)
    }
  }, [])

  return routes
}

export function useDashboardVehicles() {
  const [vehicles, setVehicles] = useState<DashboardVehicle[]>([])

  useEffect(() => {
    const loadVehicles = () => {
      setVehicles(readStorage<DashboardVehicle>(VEHICLES_STORAGE_KEY))
    }

    loadVehicles()

    window.addEventListener(DASHBOARD_DATA_EVENT, loadVehicles)
    window.addEventListener("storage", loadVehicles)

    return () => {
      window.removeEventListener(DASHBOARD_DATA_EVENT, loadVehicles)
      window.removeEventListener("storage", loadVehicles)
    }
  }, [])

  return vehicles
}