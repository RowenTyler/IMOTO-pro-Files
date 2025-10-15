import { supabase } from "./supabase"
import type { Vehicle } from "@/lib/data"
import type { VehicleFormData } from "@/types/vehicle"

/**
 * Get all vehicles from the database
 */
async function getVehicles(): Promise<Vehicle[]> {
  try {
    console.log("🚗 Fetching all vehicles from database")

    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .or("status.eq.active,status.is.null")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching vehicles:", error)
      return []
    }

    console.log(`✅ Fetched ${data?.length || 0} vehicles`)

    return (data || []).map(mapDatabaseToVehicle)
  } catch (error) {
    console.error("❌ Error in getVehicles:", error)
    return []
  }
}

/**
 * Get a single vehicle by ID
 */
async function getVehicleById(id: string): Promise<Vehicle | null> {
  try {
    console.log("🚗 Fetching vehicle:", id)

    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .eq("id", id)
      .is("deleted_at", null)
      .single()

    if (error) {
      console.error("❌ Error fetching vehicle:", error)
      return null
    }

    if (!data) {
      console.log("⚠️ Vehicle not found")
      return null
    }

    console.log("✅ Vehicle fetched successfully")
    return mapDatabaseToVehicle(data)
  } catch (error) {
    console.error("❌ Error in getVehicleById:", error)
    return null
  }
}

/**
 * Get vehicles by user ID
 */
async function getUserVehicles(userId: string): Promise<Vehicle[]> {
  try {
    console.log("🚗 Fetching vehicles for user:", userId)

    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .eq("user_id", userId)
      .or("status.eq.active,status.is.null")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching user vehicles:", error)
      return []
    }

    console.log(`✅ Fetched ${data?.length || 0} vehicles for user`)

    return (data || []).map(mapDatabaseToVehicle)
  } catch (error) {
    console.error("❌ Error in getUserVehicles:", error)
    return []
  }
}

/**
 * Create a new vehicle
 */
async function createVehicle(vehicleData: VehicleFormData, userId: string): Promise<Vehicle> {
  try {
    console.log("➕ Creating new vehicle for user:", userId)
    console.log("Vehicle data received:", vehicleData)

    const dbData = mapVehicleToDatabase(vehicleData, userId)
    console.log("Mapped database data:", dbData)

    const { data, error } = await supabase
      .from("vehicles")
      .insert(dbData)
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .single()

    if (error) {
      console.error("❌ Error creating vehicle:", error)
      throw new Error(`Failed to create vehicle: ${error.message}`)
    }

    if (!data) {
      throw new Error("No data returned from vehicle creation")
    }

    console.log("✅ Vehicle created successfully:", data.id)
    return mapDatabaseToVehicle(data)
  } catch (error) {
    console.error("❌ Error in createVehicle:", error)
    throw error
  }
}

/**
 * Update an existing vehicle
 */
async function updateVehicle(
  vehicleId: string,
  vehicleData: Partial<VehicleFormData>,
  userId: string,
): Promise<Vehicle> {
  try {
    console.log("📝 Updating vehicle:", vehicleId)

    // First verify ownership
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("user_id")
      .eq("id", vehicleId)
      .single()

    if (fetchError || !existingVehicle) {
      console.error("❌ Vehicle not found:", vehicleId)
      throw new Error("Vehicle not found")
    }

    if (existingVehicle.user_id !== userId) {
      console.error("❌ User does not own this vehicle")
      throw new Error("Unauthorized: You don't own this vehicle")
    }

    // Map the data to database format
    const dbUpdates: Record<string, any> = {}

    if (vehicleData.make !== undefined) dbUpdates.make = vehicleData.make
    if (vehicleData.model !== undefined) dbUpdates.model = vehicleData.model
    if (vehicleData.variant !== undefined) dbUpdates.variant = vehicleData.variant
    if (vehicleData.year !== undefined) dbUpdates.year = vehicleData.year
    if (vehicleData.price !== undefined) dbUpdates.price = vehicleData.price
    if (vehicleData.mileage !== undefined) dbUpdates.mileage = vehicleData.mileage
    if (vehicleData.transmission !== undefined) dbUpdates.transmission = vehicleData.transmission
    if (vehicleData.fuel !== undefined) dbUpdates.fuel = vehicleData.fuel
    if (vehicleData.engineCapacity !== undefined) dbUpdates.engine_capacity = vehicleData.engineCapacity
    if (vehicleData.bodyType !== undefined) dbUpdates.body_type = vehicleData.bodyType
    if (vehicleData.province !== undefined) dbUpdates.province = vehicleData.province
    if (vehicleData.city !== undefined) dbUpdates.city = vehicleData.city
    if (vehicleData.description !== undefined) dbUpdates.description = vehicleData.description
    if (vehicleData.images !== undefined) dbUpdates.images = vehicleData.images

    dbUpdates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("vehicles")
      .update(dbUpdates)
      .eq("id", vehicleId)
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .single()

    if (error) {
      console.error("❌ Error updating vehicle:", error)
      throw new Error(`Failed to update vehicle: ${error.message}`)
    }

    if (!data) {
      throw new Error("No data returned from vehicle update")
    }

    console.log("✅ Vehicle updated successfully")
    return mapDatabaseToVehicle(data)
  } catch (error) {
    console.error("❌ Error in updateVehicle:", error)
    throw error
  }
}

