
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getGoogleCalendarAuthUrl, disconnectGoogleCalendar } from "@/services/googleCalendarApi";
import { toast } from "sonner";

interface GoogleCalendarIntegrationProps {
  isConnected: boolean;
  isLoading?: boolean;
}

const GoogleCalendarIntegration = ({ isConnected, isLoading = false }: GoogleCalendarIntegrationProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async () => {
    try {
      setIsProcessing(true);
      const authUrl = getGoogleCalendarAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Google Calendar:", error);
      toast.error("Erro ao conectar com Google Calendar. Tente novamente ou contate o suporte.");
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsProcessing(true);
      const success = await disconnectGoogleCalendar();
      if (success) {
        toast.success("Google Calendar desconectado com sucesso!");
        // Recarregar a página para atualizar o estado
        window.location.reload();
      } else {
        throw new Error("Não foi possível desconectar");
      }
    } catch (error) {
      console.error("Erro ao desconectar Google Calendar:", error);
      toast.error("Erro ao desconectar Google Calendar. Tente novamente ou contate o suporte.");
    } finally {
      setIsProcessing(false);
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
                <Calendar className="h-4 w-4" />
                <span>Conectar Google Calendar</span>
              </>
            )}
          </Button>
        )}
      </div>
      
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
