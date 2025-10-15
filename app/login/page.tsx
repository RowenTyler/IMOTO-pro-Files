"use client"

import { useRouter } from "next/navigation"
import LoginPage from "@/components/login-page"
import type { UserProfile } from "@/types/user"

export default function LoginPageRoute() {
  const router = useRouter()

  const handleLoginSuccess = (userData: UserProfile) => {
    console.log("✅ Login successful, redirecting to dashboard with user:", userData.firstName, userData.lastName)
    router.push("/dashboard")
  }

  const handleSignUpSuccess = (userData: UserProfile) => {
    console.log("✅ Sign up successful, redirecting to dashboard")
    router.push("/dashboard?signup=true")
  }

  const handleCancel = () => {
    router.push("/home")
  }

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onSignUpSuccess={handleSignUpSuccess}
      onCancel={handleCancel}
      loginContext="default"
    />
  )
}
