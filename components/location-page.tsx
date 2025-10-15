"use client"

import { useState } from "react"
import type { Vehicle } from "@/lib/data"
import { Header } from "./ui/header" // Ensure Header is imported
import type { UserProfile } from "./dashboard"; // Import UserProfile

interface LocationPageProps {
  province: string
  vehicles: Vehicle[]
  onBack: () => void
  user: UserProfile | null // Use UserProfile type
  // Add missing Header props to LocationPageProps
  onLoginClick: () => void;
  onDashboardClick: () => void; // Keep this as it navigates back to dashboard
  onGoHome: () => void;
  onShowAllCars: () => void;
  onGoToSellPage: () => void;
  onSignOut: () => void;
}

export default function LocationPage({ province, vehicles, onBack, user, onLoginClick, onDashboardClick, onGoHome, onShowAllCars, onGoToSellPage, onSignOut }: LocationPageProps) {
  const [selectedCity, setSelectedCity] = useState("")

  // Filter vehicles based on province and selected city.
  const filteredVehicles = vehicles.filter(
    (v) => v.province === province && (selectedCity ? v.city === selectedCity : true),
  )

  // Unique list of cities.
  const cities = [...new Set(vehicles.filter((v) => v.province === province).map((v) => v.city))]

  return (
    <div className="min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      {/* Add Header component */}
      <Header
        user={user} // Pass the user prop
        onLoginClick={onLoginClick} // Use prop
        onDashboardClick={onDashboardClick} // Use prop
        onGoHome={onGoHome} // Use prop
        onShowAllCars={onShowAllCars} // Use prop
        onGoToSellPage={onGoToSellPage} // Use prop
        onSignOut={onSignOut} // Use prop
        transparent={false}
      />

      <div className="pt-20 pb-10"> {/* Added padding for header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Added max-width and padding */}
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center text-[#FF6700] dark:text-[#FF7D33] hover:underline"
          >
            &larr; Back to Listings
          </button>

          <h2 className="text-3xl font-bold mb-4 text-[#3E5641] dark:text-white">{province}</h2>
          <div className="mb-6">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 rounded-md border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-[#2A352A] border border-[#9FA791]/20 dark:border-[#4A4D45]/20 rounded-lg shadow hover:shadow-md transition-shadow p-4"
              >
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <h3 className="text-lg font-semibold mt-2 text-[#3E5641] dark:text-white">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-[#6F7F69] dark:text-gray-300">{vehicle.price}</p>
              </div>
            ))}
            {filteredVehicles.length === 0 && <p className="text-[#6F7F69] dark:text-gray-300">No vehicles found in this area.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
