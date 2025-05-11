
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
      google_calendar_connections: {
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
          created_at?: string
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
      logs_faturamento: {
        Row: {
          id: string
          user_id: string | null
          tipo: string
          origem: string | null
          valor: number
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          tipo: string
          origem?: string | null
          valor: number
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          tipo?: string
          origem?: string | null
          valor?: number
          status?: string | null
          created_at?: string
        }
      }
      planos: {
        Row: {
          id: string
          nome: string
          preco_mensal: number
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          preco_mensal: number
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          preco_mensal?: number
          created_at?: string
        }
      }
      precificacao_variavel: {
        Row: {
          id: string
          tipo: string
          preco_unitario: number
          ativo: boolean | null
        }
        Insert: {
          id?: string
          tipo: string
          preco_unitario: number
          ativo?: boolean | null
        }
        Update: {
          id?: string
          tipo?: string
          preco_unitario?: number
          ativo?: boolean | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          senha_hash: string
          nome_completo: string
          plano_id: string | null
          ativo: boolean
          data_validade: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          senha_hash: string
          nome_completo: string
          plano_id?: string | null
          ativo?: boolean
          data_validade: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          senha_hash?: string
          nome_completo?: string
          plano_id?: string | null
          ativo?: boolean
          data_validade?: string
          created_at?: string
        }
      }
    }
  }
}
