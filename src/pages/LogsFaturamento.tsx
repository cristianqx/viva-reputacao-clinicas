import { useState } from "react";
import { Search, Filter, ArrowDown, ArrowUp, Calendar, ExternalLink, AlertCircle, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import FiltrosAvancadosModal from "@/components/modals/FiltrosAvancadosModal";

// Tipos
interface LogAvaliacao {
  id: string;
  contatoId: string;
  contatoNome: string;
  plataforma: "Google" | "Facebook" | "Manual";
  dataClique?: string;
  dataAvaliacao: string;
  nota: number;
  comentario?: string;
  statusCobranca: "Gerada" | "Pendente" | "Paga";
  valorCobrado: number;
  campanhaId?: string;
  campanhaNome?: string;
}

// Dados de exemplo
const logsExemplo: LogAvaliacao[] = [
  {
    id: "log-1",
    contatoId: "1",
    contatoNome: "Ana Paula Silva",
    plataforma: "Google",
    dataClique: "2023-04-11T14:30:00",
    dataAvaliacao: "2023-04-12T10:15:00",
    nota: 5,
    comentario: "Atendimento excelente, recomendo a todos!",
    statusCobranca: "Paga",
    valorCobrado: 2.00
  },
  {
    id: "log-2",
    contatoId: "3",
    contatoNome: "Mariana Costa",
    plataforma: "Facebook",
    dataClique: "2023-04-06T09:45:00",
    dataAvaliacao: "2023-04-07T16:20:00",
    nota: 4,
    comentario: "Bom atendimento, equipe atenciosa.",
    statusCobranca: "Paga",
    valorCobrado: 2.00,
    campanhaId: "camp-102",
    campanhaNome: "Pós-Atendimento Abril"
  },
  {
    id: "log-3",
    contatoId: "5",
    contatoNome: "Juliana Almeida",
    plataforma: "Google",
    dataClique: "2023-04-02T17:10:00",
    dataAvaliacao: "2023-04-03T11:05:00",
    nota: 5,
    comentario: "Clínica maravilhosa, profissionais excelentes!",
    statusCobranca: "Paga",
    valorCobrado: 2.00,
    campanhaId: "camp-101",
    campanhaNome: "Feedback Automático"
  },
  {
    id: "log-4",
    contatoId: "7",
    contatoNome: "Fernanda Lima",
    plataforma: "Facebook",
    dataClique: "2023-03-17T10:30:00",
    dataAvaliacao: "2023-03-18T14:45:00",
    nota: 5,
    comentario: "Super recomendo, excelentes profissionais.",
    statusCobranca: "Paga",
    valorCobrado: 2.00
  },
  {
    id: "log-5",
    contatoId: "2",
    contatoNome: "Carlos Eduardo Mendes",
    plataforma: "Manual",
    dataAvaliacao: "2023-04-15T09:30:00",
    nota: 4,
    comentario: "Atendimento rápido e eficiente.",
    statusCobranca: "Pendente",
    valorCobrado: 2.00
  },
  {
    id: "log-6",
    contatoId: "4",
    contatoNome: "Pedro Henrique Oliveira",
    plataforma: "Google",
    dataClique: "2023-04-18T16:20:00",
    dataAvaliacao: "2023-04-19T09:10:00",
    nota: 3,
    comentario: "Atendimento bom, mas tive que esperar um pouco.",
    statusCobranca: "Gerada",
    valorCobrado: 2.00,
    campanhaId: "camp-103",
    campanhaNome: "Clientes Implantes"
  }
];

// Componente de estrelas para exibição da nota
const StarDisplay = ({ nota }: { nota: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < nota ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={i < nota ? "text-yellow-500" : "text-gray-300"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

export default function LogsFaturamento() {
  const [logs, setLogs] = useState<LogAvaliacao[]>(logsExemplo);
  const [busca, setBusca] = useState("");
  const [plataforma, setPlataforma] = useState("todas");
  const [statusCobranca, setStatusCobranca] = useState("todos");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [ordenacao, setOrdenacao] = useState<{campo: keyof LogAvaliacao, direcao: 'asc' | 'desc'}>({
    campo: 'dataAvaliacao',
    direcao: 'desc'
  });
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);
  
  // Formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return format(data, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };
  
  // Filtrar logs
  const logsFiltrados = logs.filter(log => {
    // Filtro de plataforma
    if (plataforma !== "todas" && log.plataforma.toLowerCase() !== plataforma) return false;
    
    // Filtro de status de cobrança
    if (statusCobranca !== "todos" && log.statusCobranca.toLowerCase() !== statusCobranca) return false;
    
    // Filtro de período
    if (periodoInicio) {
      const dataInicio = new Date(periodoInicio);
      const dataAvaliacao = new Date(log.dataAvaliacao);
      if (dataAvaliacao < dataInicio) return false;
    }
    
    if (periodoFim) {
      const dataFim = new Date(periodoFim);
      const dataAvaliacao = new Date(log.dataAvaliacao);
      // Ajustar para final do dia
      dataFim.setHours(23, 59, 59);
      if (dataAvaliacao > dataFim) return false;
    }
    
    // Busca por nome do contato
    if (busca) {
      const textoBusca = busca.toLowerCase();
      return log.contatoNome.toLowerCase().includes(textoBusca);
    }
    
    return true;
  });
  
  // Ordenar logs
  const logsOrdenados = [...logsFiltrados].sort((a, b) => {
    let valorA = a[ordenacao.campo];
    let valorB = b[ordenacao.campo];
    
    // Tratamento especial para campos de data
    if (ordenacao.campo.includes('data') && valorA && valorB) {
      valorA = new Date(valorA as string).getTime();
      valorB = new Date(valorB as string).getTime();
    }
    
    // Ordenação conforme direção
    if (ordenacao.direcao === 'asc') {
      return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
    } else {
      return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
    }
  });
  
  // Alterar ordenação
  const handleChangeOrdenacao = (campo: keyof LogAvaliacao) => {
    setOrdenacao({
      campo,
      direcao: ordenacao.campo === campo && ordenacao.direcao === 'asc' ? 'desc' : 'asc'
    });
  };
  
  // Renderizar seta de ordenação
  const renderSortArrow = (campo: keyof LogAvaliacao) => {
    if (ordenacao.campo !== campo) return null;
    
    return ordenacao.direcao === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };
  
  // Atualizar status de cobrança
  const handleUpdateStatusCobranca = (logId: string, novoStatus: "Gerada" | "Pendente" | "Paga") => {
    const novoLogs = logs.map(log => {
      if (log.id === logId) {
        return { ...log, statusCobranca: novoStatus };
      }
      return log;
    });
    
    setLogs(novoLogs);
    
    toast({
      description: `Status da cobrança atualizado para: ${novoStatus}`,
    });
  };
  
  // Abrir link da avaliação
  const handleOpenAvaliacaoLink = (log: LogAvaliacao) => {
    // Aqui abriria o link real da avaliação no Google ou Facebook
    toast({
      description: `Abrindo avaliação de ${log.contatoNome} na plataforma ${log.plataforma}`,
    });
  };
  
  // Aplicar filtros avançados
  const handleFiltrosAvancados = (filtros: any) => {
    // Implementação real dependeria dos filtros específicos que queremos aplicar
    toast({
      description: "Filtros avançados aplicados",
    });
  };
  
  // Calcular totais para os cards de resumo
  const totalAvaliacoes = logsFiltrados.length;
  const totalFaturamento = logsFiltrados.reduce((total, log) => total + log.valorCobrado, 0);
  const avaliacoesPagas = logsFiltrados.filter(log => log.statusCobranca === "Paga").length;
  const mediaNota = logsFiltrados.length > 0 
    ? Number((logsFiltrados.reduce((total, log) => total + log.nota, 0) / logsFiltrados.length).toFixed(1))
    : 0;
  
  return (
    <>
      <PageHeader 
        title="Logs de Faturamento" 
        description="Monitore as avaliações coletadas e o faturamento gerado."
      >
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFiltrosModalOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avançados
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">{totalAvaliacoes}</p>
              <p className="text-sm text-gray-500 mt-1">No período selecionado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Faturamento Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                R$ {totalFaturamento.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {avaliacoesPagas} avaliações pagas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nota Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-brand">{mediaNota}</p>
                <StarDisplay nota={mediaNota} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                de um total de 5 estrelas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                {totalAvaliacoes > 0 
                  ? Math.round((avaliacoesPagas / totalAvaliacoes) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Taxa de avaliações pagas
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome do contato..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[150px]">
                  <Select value={plataforma} onValueChange={setPlataforma}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as plataformas</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[150px]">
                  <Select value={statusCobranca} onValueChange={setStatusCobranca}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="gerada">Gerada</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="paga">Paga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsFiltrosModalOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <Label htmlFor="periodo-inicio" className="text-xs text-gray-500">Data Inicial</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="periodo-inicio"
                    type="date"
                    value={periodoInicio}
                    onChange={(e) => setPeriodoInicio(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="periodo-fim" className="text-xs text-gray-500">Data Final</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="periodo-fim"
                    type="date"
                    value={periodoFim}
                    onChange={(e) => setPeriodoFim(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('contatoNome')}
                  >
                    <div className="flex items-center">
                      Contato {renderSortArrow('contatoNome')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('plataforma')}
                  >
                    <div className="flex items-center">
                      Plataforma {renderSortArrow('plataforma')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('dataClique')}
                  >
                    <div className="flex items-center">
                      Data do Clique {renderSortArrow('dataClique')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('dataAvaliacao')}
                  >
                    <div className="flex items-center">
                      Data da Avaliação {renderSortArrow('dataAvaliacao')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('nota')}
                  >
                    <div className="flex items-center">
                      Nota {renderSortArrow('nota')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('statusCobranca')}
                  >
                    <div className="flex items-center">
                      Status {renderSortArrow('statusCobranca')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleChangeOrdenacao('valorCobrado')}
                  >
                    <div className="flex items-center">
                      Valor {renderSortArrow('valorCobrado')}
                    </div>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsOrdenados.length > 0 ? (
                  logsOrdenados.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="font-medium">{log.contatoNome}</div>
                        {log.campanhaNome && (
                          <div className="text-xs text-gray-500">
                            Campanha: {log.campanhaNome}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            log.plataforma === "Google" 
                              ? "bg-blue-50 text-blue-700 border-blue-200" 
                              : log.plataforma === "Facebook" 
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {log.plataforma}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.dataClique ? formatarData(log.dataClique) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatarData(log.dataAvaliacao)}
                      </TableCell>
                      <TableCell>
                        <StarDisplay nota={log.nota} />
                        {log.comentario && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {log.comentario}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            log.statusCobranca === "Paga" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : log.statusCobranca === "Pendente" 
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {log.statusCobranca}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        R$ {log.valorCobrado.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenAvaliacaoLink(log)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver avaliação
                            </DropdownMenuItem>
                            {log.statusCobranca !== "Paga" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatusCobranca(log.id, "Paga")}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Marcar como paga
                              </DropdownMenuItem>
                            )}
                            {log.statusCobranca !== "Pendente" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatusCobranca(log.id, "Pendente")}>
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-600" />
                                Marcar como pendente
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Não encontramos avaliações com os filtros selecionados.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {logsOrdenados.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
              Exibindo {logsOrdenados.length} de {logs.length} registros
            </div>
          )}
        </div>
      </div>
      
      <FiltrosAvancadosModal
        isOpen={isFiltrosModalOpen}
        onClose={() => setIsFiltrosModalOpen(false)}
        onApply={handleFiltrosAvancados}
        tipo="avaliacoes"
      />
    </>
  );
}
