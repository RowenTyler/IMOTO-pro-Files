"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/ui/header"
import AdvancedFilters from "@/components/advanced-filters"
import VehicleCard from "@/components/vehicle-card"
import VehicleDetails from "@/components/vehicle-details"
import { useUser } from "@/components/UserContext"
import { vehicleService } from "@/lib/vehicle-service"
import type { Vehicle } from "@/types/vehicle"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, authUser, savedVehicles, toggleSaveVehicle, logout } = useUser()

  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(searchParams.toString())
    return {
      query: params.get("query") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      province: params.get("province") || "",
      bodyType: params.getAll("bodyType") || [],
      minYear: params.get("minYear") || "",
      maxYear: params.get("maxYear") || "",
      minMileage: params.get("minMileage") || "",
      maxMileage: params.get("maxMileage") || "",
      fuelType: params.getAll("fuelType") || [],
      transmission: params.get("transmission") || "",
      engineCapacityMin: params.get("engineCapacityMin") || "1.0",
      engineCapacityMax: params.get("engineCapacityMax") || "8.0",
    }
  })

  useEffect(() => {
    console.log("useEffect in ResultsPage called. Fetching vehicles with filters:", filters)
    const fetchAndSetVehicles = async () => {
      setLoading(true)
      try {
        const data = await vehicleService.getVehicles(filters)
        if (data && Array.isArray(data)) {
          setAllVehicles(data)
        } else {
          console.error("Error fetching vehicles: Invalid data format")
          setAllVehicles([])
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        setAllVehicles([])
      } finally {
        setLoading(false)
      }
    }
    fetchAndSetVehicles()
  }, [filters])

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      setFilters(newFilters)
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else if (value) {
          params.set(key, String(value))
        }
      })
      router.push(`/results?${params.toString()}`, { scroll: false })
    },
    [router],
  )

  const filteredVehicles = useMemo(() => {
    return allVehicles
  }, [allVehicles])

  const handleSignOut = async () => {
    await logout()
    router.push("/home")
  }

  const navigationHandlers = {
    onLoginClick: () => router.push("/login"),
    onDashboardClick: () => router.push("/dashboard"),
    onGoHome: () => router.push("/home"),
    onShowAllCars: () => router.push("/results"),
    onGoToSellPage: () => router.push("/upload-vehicle"),
    onSignOut: handleSignOut,
  }

  if (selectedVehicle) {
    return (
      <>
        <Header user={user} {...navigationHandlers} />
        <div className="pt-16 md:pt-20">
          <VehicleDetails
            vehicle={selectedVehicle}
            onBack={() => setSelectedVehicle(null)}
            user={user}
            isSaved={savedVehicles.has(selectedVehicle.id)}
            onToggleSave={() => toggleSaveVehicle(selectedVehicle)}
          />
        </div>
      </>
    )
  }

  const handleApplyMobileFilters = (newFilters: any) => {
    handleFilterChange(newFilters)
    setIsMobileFilterOpen(false)
  }

  const handleResetMobileFilters = () => {
    handleFilterChange({})
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header user={user} {...navigationHandlers} />
      <main className="pt-24 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <AdvancedFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search Results</h1>
              <div className="lg:hidden flex items-center gap-2 w-full justify-between sm:justify-end">
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? "Loading vehicles..." : `${filteredVehicles.length} vehicle(s) found`}
                </p>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-5 w-5" /> Filters
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                    <div className="p-4 space-y-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={() => router.push(`/vehicle-details/${vehicle.id}`)}
                    isSaved={savedVehicles.has(vehicle.id)}
                    onToggleSave={() => toggleSaveVehicle(vehicle)}
                    isLoggedIn={!!authUser}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Vehicles Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try adjusting your search filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Results</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleApplyMobileFilters}
                onResetFilters={handleResetMobileFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}
