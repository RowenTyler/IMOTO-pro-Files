import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { vehicleService } from "@/lib/vehicle-service"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const savedVehicles = await vehicleService.getSavedVehicles(session.user.id)

    return NextResponse.json(savedVehicles)
  } catch (error) {
    console.error("API saved vehicles GET error:", error)
    return NextResponse.json({ error: "Failed to fetch saved vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { vehicleId } = await request.json()

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 })
    }

    const isSaved = await vehicleService.toggleSaveVehicle(session.user.id, vehicleId)

    return NextResponse.json({ saved: isSaved })
  } catch (error) {
    console.error("API save vehicle POST error:", error)
    return NextResponse.json({ error: "Failed to save/unsave vehicle" }, { status: 500 })
  }
}
