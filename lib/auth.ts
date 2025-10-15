import { supabase } from "./supabase"
import type { UserProfile } from "@/types/user"

export interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  name?: string
  avatar?: string
}

export class AuthError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = "AuthError"
    this.code = code
  }
}

function clearAllStorage() {
  try {
    console.log("🧹 Clearing all browser storage and cookies")
    localStorage.clear()
    sessionStorage.clear()

    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
    }

    console.log("✅ All storage and cookies cleared")
  } catch (error) {
    console.error("❌ Error clearing storage:", error)
  }
}

async function signUp(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string },
): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    console.log("🔐 Signing up user:", email, "with metadata:", metadata)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata?.firstName || "",
          last_name: metadata?.lastName || "",
          name: `${metadata?.firstName || ""} ${metadata?.lastName || ""}`.trim() || email.split("@")[0],
        },
      },
    })

    if (error) {
      console.error("❌ Sign up error:", error)
      return { user: null, error: new AuthError(error.message, error.name) }
    }

    if (!data.user) {
      return { user: null, error: new AuthError("Failed to create user", "SIGNUP_FAILED") }
    }

    console.log("✅ User signed up successfully, creating profile in database")

    // Create user profile in database
    await createUserProfile(data.user.id, email, metadata?.firstName, metadata?.lastName)

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      email_confirmed_at: data.user.email_confirmed_at,
      name: data.user.user_metadata?.name,
      avatar: data.user.user_metadata?.avatar_url,
    }

    return { user: authUser, error: null }
  } catch (error: any) {
    console.error("❌ Error in signUp:", error)
    return { user: null, error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    console.log("🔐 Signing in user:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("❌ Sign in error:", error)
      return { user: null, error: new AuthError(error.message, error.name) }
    }

    if (!data.user) {
      return { user: null, error: new AuthError("Failed to sign in", "SIGNIN_FAILED") }
    }

    console.log("✅ User signed in successfully")
    console.log("📧 Email confirmed at:", data.user.email_confirmed_at)
    console.log("🔐 Is email verified:", !!data.user.email_confirmed_at)

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      email_confirmed_at: data.user.email_confirmed_at,
      name: data.user.user_metadata?.name,
      avatar: data.user.user_metadata?.avatar_url,
    }

    return { user: authUser, error: null }
  } catch (error: any) {
    console.error("❌ Error in signIn:", error)
    return { user: null, error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    console.log("🔐 Signing out user")

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("❌ Sign out error:", error)
    }

    clearAllStorage()

    console.log("✅ User signed out successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Error in signOut:", error)
    clearAllStorage()
    return { error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function forceLogoutAll(): Promise<void> {
  try {
    console.log("🚨 Force logging out all users")
    await supabase.auth.signOut()
    clearAllStorage()
    window.location.href = "/home"
    console.log("✅ All users logged out and cache cleared")
  } catch (error) {
    console.error("❌ Error in forceLogoutAll:", error)
    clearAllStorage()
    window.location.href = "/home"
  }
}

async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    console.log("🔍 Getting current user")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("⚠️ No user found")
      return null
    }

    console.log("✅ Current user found:", user.email)
    console.log("📧 Email confirmed at:", user.email_confirmed_at)
    console.log("🔐 Is email verified:", !!user.email_confirmed_at)

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      email_confirmed_at: user.email_confirmed_at,
      name: user.user_metadata?.name,
      avatar: user.user_metadata?.avatar_url,
    }

    return authUser
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    return null
  }
}

async function isEmailVerified(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const isVerified = !!user.email_confirmed_at
    console.log("📧 Email verification status:", isVerified)
    return isVerified
  } catch (error) {
    console.error("❌ Error checking email verification:", error)
    return false
  }
}

async function getSession() {
  try {
    console.log("🔍 Getting current session")

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("⚠️ No session found")
      return null
    }

    console.log("✅ Session found")
    console.log("📧 Email confirmed at:", session.user.email_confirmed_at)
    console.log("🔐 Is email verified:", !!session.user.email_confirmed_at)
    return session
  } catch (error) {
    console.error("❌ Error getting session:", error)
    return null
  }
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log("👤 Fetching user profile for:", userId)

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("❌ Get user profile error:", error)
      return null
    }

    if (!data || data.length === 0) {
      console.log("⚠️ No user profile found for:", userId)
      return null
    }

    const userData = data[0]

    console.log("✅ User profile fetched successfully:", {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
    })

    const profile: UserProfile = {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name || "",
      lastName: userData.last_name || "",
      phone: userData.phone || "",
      profilePic: userData.profile_pic || "",
      suburb: userData.suburb || "",
      city: userData.city || "",
      province: userData.province || "",
      loginMethod: userData.login_method || "email",
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    }

    return profile
  } catch (error) {
    console.error("❌ Error in getUserProfile:", error)
    return null
  }
}

