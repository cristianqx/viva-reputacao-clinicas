
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  getCrossDomainStorage, 
  clearCrossDomainStorage, 
  extractUserInfoFromToken,
  saveUserSession
} from "@/services/googleBusinessApi";

const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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";
// Usando o domínio fixo para o redirect
const redirectUri = "https://viva-reputacao-clinicas.lovable.app/auth/callback";

const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Tentar recuperar o userId de várias fontes
  const getUserId = () => {
    // Verificar primeiro no localStorage
    const localUserId = localStorage.getItem("rv_user_id");
    if (localUserId) {
      console.log("[GoogleCallback] ID encontrado no localStorage:", localUserId);
      return localUserId;
    }
    
    // Se não encontrar no localStorage, verificar o mecanismo cross-domain
    const crossDomainUserId = getCrossDomainStorage("rv_oauth_user_id");
    if (crossDomainUserId) {
      console.log("[GoogleCallback] ID encontrado no armazenamento cross-domain:", crossDomainUserId);
      // Salvar de volta no localStorage
      localStorage.setItem("rv_user_id", crossDomainUserId);
      return crossDomainUserId;
    }
    
    console.error("[GoogleCallback] ERRO: user_id não encontrado em nenhum lugar");
    return null;
  };
  
  const userId = getUserId();
  
  // Verificar se estamos no domínio correto
  useEffect(() => {
    if (window.location.origin !== "https://viva-reputacao-clinicas.lovable.app") {
      console.error("[GoogleCallback] Domínio incorreto detectado. Redirecionando para o domínio fixo...");
      const currentUrl = new URL(window.location.href);
      const redirectUrl = `https://viva-reputacao-clinicas.lovable.app${currentUrl.pathname}${currentUrl.search}`;
      window.location.href = redirectUrl;
    }
  }, []);
  
  // Log inicial para depuração
  useEffect(() => {
    console.log("[GoogleCallback] Montado. Tentando recuperar user_id...");
    console.log("[GoogleCallback] URL completa:", window.location.href);
    console.log("[GoogleCallback] Domínio atual:", window.location.hostname);
    console.log("[GoogleCallback] Query params:", location.search);
    
    if (!userId) {
      console.error("[GoogleCallback] ERRO: user_id não encontrado em nenhuma fonte");
      setError("Usuário não identificado. Por favor, faça login novamente antes de conectar com o Google.");
      setIsProcessing(false);
    } else {
      console.log("[GoogleCallback] user_id recuperado com sucesso:", userId);
      
      // Restaurar também outros dados importantes do usuário se possível
      if (!localStorage.getItem("rv_user") && userId) {
        console.log("[GoogleCallback] Tentando recuperar dados do usuário do Supabase");
        // Tentar recuperar informações do usuário do Supabase
        const fetchUserInfo = async () => {
          try {
            // Usando query SQL direta em vez de RPC para evitar o erro de tipo
            const { data, error } = await supabase
              .from('users')
              .select('id, email, nome_completo, plano_id, ativo, data_validade')
              .eq('id', userId)
              .single();
            
            if (error) {
              console.error("[GoogleCallback] Erro ao recuperar dados do usuário:", error);
            } else if (data) {
              const userData = {
                id: data.id,
                email: data.email,
                nome_completo: data.nome_completo,
                plano_id: data.plano_id,
                ativo: data.ativo,
                data_validade: data.data_validade
              };
              
              // Salvar nas duas formas de armazenamento
              saveUserSession(userData);
              console.log("[GoogleCallback] Dados do usuário restaurados com sucesso");
            }
          } catch (error) {
            console.error("[GoogleCallback] Falha ao recuperar dados do usuário:", error);
          }
        };
        
        fetchUserInfo();
      }
    }
    
    // Informação de debug sobre o localStorage
    console.log("[GoogleCallback] Conteúdo do localStorage:", 
      Object.keys(localStorage).reduce((acc, key) => {
        return {...acc, [key]: localStorage.getItem(key)};
      }, {})
    );
  }, [userId]);

  useEffect(() => {
    // Só processamos o callback se tivermos um userId
    if (!userId) return;
    
    async function handleAuthCallback() {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        
        if (!code) {
          throw new Error("Código de autorização não encontrado");
        }

        console.log("Iniciando processamento de callback do Google OAuth...");
        console.log("Código OAuth recebido:", code.substring(0, 10) + "...");
        console.log("Usuário identificado:", userId);

        // Trocar o código por tokens
        console.log("Enviando requisição para obtenção de tokens com parâmetros:");
        console.log("- client_id:", clientId);
        console.log("- client_secret:", clientSecret ? "Presente (primeira parte: " + clientSecret.substring(0, 10) + "...)" : "AUSENTE!");
        console.log("- redirect_uri:", redirectUri);
        console.log("- grant_type: authorization_code");
        
        // Garantir que o clientSecret esteja definido
        if (!clientSecret) {
          console.error("ERRO CRÍTICO: client_secret está indefinido!");
          throw new Error("Configuração incompleta: client_secret não encontrado");
        }
        
        // Montamos a URL manualmente para garantir que não há espaços ou caracteres especiais
        const formData = new URLSearchParams();
        formData.append("code", code);
        formData.append("client_id", clientId);
        formData.append("client_secret", clientSecret);
        formData.append("redirect_uri", redirectUri);
        formData.append("grant_type", "authorization_code");
        
        console.log("Body da requisição:", formData.toString());
        
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData
        });

        console.log("Status da resposta:", tokenResponse.status);
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error("Resposta de erro completa:", errorText);
          throw new Error(`Falha ao obter tokens. Status: ${tokenResponse.status}. Detalhes: ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log("Tokens recebidos com sucesso. Access token:", 
          tokenData.access_token ? tokenData.access_token.substring(0, 10) + "..." : "ausente");
        console.log("Refresh token presente:", !!tokenData.refresh_token);
        console.log("ID token presente:", !!tokenData.id_token);
        
        // Extrair informações do usuário diretamente do ID token (JWT)
        let userInfo: { email: string, name?: string, picture?: string } | null = null;
        
        if (tokenData.id_token) {
          console.log("Extraindo informações do usuário do ID token (JWT)...");
          userInfo = extractUserInfoFromToken(tokenData.id_token);
          
          if (userInfo && userInfo.email) {
            console.log("Informações extraídas com sucesso:", userInfo.email);
          } else {
            console.warn("Não foi possível extrair informações do ID token");
          }
        }
        
        // Se não conseguiu extrair do token, faz chamada ao userinfo endpoint como fallback
        if (!userInfo || !userInfo.email) {
          console.log("Fazendo chamada à API para obter informações do usuário como fallback...");
          
          try {
            const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            });
    
            if (!userInfoResponse.ok) {
              if (userInfoResponse.status === 401) {
                console.error("Token inválido ou expirado ao acessar /userinfo (401 Unauthorized)");
                throw new Error("Erro na autorização. O token não tem permissões necessárias ou está expirado. Tente conectar novamente.");
              }
              
              const errorText = await userInfoResponse.text();
              console.error("Erro ao obter info do usuário:", errorText);
              throw new Error(`Falha ao obter informações do usuário Google. Status: ${userInfoResponse.status}`);
            }
    
            userInfo = await userInfoResponse.json();
            console.log("Informações do usuário obtidas via API:", userInfo?.email);
          } catch (userInfoError) {
            console.error("Erro ao obter informações do usuário:", userInfoError);
            // Verificar se podemos continuar mesmo sem as informações completas
            if (!userInfo || !userInfo.email) {
              throw new Error("Não foi possível obter o email do usuário Google. Tente novamente.");
            }
          }
        }
        
        if (!userInfo || !userInfo.email) {
          throw new Error("Não foi possível obter o email do usuário Google. Tente novamente.");
        }
        
        console.log("Informações do usuário Google obtidas:", userInfo.email);
        console.log("Salvando conexão para o usuário:", userId);
        
        // Verificar se já existe uma conexão ativa para este usuário e email
        const { data: existingConnection } = await supabase
          .from("gmb_connections")
          .select("id")
          .eq("user_id", userId)
          .eq("google_email", userInfo.email)
          .eq("status", "active");
          
        if (existingConnection && existingConnection.length > 0) {
          console.log("Conexão existente encontrada. Atualizando tokens...");
          
          // Atualizar a conexão existente
          const { error: updateError } = await supabase
            .from("gmb_connections")
            .update({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              token_type: tokenData.token_type,
              expires_in: tokenData.expires_in,
              status: "active",
              created_at: new Date().toISOString()
            })
            .eq("id", existingConnection[0].id);
            
          if (updateError) {
            throw new Error(`Erro ao atualizar conexão: ${updateError.message}`);
          }
          
          console.log("Conexão atualizada com sucesso");
        } else {
          console.log("Criando nova conexão...");
          
          // Inserir conexão no banco de dados
          const { error: connectionError } = await supabase.from("gmb_connections").insert({
            user_id: userId,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            token_type: tokenData.token_type,
            expires_in: tokenData.expires_in,
            google_email: userInfo.email,
            status: "active",
          });

          if (connectionError) {
            throw new Error(`Erro ao salvar conexão: ${connectionError.message}`);
          }
          
          console.log("Nova conexão criada com sucesso");
        }

        // Limpar dados temporários cross-domain após uso bem-sucedido
        clearCrossDomainStorage("rv_oauth_user_id");
        
        setSuccess(true);
        toast.success("Conta Google conectada com sucesso!");
        
        // Aguardar um momento antes de redirecionar
        setTimeout(() => {
          navigate("/configuracoes");
        }, 2000);
        
      } catch (error) {
        console.error("Erro no callback:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        toast.error("Erro ao conectar com o Google. Tente novamente ou entre em contato com o suporte.");
      } finally {
        setIsProcessing(false);
      }
    }

    handleAuthCallback();
  }, [location.search, navigate, userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-full w-full fill-blue-500">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-[#002C54] mb-2">
          Conexão com Google
        </h2>
        
        {isProcessing && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processando integração...</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="mt-4 text-green-600 font-medium">Conta Google conectada com sucesso!</p>
            <p className="mt-2 text-gray-500">Redirecionando para configurações...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="mt-4 text-red-600 font-medium">Erro na conexão</p>
            <p className="mt-2 text-gray-700">{error}</p>
            <button 
              onClick={() => navigate("/")} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        )}

        {window.location.origin !== "https://viva-reputacao-clinicas.lovable.app" && (
          <div className="mt-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <p className="mt-4 text-yellow-600 font-medium">Domínio incorreto</p>
            <p className="mt-2 text-gray-700">O callback do Google deve ser recebido no domínio oficial. Você será redirecionado automaticamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
