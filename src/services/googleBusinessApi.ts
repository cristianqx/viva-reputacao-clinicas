
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

// Função para manipular armazenamento cross-domain
export const setCrossDomainStorage = (key: string, value: string): void => {
  try {
    // Salvar no localStorage corrente
    localStorage.setItem(key, value);
    
    // Também tentar salvar em um cookie para cross-domain
    const date = new Date();
    date.setTime(date.getTime() + 30 * 60 * 1000); // 30 minutos
    document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/; SameSite=None; Secure`;
  } catch (error) {
    console.error("Erro ao salvar em armazenamento cross-domain:", error);
  }
};

// Função para obter dados de armazenamento cross-domain
export const getCrossDomainStorage = (key: string): string | null => {
  try {
    // Tentar primeiro obter do localStorage
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    
    // Se não encontrar, tentar obter dos cookies
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${key}=`))
      ?.split('=')[1];
    
    return cookieValue || null;
  } catch (error) {
    console.error("Erro ao obter armazenamento cross-domain:", error);
    return null;
  }
};

// Função para limpar armazenamento cross-domain
export const clearCrossDomainStorage = (key: string): void => {
  try {
    // Limpar do localStorage
    localStorage.removeItem(key);
    
    // Limpar do cookie (definindo data de expiração no passado)
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
  } catch (error) {
    console.error("Erro ao limpar armazenamento cross-domain:", error);
  }
};

// Função para extrair informações do usuário de um token JWT
export const extractUserInfoFromToken = (token: string): { email: string, name?: string, picture?: string } | null => {
  try {
    const decoded = jwtDecode(token) as any;
    
    if (decoded && decoded.email) {
      return {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

// Função para salvar a sessão do usuário
export const saveUserSession = (userData: any): void => {
  try {
    localStorage.setItem("rv_user", JSON.stringify(userData));
    
    if (userData.id) {
      localStorage.setItem("rv_user_id", userData.id);
      setCrossDomainStorage("rv_user_id", userData.id);
    }
  } catch (error) {
    console.error("Erro ao salvar sessão do usuário:", error);
  }
};

// Função para obter a sessão do usuário
export const getUserSession = (): any => {
  try {
    const userDataString = localStorage.getItem("rv_user");
    if (!userDataString) return null;
    
    return JSON.parse(userDataString);
  } catch (error) {
    console.error("Erro ao obter sessão do usuário:", error);
    return null;
  }
};

// Função para atualizar o link do Google Meu Negócio
export const updateGoogleMyBusinessLink = async (link: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Erro ao obter usuário:", error);
      toast.error("Não foi possível verificar a sessão do usuário.");
      return false;
    }
    
    // Atualizar o link do usuário
    const { error: updateError } = await supabase
      .from("users")
      .update({ google_my_business_link: link })
      .eq("id", (await supabase.auth.getUser()).data.user?.id);
    
    if (updateError) {
      console.error("Erro ao salvar link do Google Meu Negócio:", updateError);
      toast.error("Erro ao salvar link do Google Meu Negócio");
      return false;
    }
    
    toast.success("Link do Google Meu Negócio salvo com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao salvar link do Google Meu Negócio:", error);
    toast.error("Erro ao salvar link do Google Meu Negócio");
    return false;
  }
};

// Função para buscar o link do Google Meu Negócio
export const getGoogleMyBusinessLink = async (): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Erro ao obter usuário:", userError);
      return null;
    }
    
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("google_my_business_link")
      .eq("id", userData.user.id)
      .single();
    
    if (profileError) {
      console.error("Erro ao buscar link do Google Meu Negócio:", profileError);
      return null;
    }
    
    return userProfile?.google_my_business_link || null;
  } catch (error) {
    console.error("Erro ao buscar link do Google Meu Negócio:", error);
    return null;
  }
};

// Verificar se há um link do GMB configurado
export const hasGoogleMyBusinessLink = async (): Promise<boolean> => {
  const link = await getGoogleMyBusinessLink();
  return !!link;
};

// Função para buscar todos os dados do usuário e suas conexões
export const getUserGoogleConnection = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Erro ao obter usuário:", userError);
      return null;
    }
    
    // Buscar conexão GMB
    const { data: gmbConnection, error: gmbError } = await supabase
      .from("gmb_connections")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    
    if (gmbError && gmbError.code !== "PGRST116") {
      console.error("Erro ao buscar conexão GMB:", gmbError);
      return null;
    }
    
    return gmbConnection;
  } catch (error) {
    console.error("Erro ao buscar conexão GMB:", error);
    return null;
  }
};

// Função para verificar e processar pendências OAuth (mantida para compatibilidade)
export const checkPendingOAuth = async () => {
  // Mantida vazia para compatibilidade
  return;
};

// Função para desconectar do Google Meu Negócio (não apaga o link, apenas desconecta API se houver)
export const disconnectGoogleMyBusiness = async (): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Erro ao obter usuário:", userError);
      toast.error("Não foi possível verificar a sessão do usuário.");
      return false;
    }

    // Desconectar qualquer conexão existente (se implementarmos API no futuro)
    const { error: deleteError } = await supabase
      .from("gmb_connections")
      .delete()
      .eq("user_id", userData.user.id);
    
    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("Erro ao desconectar do Google Meu Negócio:", deleteError);
      toast.error("Erro ao desconectar do Google Meu Negócio");
      return false;
    }
    
    toast.success("Desconectado do Google Meu Negócio com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao desconectar do Google Meu Negócio:", error);
    toast.error("Erro ao desconectar do Google Meu Negócio");
    return false;
  }
};
