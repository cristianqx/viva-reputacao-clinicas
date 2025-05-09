
import { useState, useEffect } from "react";
import { getUserGoogleConnection, disconnectGoogle } from "@/services/googleBusinessApi";
import { toast } from "sonner";

interface GoogleIntegrationState {
  isConnected: boolean;
  isLoading: boolean;
  email: string | null;
  error: string | null;
}

export function useGoogleIntegration() {
  const [state, setState] = useState<GoogleIntegrationState>({
    isConnected: false,
    isLoading: true,
    email: null,
    error: null,
  });

  const checkConnection = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Verificando conexão com Google...");
      const connection = await getUserGoogleConnection();
      
      if (connection) {
        console.log("Conexão com Google encontrada para:", connection.google_email);
        setState({
          isConnected: true,
          isLoading: false,
          email: connection.google_email,
          error: null,
        });
      } else {
        console.log("Nenhuma conexão ativa com Google");
        setState({
          isConnected: false,
          isLoading: false,
          email: null,
          error: null,
        });
      }
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
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
      console.log("Iniciando processo de desconexão...");
      const success = await disconnectGoogle();
      
      if (success) {
        console.log("Conta Google desconectada com sucesso");
        setState({
          isConnected: false,
          isLoading: false,
          email: null,
          error: null,
        });
        
        toast.success("Conta Google desconectada com sucesso");
      } else {
        throw new Error("Não foi possível desconectar a conta");
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao desconectar",
      }));
      
      toast.error("Erro ao desconectar conta Google. Tente novamente mais tarde.");
    }
  };

  return {
    ...state,
    refreshConnection: checkConnection,
    disconnectGoogle: handleDisconnect,
  };
}
