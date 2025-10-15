export interface VehicleFormData {
  make: string
  model: string
  variant?: string
  year: number
  price: number
  mileage: number
  transmission: string
  fuel: string // Changed from fuelType to fuel to match the form
  engineCapacity?: string
  bodyType?: string
  province: string
  city: string
  description?: string
  images?: string[]
}
