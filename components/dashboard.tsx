"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Eye, Heart, MessageSquare, Car, Package } from "lucide-react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "./ui/header"
import VehicleDetails from "./vehicle-details"
import type { Vehicle } from "@/lib/data"
import type { UserProfile } from "@/types/user"

interface DashboardProps {
  user: UserProfile
  onSignOut: () => void
  onBack: () => void
  savedCars?: Vehicle[]
  onViewDetails?: (vehicle: Vehicle) => void
  onViewProfileSettings: () => void
  onViewUploadVehicle: () => void
  onUserUpdate?: (updatedData: Partial<UserProfile>) => void
  onEditListedCar?: (vehicle: Vehicle) => void
  onDeleteListedCar?: (vehicle: Vehicle, reason?: string) => Promise<void>
  listedCars?: Vehicle[]
  onSaveCar?: (vehicle: Vehicle) => void
  onLoginClick: () => void
  onGoHome: () => void
  onShowAllCars: () => void
  onGoToSellPage: () => void
  onNavigateToUpload: () => void
}

export default function Dashboard({
  user,
  onSignOut,
  onBack,
  savedCars = [],
  listedCars = [],
  onViewDetails,
  onViewProfileSettings,
  onViewUploadVehicle,
  onSaveCar,
  onEditListedCar,
  onDeleteListedCar,
  onLoginClick,
  onGoHome,
  onShowAllCars,
  onGoToSellPage,
}: DashboardProps) {
  const router = useRouter()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [currentCarIndex, setCurrentCarIndex] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [customDeleteReason, setCustomDeleteReason] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Ensure arrays are properly initialized
  const safeSavedCars = Array.isArray(savedCars) ? savedCars : []
  const safeListedCars = Array.isArray(listedCars) ? listedCars : []

  // Auto-rotate carousel
  useEffect(() => {
    if (safeSavedCars.length <= 1) return
    const interval = setInterval(() => {
      setCurrentCarIndex((current) => (current + 1) % safeSavedCars.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [safeSavedCars.length])

  // Handle profile settings navigation
  const handleProfileClick = () => {
    console.log("🔧 Profile card clicked - navigating to settings")
    if (onViewProfileSettings) {
      console.log("✅ Calling onViewProfileSettings prop")
      onViewProfileSettings()
    } else {
      console.log("⚠️ No onViewProfileSettings prop, using router directly")
      router.push("/settings")
    }
  }

  // Handle upload vehicle navigation
  const handleUploadClick = () => {
    console.log("📤 Upload card clicked - navigating to upload vehicle")
    if (onViewUploadVehicle) {
      console.log("✅ Calling onViewUploadVehicle prop")
      onViewUploadVehicle()
    } else {
      console.log("⚠️ No onViewUploadVehicle prop, using router directly")
      router.push("/upload-vehicle")
    }
  }

  // Handle viewing vehicle details - now with edit mode for owned vehicles
  const handleViewDetails = (vehicle: Vehicle) => {
    // Check if the current user owns this vehicle
    const isOwner = user && vehicle.user_id === user.id

    if (isOwner) {
      // Navigate to vehicle details page in edit mode for owner
      router.push(`/vehicle-details/${vehicle.id}?edit=true`)
    } else if (onViewDetails) {
      onViewDetails(vehicle)
    } else {
      // Navigate to regular vehicle details page for non-owners
      router.push(`/vehicle-details/${vehicle.id}`)
    }
  }

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle)
    setShowDeleteModal(true)
  }

  const handleEditListedCar = (vehicle: Vehicle) => {
    router.push(`/vehicle/${vehicle.id}/edit`)
  }

  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete || !onDeleteListedCar) return

    const finalReason = deleteReason === "other" ? customDeleteReason : deleteReason

    try {
      setIsDeleting(true)

      // Call the delete function with reason - this should soft delete and remove from UI
      await onDeleteListedCar(vehicleToDelete, finalReason)

      // Reset modal state
      setShowDeleteModal(false)
      setVehicleToDelete(null)
      setDeleteReason("")
      setCustomDeleteReason("")
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      // Show user-friendly error message
      alert("Failed to delete vehicle. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  // User metrics derived from props or other state
  const totalListings = safeListedCars.length
  const maxFreeListings = 5 // Assuming 5 is the limit for the free plan
  const freeListingsRemaining = Math.max(0, maxFreeListings - totalListings)
  const userMetrics = {
    listingViews: 243, // Placeholder
    saves: 18, // Placeholder
    contacts: 7, // Placeholder
  }

  // Top-level conditional returns
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">User not logged in.</div>
  }
  if (selectedVehicle) {
    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
        user={user}
        savedCars={safeSavedCars}
        onSaveCar={onSaveCar}
      />
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Top Header Section */}
      <Header
        user={user}
        onLoginClick={() => {
          /* Optionally handle login click in dashboard */
        }}
        onDashboardClick={onBack}
        onGoHome={onGoHome}
        onShowAllCars={onShowAllCars}
        onGoToSellPage={handleUploadClick}
      />

      {/* Main Content Area: Fills remaining space */}
      <main className="flex-1 px-6 pb-6 overflow-auto pt-20">
        <h1 className="text-4xl font-bold mb-6">Welcome, {user.firstName}</h1>

        {/* Desktop Layout (hidden on mobile) */}
        <div className="hidden md:block w-full mx-auto h-full">
          {/* Outer grid: 12 columns, spans full height */}
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* LEFT COLUMN (9 of 12): uses 2-row structure */}
            <div className="col-span-9 grid grid-rows-[1fr_1fr] gap-4 h-full">
              {/* ROW 1: Profile, Progress, Vehicle Uploads */}
              <div className="grid grid-cols-3 gap-4">
                {/* Profile Card */}
                <div className="col-span-1 block min-w-0">
                  <Card
                    className="rounded-3xl overflow-hidden w-full h-full transition-transform hover:scale-105 cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <div className="relative w-full h-full">
                      {user.profilePic ? (
                        <Image
                          src={user.profilePic || "/placeholder.svg"}
                          alt={`${user.firstName}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2E933C] flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-5xl font-bold mb-2">{user.firstName?.[0]?.toUpperCase() || "U"}</div>
                            <div className="text-sm">{user.firstName}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                        <h3 className="text-2xl font-bold">{user.firstName}</h3>
                        <div className="mt-2">
                          <span className="inline-block border border-white/50 rounded-full px-4 py-1 text-sm">
                            UPDATE PROFILE
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Progress Card */}
                <Card className="col-span-1 rounded-3xl p-5 w-full h-full flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#3E5641]">Listing Metrics</h3>
                      <div className="bg-[#FF6700]/10 p-1.5 rounded-full">
                        <Eye className="w-5 h-5 text-[#FF6700]" />
                      </div>
                    </div>
                    <div className="mb-4 flex items-end gap-2 filter blur-sm">
                      <div className="text-3xl font-bold text-[#3E5641]">{totalListings}</div>
                      <div className="text-lg font-medium text-[#6F7F69] pb-0.5">Total Views</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#FF6700]" />
                          <span className="font-medium text-[#3E5641]">Total Views</span>
                        </div>
                        <span className="text-lg font-bold text-[#3E5641]">{userMetrics.listingViews}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6700] rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="text-xs text-gray-500">Last 30 days</span>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xl font-bold text-[#3E5641]">{userMetrics.saves}</div>
                          <div className="text-xs text-[#6F7F69]">Saved by users</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-gray-500">Last 30 days</span>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xl font-bold text-[#3E5641]">{userMetrics.contacts}</div>
                          <div className="text-xs text-[#6F7F69]">Buyer inquiries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Vehicle Uploads Card */}
                <Card
                  className="col-span-1 rounded-3xl p-5 w-full h-full flex flex-col justify-between bg-gradient-to-br from-[#FF6700] to-[#FF9248] text-white cursor-pointer hover:shadow-lg transition-all"
                  onClick={handleUploadClick}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Vehicle Uploads</h3>
                    <Car className="w-6 h-6" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center items-center my-4">
                    <div className="bg-white/20 rounded-full p-4 mb-3">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">List a New Vehicle</p>
                      <p className="text-sm opacity-80">Quick and easy process</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* ROW 2: Subscription and Saved Cars */}
              <div className="grid grid-cols-12 md:grid-cols-9 gap-4 h-full">
                {/* Subscription Card */}
                <Card className="col-span-12 md:col-span-3 rounded-3xl w-full h-full flex flex-col">
                  <div className="p-5 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Subscription</h3>
                      <Package className="h-5 w-5 text-[#FF6700]" />
                    </div>
                  </div>
                  <div className="p-5 flex-grow">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Free Plan</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Vehicle Listings</span>
                        <span className="font-medium">
                          {totalListings}/{maxFreeListings} Used
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#FF6700] h-2 rounded-full"
                          style={{ width: `${(totalListings / maxFreeListings) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{freeListingsRemaining} free listings remaining</p>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-xl p-4">
                      <h4 className="font-medium mb-2">Premium Plans</h4>
                      <p className="text-sm text-gray-500 mb-3">Unlock unlimited listings and premium features</p>
                      <Button
                        variant="outline"
                        className="w-full text-[#FF6700] border-[#FF6700] hover:bg-[#FFF8E0] bg-transparent"
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Saved Cars Card */}
                <Card className="col-span-12 md:col-span-6 rounded-3xl overflow-hidden w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
                  <img
                    src={
                      safeSavedCars.length > 0
                        ? safeSavedCars[currentCarIndex]?.image || "/placeholder.svg?height=400&width=600"
                        : "/placeholder.svg?height=400&width=600&text=No+Saved+Cars"
                    }
                    alt={
                      safeSavedCars.length > 0
                        ? `${safeSavedCars[currentCarIndex]?.make} ${safeSavedCars[currentCarIndex]?.model}`
                        : "No saved cars"
                    }
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="relative z-20 h-full flex flex-col justify-between p-6">
                    <div className="flex justify-between">
                      <span
                        onClick={() => router.push("/liked-cars-page")}
                        className="bg-[#FF6700] text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-[#FF7D33] transition-colors"
                      >
                        View Saved Cars
                      </span>
                      {safeSavedCars.length > 0 && (
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {safeSavedCars.length} saved cars
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-end">
                      {safeSavedCars.length > 0 ? (
                        <>
                          <div
                            className="text-white cursor-pointer"
                            onClick={() => handleViewDetails(safeSavedCars[currentCarIndex])}
                          >
                            <h3 className="text-2xl font-bold mb-1">
                              {safeSavedCars[currentCarIndex]?.year} {safeSavedCars[currentCarIndex]?.make}{" "}
                              {safeSavedCars[currentCarIndex]?.model}
                            </h3>
                            <p className="text-white/80 mb-2">
                              {safeSavedCars[currentCarIndex]?.variant} • {safeSavedCars[currentCarIndex]?.mileage} km
                            </p>
                            <p className="text-xl font-bold text-[#FF6700]">{safeSavedCars[currentCarIndex]?.price}</p>
                          </div>
                          <Button
                            className="bg-white text-[#3E5641] hover:bg-white/90"
                            onClick={() => {
                              if (safeSavedCars[currentCarIndex]) {
                                window.open(
                                  `mailto:${safeSavedCars[currentCarIndex].sellerEmail}?subject=Inquiry about your ${safeSavedCars[currentCarIndex].year} ${safeSavedCars[currentCarIndex].make} ${safeSavedCars[currentCarIndex].model}&body=Hello ${safeSavedCars[currentCarIndex].sellerName},%0D%0A%0D%0AI am interested in your ${safeSavedCars[currentCarIndex].year} ${safeSavedCars[currentCarIndex].make} ${safeSavedCars[currentCarIndex].model} listed for ${safeSavedCars[currentCarIndex].price}.%0D%0A%0D%0APlease contact me with more information.%0D%0A%0D%0AThank you.`,
                                )
                              }
                            }}
                          >
                            Contact Seller
                          </Button>
                        </>
                      ) : (
                        <div className="text-white text-center w-full">
                          <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <h3 className="text-xl font-bold mb-1">No Saved Cars</h3>
                          <p className="text-white/80 mb-4">Save cars you're interested in to see them here</p>
                          <Button className="bg-white text-[#3E5641] hover:bg-white/90" onClick={onShowAllCars}>
                            Browse Cars
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Carousel indicators */}
                    {safeSavedCars.length > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {safeSavedCars.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentCarIndex === index ? "bg-white w-4" : "bg-white/40"
                            }`}
                            onClick={() => setCurrentCarIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* RIGHT COLUMN (3 of 12): Recently Listed Cars */}
            <div className="col-span-12 md:col-span-3 h-full">
              <Card className="rounded-3xl w-full h-full flex flex-col">
                <div className="p-5 border-b flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Recently Listed Cars</h3>
                  <Button variant="ghost" size="sm" className="text-[#FF6700]">
                    View All
                  </Button>
                </div>

                <div className="flex-grow overflow-auto p-3">
                  {safeListedCars.length > 0 ? (
                    safeListedCars.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex items-center gap-3 p-3 mb-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(vehicle)}
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={vehicle.images?.[0] || vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-medium truncate">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.price}</div>
                        </div>
                        <div className="flex items-center ml-2">
                          {/* Edit button */}
                          {onEditListedCar && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditListedCar(vehicle)
                              }}
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          {/* Delete button */}
                          {onDeleteListedCar && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteVehicle(vehicle)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No cars listed yet.</p>
                      <p className="text-sm">List your first car below!</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleUploadClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Listing
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Layout (shown only on mobile) */}
        <div className="md:hidden w-full mx-auto h-full">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Profile Card */}
            <div className="col-span-1" onClick={handleProfileClick}>
              <Card className="rounded-xl overflow-hidden aspect-square transition-transform hover:scale-105 cursor-pointer flex flex-col justify-end">
                <div className="relative w-full h-full">
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic || "/placeholder.svg"}
                      alt={`${user.firstName}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2E933C] flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{user.firstName?.[0]?.toUpperCase() || "U"}</div>
                        <div className="text-xs">{user.firstName}</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="text-sm font-bold">{user.firstName}</h3>
                  </div>
                </div>
              </Card>
            </div>

            {/* Metrics */}
            <Card className="col-span-1 rounded-xl p-2 flex flex-col items-center justify-center">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold text-[#3E5641]">Metrics</h3>
                <Eye className="w-3 h-3 text-[#FF6700]" />
              </div>
              <div className="text-xl font-bold text-[#3E5641]">{totalListings}</div>
              <div className="text-xs text-[#6F7F69]">Listings</div>
            </Card>

            {/* Uploads Card */}
            <Card
              className="col-span-1 rounded-xl p-2 flex flex-col items-center justify-center bg-gradient-to-br from-[#FF6700] to-[#FF9248] text-white cursor-pointer"
              onClick={handleUploadClick}
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-semibold mt-1">Upload</span>
            </Card>

            {/* Subscription Card */}
            <Card className="col-span-1 rounded-xl p-2 flex flex-col items-center justify-center">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold text-[#3E5641]">Plan</h3>
                <Package className="h-3 w-3 text-[#FF6700]" />
              </div>
              <div className="text-xl font-bold text-[#3E5641]">Free</div>
              <div className="text-xs text-[#6F7F69]">{freeListingsRemaining} left</div>
            </Card>
          </div>

          {/* Saved Cars Card (Full width on mobile) */}
          <Card className="rounded-lg overflow-hidden w-full h-40 relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
            <img
              src={
                safeSavedCars.length > 0
                  ? safeSavedCars[currentCarIndex]?.image || "/placeholder.svg?height=400&width=600"
                  : "/placeholder.svg?height=400&width=600&text=No+Saved+Cars"
              }
              alt={
                safeSavedCars.length > 0
                  ? `${safeSavedCars[currentCarIndex]?.make} ${safeSavedCars[currentCarIndex]?.model}`
                  : "No saved cars"
              }
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
            <div className="relative z-20 h-full flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <span
                  onClick={() => router.push("/liked-cars-page")}
                  className="bg-[#FF6700] text-white px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-[#FF7D33] transition-colors"
                >
                  View Saved Cars
                </span>
                {safeSavedCars.length > 0 && (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                    {safeSavedCars.length} saved cars
                  </span>
                )}
              </div>
              <div className="flex justify-between items-end">
                {safeSavedCars.length > 0 ? (
                  <>
                    <div
                      className="text-white cursor-pointer"
                      onClick={() => handleViewDetails(safeSavedCars[currentCarIndex])}
                    >
                      <h3 className="text-lg font-bold">
                        {safeSavedCars[currentCarIndex]?.year} {safeSavedCars[currentCarIndex]?.make}{" "}
                        {safeSavedCars[currentCarIndex]?.model}
                      </h3>
                      <p className="text-white/80 text-xs mb-1">
                        {safeSavedCars[currentCarIndex]?.variant} • {safeSavedCars[currentCarIndex]?.mileage} km
                      </p>
                      <p className="text-lg font-bold text-[#FF6700]">{safeSavedCars[currentCarIndex]?.price}</p>
                    </div>
                    <Button
                      className="bg-white text-[#3E5641] hover:bg-white/90 text-xs h-auto py-1.5 px-3"
                      onClick={() => {
                        if (safeSavedCars[currentCarIndex]) {
                          window.open(
                            `mailto:${safeSavedCars[currentCarIndex].sellerEmail}?subject=Inquiry about your ${safeSavedCars[currentCarIndex].year} ${safeSavedCars[currentCarIndex].make} ${safeSavedCars[currentCarIndex].model}&body=Hello ${safeSavedCars[currentCarIndex].sellerName},%0D%0A%0D%0AI am interested in your ${safeSavedCars[currentCarIndex].year} ${safeSavedCars[currentCarIndex].make} ${safeSavedCars[currentCarIndex].model} listed for ${safeSavedCars[currentCarIndex].price}.%0D%0A%0D%0APlease contact me with more information.%0D%0A%0D%0AThank you.`,
                          )
                        }
                      }}
                    >
                      Contact
                    </Button>
                  </>
                ) : (
                  <div className="text-white text-center w-full">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <h3 className="text-base font-bold mb-1">No Saved Cars</h3>
                    <p className="text-white/80 text-xs mb-3">Save cars you're interested in to see them here</p>
                    <Button
                      className="bg-white text-[#3E5641] hover:bg-white/90 text-xs h-auto py-1.5 px-3"
                      onClick={onShowAllCars}
                    >
                      Browse Cars
                    </Button>
                  </div>
                )}
              </div>
              {/* Carousel indicators */}
              {safeSavedCars.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {safeSavedCars.map((_, index) => (
                    <button
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        currentCarIndex === index ? "bg-white w-3" : "bg-white/40"
                      }`}
                      onClick={() => setCurrentCarIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Recently Listed Cars (Full width on mobile) */}
          <Card className="col-span-4 rounded-3xl w-full h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recently Listed</h3>
              <Button variant="ghost" size="sm" className="text-[#FF6700]">
                View All
              </Button>
            </div>
            <div className="flex-grow overflow-auto p-2">
              {safeListedCars.length > 0 ? (
                safeListedCars.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center gap-2 p-2 mb-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(vehicle)}
                  >
                    <div className="w-12 h-9 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={vehicle.images?.[0] || vehicle.image || "/placeholder.svg"}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-sm truncate">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-xs text-gray-500">{vehicle.price}</div>
                    </div>
                    <div className="flex items-center ml-1">
                      {onEditListedCar && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditListedCar(vehicle)
                          }}
                        >
                          <Edit className="h-3 w-3 text-blue-500" />
                        </Button>
                      )}
                      {onDeleteListedCar && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteVehicle(vehicle)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">
                  <Car className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No cars listed yet.</p>
                  <p className="text-xs">List your first car below!</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t">
              <Button variant="outline" className="w-full text-sm bg-transparent" onClick={handleUploadClick}>
                <Plus className="mr-1 h-3 w-3" />
                Add New Listing
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Vehicle Listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your {vehicleToDelete?.year} {vehicleToDelete?.make}{" "}
              {vehicleToDelete?.model} listing?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for deletion:</label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6700] focus:border-transparent"
                disabled={isDeleting}
              >
                <option value="">Select a reason</option>
                <option value="sold">Vehicle has been sold</option>
                <option value="no_longer_selling">No longer selling</option>
                <option value="no_longer_need_service">No longer need the service</option>
                <option value="other">Other</option>
              </select>
            </div>

            {deleteReason === "other" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Please specify:</label>
                <textarea
                  value={customDeleteReason}
                  onChange={(e) => setCustomDeleteReason(e.target.value)}
                  placeholder="Please provide your reason..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6700] focus:border-transparent"
                  rows={3}
                  disabled={isDeleting}
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setVehicleToDelete(null)
                  setDeleteReason("")
                  setCustomDeleteReason("")
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteVehicle}
                disabled={!deleteReason || (deleteReason === "other" && !customDeleteReason.trim()) || isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete Listing"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
