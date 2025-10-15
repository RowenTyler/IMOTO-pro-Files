"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/components/UserContext"
import { vehicleService } from "@/lib/vehicle-service"
import UploadVehicle from "@/components/upload-vehicle"
import { Header } from "@/components/ui/header"
import type { Vehicle } from "@/types/vehicle"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditVehiclePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVehicle() {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid vehicle ID")
        setIsLoading(false)
        return
      }

      if (!user) {
        console.log("⚠️ No user found, redirecting to login")
        router.push(`/login?redirect=/vehicle/${params.id}/edit`)
        return
      }

      try {
        console.log("🔍 Loading vehicle for edit:", params.id)
        const vehicleData = await vehicleService.getVehicleById(params.id)

        if (!vehicleData) {
          console.error("❌ Vehicle not found")
          setError("Vehicle not found")
          setIsLoading(false)
          return
        }

        // Check if user owns this vehicle
        if (vehicleData.userId !== user.id) {
          console.error("❌ User does not own this vehicle")
          setError("You don't have permission to edit this vehicle")
          setIsLoading(false)
          return
        }

        console.log("✅ Vehicle loaded successfully:", vehicleData)
        setVehicle(vehicleData)
        setError(null)
      } catch (err: any) {
        console.error("❌ Error loading vehicle:", err)
        setError(err.message || "Failed to load vehicle")
      } finally {
        setIsLoading(false)
      }
    }

    loadVehicle()
  }, [params.id, user, router])

  const handleSuccess = () => {
    console.log("✅ Vehicle updated successfully, redirecting to dashboard")
    router.push("/dashboard")
  }

  const handleCancel = () => {
    console.log("❌ Edit cancelled, returning to dashboard")
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <>
        <Header user={user} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24 min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#FF6700] mx-auto" />
            <p className="text-[#6F7F69] dark:text-gray-400">Loading vehicle details...</p>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header user={user} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24 min-h-screen">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-[#2A352A] p-8 rounded-3xl shadow-lg border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#3E5641] dark:text-white">Error Loading Vehicle</h2>
                <p className="text-[#6F7F69] dark:text-gray-400">{error}</p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-[#FF6700] text-white hover:bg-[#FF6700]/90 dark:bg-[#FF7D33] dark:hover:bg-[#FF7D33]/90"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!vehicle) {
    return (
      <>
        <Header user={user} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24 min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-[#6F7F69] dark:text-gray-400">Vehicle not found</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#FF6700] text-white hover:bg-[#FF6700]/90 dark:bg-[#FF7D33] dark:hover:bg-[#FF7D33]/90"
            >
              Return to Dashboard
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header user={user} transparent={false} />
      <main className="pt-20 md:pt-24">
        <UploadVehicle existingVehicle={vehicle} onSuccess={handleSuccess} onCancel={handleCancel} />
      </main>
    </>
  )
}
