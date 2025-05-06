import { useState } from "react";
import { Mail, Phone, Calendar, Plus, ArrowRight, Filter, MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import NovaCampanhaModal from "@/components/modals/NovaCampanhaModal";
import FiltroPeriodoModal from "@/components/modals/FiltroPeriodoModal";
import FiltrosAvancadosModal from "@/components/modals/FiltrosAvancadosModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos
type CampanhaStatus = "ativa" | "agendada" | "pausada" | "rascunho" | "finalizada";
type CampanhaTipo = "email" | "sms";

interface Campanha {
  id: string;
  nome: string;
  tipo: CampanhaTipo;
  status: CampanhaStatus;
  dataEnvio?: string;
  dataAgendamento?: string;
  estatisticas: {
    enviados: number;
    abertos: number;
    clicados: number;
    avaliados: number;
  };
  progresso: number;
  ultimoEnvio?: string;
  audiencia: {
    total: number;
    origem: string;
  };
}

// Dados de exemplo
const campanhasExemplo: Campanha[] = [
  {
    id: "1",
    nome: "Pós-Atendimento Abril 2023",
    tipo: "email",
    status: "ativa",
    dataEnvio: "2023-04-01",
    estatisticas: {
      enviados: 120,
      abertos: 85,
      clicados: 42,
      avaliados: 18
    },
    progresso: 85,
    ultimoEnvio: "2023-04-15",
    audiencia: {
      total: 250,
      origem: "Agenda Odontológica"
    }
  },
  {
    id: "2",
    nome: "Campanha SMS Pacientes Ortodontia",
    tipo: "sms",
    status: "finalizada",
    dataEnvio: "2023-03-10",
    estatisticas: {
      enviados: 75,
      abertos: 75, // SMS sempre é considerado aberto
      clicados: 22,
      avaliados: 15
    },
    progresso: 100,
    ultimoEnvio: "2023-03-15",
    audiencia: {
      total: 75,
      origem: "Lista manual"
    }
  },
  {
    id: "3",
    nome: "Feedback Clareamento Dental",
    tipo: "email",
    status: "pausada",
    dataEnvio: "2023-02-20",
    estatisticas: {
      enviados: 50,
      abertos: 30,
      clicados: 15,
      avaliados: 8
    },
    progresso: 40,
    ultimoEnvio: "2023-02-25",
    audiencia: {
      total: 120,
      origem: "Importação CSV"
    }
  },
  {
    id: "4",
    nome: "Lembrete de Revisão Trimestral",
    tipo: "email",
    status: "agendada",
    dataAgendamento: "2023-05-01",
    estatisticas: {
      enviados: 0,
      abertos: 0,
      clicados: 0,
      avaliados: 0
    },
    progresso: 0,
    audiencia: {
      total: 180,
      origem: "Agenda Odontológica"
    }
  },
  {
    id: "5",
    nome: "Novo Tratamento de Implante",
    tipo: "email",
    status: "rascunho",
    estatisticas: {
      enviados: 0,
      abertos: 0,
      clicados: 0,
      avaliados: 0
    },
    progresso: 0,
    audiencia: {
      total: 0,
      origem: "Não definido"
    }
  }
];

// Componente de Badge de status da campanha
const StatusBadge = ({ status }: { status: CampanhaStatus }) => {
  const configs = {
    ativa: { bg: "bg-green-100 text-green-800", label: "Ativa" },
    pausada: { bg: "bg-yellow-100 text-yellow-800", label: "Pausada" },
    rascunho: { bg: "bg-gray-100 text-gray-800", label: "Rascunho" },
    agendada: { bg: "bg-blue-100 text-blue-800", label: "Agendada" },
    finalizada: { bg: "bg-purple-100 text-purple-800", label: "Finalizada" }
  };
  
  const config = configs[status];
  
  return (
    <Badge variant="outline" className={`${config.bg}`}>
      {config.label}
    </Badge>
  );
};

// Componente de Tipo da campanha
const TipoBadge = ({ tipo }: { tipo: CampanhaTipo }) => {
  const config = tipo === 'email' 
    ? { icon: Mail, label: "Email" }
    : { icon: Phone, label: "SMS" };
    
  const Icon = config.icon;
  
  return (
    <div className="flex items-center text-sm text-gray-500">
      <Icon size={14} className="mr-1" />
      <span>{config.label}</span>
    </div>
  );
};

// Componente de Card de Campanha
const CampanhaCard = ({ campanha }: { campanha: Campanha }) => {
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Calcula a taxa de conversão
  const taxaConversao = campanha.estatisticas.enviados > 0 
    ? ((campanha.estatisticas.avaliados / campanha.estatisticas.enviados) * 100).toFixed(1)
    : "0";
    
  // Ações da campanha
  const handlePausarCampanha = () => {
    toast({
      title: "Campanha pausada",
      description: `A campanha "${campanha.nome}" foi pausada.`,
    });
  };
  
  const handleEditarCampanha = () => {
    toast({
      description: `Edição da campanha "${campanha.nome}" iniciada.`,
    });
  };
  
  const handleDuplicarCampanha = () => {
    toast({
      description: `A campanha "${campanha.nome}" foi duplicada.`,
    });
  };
  
  const handleExcluirCampanha = () => {
    toast({
      title: "Campanha excluída",
      description: `A campanha "${campanha.nome}" foi excluída.`,
      variant: "destructive",
    });
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg font-medium">{campanha.nome}</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <TipoBadge tipo={campanha.tipo} />
              <span className="mx-2">•</span>
              <span className="text-sm text-gray-500">
                {campanha.status === "agendada" 
                  ? `Agendada para ${formatarData(campanha.dataAgendamento)}`
                  : campanha.ultimoEnvio 
                    ? `Último envio: ${formatarData(campanha.ultimoEnvio)}`
                    : "Não enviada"}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={campanha.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditarCampanha}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicarCampanha}>Duplicar</DropdownMenuItem>
                <DropdownMenuItem onClick={handlePausarCampanha}>
                  {campanha.status === "pausada" ? "Retomar" : "Pausar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExcluirCampanha} className="text-red-500">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Enviados</p>
            <p className="font-semibold text-lg">{campanha.estatisticas.enviados}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Abertos</p>
            <p className="font-semibold text-lg">{campanha.estatisticas.abertos}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Clicados</p>
            <p className="font-semibold text-lg">{campanha.estatisticas.clicados}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avaliações</p>
            <p className="font-semibold text-lg">{campanha.estatisticas.avaliados}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Progresso</span>
            <span className="text-sm font-medium">{campanha.progresso}%</span>
          </div>
          <Progress value={campanha.progresso} className="h-2" />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <span>Taxa de conversão: <span className="font-medium">{taxaConversao}%</span></span>
          <span className="mx-2">•</span>
          <span>Audiência: <span className="font-medium">{campanha.audiencia.total} contatos</span></span>
          <span className="mx-2">•</span>
          <span>Origem: <span className="font-medium">{campanha.audiencia.origem}</span></span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="ml-auto">
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente principal da página
export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(campanhasExemplo);
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [busca, setBusca] = useState("");
  const [isNovaCampanhaModalOpen, setIsNovaCampanhaModalOpen] = useState(false);
  const [isPeriodoModalOpen, setIsPeriodoModalOpen] = useState(false);
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);
  const [periodoFiltro, setPeriodoFiltro] = useState<string | null>(null);

  // Criar nova campanha
  const handleCriarNovaCampanha = (novaCampanha: any) => {
    const campanha: Campanha = {
      ...novaCampanha,
      id: (campanhas.length + 1).toString(),
      estatisticas: {
        enviados: 0,
        abertos: 0,
        clicados: 0,
        avaliados: 0
      },
      progresso: 0,
      audiencia: {
        total: 0,
        origem: novaCampanha.origem || "Não definido"
      }
    };
    
    setCampanhas([campanha, ...campanhas]);
  };

  // Filtrar campanhas
  const campanhasFiltradas = campanhas.filter(campanha => {
    // Filtro de status
    if (filtroAtivo !== "todas" && campanha.status !== filtroAtivo) return false;
    
    // Busca por nome
    if (busca && !campanha.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Filtrar por período
  const handleFiltrarPeriodo = (dataInicio: Date, dataFim: Date) => {
    const dataInicioFormatada = format(dataInicio, "dd/MM/yyyy", { locale: ptBR });
    const dataFimFormatada = format(dataFim, "dd/MM/yyyy", { locale: ptBR });
    
    setPeriodoFiltro(`${dataInicioFormatada} - ${dataFimFormatada}`);
    
    toast({
      description: `Filtro aplicado: ${dataInicioFormatada} a ${dataFimFormatada}`,
    });
  };

  // Filtros avançados
  const handleFiltrosAvancados = (filtros: any) => {
    toast({
      description: "Filtros avançados aplicados com sucesso",
    });
  };

  // Templates e relatórios
  const handleVerTodosTemplates = () => {
    toast({
      description: "Abrindo biblioteca de templates",
    });
  };

  const handleVerRelatorioCompleto = () => {
    toast({
      description: "Abrindo relatório completo de campanhas",
    });
  };

  return (
    <>
      <PageHeader 
        title="Campanhas" 
        description="Crie e gerencie campanhas para solicitação de avaliações."
      >
        <Button className="ml-auto" onClick={() => setIsNovaCampanhaModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </PageHeader>
      
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar campanhas..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsFiltrosModalOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPeriodoModalOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {periodoFiltro || "Período"}
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="todas" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="todas" onClick={() => setFiltroAtivo("todas")}>
                  Todas
                </TabsTrigger>
                <TabsTrigger value="ativas" onClick={() => setFiltroAtivo("ativa")}>
                  Ativas
                </TabsTrigger>
                <TabsTrigger value="agendadas" onClick={() => setFiltroAtivo("agendada")}>
                  Agendadas
                </TabsTrigger>
                <TabsTrigger value="pausadas" onClick={() => setFiltroAtivo("pausada")}>
                  Pausadas
                </TabsTrigger>
                <TabsTrigger value="rascunhos" onClick={() => setFiltroAtivo("rascunho")}>
                  Rascunhos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="todas" className="p-4">
              {campanhasFiltradas.length > 0 ? (
                campanhasFiltradas.map(campanha => (
                  <CampanhaCard key={campanha.id} campanha={campanha} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos campanhas com os filtros selecionados.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsNovaCampanhaModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar nova campanha
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Os outros TabsContent compartilham o mesmo conteúdo filtrado pelos Triggers */}
            <TabsContent value="ativas" className="p-4">
              {campanhasFiltradas.length > 0 ? (
                campanhasFiltradas.map(campanha => (
                  <CampanhaCard key={campanha.id} campanha={campanha} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha ativa</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você não possui campanhas ativas no momento.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsNovaCampanhaModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar nova campanha
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="agendadas" className="p-4">
              {campanhasFiltradas.length > 0 ? (
                campanhasFiltradas.map(campanha => (
                  <CampanhaCard key={campanha.id} campanha={campanha} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha agendada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você não possui campanhas agendadas no momento.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsNovaCampanhaModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agendar nova campanha
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pausadas" className="p-4">
              {campanhasFiltradas.length > 0 ? (
                campanhasFiltradas.map(campanha => (
                  <CampanhaCard key={campanha.id} campanha={campanha} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha pausada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você não possui campanhas pausadas no momento.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rascunhos" className="p-4">
              {campanhasFiltradas.length > 0 ? (
                campanhasFiltradas.map(campanha => (
                  <CampanhaCard key={campanha.id} campanha={campanha} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum rascunho encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você não possui rascunhos de campanhas no momento.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsNovaCampanhaModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar rascunho
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Templates Populares</CardTitle>
              <CardDescription>Templates prontos para suas campanhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium">Pós-Atendimento Padrão</h4>
                    <p className="text-sm text-gray-500">Email de solicitação após consulta</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium">SMS Rápido</h4>
                    <p className="text-sm text-gray-500">Mensagem curta para avaliação</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium">Lembrete de Avaliação</h4>
                    <p className="text-sm text-gray-500">Email para quem não respondeu</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleVerTodosTemplates}>
                Ver todos os templates
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Desempenho</CardTitle>
              <CardDescription>Desempenho de suas campanhas nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Emails Enviados</p>
                  <p className="text-2xl font-bold text-brand mt-1">325</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12% vs mês anterior</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Taxa de Abertura</p>
                  <p className="text-2xl font-bold text-brand mt-1">68%</p>
                  <p className="text-xs text-green-600 mt-1">↑ 5% vs mês anterior</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Taxa de Clique</p>
                  <p className="text-2xl font-bold text-brand mt-1">42%</p>
                  <p className="text-xs text-green-600 mt-1">↑ 3% vs mês anterior</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Avaliações Obtidas</p>
                  <p className="text-2xl font-bold text-brand mt-1">78</p>
                  <p className="text-xs text-green-600 mt-1">↑ 15% vs mês anterior</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleVerRelatorioCompleto}>
                Ver relatório completo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modais */}
      <NovaCampanhaModal
        isOpen={isNovaCampanhaModalOpen}
        onClose={() => setIsNovaCampanhaModalOpen(false)}
        onSave={handleCriarNovaCampanha}
      />
      
      <FiltroPeriodoModal
        isOpen={isPeriodoModalOpen}
        onClose={() => setIsPeriodoModalOpen(false)}
        onApply={handleFiltrarPeriodo}
      />
      
      <FiltrosAvancadosModal
        isOpen={isFiltrosModalOpen}
        onClose={() => setIsFiltrosModalOpen(false)}
        onApply={handleFiltrosAvancados}
        tipo="campanhas"
      />
    </>
  );
}