/**
 * Delete a vehicle (soft delete)
 */
async function deleteVehicle(vehicleId: string, userId: string, reason?: string): Promise<boolean> {
  try {
    console.log("🗑️ Deleting vehicle:", vehicleId, "Reason:", reason)

    // First verify ownership
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("user_id")
      .eq("id", vehicleId)
      .single()

    if (fetchError || !existingVehicle) {
      console.error("❌ Vehicle not found:", vehicleId)
      return false
    }

    if (existingVehicle.user_id !== userId) {
      console.error("❌ User does not own this vehicle")
      return false
    }

    // Soft delete by setting status and deleted_at
    const updates: Record<string, any> = {
      status: "deleted",
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (reason) {
      updates.deletion_reason = reason
    }

    const { error } = await supabase.from("vehicles").update(updates).eq("id", vehicleId)

    if (error) {
      console.error("❌ Error deleting vehicle:", error)
      return false
    }

    console.log("✅ Vehicle deleted successfully")
    return true
  } catch (error) {
    console.error("❌ Error in deleteVehicle:", error)
    return false
  }
}

/**
 * Search vehicles with filters
 */
async function searchVehicles(filters: {
  make?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  transmission?: string
  fuelType?: string
  bodyType?: string
  province?: string
  city?: string
}): Promise<Vehicle[]> {
  try {
    console.log("🔍 Searching vehicles with filters:", filters)

    let query = supabase
      .from("vehicles")
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone,
          profile_pic,
          suburb,
          city,
          province
        )
      `)
      .or("status.eq.active,status.is.null")
      .is("deleted_at", null)

    if (filters.make) {
      query = query.ilike("make", `%${filters.make}%`)
    }
    if (filters.model) {
      query = query.ilike("model", `%${filters.model}%`)
    }
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice)
    }
    if (filters.minYear) {
      query = query.gte("year", filters.minYear)
    }
    if (filters.maxYear) {
      query = query.lte("year", filters.maxYear)
    }
    if (filters.transmission) {
      query = query.eq("transmission", filters.transmission)
    }
    if (filters.fuelType) {
      query = query.eq("fuel", filters.fuelType)
    }
    if (filters.bodyType) {
      query = query.eq("body_type", filters.bodyType)
    }
    if (filters.province) {
      query = query.eq("province", filters.province)
    }
    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("❌ Error searching vehicles:", error)
      return []
    }

    console.log(`✅ Found ${data?.length || 0} vehicles`)

    return (data || []).map(mapDatabaseToVehicle)
  } catch (error) {
    console.error("❌ Error in searchVehicles:", error)
    return []
  }
}

/**
 * Map database record to Vehicle type
 */
function mapDatabaseToVehicle(data: any): Vehicle {
  const user = data.users || {}

  return {
    id: data.id,
    userId: data.user_id,
    make: data.make,
    model: data.model,
    variant: data.variant || "",
    year: data.year,
    price: data.price,
    mileage: data.mileage,
    transmission: data.transmission,
    fuel: data.fuel,
    fuelType: data.fuel,
    engineCapacity: data.engine_capacity || "",
    bodyType: data.body_type || "",
    province: data.province,
    city: data.city,
    description: data.description || "",
    images: data.images || [],
    status: data.status || "active",
    // Get seller information from joined users table
    sellerName:
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.first_name || user.last_name || user.email?.split("@")[0] || "",
    sellerEmail: user.email || "",
    sellerPhone: user.phone || "",
    sellerSuburb: user.suburb || "",
    sellerCity: user.city || "",
    sellerProvince: user.province || "",
    sellerProfilePic: user.profile_pic || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

/**
 * Map VehicleFormData to database format
 */
function mapVehicleToDatabase(vehicleData: VehicleFormData, userId: string): Record<string, any> {
  return {
    user_id: userId,
    make: vehicleData.make,
    model: vehicleData.model,
    variant: vehicleData.variant || "",
    year: vehicleData.year,
    price: vehicleData.price,
    mileage: vehicleData.mileage,
    transmission: vehicleData.transmission,
    fuel: vehicleData.fuel, // Changed from vehicleData.fuelType to vehicleData.fuel
    engine_capacity: vehicleData.engineCapacity || "",
    body_type: vehicleData.bodyType || "",
    province: vehicleData.province,
    city: vehicleData.city,
    description: vehicleData.description || "",
    images: vehicleData.images || [],
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Export as object
export const vehicleService = {
  getVehicles,
  getVehicleById,
  getUserVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
}

// Also export individual functions
export { getVehicles, getVehicleById, getUserVehicles, createVehicle, updateVehicle, deleteVehicle, searchVehicles }
