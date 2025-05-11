
import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Definição dos tipos
interface User {
  id: string;
  email: string;
  nome_completo: string;
  plano_id: string;
  ativo: boolean;
  data_validade: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão do armazenamento local
  const loadSession = useCallback(() => {
    try {
      console.log("Tentando carregar sessão do localStorage...");
      const storedToken = localStorage.getItem("rv_auth_token");
      const storedUser = localStorage.getItem("rv_user");
      
      if (storedToken && storedUser) {
        console.log("Sessão encontrada no localStorage");
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        return true;
      } else {
        console.log("Nenhuma sessão válida encontrada no localStorage");
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      clearSession();
    }
    return false;
  }, []);

  // Limpar sessão
  const clearSession = useCallback(() => {
    console.log("Limpando dados de sessão do localStorage");
    localStorage.removeItem("rv_auth_token");
    localStorage.removeItem("rv_user_id");
    localStorage.removeItem("rv_user");
    
    // Limpar quaisquer dados de cross-domain storage que possam estar relacionados à autenticação
    try {
      sessionStorage.clear();
      // Tentar limpar outros armazenamentos relacionados à autenticação do Google
      localStorage.removeItem("rv_oauth_user_id");
    } catch (e) {
      console.error("Erro ao limpar storage adicional:", e);
    }
    
    setUser(null);
    setToken(null);
  }, []);

  // Verificar autenticação
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Verificando autenticação...");
      // Por enquanto, apenas verifica se o token existe
      // Futuramente, podemos adicionar verificação de expiração
      const sessionLoaded = loadSession();
      setIsLoading(false);
      return sessionLoaded;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsLoading(false);
      return false;
    }
  }, [loadSession]);

  // Efeito para carregar a sessão ao inicializar
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    
    initAuth();
  }, [checkAuth]);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Tentando login com:", email);
      
      // Chamar a função RPC de login no Supabase
      const { data, error } = await supabase.rpc('login', {
        p_email: email,
        p_senha: password
      });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("E-mail ou senha incorretos.");
        setIsLoading(false);
        return false;
      }
      
      const userData = data[0];
      
      // Verificar se o usuário está ativo e dentro da validade
      if (!userData.ativo) {
        toast.error("Esta conta está desativada.");
        setIsLoading(false);
        return false;
      }
      
      // Gerar um token JWT simples (na prática seria pelo servidor)
      // Este é um placeholder - em produção use um token real
      const jwtToken = `rv_${btoa(JSON.stringify({
        id: userData.user_id,
        email: userData.email,
        exp: new Date().getTime() + (365 * 24 * 60 * 60 * 1000) // 1 ano no futuro
      }))}`;
      
      // Criar objeto de usuário para armazenar
      const userObject = {
        id: userData.user_id,
        email: userData.email,
        nome_completo: userData.nome_completo,
        plano_id: userData.plano_id,
        ativo: userData.ativo,
        data_validade: userData.data_validade
      };
      
      // Salvar dados APENAS no localStorage para garantir persistência
      console.log("Salvando dados de autenticação no localStorage");
      localStorage.setItem("rv_auth_token", jwtToken);
      localStorage.setItem("rv_user_id", userData.user_id);
      localStorage.setItem("rv_user", JSON.stringify(userObject));
      
      // Atualizar estado
      setUser(userObject);
      setToken(jwtToken);
      
      toast.success(`Bem-vindo, ${userData.nome_completo}!`);
      setIsLoading(false);
      console.log("Login bem-sucedido, user_id salvo:", userData.user_id);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
      setIsLoading(false);
      return false;
    }
  };

  // Função de logout melhorada
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("Realizando logout...");
      
      // Limpar dados de conexões com Google
      try {
        const { error } = await supabase
          .from('gmb_connections')
          .update({ status: 'revoked' })
          .eq('user_id', user?.id || '');
          
        if (error) {
          console.error("Erro ao atualizar status das conexões:", error);
        }
      } catch (e) {
        console.error("Erro ao revogar conexões externas:", e);
      }
      
      // Limpar todos os dados de sessão
      clearSession();
      
      toast.info("Sessão encerrada com sucesso");
      
      // Redirecionar para a página de login (isso será feito pelo router)
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao encerrar sessão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
