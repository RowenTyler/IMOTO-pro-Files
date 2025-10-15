export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          profile_pic: string | null
          suburb: string | null
          city: string | null
          province: string | null
          login_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string
          last_name?: string
          phone?: string | null
          profile_pic?: string | null
          suburb?: string | null
          city?: string | null
          province?: string | null
          login_method?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          profile_pic?: string | null
          suburb?: string | null
          city?: string | null
          province?: string | null
          login_method?: string
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: number
          price: number
          mileage: number
          transmission: string
          fuel: string
          engine_capacity: string | null
          body_type: string | null
          variant: string | null
          description: string | null
          city: string | null
          province: string | null
          images: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          year: number
          price: number
          mileage: number
          transmission: string
          fuel: string
          engine_capacity?: string | null
          body_type?: string | null
          variant?: string | null
          description?: string | null
          city?: string | null
          province?: string | null
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          make?: string
          model?: string
          year?: number
          price?: number
          mileage?: number
          transmission?: string
          fuel?: string
          engine_capacity?: string | null
          body_type?: string | null
          variant?: string | null
          description?: string | null
          city?: string | null
          province?: string | null
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      saved_vehicles: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
