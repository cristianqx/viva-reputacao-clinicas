
import { useState, useEffect } from "react";
import { getGoogleAuthUrl, checkPendingOAuth } from "@/services/googleBusinessApi";
import { useGoogleIntegration } from "@/hooks/useGoogleIntegration";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, RefreshCcw, ExternalLink } from "lucide-react";

export default function GoogleBusinessIntegration() {
  const { 
    isConnected, 
    isLoading, 
    email, 
    error, 
    disconnectGoogle,
    refreshConnection
  } = useGoogleIntegration();
  
  const [disconnecting, setDisconnecting] = useState(false);

  // Verificar se há operação OAuth pendente ao carregar o componente
  useEffect(() => {
    checkPendingOAuth();
  }, []);

  const handleConnect = () => {
    const redirectUrl = getGoogleAuthUrl();
    window.location.href = redirectUrl;
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await disconnectGoogle();
    setDisconnecting(false);
  };

  const handleRefresh = () => {
    refreshConnection();
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-6 w-6 fill-blue-500">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-base">Google Meu Negócio</h3>
            <p className="text-sm text-gray-500 mt-1">
              Conecte-se para ver e responder avaliações do Google
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <Button variant="outline" size="sm" disabled>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </Button>
          ) : isConnected ? (
            <div className="flex items-center">
              <div className="mr-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={disconnecting}>
                {disconnecting ? "Desconectando..." : "Desconectar"}
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Conectar com Google
            </Button>
          )}
        </div>
      </div>

      {isConnected && email && (
        <Alert className="mt-4 bg-green-50 border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="text-green-700">
              Conta conectada: <strong>{email}</strong>
            </p>
            <Button variant="link" className="p-0 h-auto text-green-700" onClick={handleRefresh}>
              Verificar status da conexão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mt-4 bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <p>Erro na conexão: {error}</p>
            <Button variant="link" className="p-0 h-auto text-red-700" onClick={handleConnect}>
              Reconectar agora
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {window.location.origin !== "https://opinar-cliente-hub-74.lovable.app" && (
        <Alert className="mt-4 bg-yellow-50 border border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            <p>Aviso: Você está em um domínio diferente do esperado pelo Google OAuth. Ao clicar em "Conectar com Google" você será redirecionado para o domínio correto.</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
