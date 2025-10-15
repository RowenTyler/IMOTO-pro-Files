"use client"

import type { Vehicle } from "@/types/user"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit } from "lucide-react"

interface MyListingCardProps {
  vehicle: Vehicle
  onEdit: (vehicleId: string) => void
}

export function MyListingCard({ vehicle, onEdit }: MyListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-white dark:bg-[#2A352A] border-[#9FA791]/20 dark:border-[#4A4D45]/20 rounded-2xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={vehicle.images?.[0] || "/placeholder.svg?width=400&height=300&query=car"}
            alt={`${vehicle.make} ${vehicle.model}`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold truncate text-[#3E5641] dark:text-white">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </CardTitle>
        <p className="text-lg font-semibold text-[#FF6700] dark:text-[#FF7D33] mt-1">{formatPrice(vehicle.price)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.mileage.toLocaleString()} km</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onEdit(vehicle.id)}
          className="w-full bg-gray-100 text-[#3E5641] hover:bg-gray-200 dark:bg-[#1F2B20] dark:text-white dark:hover:bg-[#3E5641]"
          variant="outline"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Listing
        </Button>
      </CardFooter>
    </Card>
  )
}
