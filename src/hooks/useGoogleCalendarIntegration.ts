import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    console.log("checkConnection: Iniciando verificação...");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("checkConnection: Dentro do try...");
      // Retrieve the userId from localStorage
      const userId = localStorage.getItem("rv_user_id");
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      // Query the google_calendar_connections table to check for an active connection
      const { data, error } = await supabase
        .from('google_calendar_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Conexão com Google Calendar encontrada para:", data.google_email);
        setState({
          isConnected: true,
          isLoading: false,
          email: data.google_email,
          error: null,
        });
      } else {
        console.log("checkConnection: Nenhuma conexão ativa encontrada.");
        setState({
          isConnected: false,
          isLoading: false,
          email: null,
          error: null,
        });
      }
    } catch (error) {
      console.error("checkConnection: Erro ao verificar conexão:", error);
      setState({
        isConnected: false,
        isLoading: false,
        email: null,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      console.log("checkConnection: Finalizando verificação.");
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleDisconnect = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log("Iniciando processo de desconexão do Calendar...");
      
      const response = await fetch("https://tjvcdtrofkzwrbugrbgk.supabase.co/functions/v1/disconnect-google-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("supabase-auth-token")}`
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao desconectar Google Calendar");
      }
      
      console.log("Conta Google Calendar desconectada com sucesso");
      setState({
        isConnected: false,
        isLoading: false,
        email: null,
        error: null,
      });
      
      toast.success("Conta Google Calendar desconectada com sucesso");
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
