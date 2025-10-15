import { describe, it, expect, beforeEach, vi } from "vitest"
import { authService, AuthError } from "@/lib/auth"

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}))

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("signUp", () => {
    it("should successfully sign up a user", async () => {
      const mockUser = { id: "123", email: "test@example.com" }
      const mockSession = { access_token: "token" }

      const { supabase } = await import("@/lib/supabase")
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await authService.signUp("test@example.com", "password123")

      expect(result.user).toEqual(mockUser)
      expect(result.session).toEqual(mockSession)
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        options: {
          data: {
            first_name: undefined,
            last_name: undefined,
          },
        },
      })
    })

    it("should throw AuthError on sign up failure", async () => {
      const { supabase } = await import("@/lib/supabase")
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email already exists" },
      })

      await expect(authService.signUp("test@example.com", "password123")).rejects.toThrow(AuthError)
    })
  })

  describe("signIn", () => {
    it("should successfully sign in a user", async () => {
      const mockUser = { id: "123", email: "test@example.com" }
      const mockSession = { access_token: "token" }

      const { supabase } = await import("@/lib/supabase")
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await authService.signIn("test@example.com", "password123")

      expect(result.user).toEqual(mockUser)
      expect(result.session).toEqual(mockSession)
    })

    it("should throw AuthError on invalid credentials", async () => {
      const { supabase } = await import("@/lib/supabase")
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      })

      await expect(authService.signIn("test@example.com", "wrongpassword")).rejects.toThrow(AuthError)
    })
  })

  describe("signOut", () => {
    it("should successfully sign out", async () => {
      const { supabase } = await import("@/lib/supabase")
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })

      await expect(authService.signOut()).resolves.not.toThrow()
    })
  })
})
