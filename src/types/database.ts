export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          photo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          photo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          photo?: string | null
          created_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          title: string
          destination: string | null
          start_date: string | null
          end_date: string | null
          organizer_id: string | null
          join_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          organizer_id?: string | null
          join_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          organizer_id?: string | null
          join_code?: string | null
          created_at?: string
        }
      }
      trip_members: {
        Row: {
          id: string
          trip_id: string | null
          user_id: string | null
          role: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          trip_id: string | null
          day_number: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          day_number: number
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          day_number?: number
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          day_id: string | null
          title: string
          location: string | null
          time: string | null
          notes: string | null
          cost: number | null
          lat: number | null
          lng: number | null
          created_at: string
        }
        Insert: {
          id?: string
          day_id?: string | null
          title: string
          location?: string | null
          time?: string | null
          notes?: string | null
          cost?: number | null
          lat?: number | null
          lng?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          day_id?: string | null
          title?: string
          location?: string | null
          time?: string | null
          notes?: string | null
          cost?: number | null
          lat?: number | null
          lng?: number | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          trip_id: string | null
          title: string
          amount: number
          paid_by: string | null
          date: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          title: string
          amount: number
          paid_by?: string | null
          date?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          title?: string
          amount?: number
          paid_by?: string | null
          date?: string | null
          category?: string | null
          created_at?: string
        }
      }
      expense_splits: {
        Row: {
          id: string
          expense_id: string | null
          user_id: string | null
          share: number
        }
        Insert: {
          id?: string
          expense_id?: string | null
          user_id?: string | null
          share: number
        }
        Update: {
          id?: string
          expense_id?: string | null
          user_id?: string | null
          share?: number
        }
      }
      memories: {
        Row: {
          id: string
          trip_id: string | null
          uploaded_by: string | null
          file_url: string
          file_type: string | null
          caption: string | null
          likes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          uploaded_by?: string | null
          file_url: string
          file_type?: string | null
          caption?: string | null
          likes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          uploaded_by?: string | null
          file_url?: string
          file_type?: string | null
          caption?: string | null
          likes?: number | null
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
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type TripMember = Database['public']['Tables']['trip_members']['Row']
export type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseSplit = Database['public']['Tables']['expense_splits']['Row']
export type Memory = Database['public']['Tables']['memories']['Row']

export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertTrip = Database['public']['Tables']['trips']['Insert']
export type InsertTripMember = Database['public']['Tables']['trip_members']['Insert']
export type InsertItineraryDay = Database['public']['Tables']['itinerary_days']['Insert']
export type InsertActivity = Database['public']['Tables']['activities']['Insert']
export type InsertExpense = Database['public']['Tables']['expenses']['Insert']
export type InsertExpenseSplit = Database['public']['Tables']['expense_splits']['Insert']
export type InsertMemory = Database['public']['Tables']['memories']['Insert']
