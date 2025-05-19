import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGoogleCalendarIntegration } from "@/hooks/useGoogleCalendarIntegration";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const GoogleCalendarIntegration = () => {
  const {
    isConnected,
    isLoading: isCalendarLoading,
    email,
    refreshConnection,
    disconnectGoogleCalendar,
    error
  } = useGoogleCalendarIntegration();
  
  const { token, isLoading: isAuthLoading } = useAuth();
  
  console.log("GoogleCalendarIntegration state:", { isConnected, isCalendarLoading, isAuthLoading, email, error });
  
  const [isSyncing, setIsSyncing] = useState(false);
  let authWindow: Window | null = null;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        "https://viva-reputacao-clinicas.lovable.app",
        // Adicione outros domínios do lovableproject.com dinamicamente se necessário,
        // ou use uma verificação mais flexível como event.origin.endsWith(".lovableproject.com")
      ];
      const isLovableProjectOrigin = event.origin.includes("lovableproject.com");
      const isLovableDevOrigin = event.origin.includes("lovable.dev");

      if (
        !allowedOrigins.includes(event.origin) &&
        !isLovableProjectOrigin &&
        !isLovableDevOrigin
      ) {
        console.log("Mensagem recebida de origem NÃO aceita:", event.origin);
        return;
      }
      console.log("Mensagem recebida de origem aceita:", event.origin);

      const { type, payload } = event.data;

      if (type === "google-calendar-auth-success") {
        console.log("Auth success message received from popup", payload);
        if (authWindow) {
          authWindow.close();
          authWindow = null;
        }
        refreshConnection();
      } else if (type === "google-calendar-auth-error") {
        console.log("Auth error message received from popup", payload);
        if (authWindow) {
          authWindow.close();
          authWindow = null;
        }
        refreshConnection();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [refreshConnection]);

  const handleConnect = async () => {
    console.log("handleConnect called");
    console.log("Token value from top-level hook:", token);
    try {
      if (!token) {
        console.error("handleConnect: Token is null or undefined when connecting.", { tokenFromState: token });
        toast.error("Usuário não autenticado. Por favor, tente recarregar a página.");
        return;
      }

      const baseUrl = "https://tjvcdtrofkzwrbugrbgk.supabase.co";
      const response = await fetch(`${baseUrl}/functions/v1/google-calendar-auth`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao obter URL de autenticação");
      }

      const data = await response.json();
      if (data.redirectUrl) {
        const windowFeatures = "popup,width=600,height=700,noopener,noreferrer";
        authWindow = window.open(data.redirectUrl, "googleAuthPopup", windowFeatures);

        if (!authWindow || authWindow.closed || typeof authWindow.closed == 'undefined') {
            toast.warning('Não foi possível abrir a janela pop-up. Por favor, verifique as configurações do seu navegador para permitir pop-ups.');
        } else {
            authWindow.focus();
        }

      } else {
        throw new Error("URL de redirecionamento não encontrada na resposta da função");
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Google Calendar:", error);
      toast.error("Erro ao iniciar autenticação: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      const response = await fetch("https://tjvcdtrofkzwrbugrbgk.supabase.co/functions/v1/sync-google-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("supabase-auth-token")}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Erro ao sincronizar com Google Calendar");
      }
      
      const data = await response.json();
      alert(`Sincronização concluída! ${data.eventsProcessed || 0} evento(s) processado(s).`);
      
    } catch (error) {
      console.error("Erro ao sincronizar Google Calendar:", error);
      alert("Erro ao sincronizar Google Calendar. Tente novamente mais tarde.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Google Calendar</h3>
        </div>
        
        {isConnected ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={disconnectGoogleCalendar}
              disabled={isCalendarLoading}
            >
              {isCalendarLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Desconectar</span>
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSync} 
              className="gap-2"
              disabled={isCalendarLoading || isSyncing}
            >
              {isSyncing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  <span>Sincronizar Agora</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleConnect} 
            className="gap-2"
            disabled={isCalendarLoading || isSyncing || isAuthLoading}
          >
            {isCalendarLoading || isAuthLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                <span>Conectar Google Calendar</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      {isConnected && email && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>
            Conectado à conta <strong>{email}</strong>. Os eventos do seu calendário serão sincronizados automaticamente.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use o Google Calendar para agendamentos automáticos de consultas. 
          Se preferir, agende manualmente pelo perfil do paciente.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GoogleCalendarIntegration;
