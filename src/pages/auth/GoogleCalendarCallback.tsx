
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractUserInfoFromToken, getCrossDomainStorage, getUserSession } from "@/services/googleBusinessApi";

const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "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";
const redirectUri = "https://viva-reputacao-clinicas.lovable.app/auth/google-calendar-callback";

const GoogleCalendarCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Tentar recuperar o userId de várias fontes
  const getUserId = () => {
    const localUserId = localStorage.getItem("rv_user_id");
    if (localUserId) {
      console.log("[CalendarCallback] ID encontrado no localStorage:", localUserId);
      return localUserId;
    }
    
    const crossDomainUserId = getCrossDomainStorage("rv_oauth_user_id");
    if (crossDomainUserId) {
      console.log("[CalendarCallback] ID encontrado no armazenamento cross-domain:", crossDomainUserId);
      localStorage.setItem("rv_user_id", crossDomainUserId);
      return crossDomainUserId;
    }
    
    console.error("[CalendarCallback] ERRO: user_id não encontrado em nenhum lugar");
    return null;
  };
  
  const userId = getUserId();
  
  // Verificar se estamos no domínio correto
  useEffect(() => {
    if (window.location.origin !== "https://viva-reputacao-clinicas.lovable.app") {
      console.error("[CalendarCallback] Domínio incorreto detectado. Redirecionando para o domínio correto...");
      const currentUrl = new URL(window.location.href);
      const redirectUrl = `https://viva-reputacao-clinicas.lovable.app${currentUrl.pathname}${currentUrl.search}`;
      window.location.href = redirectUrl;
    }
  }, []);
  
  useEffect(() => {
    console.log("[CalendarCallback] Montado. Tentando recuperar user_id...");
    console.log("[CalendarCallback] URL completa:", window.location.href);
    console.log("[CalendarCallback] Query params:", location.search);
    
    if (!userId) {
      console.error("[CalendarCallback] ERRO: user_id não encontrado em nenhuma fonte");
      setError("Usuário não identificado. Por favor, faça login novamente antes de conectar com o Google Calendar.");
      setIsProcessing(false);
    } else {
      console.log("[CalendarCallback] user_id recuperado com sucesso:", userId);
      
      // Restaurar também outros dados importantes do usuário se possível
      if (!localStorage.getItem("rv_user") && userId) {
        console.log("[CalendarCallback] Tentando recuperar dados do usuário do Supabase");
        const fetchUserInfo = async () => {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('id, email, nome_completo, plano_id, ativo, data_validade')
              .eq('id', userId)
              .single();
            
            if (error) {
              console.error("[CalendarCallback] Erro ao recuperar dados do usuário:", error);
            } else if (data) {
              const userData = {
                id: data.id,
                email: data.email,
                nome_completo: data.nome_completo,
                plano_id: data.plano_id,
                ativo: data.ativo,
                data_validade: data.data_validade
              };
              
              localStorage.setItem("rv_user", JSON.stringify(userData));
              console.log("[CalendarCallback] Dados do usuário restaurados com sucesso");
            }
          } catch (error) {
            console.error("[CalendarCallback] Falha ao recuperar dados do usuário:", error);
          }
        };
        
        fetchUserInfo();
      }
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    async function handleAuthCallback() {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        
        if (!code) {
          throw new Error("Código de autorização não encontrado");
        }

        console.log("Iniciando processamento de callback do Google Calendar OAuth...");
        console.log("Código OAuth recebido:", code.substring(0, 10) + "...");
        console.log("Usuário identificado:", userId);

        // Trocar o código por tokens
        console.log("Enviando requisição para obtenção de tokens...");
        
        if (!clientSecret) {
          console.error("ERRO CRÍTICO: client_secret está indefinido!");
          throw new Error("Configuração incompleta: client_secret não encontrado");
        }
        
        const formData = new URLSearchParams();
        formData.append("code", code);
        formData.append("client_id", clientId);
        formData.append("client_secret", clientSecret);
        formData.append("redirect_uri", redirectUri);
        formData.append("grant_type", "authorization_code");
        
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
        
        if (!userInfo || !userInfo.email) {
          throw new Error("Não foi possível obter o email do usuário Google. Tente novamente.");
        }
        
        console.log("Informações do usuário Google obtidas:", userInfo.email);
        console.log("Salvando conexão para o usuário:", userId);
        
        // Usando uma consulta SQL direta para evitar problemas com tabelas recém-criadas
        
        // Verificar se já existe uma conexão ativa para este usuário e email
        const { data: existingConnection } = await supabase
          .from('google_calendar_connections')
          .select('id')
          .eq('user_id', userId)
          .eq('google_email', userInfo.email)
          .eq('status', 'active');
          
        if (existingConnection && existingConnection.length > 0) {
          console.log("Conexão existente encontrada. Atualizando tokens...");
          
          // Atualizar a conexão existente
          const { error: updateError } = await supabase
            .from('google_calendar_connections')
            .update({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              token_type: tokenData.token_type,
              expires_in: tokenData.expires_in,
              status: "active",
              created_at: new Date().toISOString()
            })
            .eq('id', existingConnection[0].id);
            
          if (updateError) {
            throw new Error(`Erro ao atualizar conexão: ${updateError.message}`);
          }
          
          console.log("Conexão atualizada com sucesso");
        } else {
          console.log("Criando nova conexão...");
          
          // Inserir conexão no banco de dados
          const { error: connectionError } = await supabase
            .from('google_calendar_connections')
            .insert({
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
        
        setSuccess(true);
        toast.success("Google Calendar conectado com sucesso!");
        
        // Aguardar um momento antes de redirecionar
        setTimeout(() => {
          navigate("/integracoes");
        }, 2000);
        
      } catch (error) {
        console.error("Erro no callback:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        toast.error("Erro ao conectar com o Google Calendar. Tente novamente ou entre em contato com o suporte.");
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full w-full fill-blue-500">
            <path d="M21 6v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14z"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-[#002C54] mb-2">
          Conexão com Google Calendar
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
            <p className="mt-4 text-green-600 font-medium">Google Calendar conectado com sucesso!</p>
            <p className="mt-2 text-gray-500">Redirecionando para integrações...</p>
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
              onClick={() => navigate("/integracoes")} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Voltar às integrações
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

export default GoogleCalendarCallback;
