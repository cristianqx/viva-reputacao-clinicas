
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

// Google OAuth configs
const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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";
// Usando o domínio correto para o redirect
const redirectUri = "https://viva-reputacao-clinicas.lovable.app/auth/callback";

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
  // Definir múltiplos escopos necessários
  const scopes = [
    "https://www.googleapis.com/auth/business.manage",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
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
  
  // Antes de redirecionar, salvar o userId em um cookie com domínio raiz
  setCrossDomainStorage("rv_oauth_user_id", userId);
  console.log("User ID armazenado em cookie para recuperação cross-domain");
  
  // Garantir que o userId está disponível no localStorage antes de redirecionar
  if (userId) {
    console.log("Confirmado: user_id presente no localStorage antes do redirecionamento OAuth");
  }
  
  // Usando o domínio correto para o redirecionamento OAuth
  const finalRedirectUri = redirectUri;
  console.log("Usando URI de redirecionamento:", finalRedirectUri);
  
  // Se o usuário estiver em outro domínio, redirecionamos primeiro para o domínio correto
  if (window.location.origin !== "https://viva-reputacao-clinicas.lovable.app") {
    console.log("Usuário está em um domínio diferente do configurado no Google Console");
    console.log("Redirecionando para o domínio correto antes de iniciar OAuth...");
    
    // Salvamos a intenção de iniciar OAuth
    localStorage.setItem("rv_oauth_pending", "true");
    
    // Redirecionamos para o domínio correto na mesma página
    const currentPath = window.location.pathname;
    return `https://viva-reputacao-clinicas.lovable.app${currentPath}`;
  }
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(finalRedirectUri)}&response_type=code&scope=${encodedScopes}&access_type=offline&prompt=consent`;
}

/**
 * Verifica se o usuário tem uma conexão ativa com o Google
 */
export async function getUserGoogleConnection(): Promise<GoogleConnection | null> {
  try {
    // Obter ID do usuário do localStorage ou do cookie cross-domain
    const userId = localStorage.getItem("rv_user_id") || getCrossDomainStorage("rv_oauth_user_id");
    
    if (!userId) {
      console.log("Nenhum usuário autenticado encontrado");
      return null;
    }
    
    // Get connection from database
    console.log("Buscando conexão no Supabase para o usuário:", userId);
    const { data, error } = await supabase
      .from("gmb_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Código para "nenhum resultado encontrado"
        console.error("Erro ao buscar conexão:", error);
      } else {
        console.log("Nenhuma conexão ativa encontrada para este usuário");
      }
      return null;
    }
    
    if (!data) {
      console.log("Nenhuma conexão ativa encontrada");
      return null;
    }
    
    console.log("Conexão encontrada para:", data.google_email);
    
    // Check if token needs to be refreshed
    const createdAt = new Date(data.created_at).getTime();
    const expiresAt = createdAt + (data.expires_in * 1000);
    const now = Date.now();
    
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (now > expiresAt - 5 * 60 * 1000) {
      console.log("Token expirado ou prestes a expirar, atualizando...");
      return await refreshGoogleToken(data as GoogleConnection);
    }
    
    return data as GoogleConnection;
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
    console.log("Iniciando atualização de token para:", connection.google_email);
    
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
      console.error("Falha ao atualizar token. Status:", tokenResponse.status);
      const errorText = await tokenResponse.text();
      console.error("Resposta completa:", errorText);
      
      // If refresh fails, mark connection as revoked
      await supabase
        .from("gmb_connections")
        .update({ status: "revoked" })
        .eq("id", connection.id);
      
      console.log("Conexão marcada como revogada devido a falha na atualização");
      return null;
    }

    const tokenData = await tokenResponse.json();
    console.log("Token atualizado com sucesso");
    
    // Update the connection with new token
    const updatedConnection: GoogleConnection = {
      ...connection,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      created_at: new Date().toISOString(),
    };
    
    // Save to database
    console.log("Salvando token atualizado no Supabase");
    const { error } = await supabase
      .from("gmb_connections")
      .update({
        access_token: updatedConnection.access_token,
        token_type: updatedConnection.token_type,
        expires_in: updatedConnection.expires_in,
        created_at: updatedConnection.created_at
      })
      .eq("id", connection.id);
    
    if (error) {
      console.error("Erro ao atualizar token:", error);
      return null;
    }
    
    console.log("Token atualizado e salvo com sucesso");
    return updatedConnection;
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
    return null;
  }
}

/**
 * Tenta extrair informações do usuário do token JWT, se disponível
 * @param idToken Token JWT com informações do usuário
 * @returns Objeto com email e outros dados se disponível
 */
export function extractUserInfoFromToken(idToken: string | undefined): { email: string, name?: string, picture?: string } | null {
  if (!idToken) {
    console.log("ID token não disponível para extração de informações");
    return null;
  }
  
  try {
    const decoded: any = jwtDecode(idToken);
    console.log("Informações do usuário extraídas do token:", decoded.email);
    
    return {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

/**
 * Desconecta a conta Google, revogando os tokens
 */
export async function disconnectGoogle(): Promise<boolean> {
  try {
    // Obter ID do usuário do localStorage ou do cookie cross-domain
    const userId = localStorage.getItem("rv_user_id") || getCrossDomainStorage("rv_oauth_user_id");
    
    if (!userId) {
      console.log("Nenhum usuário autenticado para desconectar");
      return false;
    }
    
    console.log("Buscando conexão para desconectar para o usuário:", userId);
    
    // Get connection
    const { data } = await supabase
      .from("gmb_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1)
      .single();
    
    if (data) {
      console.log("Revogando token para:", data.google_email);
      
      // Revoke token at Google
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${data.access_token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log("Token revogado no Google com sucesso");
      } catch (revokeError) {
        console.error("Erro ao revogar token no Google:", revokeError);
        // Continue mesmo se falhar a revogação no Google
      }
      
      // Update status in database
      const { error } = await supabase
        .from("gmb_connections")
        .update({ status: "revoked" })
        .eq("id", data.id);
        
      if (error) {
        console.error("Erro ao atualizar status da conexão:", error);
        return false;
      }
      
      console.log("Conexão marcada como revogada no Supabase");
    } else {
      console.log("Nenhuma conexão ativa encontrada para desconectar");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao desconectar conta Google:", error);
    return false;
  }
}

/**
 * Salva dados do usuário no localStorage após login bem-sucedido
 * @param user Dados do usuário para salvar
 */
export function saveUserSession(user: any): void {
  if (!user || !user.id) {
    console.error("Dados de usuário inválidos para salvar na sessão");
    return;
  }
  
  // Salvar dados essenciais
  localStorage.setItem("rv_user_id", user.id);
  localStorage.setItem("rv_user", JSON.stringify(user));
  
  // Se houver token de autenticação, salvar também
  const authToken = localStorage.getItem("rv_auth_token");
  if (authToken) {
    // Renovar cookie cross-domain com o token
    setCrossDomainStorage("rv_auth_token", authToken);
  }
  
  console.log("Sessão do usuário salva com sucesso no localStorage");
}

/**
 * Verifica se existe uma sessão de usuário salva e a recupera
 * @returns Dados do usuário se existir sessão, ou null
 */
export function getUserSession(): any | null {
  try {
    // Tentar obter do localStorage
    const userData = localStorage.getItem("rv_user");
    const userId = localStorage.getItem("rv_user_id");
    
    if (userData && userId) {
      console.log("Sessão do usuário recuperada do localStorage");
      return JSON.parse(userData);
    }
    
    // Tentar recuperar do cookie cross-domain
    const crossDomainUserId = getCrossDomainStorage("rv_oauth_user_id");
    if (crossDomainUserId) {
      console.log("ID do usuário recuperado do armazenamento cross-domain");
      // Buscar dados completos do usuário
      // Esse seria um bom lugar para buscar dados do usuário do Supabase usando o ID
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao recuperar sessão do usuário:", error);
    return null;
  }
}

/**
 * Limpa todos os dados de sessão do usuário
 */
export function clearUserSession(): void {
  localStorage.removeItem("rv_user_id");
  localStorage.removeItem("rv_user");
  localStorage.removeItem("rv_auth_token");
  
  // Limpar também cookies cross-domain
  clearCrossDomainStorage("rv_oauth_user_id");
  clearCrossDomainStorage("rv_auth_token");
  
  console.log("Sessão do usuário removida com sucesso");
}

/**
 * Funções auxiliares para armazenamento cross-domain
 */
export function setCrossDomainStorage(key: string, value: string): void {
  // Armazenar em localStorage
  localStorage.setItem(key, value);
  
  // Armazenar em cookie com domínio raiz e validade de 30 minutos
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 60 * 1000); // 30 minutos
  document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
  
  console.log(`Dados armazenados para recuperação cross-domain: ${key}`);
}

export function getCrossDomainStorage(key: string): string | null {
  // Tentar obter do localStorage primeiro
  const localValue = localStorage.getItem(key);
  if (localValue) {
    console.log(`Valor recuperado do localStorage: ${key}`);
    return localValue;
  }
  
  // Tentar obter do cookie como fallback
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.trim().split('=');
    if (cookieKey === key) {
      console.log(`Valor recuperado do cookie: ${key}`);
      // Persistir de volta no localStorage para uso futuro
      localStorage.setItem(key, cookieValue);
      return cookieValue;
    }
  }
  
  console.log(`Nenhum valor encontrado para: ${key}`);
  return null;
}

// Função para limpar armazenamento cross-domain
export function clearCrossDomainStorage(key: string): void {
  localStorage.removeItem(key);
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(`Dados cross-domain removidos: ${key}`);
}

// Verificar se há uma operação OAuth pendente ao carregar
export function checkPendingOAuth(): void {
  const pendingOAuth = localStorage.getItem("rv_oauth_pending");
  if (pendingOAuth === "true" && window.location.origin === "https://viva-reputacao-clinicas.lovable.app") {
    console.log("Operação OAuth pendente detectada. Continuando fluxo...");
    localStorage.removeItem("rv_oauth_pending");
    // Iniciar o fluxo OAuth
    window.location.href = getGoogleAuthUrl();
  }
}
