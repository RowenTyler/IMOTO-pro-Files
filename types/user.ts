export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  profilePic?: string | null
  suburb?: string | null
  city?: string | null
  province?: string | null
  loginMethod: "email" | "google" | "facebook" | "apple"
}

export interface Vehicle {
  id: string
  userId: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  condition: string
  description?: string
  images: string[]
  location: string
  contactPhone?: string
  contactEmail?: string
  preferredContact: string
  features: string[]
  fuelType: string
  transmission: string
  bodyType: string
  exteriorColor: string
  interiorColor: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SavedVehicle {
  id: string
  userId: string
  vehicleId: string
  createdAt: string
}
