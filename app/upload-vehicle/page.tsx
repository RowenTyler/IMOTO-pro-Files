"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserContext"
import UploadVehicleComponent from "@/components/upload-vehicle"
import { useEffect } from "react"
import { vehicleService } from "@/lib/vehicle-service"
import type { UserProfile } from "@/types/user"
import type { VehicleFormData } from "@/types/vehicle"

export default function UploadVehiclePage() {
  const router = useRouter()
  const { user, authUser, isEmailVerified, isLoading } = useUser()

  useEffect(() => {
    console.log("🔍 Upload Vehicle Page - Current State:", {
      isLoading,
      hasAuthUser: !!authUser,
      hasUser: !!user,
      isEmailVerified,
      email: authUser?.email,
      email_confirmed_at: authUser?.email_confirmed_at,
    })

    if (!isLoading && !authUser) {
      console.log("⚠️ No authenticated user, redirecting to login")
      router.push("/login?next=/upload-vehicle")
    }
  }, [authUser, isLoading, router, isEmailVerified, user])

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("⏳ Upload page: Loading user data...")
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <p className="text-[#3E5641] dark:text-white">Loading...</p>
      </div>
    )
  }

  // Redirect if no auth user
  if (!authUser) {
    console.log("⚠️ Upload page: No auth user, should redirect")
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <p className="text-[#3E5641] dark:text-white">Redirecting to login...</p>
      </div>
    )
  }

  // Wait for user profile to load
  if (!user) {
    console.log("⏳ Upload page: Waiting for user profile...")
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <p className="text-[#3E5641] dark:text-white">Loading profile...</p>
      </div>
    )
  }

  console.log("✅ Upload page: All checks passed, showing upload form")

  const handleVehicleSubmit = async (vehicleData: VehicleFormData) => {
    if (!user) throw new Error("User is not authenticated.")

    try {
      console.log("📝 Submitting vehicle data:", vehicleData)
      await vehicleService.createVehicle(vehicleData, user.id)
      console.log("✅ Vehicle created successfully")
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Failed to submit vehicle:", err)
      throw err
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      console.log("📝 Updating profile:", updatedProfile)
      // Profile update logic would go here if needed
    } catch (err) {
      console.error("❌ Failed to save profile:", err)
      throw err
    }
  }

  return (
    <UploadVehicleComponent
      user={user as UserProfile}
      onVehicleSubmit={handleVehicleSubmit}
      onBack={handleBack}
      onSaveProfile={handleSaveProfile}
    />
  )
}
