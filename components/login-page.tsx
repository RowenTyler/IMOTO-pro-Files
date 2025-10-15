"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, UserPlus, Mail, CheckCircle, RefreshCw, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/ui/header"
import { authService, AuthError } from "@/lib/auth"
import type { UserProfile } from "@/types/user"

interface LoginPageProps {
  onLoginSuccess?: (userProfile: UserProfile) => void
  onSignUpSuccess?: (userProfile: UserProfile) => void
  onCancel?: () => void
  loginContext?: "default" | "checkout" | "sell"
}

export default function LoginPage({
  onLoginSuccess,
  onSignUpSuccess,
  onCancel,
  loginContext = "default",
}: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [showExistingUserMessage, setShowExistingUserMessage] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      console.log("📝 Signing up with:", { email, firstName, lastName })
      
      const { user } = await authService.signUp(email, password, { firstName, lastName })
      
      if (user) {
        console.log("✅ Sign up successful, showing verification message")
        setVerificationEmail(email)
        setShowVerificationMessage(true)
      }
    } catch (e) {
      console.error("❌ Sign up error:", e)
      if (e instanceof AuthError) {
        if (
          e.code === "user_exists" ||
          e.message.includes("already exists") ||
          e.message.includes("already been registered")
        ) {
          setShowExistingUserMessage(true)
        } else {
          setError(e.message)
        }
      } else {
        setError("An unexpected error occurred during sign up.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      await authService.resendVerificationEmail(verificationEmail)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (e) {
      if (e instanceof AuthError) {
        setError(e.message)
      } else {
        setError("Failed to resend verification email. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("🔑 Attempting sign in for:", email)
      
      const { user } = await authService.signIn(email, password)
      
      if (!user) {
        console.error("❌ No user returned from sign in")
        setError("Sign in failed. Please try again.")
        return
      }

      console.log("✅ Sign in successful:", user.email)
      console.log("📧 Email verified:", !!user.email_confirmed_at)

      // Check email verification
      if (!user.email_confirmed_at) {
        console.warn("⚠️ Email not verified")
        setError("Please verify your email address before signing in. Check your inbox for a verification link.")
        return
      }

      // Get user profile
      console.log("👤 Fetching user profile...")
      const profile = await authService.getUserProfile(user.id)
      
      if (profile) {
        console.log("✅ Profile loaded:", profile.firstName, profile.lastName)
        console.log("🔄 Calling onLoginSuccess with profile")
        
        // Call the success callback with the profile
        if (onLoginSuccess) {
          onLoginSuccess(profile)
        } else {
          // Fallback: navigate directly
          console.log("⚠️ No onLoginSuccess callback, navigating directly")
          router.push("/dashboard")
        }
      } else {
        console.warn("⚠️ No profile found, creating fallback profile")
        
        // Fallback profile
        const fallbackProfile: UserProfile = {
          id: user.id,
          email: user.email,
          firstName: "",
          lastName: "",
          loginMethod: "email",
        }
        
        if (onLoginSuccess) {
          onLoginSuccess(fallbackProfile)
        } else {
          router.push("/dashboard")
        }
      }
    } catch (e) {
      console.error("❌ Sign in error:", e)
      if (e instanceof AuthError) {
        if (e.code === "email_not_confirmed") {
          setError("Please verify your email address before signing in. Check your inbox for a verification link.")
        } else {
          setError(e.message)
        }
      } else {
        setError("An unexpected error occurred during sign in.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.signInWithOAuth(provider)
    } catch (e) {
      if (e instanceof AuthError) {
        setError(e.message)
      } else {
        setError(`An unexpected error occurred with ${provider} sign in.`)
      }
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      handleSignUp()
    } else {
      handleSignIn()
    }
  }

  const handleBackToSignUp = () => {
    setShowVerificationMessage(false)
    setShowExistingUserMessage(false)
    setVerificationEmail("")
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setError(null)
    setResendSuccess(false)
  }

  const handleGoToSignIn = () => {
    setShowExistingUserMessage(false)
    setIsSignUp(false)
    setError(null)
    setResendSuccess(false)
  }

  if (showExistingUserMessage) {
    return (
      <>
        <Header user={null} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-[#3E5641] dark:text-white">Account Already Exists</h1>
              <p className="text-[#6F7F69] dark:text-gray-400 mt-2">
                You already have an account with this email address.
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A352A] p-8 rounded-3xl shadow-lg border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Email address:</strong>
                  </p>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mt-1">{email}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    This email is already registered in our system.
                  </p>
                </div>

                <div className="text-left space-y-2 text-sm text-[#6F7F69] dark:text-gray-400">
                  <p>
                    <strong>What you can do:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Sign in with your existing password</li>
                    <li>Use "Forgot Password" if you don't remember it</li>
                    <li>Try signing in with Google if you used that before</li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleGoToSignIn}
                    className="w-full bg-[#FF6700] text-white hover:bg-[#FF6700]/90 dark:bg-[#FF7D33] dark:hover:bg-[#FF7D33]/90"
                  >
                    Continue to Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" onClick={handleBackToSignUp} className="w-full bg-transparent">
                    Try Different Email
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#6F7F69] dark:text-gray-400">
                Need help? Contact our support team for assistance.
              </p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (showVerificationMessage) {
    return (
      <>
        <Header user={null} transparent={false} />
        <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-[#3E5641] dark:text-white">Check Your Email</h1>
              <p className="text-[#6F7F69] dark:text-gray-400 mt-2">
                We've sent a verification link to your email address.
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A352A] p-8 rounded-3xl shadow-lg border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Verification email sent to:</strong>
                  </p>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mt-1">{verificationEmail}</p>
                </div>

                {resendSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <p className="text-sm text-green-800 dark:text-green-200">Verification email sent successfully!</p>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="text-left space-y-2 text-sm text-[#6F7F69] dark:text-gray-400">
                  <p>
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the verification link in the email</li>
                    <li>Return here to sign in to your account</li>
                  </ol>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => {
                      setShowVerificationMessage(false)
                      setIsSignUp(false)
                      setError(null)
                      setResendSuccess(false)
                    }}
                    className="w-full bg-[#FF6700] text-white hover:bg-[#FF6700]/90 dark:bg-[#FF7D33] dark:hover:bg-[#FF7D33]/90"
                  >
                    Continue to Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full bg-transparent"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={handleBackToSignUp} className="w-full bg-transparent">
                    Back to Sign Up
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="text-xs text-[#6F7F69] dark:text-gray-400 space-y-2">
                <p>
                  <strong>Troubleshooting:</strong>
                </p>
                <ul className="text-left space-y-1 max-w-sm mx-auto">
                  <li>Check your spam/junk folder</li>
                  <li>Wait a few minutes for email delivery</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Try using the "Resend" button above</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header user={null} transparent={false} />
      <main className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#3E5641] dark:text-white">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-[#6F7F69] dark:text-gray-400 mt-2">
              {isSignUp ? "Join the community to buy and sell cars." : "Sign in to manage your listings."}
            </p>
          </div>

          <div className="bg-white dark:bg-[#2A352A] p-8 rounded-3xl shadow-lg border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="firstName" className="text-sm font-medium text-[#3E5641] dark:text-gray-300">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required={isSignUp}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="lastName" className="text-sm font-medium text-[#3E5641] dark:text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required={isSignUp}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#3E5641] dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-[#3E5641] dark:text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#FF6700] text-white hover:bg-[#FF6700]/90 dark:bg-[#FF7D33] dark:hover:bg-[#FF7D33]/90"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                {isSignUp ? <UserPlus className="ml-2 h-4 w-4" /> : <LogIn className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#2A352A] text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleOAuthSignIn("google")} 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                  setShowVerificationMessage(false)
                  setShowExistingUserMessage(false)
                  setResendSuccess(false)
                }}
                className="text-sm text-[#FF6700] dark:text-[#FF7D33] hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => router.push("/auth/reset-password")}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:underline ml-4"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          </div>
        </main>
      </>
    )
  )\
}
