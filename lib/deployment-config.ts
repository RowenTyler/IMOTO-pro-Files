/**
 * Deployment configuration and environment validation
 */

interface DeploymentConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  app: {
    url: string
    environment: "development" | "staging" | "production"
  }
  features: {
    realTimeUpdates: boolean
    socialAuth: boolean
    imageUpload: boolean
  }
}

function validateEnvironmentVariable(name: string, value: string | undefined, fallback?: string): string {
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || fallback!
}

export const deploymentConfig: DeploymentConfig = {
  supabase: {
    url: validateEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "https://gdhnyulduswsqfydkdev.supabase.co",
    ),
    anonKey: validateEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaG55dWxkdXN3c3FmeWRrZGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjkyNTksImV4cCI6MjA2OTA0NTI1OX0.heqhzV_u-YasvypMA9mnA-gE1QJqJHWOzETbF1n9Yj0",
    ),
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "fgya6Usww5RM4TJ6Hmi/MRGNOY5BFFk95TFKW65JVK3K3MwxpypiyDSCcrCSNNUKRGUVzijyYHuv8tq4ZlUNqA==",
  },
  app: {
    url:
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
    environment: (process.env.NODE_ENV as any) || "development",
  },
  features: {
    realTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== "false",
    socialAuth: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_AUTH !== "false",
    imageUpload: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD !== "false",
  },
}

export function validateDeploymentConfig() {
  const errors: string[] = []

  // Validate Supabase configuration
  try {
    new URL(deploymentConfig.supabase.url)
  } catch {
    errors.push("Invalid NEXT_PUBLIC_SUPABASE_URL")
  }

  if (deploymentConfig.supabase.anonKey.length < 32) {
    errors.push("Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  // Validate app URL in production
  if (deploymentConfig.app.environment === "production") {
    try {
      const url = new URL(deploymentConfig.app.url)
      if (url.protocol !== "https:") {
        errors.push("Production app URL must use HTTPS")
      }
    } catch {
      errors.push("Invalid app URL configuration")
    }
  }

  if (errors.length > 0) {
    throw new Error(`Deployment configuration errors:\n${errors.join("\n")}`)
  }

  return true
}

// Validate configuration on import (server-side only)
if (typeof window === "undefined") {
  try {
    validateDeploymentConfig()
    console.log("✅ Deployment configuration validated successfully")
  } catch (error) {
    console.error("❌ Deployment configuration validation failed:", error)
    if (deploymentConfig.app.environment === "production") {
      process.exit(1)
    }
  }
}
