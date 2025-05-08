
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
      gmb_connections: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string
          token_type: string
          expires_in: number
          created_at: string
          google_email: string
          status: "active" | "revoked"
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token: string
          token_type: string
          expires_in: number
          created_at: string
          google_email: string
          status: "active" | "revoked"
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string
          token_type?: string
          expires_in?: number
          created_at?: string
          google_email?: string
          status?: "active" | "revoked"
        }
      }
    }
  }
}
