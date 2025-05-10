
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";
import GoogleBusinessIntegration from "@/components/integrations/GoogleBusinessIntegration";
import { useToast } from "@/hooks/use-toast";
import { getUserGoogleConnection } from "@/services/googleBusinessApi";
import { getUserCalendarConnection } from "@/services/googleCalendarApi";

const Integracoes = () => {
  const { toast } = useToast();
  const [gmbConnected, setGmbConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkConnections = async () => {
      try {
        setIsLoading(true);
        // Verificar conexão com Google Meu Negócio
        const gmbConnection = await getUserGoogleConnection();
        setGmbConnected(!!gmbConnection);
        
        // Verificar conexão com Google Calendar
        const calendarConnection = await getUserCalendarConnection();
        setCalendarConnected(!!calendarConnection);
      } catch (error) {
        console.error("Erro ao verificar conexões:", error);
        toast({
          title: "Erro",
          description: "Não foi possível verificar o estado das integrações",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnections();
  }, [toast]);
  
  return (
    <Layout>
      <PageHeader 
        title="Integrações" 
        description="Conecte seus serviços Google para maximizar o uso da plataforma."
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Integrações Google</CardTitle>
            <CardDescription>
              Conecte suas contas Google para acessar recursos adicionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <GoogleCalendarIntegration 
              isConnected={calendarConnected}
              isLoading={isLoading}
            />
            
            <GoogleBusinessIntegration 
              isConnected={gmbConnected} 
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Integracoes;
