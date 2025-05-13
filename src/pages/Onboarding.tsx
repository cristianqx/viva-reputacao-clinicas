
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import GoogleBusinessIntegration from "@/components/integrations/GoogleBusinessIntegration";
import { useGoogleIntegration } from "@/hooks/useGoogleIntegration";
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";
import { useGoogleCalendarIntegration } from "@/hooks/useGoogleCalendarIntegration";
import { toast } from "sonner";

// Tipos de negócio para o dropdown
const tiposNegocio = [
  { value: "clinica_odontologica", label: "Clínica Odontológica" },
  { value: "clinica_medica", label: "Clínica Médica" },
  { value: "salao_beleza", label: "Salão de Beleza" },
  { value: "restaurante", label: "Restaurante" },
  { value: "academia", label: "Academia" },
  { value: "escola", label: "Escola" },
  { value: "advocacia", label: "Escritório de Advocacia" },
  { value: "outro", label: "Outro" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [nomeBusiness, setNomeBusiness] = useState("");
  const [tipoBusiness, setTipoBusiness] = useState("");
  const [telefone, setTelefone] = useState("");
  const [etapasConcluidas, setEtapasConcluidas] = useState([false, false, false, false]);
  const totalEtapas = 5;
  
  // Integração com Google Business
  const { 
    isConnected: isGoogleConnected, 
    isLoading: isGoogleLoading,
    refreshConnection: refreshGoogleConnection
  } = useGoogleIntegration();
  
  // Custom hook para Google Calendar (vamos criar em seguida)
  const { 
    isConnected: isCalendarConnected, 
    isLoading: isCalendarLoading,
    refreshConnection: refreshCalendarConnection
  } = useGoogleCalendarIntegration();
  
  // Marcar a etapa como concluída quando a conexão for estabelecida
  useEffect(() => {
    if (isGoogleConnected) {
      const novasEtapasConcluidas = [...etapasConcluidas];
      novasEtapasConcluidas[1] = true;
      setEtapasConcluidas(novasEtapasConcluidas);
    }
  }, [isGoogleConnected]);

  // Marcar a etapa do Calendar como concluída quando a conexão for estabelecida
  useEffect(() => {
    if (isCalendarConnected) {
      const novasEtapasConcluidas = [...etapasConcluidas];
      novasEtapasConcluidas[2] = true;
      setEtapasConcluidas(novasEtapasConcluidas);
    }
  }, [isCalendarConnected]);

  // Calcular progresso
  const progresso = (etapaAtual / totalEtapas) * 100;

  // Avançar para próxima etapa
  const avancarEtapa = () => {
    // Validações específicas por etapa
    if (etapaAtual === 1) {
      // Etapa de boas-vindas não tem validação
      const novasEtapasConcluidas = [...etapasConcluidas];
      novasEtapasConcluidas[0] = true;
      setEtapasConcluidas(novasEtapasConcluidas);
      setEtapaAtual(etapaAtual + 1);
    } 
    else if (etapaAtual === 2) {
      // Google Business - pode pular se necessário
      setEtapaAtual(etapaAtual + 1);
    }
    else if (etapaAtual === 3) {
      // Google Calendar - pode pular se necessário
      setEtapaAtual(etapaAtual + 1);
    }
    else if (etapaAtual === 4) {
      // Validar informações do negócio
      if (!nomeBusiness.trim()) {
        toast.error("Por favor, informe o nome do seu negócio");
        return;
      }
      if (!tipoBusiness) {
        toast.error("Por favor, selecione o tipo do seu negócio");
        return;
      }
      if (!telefone.trim()) {
        toast.error("Por favor, informe o telefone de contato");
        return;
      }
      
      // Se passou nas validações
      const novasEtapasConcluidas = [...etapasConcluidas];
      novasEtapasConcluidas[3] = true;
      setEtapasConcluidas(novasEtapasConcluidas);
      setEtapaAtual(etapaAtual + 1);
    }
    else if (etapaAtual === 5) {
      // Concluir onboarding e ir para dashboard
      finalizarOnboarding();
    }
  };

  // Voltar para etapa anterior
  const voltarEtapa = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  // Pular etapa atual
  const pularEtapa = () => {
    if (etapaAtual < totalEtapas) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  // Finalizar o onboarding e salvar os dados
  const finalizarOnboarding = () => {
    // Aqui você iria salvar os dados no banco de dados
    // Para este exemplo, apenas vamos mostrar um toast e navegar para o dashboard
    toast.success("Configuração concluída com sucesso!");
    
    // Navega para o Dashboard após um pequeno delay para o usuário ver o toast
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // Renderizar a etapa atual
  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">
                Bem-vindo(a) à Reputação Viva, {user?.nome_completo || ""}!
              </h2>
              <p className="text-gray-600 mt-2">
                Vamos configurar sua conta em poucos passos para que você possa 
                começar a melhorar sua reputação online rapidamente.
              </p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium text-primary">O que vamos configurar:</h3>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>Conectar com Google Meu Negócio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>Configurar Google Calendar (opcional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>Informações básicas do seu negócio</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">
                Conecte-se ao Google Meu Negócio
              </h2>
              <p className="text-gray-600 mt-2">
                Esta integração permite coletar e gerenciar avaliações diretamente 
                no Google, além de responder aos clientes de forma centralizada.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <GoogleBusinessIntegration 
                isConnected={isGoogleConnected} 
                isLoading={isGoogleLoading}
              />
            </div>
            
            {isGoogleConnected && (
              <div className="flex items-center text-green-600 justify-center mt-4">
                <Check className="mr-2" />
                <span>Conexão estabelecida com sucesso!</span>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">
                Conecte-se ao Google Calendar
              </h2>
              <p className="text-gray-600 mt-2">
                Ideal para negócios baseados em agendamento. Esta integração permite
                automatizar lembretes e pedidos de avaliação após o atendimento.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                (Opcional, você pode configurar depois)
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <GoogleCalendarIntegration 
                isConnected={isCalendarConnected} 
                isLoading={isCalendarLoading}
              />
            </div>
            
            {isCalendarConnected && (
              <div className="flex items-center text-green-600 justify-center mt-4">
                <Check className="mr-2" />
                <span>Conexão estabelecida com sucesso!</span>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">
                Informações do seu Negócio
              </h2>
              <p className="text-gray-600 mt-2">
                Estas informações serão usadas em campanhas e na personalização da plataforma.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-negocio">Nome do Negócio</Label>
                <Input
                  id="nome-negocio"
                  placeholder="Ex: Clínica Odontológica Sorriso Feliz"
                  value={nomeBusiness}
                  onChange={(e) => setNomeBusiness(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo-negocio">Tipo de Negócio</Label>
                <Select value={tipoBusiness} onValueChange={setTipoBusiness}>
                  <SelectTrigger id="tipo-negocio">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposNegocio.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone de Contato</Label>
                <Input
                  id="telefone"
                  placeholder="Ex: (11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">
                Tudo Pronto!
              </h2>
              <p className="text-gray-600 mt-2">
                Sua plataforma está configurada e pronta para começar a coletar 
                mais avaliações para o seu negócio.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-700">Configuração Concluída</h3>
              <p className="text-green-600 text-center mt-2">
                Você pode começar a usar a plataforma agora mesmo, ou configurar mais 
                detalhes na seção de configurações.
              </p>
            </div>
            
            <div className="text-center text-gray-500">
              <p>Acesse seu Dashboard para visualizar seus principais indicadores.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/placeholder.svg" 
              alt="Reputação Viva" 
              className="h-8 w-8 mr-2"
            />
            <span className="font-medium text-lg text-primary">Reputação Viva</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Configuração Inicial</span>
          </div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <div className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                    Etapa {etapaAtual} de {totalEtapas}
                  </span>
                  {etapasConcluidas[etapaAtual - 1] && (
                    <span className="text-green-500 flex items-center">
                      <Check size={16} className="mr-1" /> Concluído
                    </span>
                  )}
                </div>
              </div>
              <Progress value={progresso} className="w-full md:w-1/2 h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {renderEtapa()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={voltarEtapa}
              disabled={etapaAtual === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            
            <div className="flex space-x-2">
              {etapaAtual === 3 && (
                <Button
                  variant="ghost"
                  onClick={pularEtapa}
                  className="text-gray-500"
                >
                  Pular esta etapa
                </Button>
              )}
              
              <Button 
                onClick={avancarEtapa}
                className="bg-[#0E927D] hover:bg-[#0E927D]/90"
              >
                {etapaAtual === totalEtapas ? (
                  "Finalizar"
                ) : (
                  <>
                    Avançar <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
