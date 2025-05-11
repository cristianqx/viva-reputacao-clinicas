
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCrossDomainStorage, setCrossDomainStorage } from "@/services/googleBusinessApi";

// Google OAuth configs
const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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";
const redirectUri = "https://viva-reputacao-clinicas.lovable.app/auth/google-calendar-callback";

interface CalendarConnection {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  created_at: string;
  google_email: string;
  status: "active" | "revoked";
}

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: "email" | "popup";
      minutes: number;
    }>;
  };
}

/**
 * Obtém a URL de autorização para o fluxo OAuth 2.0 do Google Calendar
 */
export function getGoogleCalendarAuthUrl(): string {
  // Definir múltiplos escopos necessários
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "openid",
    "profile",
    "email"
  ];
  
  const encodedScopes = encodeURIComponent(scopes.join(' '));
  
  // Verificamos se temos um userId antes de iniciar o fluxo OAuth
  const userId = localStorage.getItem("rv_user_id");
  
  if (!userId) {
    console.error("Nenhum usuário autenticado encontrado. Impossível iniciar fluxo OAuth.");
    toast.error("Usuário não autenticado. Faça login novamente.");
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }
  
  console.log("Iniciando fluxo OAuth para o usuário:", userId);
  console.log("Escopos solicitados:", scopes.join(', '));
  
  // Armazenar userId para recuperação cross-domain
  setCrossDomainStorage("rv_oauth_user_id", userId);
  
  // Se o usuário estiver em outro domínio, redirecionamos primeiro para o domínio correto
  if (window.location.origin !== "https://viva-reputacao-clinicas.lovable.app") {
    console.log("Usuário está em um domínio diferente do configurado no Google Console");
    console.log("Redirecionando para o domínio correto antes de iniciar OAuth...");
    
    // Salvamos a intenção de iniciar OAuth
    localStorage.setItem("rv_calendar_oauth_pending", "true");
    
    // Redirecionamos para o domínio correto na mesma página
    const currentPath = window.location.pathname;
    return `https://viva-reputacao-clinicas.lovable.app${currentPath}`;
  }
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodedScopes}&access_type=offline&prompt=consent`;
}

/**
 * Verifica se o usuário tem uma conexão ativa com o Google Calendar
 */
export async function getUserCalendarConnection(): Promise<CalendarConnection | null> {
  try {
    // Obter ID do usuário do localStorage
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      console.log("Nenhum usuário autenticado encontrado");
      return null;
    }
    
    // Get connection from database - usando uma abordagem tipada para evitar erros
    console.log("Buscando conexão Calendar no Supabase para o usuário:", userId);
    
    // Usando uma query SQL direta para evitar problemas de tipagem com tabelas recém-criadas
    const { data, error } = await supabase
      .from('google_calendar_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Código para "nenhum resultado encontrado"
        console.error("Erro ao buscar conexão:", error);
      } else {
        console.log("Nenhuma conexão Calendar ativa encontrada para este usuário");
      }
      return null;
    }
    
    if (!data) {
      console.log("Nenhuma conexão Calendar ativa encontrada");
      return null;
    }
    
    console.log("Conexão Calendar encontrada para:", data.google_email);
    
    // Check if token needs to be refreshed
    const createdAt = new Date(data.created_at).getTime();
    const expiresAt = createdAt + (data.expires_in * 1000);
    const now = Date.now();
    
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (now > expiresAt - 5 * 60 * 1000) {
      console.log("Token Calendar expirado ou prestes a expirar, atualizando...");
      return await refreshCalendarToken(data as CalendarConnection);
    }
    
    return data as CalendarConnection;
  } catch (error) {
    console.error("Erro ao verificar conexão com Google Calendar:", error);
    return null;
  }
}

/**
 * Atualiza o token de acesso usando o refresh token
 */
async function refreshCalendarToken(connection: CalendarConnection): Promise<CalendarConnection | null> {
  try {
    console.log("Iniciando atualização de token Calendar para:", connection.google_email);
    
    // Verificar se temos um client_secret
    if (!clientSecret) {
      console.error("ERRO CRÍTICO: client_secret não está disponível para atualização de token!");
      return null;
    }
    
    const formData = new URLSearchParams();
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("refresh_token", connection.refresh_token);
    formData.append("grant_type", "refresh_token");
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!tokenResponse.ok) {
      console.error("Falha ao atualizar token Calendar. Status:", tokenResponse.status);
      const errorText = await tokenResponse.text();
      console.error("Resposta completa:", errorText);
      
      // If refresh fails, mark connection as revoked
      await supabase
        .from('google_calendar_connections')
        .update({ status: "revoked" })
        .eq("id", connection.id);
      
      console.log("Conexão Calendar marcada como revogada devido a falha na atualização");
      return null;
    }

    const tokenData = await tokenResponse.json();
    console.log("Token Calendar atualizado com sucesso");
    
    // Update the connection with new token
    const updatedConnection: CalendarConnection = {
      ...connection,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      created_at: new Date().toISOString(),
    };
    
    // Save to database
    console.log("Salvando token Calendar atualizado no Supabase");
    const { error } = await supabase
      .from('google_calendar_connections')
      .update({
        access_token: updatedConnection.access_token,
        token_type: updatedConnection.token_type,
        expires_in: updatedConnection.expires_in,
        created_at: updatedConnection.created_at
      })
      .eq("id", connection.id);
    
    if (error) {
      console.error("Erro ao atualizar token Calendar:", error);
      return null;
    }
    
    console.log("Token Calendar atualizado e salvo com sucesso");
    return updatedConnection;
  } catch (error) {
    console.error("Erro ao atualizar token Calendar:", error);
    return null;
  }
}

/**
 * Desconecta a conta Google Calendar, revogando os tokens
 */
export async function disconnectGoogleCalendar(): Promise<boolean> {
  try {
    // Obter ID do usuário do localStorage
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      console.log("Nenhum usuário autenticado para desconectar Calendar");
      return false;
    }
    
    console.log("Buscando conexão Calendar para desconectar para o usuário:", userId);
    
    // Get connection
    const { data } = await supabase
      .from('google_calendar_connections')
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1)
      .single();
    
    if (data) {
      console.log("Revogando token Calendar para:", data.google_email);
      
      // Revoke token at Google
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${data.access_token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log("Token Calendar revogado no Google com sucesso");
      } catch (revokeError) {
        console.error("Erro ao revogar token Calendar no Google:", revokeError);
        // Continue mesmo se falhar a revogação no Google
      }
      
      // Update status in database
      const { error } = await supabase
        .from('google_calendar_connections')
        .update({ status: "revoked" })
        .eq("id", data.id);
        
      if (error) {
        console.error("Erro ao atualizar status da conexão Calendar:", error);
        return false;
      }
      
      console.log("Conexão Calendar marcada como revogada no Supabase");
    } else {
      console.log("Nenhuma conexão Calendar ativa encontrada para desconectar");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao desconectar conta Google Calendar:", error);
    return false;
  }
}

/**
 * Lista eventos do Google Calendar
 */
export async function listCalendarEvents(
  calendarId: string = 'primary',
  timeMin: string = new Date().toISOString(),
  timeMax?: string
): Promise<CalendarEvent[] | null> {
  try {
    const connection = await getUserCalendarConnection();
    
    if (!connection) {
      console.error("Não há conexão ativa com o Google Calendar");
      return null;
    }
    
    const params = new URLSearchParams({
      timeMin: timeMin
    });
    
    if (timeMax) {
      params.append('timeMax', timeMax);
    }
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      {
        headers: {
          'Authorization': `${connection.token_type} ${connection.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error("Erro ao listar eventos do calendar:", response.status);
      const errorData = await response.text();
      console.error("Detalhes:", errorData);
      return null;
    }
    
    const data = await response.json();
    return data.items || [];
    
  } catch (error) {
    console.error("Erro ao listar eventos do calendar:", error);
    return null;
  }
}

