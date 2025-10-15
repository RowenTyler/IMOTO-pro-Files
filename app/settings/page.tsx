"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserContext"
import ProfileSettings from "@/components/profile-settings"
import { Header } from "@/components/ui/header"
import { authService } from "@/lib/auth"
import type { UserProfile } from "@/types/user"

export default function SettingsPage() {
  const router = useRouter()
  const { user, authUser, isLoading, refreshUserProfile } = useUser()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !authUser) {
      console.log("⚠️ No authenticated user, redirecting to login")
      router.push("/login?redirect=/settings")
    }
  }, [authUser, isLoading, router])

  const handleSave = async (updatedProfile: Partial<UserProfile>, profilePictureFile?: File) => {
    if (!user) {
      throw new Error("No user found")
    }

    try {
      setIsSaving(true)
      console.log("💾 Saving profile updates:", updatedProfile)

      // Handle profile picture if provided
      let profilePicUrl = updatedProfile.profilePic

      if (profilePictureFile) {
        // For now, we'll store the base64 image directly
        // In production, you'd upload to storage service
        const reader = new FileReader()
        profilePicUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(profilePictureFile)
        })
      }

      // Update profile in database
      const { error } = await authService.updateUserProfile(user.id, {
        ...updatedProfile,
        profilePic: profilePicUrl,
      })

      if (error) {
        throw new Error(error.message)
      }

      console.log("✅ Profile updated successfully")

      // Refresh the user profile in context
      await refreshUserProfile()

      console.log("✅ User profile refreshed in context")
    } catch (error) {
      console.error("❌ Error saving profile:", error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push("/home")
    } catch (error) {
      console.error("❌ Error signing out:", error)
    }
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
    <ProfileSettings
      user={user}
      onBack={handleBack}
      onSave={handleSave}
      onSignOut={handleSignOut}
      handleLogin={() => router.push("/login")}
      handleDashboard={() => router.push("/dashboard")}
      handleGoHome={() => router.push("/home")}
      handleShowAllCars={() => router.push("/results")}
      handleGoToSell={() => router.push("/upload-vehicle")}
    />
  )
}
