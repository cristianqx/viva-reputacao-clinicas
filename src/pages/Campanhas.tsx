
import { useState } from "react";
import { Plus, Filter, Copy, Pause, Trash2, ChevronRight, BarChart, FileText, Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NovaCampanhaModal } from "@/components/campanhas/NovaCampanhaModal";
import { cn } from "@/lib/utils";

interface Campanha {
  id: string;
  nome: string;
  tipo: string;
  dataCriacao: string;
  status: "ativa" | "pausada" | "encerrada";
  agendada: boolean;
  dataEnvio?: string;
  totalDestinatarios: number;
  taxaEntrega: number;
  taxaAbertura: number;
}

// Dados de exemplo
const campanhasIniciais: Campanha[] = [
  {
    id: "1",
    nome: "Lembrete de Consulta",
    tipo: "WhatsApp",
    dataCriacao: "2023-04-15",
    status: "ativa",
    agendada: true,
    dataEnvio: "2023-04-20",
    totalDestinatarios: 120,
    taxaEntrega: 98,
    taxaAbertura: 75
  },
  {
    id: "2",
    nome: "Aniversariantes do Mês",
    tipo: "E-mail",
    dataCriacao: "2023-04-10",
    status: "ativa",
    agendada: false,
    totalDestinatarios: 45,
    taxaEntrega: 100,
    taxaAbertura: 82
  },
  {
    id: "3",
    nome: "Promoção de Limpeza",
    tipo: "SMS",
    dataCriacao: "2023-04-05",
    status: "pausada",
    agendada: false,
    totalDestinatarios: 200,
    taxaEntrega: 97,
    taxaAbertura: 65
  },
  {
    id: "4",
    nome: "Follow-up Tratamento",
    tipo: "WhatsApp",
    dataCriacao: "2023-03-28",
    status: "ativa",
    agendada: true,
    dataEnvio: "2023-04-25",
    totalDestinatarios: 78,
    taxaEntrega: 99,
    taxaAbertura: 80
  },
  {
    id: "5",
    nome: "Reativação de Pacientes",
    tipo: "E-mail",
    dataCriacao: "2023-03-20",
    status: "encerrada",
    agendada: false,
    totalDestinatarios: 150,
    taxaEntrega: 96,
    taxaAbertura: 60
  }
];

