"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/components/UserContext"
import Dashboard from "@/components/dashboard"
import { Header } from "@/components/ui/header"
import type { Vehicle } from "@/types/vehicle"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, listedVehicles = [], savedVehicles = [], deleteListedVehicle, refreshVehicles, isLoading } = useUser()
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [isDeletingVehicle, setIsDeletingVehicle] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("⚠️ No user found, redirecting to login")
      router.push("/login?redirect=/dashboard")
    }

    // Check if user just signed up
    const isSignup = searchParams.get("signup")
    if (isSignup === "true" && user) {
      setShowVerificationPrompt(true)
    }
  }, [user, isLoading, router, searchParams])

  const handleEditListedCar = (vehicle: Vehicle) => {
    console.log("✏️ Editing vehicle:", vehicle.id)
    router.push(`/vehicle/${vehicle.id}/edit`)
  }

  const handleDeleteListedCar = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return
    }

    try {
      console.log("🗑️ Dashboard: Deleting vehicle:", vehicleId)
      setIsDeletingVehicle(vehicleId)

      await deleteListedVehicle(vehicleId)
      console.log("✅ Dashboard: Vehicle deleted successfully")

      // Refresh vehicles to ensure UI is in sync
      await refreshVehicles()
    } catch (error: any) {
      console.error("❌ Dashboard: Error deleting vehicle:", error)
      alert(`Failed to delete listing: ${error.message}`)
    } finally {
      setIsDeletingVehicle(null)
    }
  }

  const handleViewListedCar = (vehicle: Vehicle) => {
    console.log("👁️ Viewing vehicle:", vehicle.id)
    router.push(`/vehicle-details/${vehicle.id}`)
  }

  const handleViewSavedCar = (vehicle: Vehicle) => {
    console.log("👁️ Viewing saved vehicle:", vehicle.id)
    router.push(`/vehicle-details/${vehicle.id}`)
  }

  if (isLoading) {
    return (
      <>
        <Header user={user} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24">
          <div className="text-center">
            <p className="text-[#6F7F69] dark:text-gray-400">Loading...</p>
          </div>
        </main>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header user={user} transparent={false} />
      <main className="pt-20 md:pt-24">
        <Dashboard
          user={user}
          listedCars={Array.isArray(listedVehicles) ? listedVehicles : []}
          savedCars={Array.isArray(savedVehicles) ? savedVehicles : []}
          onEditListedCar={handleEditListedCar}
          onDeleteListedCar={handleDeleteListedCar}
          onViewListedCar={handleViewListedCar}
          onViewSavedCar={handleViewSavedCar}
          isDeletingVehicle={isDeletingVehicle}
        />
      </main>
    </>
  )
}
