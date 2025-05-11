
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Google } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getGoogleAuthUrl, disconnectGoogle } from "@/services/googleBusinessApi";
import { toast } from "sonner";

export interface GoogleBusinessIntegrationProps {
  isConnected: boolean;
  isLoading?: boolean;
}

const GoogleBusinessIntegration = ({ isConnected, isLoading = false }: GoogleBusinessIntegrationProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async () => {
    try {
      setIsProcessing(true);
      const authUrl = getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Google:", error);
      toast.error("Erro ao conectar com Google Meu Negócio. Tente novamente ou contate o suporte.");
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsProcessing(true);
      const success = await disconnectGoogle();
      if (success) {
        toast.success("Google Meu Negócio desconectado com sucesso!");
        // Recarregar a página para atualizar o estado
        window.location.reload();
      } else {
        throw new Error("Não foi possível desconectar");
      }
    } catch (error) {
      console.error("Erro ao desconectar Google:", error);
      toast.error("Erro ao desconectar Google Meu Negócio. Tente novamente ou contate o suporte.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Google className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Google Meu Negócio</h3>
        </div>
        
        {isConnected ? (
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleDisconnect}
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Conectado</span>
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleConnect} 
            className="gap-2"
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Google className="h-4 w-4" />
                <span>Conectar Google Meu Negócio</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use o Google Meu Negócio para gerenciar suas avaliações online e melhorar a visibilidade da sua clínica nos resultados de busca.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GoogleBusinessIntegration;
