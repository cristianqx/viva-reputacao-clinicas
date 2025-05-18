export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          nota_minima_redirecionamento: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          nota_minima_redirecionamento?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          nota_minima_redirecionamento?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gmb_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_in: number
          google_email: string
          id: string
          refresh_token: string
          status: string
          token_type: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_in: number
          google_email: string
          id?: string
          refresh_token: string
          status: string
          token_type: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_in?: number
          google_email?: string
          id?: string
          refresh_token?: string
          status?: string
          token_type?: string
          user_id?: string
        }
        Relationships: []
      }
      google_calendar_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_in: number
          google_email: string
          id: string
          refresh_token: string
          status: string
          token_type: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_in: number
          google_email: string
          id?: string
          refresh_token: string
          status: string
          token_type: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_in?: number
          google_email?: string
          id?: string
          refresh_token?: string
          status?: string
          token_type?: string
          user_id?: string
        }
        Relationships: []
      }
      internal_reviews: {
        Row: {
          campaign_id: string
          comentario: string | null
          created_at: string
          id: string
          ip_address: string | null
          nome_paciente: string | null
          nota: number
        }
        Insert: {
          campaign_id: string
          comentario?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          nome_paciente?: string | null
          nota: number
        }
        Update: {
          campaign_id?: string
          comentario?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          nome_paciente?: string | null
          nota?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_id"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_faturamento: {
        Row: {
          created_at: string
          id: string
          origem: string | null
          status: string | null
          tipo: string
          user_id: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          id?: string
          origem?: string | null
          status?: string | null
          tipo: string
          user_id?: string | null
          valor: number
        }
        Update: {
          created_at?: string
          id?: string
          origem?: string | null
          status?: string | null
          tipo?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "logs_faturamento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          created_at: string
          id: string
          nome: string
          preco_mensal: number
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          preco_mensal: number
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          preco_mensal?: number
        }
        Relationships: []
      }
      precificacao_variavel: {
        Row: {
          ativo: boolean | null
          id: string
          preco_unitario: number
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          id?: string
          preco_unitario: number
          tipo: string
        }
        Update: {
          ativo?: boolean | null
          id?: string
          preco_unitario?: number
          tipo?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          ativo: boolean
          created_at: string
          data_validade: string
          email: string
          endereco_clinica: string | null
          google_calendar_integrado: boolean | null
          google_my_business_link: string | null
          id: string
          nome_clinica: string | null
          nome_completo: string
          onboarding_completo: boolean | null
          plano_id: string | null
          senha_hash: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_validade: string
          email: string
          endereco_clinica?: string | null
          google_calendar_integrado?: boolean | null
          google_my_business_link?: string | null
          id?: string
          nome_clinica?: string | null
          nome_completo: string
          onboarding_completo?: boolean | null
          plano_id?: string | null
          senha_hash: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_validade?: string
          email?: string
          endereco_clinica?: string | null
          google_calendar_integrado?: boolean | null
          google_my_business_link?: string | null
          id?: string
          nome_clinica?: string | null
          nome_completo?: string
          onboarding_completo?: boolean | null
          plano_id?: string | null
          senha_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      login: {
        Args: { p_email: string; p_senha: string }
        Returns: {
          user_id: string
          nome_completo: string
          email: string
          plano_id: string
          ativo: boolean
          data_validade: string
        }[]
      }
      register_user: {
        Args: {
          email_input: string
          senha_input: string
          nome_completo_input: string
          plano_ativo_input: string
          data_validade_input: string
        }
        Returns: Json
      }
      registrar_faturamento: {
        Args: { p_user_id: string; p_tipo: string; p_origem?: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