/**
 * Cria um evento no Google Calendar
 */
export async function createCalendarEvent(
  event: CalendarEvent,
  calendarId: string = 'primary'
): Promise<CalendarEvent | null> {
  try {
    const connection = await getUserCalendarConnection();
    
    if (!connection) {
      console.error("Não há conexão ativa com o Google Calendar");
      return null;
    }
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `${connection.token_type} ${connection.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    );
    
    if (!response.ok) {
      console.error("Erro ao criar evento no calendar:", response.status);
      const errorData = await response.text();
      console.error("Detalhes:", errorData);
      return null;
    }
    
    return await response.json();
    
  } catch (error) {
    console.error("Erro ao criar evento no calendar:", error);
    return null;
  }
}

/**
 * Verifica se há uma operação OAuth pendente ao carregar
 */
export function checkPendingCalendarOAuth(): void {
  const pendingOAuth = localStorage.getItem("rv_calendar_oauth_pending");
  if (pendingOAuth === "true" && window.location.origin === "https://viva-reputacao-clinicas.lovable.app") {
    console.log("Operação OAuth Calendar pendente detectada. Continuando fluxo...");
    localStorage.removeItem("rv_calendar_oauth_pending");
    // Iniciar o fluxo OAuth
    window.location.href = getGoogleCalendarAuthUrl();
  }
}
