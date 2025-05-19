
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const GoogleCalendarCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        
        if (!code) {
          throw new Error("Código de autorização não encontrado");
        }

        console.log("Iniciando processamento de callback do Google Calendar OAuth...");
        
        // Call the edge function to handle token exchange and database updates
        const response = await fetch("https://tjvcdtrofkzwrbugrbgk.supabase.co/functions/v1/google-calendar-oauth-callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro no processamento da autenticação");
        }

        const data = await response.json();
        console.log("Conexão estabelecida com sucesso:", data);
        
        setSuccess(true);
        toast.success("Google Calendar conectado com sucesso!");

        // Comunicar sucesso para a janela pai
        // Aceitar tanto o domínio lovable.app quanto lovableproject.com como origens válidas
        const parentOrigins = [
          "https://viva-reputacao-clinicas.lovable.app", 
          "https://e12a7f71-0eee-4922-9f67-2faf89004991.lovableproject.com",
          "https://lovable.dev"
        ];
        
        if (window.opener) {
          for (const origin of parentOrigins) {
            try {
              window.opener.postMessage(
                { type: "google-calendar-auth-success", payload: { email: data.email } }, 
                origin
              );
              console.log("Mensagem enviada com sucesso para:", origin);
            } catch (err) {
              console.error(`Erro ao enviar mensagem para ${origin}:`, err);
            }
          }
          
          // Fechar a janela popup após curto delay
          setTimeout(() => {
            window.close();
          }, 1000);
        }

      } catch (error) {
        console.error("Erro no callback:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        toast.error("Erro ao conectar com o Google Calendar. Tente novamente ou entre em contato com o suporte.");

        // Comunicar erro para a janela pai
        const parentOrigins = [
          "https://viva-reputacao-clinicas.lovable.app", 
          "https://e12a7f71-0eee-4922-9f67-2faf89004991.lovableproject.com",
          "https://lovable.dev"
        ];
        
        if (window.opener) {
          for (const origin of parentOrigins) {
            try {
              window.opener.postMessage(
                { type: "google-calendar-auth-error", payload: { error: error instanceof Error ? error.message : String(error) } }, 
                origin
              );
            } catch (err) {
              console.error(`Erro ao enviar mensagem de erro para ${origin}:`, err);
            }
          }
          
          // Fechar a janela popup após curto delay
          setTimeout(() => {
            window.close();
          }, 3000);
        }

      } finally {
        setIsProcessing(false);
      }
    }

    handleAuthCallback();
  }, [location.search, navigate]);

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
      </div>
    </div>
  );
};

export default GoogleCalendarCallback;
