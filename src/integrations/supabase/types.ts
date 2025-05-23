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
          canal: string | null
          created_at: string
          descricao: string | null
          dias_apos_evento: number | null
          horario_fim_envio: string | null
          horario_inicio_envio: string | null
          id: string
          link_avaliacao: string | null
          nome: string
          nota_minima_redirecionamento: number
          plataforma_avaliacao: string | null
          status: string | null
          template_mensagem_whatsapp: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativa?: boolean
          canal?: string | null
          created_at?: string
          descricao?: string | null
          dias_apos_evento?: number | null
          horario_fim_envio?: string | null
          horario_inicio_envio?: string | null
          id?: string
          link_avaliacao?: string | null
          nome: string
          nota_minima_redirecionamento?: number
          plataforma_avaliacao?: string | null
          status?: string | null
          template_mensagem_whatsapp?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativa?: boolean
          canal?: string | null
          created_at?: string
          descricao?: string | null
          dias_apos_evento?: number | null
          horario_fim_envio?: string | null
          horario_inicio_envio?: string | null
          id?: string
          link_avaliacao?: string | null
          nome?: string
          nota_minima_redirecionamento?: number
          plataforma_avaliacao?: string | null
          status?: string | null
          template_mensagem_whatsapp?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
          origem: string | null
          tags: string[] | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          origem?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          origem?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_types: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          campaign_id: string | null
          contact_id: string
          created_at: string | null
          data_hora_fim: string | null
          data_hora_inicio: string
          descricao: string | null
          id: string
          origem: string | null
          responsavel: string | null
          status: string | null
          titulo: string | null
          updated_at: string | null
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          contact_id: string
          created_at?: string | null
          data_hora_fim?: string | null
          data_hora_inicio: string
          descricao?: string | null
          id?: string
          origem?: string | null
          responsavel?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string
          created_at?: string | null
          data_hora_fim?: string | null
          data_hora_inicio?: string
          descricao?: string | null
          id?: string
          origem?: string | null
          responsavel?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_eventos_whatsapp_message"
            columns: ["whatsapp_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
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
      whatsapp_configurations: {
        Row: {
          api_key: string | null
          business_name: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          phone_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          campaign_id: string | null
          contact_id: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          event_id: string | null
          external_message_id: string | null
          id: string
          message_content: string
          read_at: string | null
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          contact_id: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          event_id?: string | null
          external_message_id?: string | null
          id?: string
          message_content: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          event_id?: string | null
          external_message_id?: string | null
          id?: string
          message_content?: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_webhook_logs: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          external_message_id: string | null
          id: string
          processed: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data: Json
          event_type: string
          external_message_id?: string | null
          id?: string
          processed?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          external_message_id?: string | null
          id?: string
          processed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      associar_webhook_usuario: {
        Args: { p_webhook_log_id: string; p_external_message_id: string }
        Returns: string
      }
      atualizar_status_mensagem_whatsapp: {
        Args: {
          p_external_message_id: string
          p_status: string
          p_timestamp: string
        }
        Returns: boolean
      }
      get_eventos_para_disparo: {
        Args: { p_data_atual: string }
        Returns: {
          evento_id: string
          contato_id: string
          campanha_id: string
          nome_contato: string
          telefone_contato: string
          data_hora_evento: string
          template_mensagem: string
          link_avaliacao: string
          horario_inicio_envio: string
          horario_fim_envio: string
          user_id: string
          nome_empresa: string
        }[]
      }
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
      process_whatsapp_webhook: {
        Args: { p_event_data: Json }
        Returns: string
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
      registrar_mensagem_whatsapp: {
        Args: {
          p_user_id: string
          p_contact_id: string
          p_campaign_id: string
          p_event_id: string
          p_message_content: string
          p_external_message_id: string
        }
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
