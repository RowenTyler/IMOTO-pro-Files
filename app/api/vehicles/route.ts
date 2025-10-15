import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { vehicleService } from "@/lib/vehicle-service"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      make: searchParams.get("make") || undefined,
      model: searchParams.get("model") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      minYear: searchParams.get("minYear") || undefined, // Keep as string
      maxYear: searchParams.get("maxYear") || undefined, // Keep as string
      province: searchParams.get("province") || undefined,
      city: searchParams.get("city") || undefined,
      bodyType: searchParams.get("bodyType") || undefined,
      fuel: searchParams.get("fuel") || undefined,
      transmission: searchParams.get("transmission") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
      offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
    }

    const result = await vehicleService.getVehicles(filters)

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("API vehicles GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch vehicles", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vehicleData = await request.json()

    // Validate required fields
    const requiredFields = ["make", "model", "year", "price", "mileage", "transmission", "fuel"]
    for (const field of requiredFields) {
      if (!vehicleData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const vehicle = await vehicleService.createVehicle({
      ...vehicleData,
      userId: session.user.id,
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error("API vehicles POST error:", error)
    return NextResponse.json(
      { error: "Failed to create vehicle listing", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
