import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGoogleCalendarIntegration } from "@/hooks/useGoogleCalendarIntegration";

const GoogleCalendarIntegration = () => {
  const {
    isConnected,
    isLoading,
    email,
    refreshConnection,
    disconnectGoogleCalendar,
    error
  } = useGoogleCalendarIntegration();
  
  console.log("GoogleCalendarIntegration state:", { isConnected, isLoading, email, error });
  
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleConnect = async () => {
    console.log("handleConnect called");
    try {
      // Get the auth token
      const authToken = localStorage.getItem("supabase-auth-token");
      if (!authToken) {
        throw new Error("Usuário não autenticado");
      }

      // Redirect to auth URL through our service
      const baseUrl = "https://tjvcdtrofkzwrbugrbgk.supabase.co";
      const response = await fetch(`${baseUrl}/functions/v1/google-calendar-auth`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao iniciar autenticação do Google Calendar");
      }

      // Get the redirect URL from the response
      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("URL de redirecionamento não encontrada");
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Google Calendar:", error);
      alert("Erro ao iniciar autenticação do Google Calendar. Tente novamente mais tarde.");
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
              disabled={isLoading}
            >
              {isLoading ? (
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
              disabled={isLoading || isSyncing}
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
            disabled={isLoading}
          >
            {isLoading ? (
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
