import { type NextRequest, NextResponse } from "next/server"
import { vehicleService } from "@/lib/vehicle-service"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("🔍 GET /api/vehicles/[id] - Fetching vehicle:", params.id)

    const vehicle = await vehicleService.getVehicleById(params.id)

    if (!vehicle) {
      console.log("❌ Vehicle not found")
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    console.log("✅ Vehicle fetched successfully")
    return NextResponse.json(vehicle)
  } catch (error: any) {
    console.error("❌ GET /api/vehicles/[id] error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("📝 PUT /api/vehicles/[id] - Updating vehicle:", params.id)

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.error("❌ No valid session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    console.log("👤 User ID:", userId)

    const body = await request.json()
    console.log("📝 Request body:", body)

    const updatedVehicle = await vehicleService.updateVehicle(params.id, body, userId)

    console.log("✅ Vehicle updated successfully")
    return NextResponse.json(updatedVehicle)
  } catch (error: any) {
    console.error("❌ PUT /api/vehicles/[id] error:", error)
    return NextResponse.json({ error: error.message || "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("🗑️ DELETE /api/vehicles/[id] - Deleting vehicle:", params.id)

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.error("❌ No valid session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    console.log("👤 User ID:", userId)

    await vehicleService.deleteVehicle(params.id, userId)

    console.log("✅ Vehicle deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ DELETE /api/vehicles/[id] error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete vehicle" }, { status: 500 })
  }
}
