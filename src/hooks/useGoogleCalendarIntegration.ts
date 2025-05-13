
import { useState, useEffect } from "react";
import { getUserCalendarConnection, disconnectGoogleCalendar } from "@/services/googleCalendarApi";
import { toast } from "sonner";

interface GoogleCalendarIntegrationState {
  isConnected: boolean;
  isLoading: boolean;
  email: string | null;
  error: string | null;
}

export function useGoogleCalendarIntegration() {
  const [state, setState] = useState<GoogleCalendarIntegrationState>({
    isConnected: false,
    isLoading: true,
    email: null,
    error: null,
  });

  const checkConnection = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Verificando conexão com Google Calendar...");
      const connection = await getUserCalendarConnection();
      
      if (connection) {
        console.log("Conexão com Google Calendar encontrada para:", connection.google_email);
        setState({
          isConnected: true,
          isLoading: false,
          email: connection.google_email,
          error: null,
        });
      } else {
        console.log("Nenhuma conexão ativa com Google Calendar");
        setState({
          isConnected: false,
          isLoading: false,
          email: null,
          error: null,
        });
      }
    } catch (error) {
      console.error("Erro ao verificar conexão com Calendar:", error);
      setState({
        isConnected: false,
        isLoading: false,
        email: null,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleDisconnect = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log("Iniciando processo de desconexão do Calendar...");
      const success = await disconnectGoogleCalendar();
      
      if (success) {
        console.log("Conta Google Calendar desconectada com sucesso");
        setState({
          isConnected: false,
          isLoading: false,
          email: null,
          error: null,
        });
        
        toast.success("Conta Google Calendar desconectada com sucesso");
      } else {
        throw new Error("Não foi possível desconectar a conta do Calendar");
      }
    } catch (error) {
      console.error("Erro ao desconectar Calendar:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao desconectar",
      }));
      
      toast.error("Erro ao desconectar conta Google Calendar. Tente novamente mais tarde.");
    }
  };

  return {
    ...state,
    refreshConnection: checkConnection,
    disconnectGoogleCalendar: handleDisconnect,
  };
}
