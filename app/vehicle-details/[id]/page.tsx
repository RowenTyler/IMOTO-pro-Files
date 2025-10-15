import { notFound } from "next/navigation"
import VehicleDetails from "@/components/vehicle-details"
import { vehicleService } from "@/lib/vehicle-service"
import { Header } from "@/components/ui/header"

interface VehicleDetailsPageProps {
  params: {
    id: string
  }
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
  const vehicle = await vehicleService.getVehicleById(params.id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <Header
        user={null}
        onLoginClick={() => {}}
        onDashboardClick={() => {}}
        onGoHome={() => {}}
        onShowAllCars={() => {}}
        onGoToSellPage={() => {}}
        onSignOut={() => {}}
      />
      <div className="pt-16 md:pt-20">
        <VehicleDetails
          vehicle={vehicle}
          onBack={() => window.history.back()}
          user={null}
          savedCars={[]}
          onSaveCar={() => {}}
        />
      </div>
    </div>
  )
}