async function createUserProfile(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
): Promise<{ error: AuthError | null }> {
  try {
    console.log("📝 Creating user profile for:", userId, "with name:", firstName, lastName)

    const existing = await getUserProfile(userId)
    if (existing) {
      console.log("✅ Profile already exists, skipping creation")
      return { error: null }
    }

    const dbData: Record<string, any> = {
      id: userId,
      email: email,
      first_name: firstName || "",
      last_name: lastName || "",
      phone: "",
      profile_pic: "",
      suburb: "",
      city: "",
      province: "",
      login_method: "email",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("users").insert(dbData)

    if (error) {
      if (error.code === "23505") {
        console.log("✅ Profile already exists (duplicate key), treating as success")
        return { error: null }
      }

      console.error("❌ Create user profile error:", error)
      return { error: new AuthError(error.message, "CREATE_PROFILE_FAILED") }
    }

    console.log("✅ User profile created successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Error in createUserProfile:", error)
    return { error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error: AuthError | null }> {
  try {
    console.log("📝 Updating user profile for:", userId, "with updates:", updates)

    const dbUpdates: Record<string, any> = {}

    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone
    if (updates.profilePic !== undefined) dbUpdates.profile_pic = updates.profilePic
    if (updates.suburb !== undefined) dbUpdates.suburb = updates.suburb
    if (updates.city !== undefined) dbUpdates.city = updates.city
    if (updates.province !== undefined) dbUpdates.province = updates.province

    dbUpdates.updated_at = new Date().toISOString()

    const { error } = await supabase.from("users").update(dbUpdates).eq("id", userId)

    if (error) {
      console.error("❌ Update user profile error:", error)
      return { error: new AuthError(error.message, "UPDATE_PROFILE_FAILED") }
    }

    console.log("✅ User profile updated successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Error in updateUserProfile:", error)
    return { error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    console.log("🔐 Requesting password reset for:", email)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error("❌ Password reset error:", error)
      return { error: new AuthError(error.message, error.name) }
    }

    console.log("✅ Password reset email sent")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Error in resetPassword:", error)
    return { error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  try {
    console.log("🔐 Updating password")

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("❌ Update password error:", error)
      return { error: new AuthError(error.message, error.name) }
    }

    console.log("✅ Password updated successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Error in updatePassword:", error)
    return { error: new AuthError(error.message, "UNKNOWN_ERROR") }
  }
}

async function resendVerificationEmail(email: string): Promise<void> {
  try {
    console.log("📧 Resending verification email to:", email)

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    if (error) {
      console.error("❌ Resend verification error:", error)
      throw new AuthError(error.message, "RESEND_VERIFICATION_ERROR")
    }

    console.log("✅ Verification email sent")
  } catch (error: any) {
    console.error("❌ Error in resendVerificationEmail:", error)
    throw error
  }
}

async function signInWithOAuth(provider: "google" | "facebook" | "apple"): Promise<void> {
  try {
    console.log("🔐 Signing in with OAuth:", provider)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("❌ OAuth sign in error:", error)
      throw new AuthError(error.message, error.name)
    }

    console.log("✅ OAuth sign in initiated")
  } catch (error: any) {
    console.error("❌ Error in signInWithOAuth:", error)
    throw error
  }
}

function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  console.log("👂 Setting up auth state listener")

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log("🔄 Auth state change event:", _event)

    if (session?.user) {
      console.log("✅ Auth state: User present")
      console.log("📧 Email confirmed at:", session.user.email_confirmed_at)
      console.log("🔐 Is email verified:", !!session.user.email_confirmed_at)

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email!,
        email_confirmed_at: session.user.email_confirmed_at,
        name: session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url,
      }
      callback(authUser)
    } else {
      console.log("⚠️ Auth state: No user")
      callback(null)
    }
  })

  return () => {
    console.log("👋 Cleaning up auth state listener")
    subscription.unsubscribe()
  }
}

export const authService = {
  signUp,
  signIn,
  signOut,
  forceLogoutAll,
  getCurrentUser,
  isEmailVerified,
  getSession,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  resetPassword,
  updatePassword,
  resendVerificationEmail,
  signInWithOAuth,
  onAuthStateChange,
  clearAllStorage,
}

export {
  signUp,
  signIn,
  signOut,
  forceLogoutAll,
  getCurrentUser,
  isEmailVerified,
  getSession,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  resetPassword,
  updatePassword,
  resendVerificationEmail,
  signInWithOAuth,
  onAuthStateChange,
  clearAllStorage,
}