// Templates de exemplo
const templatesDisponiveis = [
  {
    id: "t1",
    nome: "Lembrete de Consulta",
    tipo: "WhatsApp",
    conteudo: "Olá {nome}, este é um lembrete para sua consulta em {data} às {hora}. Confirma sua presença?"
  },
  {
    id: "t2",
    nome: "Aniversário",
    tipo: "WhatsApp",
    conteudo: "Feliz aniversário, {nome}! Que seu dia seja especial. Um abraço da equipe {clinica}."
  },
  {
    id: "t3",
    nome: "Retorno",
    tipo: "WhatsApp",
    conteudo: "Olá {nome}, já está na hora do seu retorno. Podemos agendar para a próxima semana?"
  },
  {
    id: "t4",
    nome: "Confirmação",
    tipo: "SMS",
    conteudo: "Confirmamos sua consulta para {data} às {hora}. Atenciosamente, {clinica}."
  },
  {
    id: "t5",
    nome: "Novidades",
    tipo: "E-mail",
    conteudo: "Olá {nome}, temos novidades em nossos tratamentos! Conheça nossas promoções do mês."
  }
];

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(campanhasIniciais);
  const [busca, setBusca] = useState("");
  const [novaCampanhaModalAberta, setNovaCampanhaModalAberta] = useState(false);
  const [verTemplatesModalAberta, setVerTemplatesModalAberta] = useState(false);
  const [confirmarExclusaoModalAberta, setConfirmarExclusaoModalAberta] = useState(false);
  const [campanhaParaExcluir, setCampanhaParaExcluir] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();
  const [filtroModalAberto, setFiltroModalAberto] = useState(false);

  // Filtrar campanhas
  const campanhasFiltradas = campanhas.filter(campanha => {
    // Filtro de busca
    if (busca && !campanha.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    
    // Filtro de status
    if (filtroStatus !== "todos" && campanha.status !== filtroStatus) {
      return false;
    }
    
    // Filtro de tipo
    if (filtroTipo !== "todos" && campanha.tipo !== filtroTipo) {
      return false;
    }
    
    // Filtro de data de criação
    if (dataInicio && new Date(campanha.dataCriacao) < dataInicio) {
      return false;
    }
    
    if (dataFim) {
      // Ajustar data fim para o final do dia
      const dataFimAjustada = new Date(dataFim);
      dataFimAjustada.setHours(23, 59, 59, 999);
      if (new Date(campanha.dataCriacao) > dataFimAjustada) {
        return false;
      }
    }
    
    return true;
  });
  
  // Adicionar nova campanha
  const adicionarCampanha = (novaCampanha: any) => {
    const campanha: Campanha = {
      id: `${campanhas.length + 1}`,
      nome: novaCampanha.nome,
      tipo: novaCampanha.tipoMensagem === "whatsapp" ? "WhatsApp" : 
            novaCampanha.tipoMensagem === "email" ? "E-mail" : "SMS",
      dataCriacao: new Date().toISOString().split("T")[0],
      status: "ativa" as const,
      agendada: novaCampanha.tipoDisparo === "programado",
      dataEnvio: novaCampanha.tipoDisparo === "programado" ? 
                novaCampanha.dataDisparo.toISOString().split("T")[0] : undefined,
      totalDestinatarios: Math.floor(Math.random() * 100) + 50,
      taxaEntrega: 0,
      taxaAbertura: 0
    };
    
    setCampanhas([campanha, ...campanhas]);
  };
  
  // Pausar/ativar campanha
  const alterarStatusCampanha = (id: string, novoStatus: "ativa" | "pausada") => {
    setCampanhas(campanhas.map(campanha => {
      if (campanha.id === id) {
        return { ...campanha, status: novoStatus };
      }
      return campanha;
    }));
  };
  
  // Duplicar campanha
  const duplicarCampanha = (id: string) => {
    const campanhaOriginal = campanhas.find(c => c.id === id);
    if (!campanhaOriginal) return;
    
    const novaCampanha: Campanha = {
      ...campanhaOriginal,
      id: `${parseInt(campanhaOriginal.id) + 100}`,
      nome: `${campanhaOriginal.nome} (cópia)`,
      dataCriacao: new Date().toISOString().split("T")[0],
      status: "ativa"
    };
    
    setCampanhas([novaCampanha, ...campanhas]);
  };
  
  // Remover campanha
  const removerCampanha = () => {
    if (!campanhaParaExcluir) return;
    
    setCampanhas(campanhas.filter(campanha => campanha.id !== campanhaParaExcluir));
    setConfirmarExclusaoModalAberta(false);
    setCampanhaParaExcluir(null);
  };
  
  // Limpar todos os filtros
  const limparFiltros = () => {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroTipo("todos");
    setDataInicio(undefined);
    setDataFim(undefined);
  };
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  return (
    <>
      <PageHeader 
        title="Campanhas" 
        description="Crie e gerencie suas campanhas de comunicação com pacientes."
      >
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setVerTemplatesModalAberta(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Ver todos os templates
          </Button>
          <Button onClick={() => setNovaCampanhaModalAberta(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Campanhas ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                {campanhas.filter(c => c.status === "ativa").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total de {campanhas.length} campanhas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxa de entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                {Math.round(
                  campanhas.reduce((acc, curr) => acc + curr.taxaEntrega, 0) / campanhas.length
                )}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Média de todas as campanhas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxa de abertura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                {Math.round(
                  campanhas.reduce((acc, curr) => acc + curr.taxaAbertura, 0) / campanhas.length
                )}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Média de todas as campanhas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Destinatários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">
                {campanhas.reduce((acc, curr) => acc + curr.totalDestinatarios, 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total de destinatários
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar campanhas..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-[150px]">
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativa">Ativas</SelectItem>
                    <SelectItem value="pausada">Pausadas</SelectItem>
                    <SelectItem value="encerrada">Encerradas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-[150px]">
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Popover open={filtroModalAberto} onOpenChange={setFiltroModalAberto}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Período de criação</h4>
                      <div className="flex flex-col gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Data inicial"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dataInicio}
                              onSelect={setDataInicio}
                              initialFocus
                              locale={ptBR}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              {dataFim ? format(dataFim, "dd/MM/yyyy") : "Data final"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dataFim}
                              onSelect={setDataFim}
                              initialFocus
                              locale={ptBR}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={limparFiltros}>
                        Limpar filtros
                      </Button>
                      <Button size="sm" onClick={() => setFiltroModalAberto(false)}>
                        Aplicar filtros
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Criação</TableHead>
                  <TableHead>Envio</TableHead>
                  <TableHead>Destinatários</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Desempenho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanhasFiltradas.length > 0 ? (
                  campanhasFiltradas.map((campanha) => (
                    <TableRow key={campanha.id}>
                      <TableCell className="font-medium">{campanha.nome}</TableCell>
                      <TableCell>{campanha.tipo}</TableCell>
                      <TableCell>{formatarData(campanha.dataCriacao)}</TableCell>
                      <TableCell>
                        {campanha.agendada ? (
                          campanha.dataEnvio ? formatarData(campanha.dataEnvio) : "Agendada"
                        ) : (
                          "Manual"
                        )}
                      </TableCell>
                      <TableCell>{campanha.totalDestinatarios}</TableCell>
                      <TableCell>
                        <StatusBadge status={campanha.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full max-w-24">
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>Entregas: {campanha.taxaEntrega}%</span>
                              <span>Aberturas: {campanha.taxaAbertura}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${campanha.taxaAbertura}%` }}
                              />
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2 h-8 px-2">
                            <BarChart className="h-4 w-4 mr-1" />
                            <span className="text-xs">Ver relatório</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Abrir menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setNovaCampanhaModalAberta(true)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicarCampanha(campanha.id)}>
                              Duplicar
                            </DropdownMenuItem>
                            {campanha.status === "ativa" ? (
                              <DropdownMenuItem onClick={() => alterarStatusCampanha(campanha.id, "pausada")}>
                                Pausar
                              </DropdownMenuItem>
                            ) : campanha.status === "pausada" ? (
                              <DropdownMenuItem onClick={() => alterarStatusCampanha(campanha.id, "ativa")}>
                                Ativar
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              onClick={() => {
                                setCampanhaParaExcluir(campanha.id);
                                setConfirmarExclusaoModalAberta(true);
                              }}
                              className="text-destructive"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhuma campanha encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Modal de nova campanha */}
      <NovaCampanhaModal 
        open={novaCampanhaModalAberta} 
        onOpenChange={setNovaCampanhaModalAberta}
        onSave={adicionarCampanha}
      />
      
      {/* Modal de templates */}
      <Dialog open={verTemplatesModalAberta} onOpenChange={setVerTemplatesModalAberta}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Templates Disponíveis</DialogTitle>
            <DialogDescription>
              Escolha um template pronto ou crie um novo personalizado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {templatesDisponiveis.map(template => (
              <div key={template.id} className="border rounded-md p-4 hover:border-primary cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{template.nome}</h4>
                    <Badge variant="outline" className="mt-1">{template.tipo}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setVerTemplatesModalAberta(false);
                    setNovaCampanhaModalAberta(true);
                  }}>
                    <span>Usar template</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{template.conteudo}</p>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerTemplatesModalAberta(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de exclusão */}
      <Dialog open={confirmarExclusaoModalAberta} onOpenChange={setConfirmarExclusaoModalAberta}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmarExclusaoModalAberta(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={removerCampanha}
            >
              Excluir campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componente de Badge de Status
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "ativa":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
          Ativa
        </Badge>
      );
    case "pausada":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
          Pausada
        </Badge>
      );
    case "encerrada":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Encerrada
        </Badge>
      );
    default:
      return null;
  }
}
