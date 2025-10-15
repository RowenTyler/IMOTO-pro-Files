"use client"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Vehicle } from "@/lib/data"

interface LikedCarsProps {
  likedVehicles: Vehicle[]
  onViewAll: () => void
  onViewDetails: (vehicle: Vehicle) => void
}

export default function LikedCars({ likedVehicles, onViewAll, onViewDetails }: LikedCarsProps) {
  return (
    <Card className="rounded-3xl p-5 w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Liked Cars</h3>
        <button onClick={onViewAll} className="text-sm text-[#FF6700] dark:text-[#FF7D33] hover:underline">
          View All
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4 mt-2">
          {likedVehicles.length > 0 ? (
            likedVehicles.slice(0, 4).map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center p-3 rounded-xl hover:bg-[#FFF8E0] dark:hover:bg-[#2A352A] cursor-pointer transition-colors"
                onClick={() => onViewDetails(vehicle)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {vehicle.mileage} km • {vehicle.price}
                  </div>
                </div>
                <Heart className="w-5 h-5 text-[#FF6700] dark:text-[#FF7D33] flex-shrink-0 ml-2" fill="currentColor" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 opacity-70">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>You haven't liked any cars yet</p>
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-4 text-sm text-[#FF6700] dark:text-[#FF7D33] hover:underline"
              >
                Browse vehicles
              </button>
            </div>
          )}
        </div>
      </div>

      {likedVehicles.length > 4 && (
        <div className="mt-4 text-center">
          <button onClick={onViewAll} className="text-sm text-[#FF6700] dark:text-[#FF7D33] hover:underline">
            +{likedVehicles.length - 4} more
          </button>
        </div>
      )}
    </Card>
  )
}
