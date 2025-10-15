import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

/**
 * Validate and refresh the current session if needed
 */
export async function validateSession(): Promise<boolean> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Session validation error:", error)
      return false
    }

    if (!session) {
      return false
    }

    // Check if token is about to expire (within 5 minutes)
    const expiresAt = session.expires_at || 0
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = expiresAt - now

    if (timeUntilExpiry < 300) {
      // Less than 5 minutes
      console.log("Session about to expire, refreshing...")
      const { data, error: refreshError } = await supabase.auth.refreshSession()

      if (refreshError) {
        console.error("Session refresh error:", refreshError)
        return false
      }

      return !!data.session
    }

    return true
  } catch (error) {
    console.error("Error validating session:", error)
    return false
  }
}

/**
 * Handle Supabase errors and return user-friendly messages
 */
export function handleSupabaseError(error: any): string {
  if (error.message?.includes("Invalid Refresh Token")) {
    return "Your session has expired. Please sign in again."
  }

  if (error.message?.includes("JWT expired")) {
    return "Your session has expired. Please sign in again."
  }

  if (error.message?.includes("not found")) {
    return "The requested resource was not found."
  }

  if (error.message?.includes("unique constraint")) {
    return "This item already exists."
  }

  if (error.message?.includes("foreign key constraint")) {
    return "Cannot complete this action due to related data."
  }

  return error.message || "An unexpected error occurred. Please try again."
}
