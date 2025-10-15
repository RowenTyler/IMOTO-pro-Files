"use client"

import { useState, useEffect, useCallback } from "react"
import { vehicleService, VehicleError } from "@/lib/vehicle-service"
import { useUser } from "@/components/UserContext"
import type { Vehicle } from "@/lib/data"

export function useSavedVehicles() {
  const { user } = useUser()
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({})

  const fetchSavedVehicles = useCallback(async () => {
    if (!user) {
      setSavedVehicles([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const vehicles = await vehicleService.getSavedVehicles(user.id)
      setSavedVehicles(vehicles)
    } catch (err) {
      console.error("Fetch saved vehicles error:", err)
      setError(err instanceof VehicleError ? err.message : "Failed to fetch saved vehicles")
    } finally {
      setLoading(false)
    }
  }, [user])

  const toggleSaveVehicle = useCallback(
    async (vehicleId: string) => {
      if (!user) return false

      try {
        setSavingStates((prev) => ({ ...prev, [vehicleId]: true }))
        setError(null)

        const isSaved = await vehicleService.toggleSaveVehicle(user.id, vehicleId)

        // Update local state
        if (isSaved) {
          // Vehicle was saved - we need to fetch the vehicle details to add it
          const vehicle = await vehicleService.getVehicleById(vehicleId)
          if (vehicle) {
            setSavedVehicles((prev) => [vehicle, ...prev])
          }
        } else {
          // Vehicle was unsaved - remove it from the list
          setSavedVehicles((prev) => prev.filter((v) => v.id.toString() !== vehicleId))
        }

        return isSaved
      } catch (err) {
        console.error("Toggle save vehicle error:", err)
        setError(err instanceof VehicleError ? err.message : "Failed to save/unsave vehicle")
        return false
      } finally {
        setSavingStates((prev) => ({ ...prev, [vehicleId]: false }))
      }
    },
    [user],
  )

  const isVehicleSaved = useCallback(
    (vehicleId: string) => {
      return savedVehicles.some((v) => v.id.toString() === vehicleId)
    },
    [savedVehicles],
  )

  const isVehicleSaving = useCallback(
    (vehicleId: string) => {
      return savingStates[vehicleId] || false
    },
    [savingStates],
  )

  // Initial load
  useEffect(() => {
    fetchSavedVehicles()
  }, [fetchSavedVehicles])

  // Real-time updates for saved vehicles
  useEffect(() => {
    if (!user) return

    const subscription = vehicleService.subscribeToSavedVehicles(user.id, (payload) => {
      console.log("Real-time saved vehicle update:", payload)

      if (payload.eventType === "INSERT") {
        // Fetch the vehicle details and add to saved list
        vehicleService.getVehicleById(payload.new.vehicle_id).then((vehicle) => {
          if (vehicle) {
            setSavedVehicles((prev) => [vehicle, ...prev])
          }
        })
      } else if (payload.eventType === "DELETE") {
        setSavedVehicles((prev) => prev.filter((vehicle) => vehicle.id.toString() !== payload.old.vehicle_id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    savedVehicles,
    loading,
    error,
    toggleSaveVehicle,
    isVehicleSaved,
    isVehicleSaving,
    refresh: fetchSavedVehicles,
  }
}
