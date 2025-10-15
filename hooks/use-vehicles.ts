"use client"

import { useState, useEffect, useCallback } from "react"
import { vehicleService, VehicleError } from "@/lib/vehicle-service"
import type { Vehicle } from "@/lib/data"

interface UseVehiclesOptions {
  filters?: {
    make?: string
    model?: string
    minPrice?: number
    maxPrice?: number
    minYear?: string
    maxYear?: string
    province?: string
    city?: string
    bodyType?: string
    fuel?: string
    transmission?: string
    search?: string
  }
  limit?: number
  enableRealtime?: boolean
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { filters, limit = 20, enableRealtime = false } = options

  const fetchVehicles = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        setError(null)

        const offset = reset ? 0 : page * limit
        const result = await vehicleService.getVehicles({
          ...filters,
          limit,
          offset,
        })

        if (reset) {
          setVehicles(result.vehicles)
          setPage(0)
        } else {
          setVehicles((prev) => [...prev, ...result.vehicles])
        }

        setTotal(result.total)
        setHasMore(result.vehicles.length === limit)
      } catch (err) {
        console.error("Fetch vehicles error:", err)
        setError(err instanceof VehicleError ? err.message : "Failed to fetch vehicles")
      } finally {
        setLoading(false)
      }
    },
    [filters, limit, page],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }, [loading, hasMore])

  const refresh = useCallback(() => {
    setPage(0)
    fetchVehicles(true)
  }, [fetchVehicles])

  // Initial load and when filters change
  useEffect(() => {
    fetchVehicles(true)
  }, [filters, limit])

  // Load more when page changes
  useEffect(() => {
    if (page > 0) {
      fetchVehicles(false)
    }
  }, [page, fetchVehicles])

  // Real-time updates
  useEffect(() => {
    if (!enableRealtime) return

    const subscription = vehicleService.subscribeToVehicles((payload) => {
      console.log("Real-time vehicle update:", payload)

      if (payload.eventType === "INSERT" && payload.new.status === "active") {
        setVehicles((prev) => [payload.new, ...prev])
        setTotal((prev) => prev + 1)
      } else if (payload.eventType === "UPDATE") {
        if (payload.new.status === "active") {
          setVehicles((prev) => prev.map((vehicle) => (vehicle.id === payload.new.id ? payload.new : vehicle)))
        } else {
          // Vehicle was deactivated or deleted, remove from list
          setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== payload.new.id))
          setTotal((prev) => prev - 1)
        }
      } else if (payload.eventType === "DELETE") {
        setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== payload.old.id))
        setTotal((prev) => prev - 1)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [enableRealtime])

  return {
    vehicles,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    refresh,
  }
}
