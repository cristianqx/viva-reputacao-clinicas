
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google OAuth configs
const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
const redirectUri = "https://preview--viva-reputacao-clinicas.lovable.app/auth/callback";

interface GoogleConnection {
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

/**
 * Obtém a URL de autorização para o fluxo OAuth 2.0 do Google
 */
export function getGoogleAuthUrl(): string {
  const scopes = encodeURIComponent("https://www.googleapis.com/auth/business.manage");
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
}

/**
 * Verifica se o usuário tem uma conexão ativa com o Google
 */
export async function getUserGoogleConnection(): Promise<GoogleConnection | null> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Get connection from database
    const { data, error } = await supabase
      .from("gmb_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check if token needs to be refreshed
    const createdAt = new Date(data.created_at).getTime();
    const expiresAt = createdAt + (data.expires_in * 1000);
    const now = Date.now();
    
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (now > expiresAt - 5 * 60 * 1000) {
      return await refreshGoogleToken(data);
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao verificar conexão com Google:", error);
    return null;
  }
}

/**
 * Atualiza o token de acesso usando o refresh token
 */
async function refreshGoogleToken(connection: GoogleConnection): Promise<GoogleConnection | null> {
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: connection.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      // If refresh fails, mark connection as revoked
      await supabase
        .from("gmb_connections")
        .update({ status: "revoked" })
        .eq("id", connection.id);
      
      return null;
    }

    const tokenData = await tokenResponse.json();
    
    // Update the connection with new token
    const updatedConnection = {
      ...connection,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      created_at: new Date().toISOString(),
    };
    
    // Save to database
    const { error } = await supabase
      .from("gmb_connections")
      .update(updatedConnection)
      .eq("id", connection.id);
    
    if (error) {
      console.error("Erro ao atualizar token:", error);
      return null;
    }
    
    return updatedConnection;
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
    return null;
  }
}

/**
 * Desconecta a conta Google, revogando os tokens
 */
export async function disconnectGoogle(): Promise<boolean> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Get connection
    const { data } = await supabase
      .from("gmb_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();
    
    if (data) {
      // Revoke token at Google
      await fetch(`https://oauth2.googleapis.com/revoke?token=${data.access_token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
      // Update status in database
      await supabase
        .from("gmb_connections")
        .update({ status: "revoked" })
        .eq("id", data.id);
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao desconectar conta Google:", error);
    return false;
  }
}
