
import { useState } from "react";
import { Users, Search, Filter, Plus, Upload, MoreHorizontal, Mail, Phone, Calendar, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NovoContatoModal } from "@/components/contatos/NovoContatoModal";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Tipos
interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  origem: string;
  ultimaConsulta?: string;
  proximaConsulta?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  tags?: string[];
  dataRegistro: string;
  ultimaAvaliacao?: {
    data: string;
    plataforma: string;
    nota: number;
  };
}

// Dados de exemplo
const contatosExemplo: Contato[] = [
  {
    id: "1",
    nome: "Ana Paula Silva",
    email: "ana.silva@email.com",
    telefone: "(11) 98765-4321",
    origem: "Agenda Odontológica",
    ultimaConsulta: "2023-04-10",
    proximaConsulta: "2023-07-15",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Ortodontia", "Plano Amil"],
    dataRegistro: "2022-01-15",
    ultimaAvaliacao: {
      data: "2023-04-12",
      plataforma: "Google",
      nota: 5
    }
  },
  {
    id: "2",
    nome: "Carlos Eduardo Mendes",
    email: "carlos.mendes@email.com",
    telefone: "(11) 91234-5678",
    origem: "Site",
    ultimaConsulta: "2023-03-22",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Clareamento", "Particular"],
    dataRegistro: "2022-02-10"
  },
  {
    id: "3",
    nome: "Mariana Costa",
    email: "mariana.costa@email.com",
    telefone: "(11) 94567-8901",
    origem: "Indicação",
    ultimaConsulta: "2023-04-05",
    proximaConsulta: "2023-06-20",
    endereco: "Rua Augusta, 500",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Limpeza", "Plano Odonto"],
    dataRegistro: "2022-03-05",
    ultimaAvaliacao: {
      data: "2023-04-07",
      plataforma: "Doctoralia",
      nota: 4
    }
  },
  {
    id: "4",
    nome: "Pedro Henrique Oliveira",
    telefone: "(11) 95678-9012",
    origem: "Agenda Odontológica",
    ultimaConsulta: "2023-02-15",
    endereco: "Rua Oscar Freire, 200",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Implante", "Particular"],
    dataRegistro: "2022-04-20"
  },
  {
    id: "5",
    nome: "Juliana Almeida",
    email: "juliana.almeida@email.com",
    telefone: "(11) 96789-0123",
    origem: "Campanha",
    ultimaConsulta: "2023-04-01",
    proximaConsulta: "2023-05-30",
    endereco: "Av. Rebouças, 300",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Endodontia", "Plano Bradesco"],
    dataRegistro: "2022-05-12",
    ultimaAvaliacao: {
      data: "2023-04-03",
      plataforma: "Google",
      nota: 5
    }
  },
  {
    id: "6",
    nome: "Ricardo Santos",
    email: "ricardo.santos@email.com",
    telefone: "(11) 97890-1234",
    origem: "Agenda Odontológica",
    endereco: "Rua Tutóia, 150",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Consulta inicial", "Particular"],
    dataRegistro: "2022-06-18"
  },
  {
    id: "7",
    nome: "Fernanda Lima",
    email: "fernanda.lima@email.com",
    telefone: "(11) 98901-2345",
    origem: "Site",
    ultimaConsulta: "2023-03-15",
    proximaConsulta: "2023-06-10",
    endereco: "Av. Brigadeiro Faria Lima, 1500",
    cidade: "São Paulo",
    estado: "SP",
    tags: ["Ortodontia", "Plano Odonto"],
    dataRegistro: "2022-07-25",
    ultimaAvaliacao: {
      data: "2023-03-18",
      plataforma: "Facebook",
      nota: 5
    }
  }
];

// Componente de Tag de Contato
const ContatoTag = ({ tag }: { tag: string }) => {
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-800 mr-1">
      {tag}
    </Badge>
  );
};

// Componente de estrelas
const Star = (props: any) => {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>(contatosExemplo);
  const [busca, setBusca] = useState("");
  const [origem, setOrigem] = useState("todas");
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [novoContatoModalAberto, setNovoContatoModalAberto] = useState(false);
  const [confirmarExclusaoModalAberto, setConfirmarExclusaoModalAberto] = useState(false);
  const [contatoParaExcluir, setContatoParaExcluir] = useState<string | null>(null);
  const [filtroTag, setFiltroTag] = useState<string>("todas");
  const [ordenacao, setOrdenacao] = useState<{ coluna: string; ordem: 'asc' | 'desc' }>({ coluna: 'nome', ordem: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [agendarConsultaModalAberto, setAgendarConsultaModalAberto] = useState(false);
  const [dataConsulta, setDataConsulta] = useState<string>("");
  const [horaConsulta, setHoraConsulta] = useState<string>("");
  const [tipoConsulta, setTipoConsulta] = useState<string>("checkup");
  const [observacoes, setObservacoes] = useState<string>("");
  const [enviarEmailModalAberto, setEnviarEmailModalAberto] = useState(false);
  const [emailAssunto, setEmailAssunto] = useState<string>("");
  const [emailConteudo, setEmailConteudo] = useState<string>("");
  const [enviarSmsModalAberto, setEnviarSmsModalAberto] = useState(false);
  const [smsMensagem, setSmsMensagem] = useState<string>("");

  // Filtrar contatos
  const contatosFiltrados = contatos.filter(contato => {
    // Filtro de origem
    if (origem !== "todas" && contato.origem !== origem) return false;
    
    // Filtro de tag
    if (filtroTag !== "todas" && (!contato.tags || !contato.tags.includes(filtroTag))) return false;
    
    // Busca por nome, email ou telefone
    if (busca) {
      const textoBusca = busca.toLowerCase();
      return (
        contato.nome.toLowerCase().includes(textoBusca) ||
        (contato.email && contato.email.toLowerCase().includes(textoBusca)) ||
        (contato.telefone && contato.telefone.includes(textoBusca))
      );
    }
    
    return true;
  });
  
  // Ordenar contatos
  const contatosOrdenados = [...contatosFiltrados].sort((a, b) => {
    if (ordenacao.coluna === 'nome') {
      return ordenacao.ordem === 'asc' 
        ? a.nome.localeCompare(b.nome) 
        : b.nome.localeCompare(a.nome);
    } else if (ordenacao.coluna === 'ultimaConsulta') {
      const dataA = a.ultimaConsulta ? new Date(a.ultimaConsulta).getTime() : 0;
      const dataB = b.ultimaConsulta ? new Date(b.ultimaConsulta).getTime() : 0;
      return ordenacao.ordem === 'asc' ? dataA - dataB : dataB - dataA;
    }
    return 0;
  });
  
  // Paginação
  const totalPaginas = Math.ceil(contatosOrdenados.length / itensPorPagina);
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const contatosPaginados = contatosOrdenados.slice(indexInicial, indexInicial + itensPorPagina);
  
  // Alternar ordem da tabela
  const alternarOrdenacao = (coluna: string) => {
    setOrdenacao(prev => ({
      coluna,
      ordem: prev.coluna === coluna && prev.ordem === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSelecionarContato = (id: string) => {
    const contato = contatos.find(c => c.id === id);
    if (contato) {
      setContatoSelecionado(contato);
    }
  };

  const handleFecharDetalhe = () => {
    setContatoSelecionado(null);
  };
  
  const handleSalvarNovoContato = (novoContato: any) => {
    setContatos([novoContato, ...contatos]);
  };
  
  const handleExcluirContato = () => {
    if (contatoParaExcluir) {
      setContatos(contatos.filter(c => c.id !== contatoParaExcluir));
      setConfirmarExclusaoModalAberto(false);
      setContatoParaExcluir(null);
      
      // Se o contato selecionado for o que está sendo excluído, feche a visualização
      if (contatoSelecionado && contatoSelecionado.id === contatoParaExcluir) {
        setContatoSelecionado(null);
      }
    }
  };
  
  const handleAgendarConsulta = () => {
    if (!contatoSelecionado || !dataConsulta || !horaConsulta) return;
    
    // Simular agendamento
    const dataFormatada = `${dataConsulta}T${horaConsulta}:00`;
    
    // Atualizar o contato com a próxima consulta
    const contatosAtualizados = contatos.map(c => {
      if (c.id === contatoSelecionado.id) {
        return { ...c, proximaConsulta: dataFormatada };
      }
      return c;
    });
    
    setContatos(contatosAtualizados);
    setContatoSelecionado(prev => 
      prev ? { ...prev, proximaConsulta: dataFormatada } : null
    );
    
    // Fechar modal e resetar campos
    setAgendarConsultaModalAberto(false);
    setDataConsulta("");
    setHoraConsulta("");
    setTipoConsulta("checkup");
    setObservacoes("");
  };
  
  const handleEnviarEmail = () => {
    if (!contatoSelecionado || !emailAssunto || !emailConteudo) return;
    
    // Simular envio de email
    alert(`Email enviado para ${contatoSelecionado.nome} com o assunto: ${emailAssunto}`);
    
    // Fechar modal e resetar campos
    setEnviarEmailModalAberto(false);
    setEmailAssunto("");
    setEmailConteudo("");
  };
  
  const handleEnviarSms = () => {
    if (!contatoSelecionado || !smsMensagem) return;
    
    // Simular envio de SMS
    alert(`SMS enviado para ${contatoSelecionado.nome}: ${smsMensagem}`);
    
    // Fechar modal e resetar campos
    setEnviarSmsModalAberto(false);
    setSmsMensagem("");
  };

  // Função para formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  // Gera as iniciais do nome para o avatar
  const obterIniciais = (nome: string) => {
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Lista única de tags para o filtro
  const todasTags = Array.from(
    new Set(
      contatos
        .flatMap(contato => contato.tags || [])
    )
  );
  
  // Componente de Linha da Tabela
  const ContatoRow = ({ contato }: { contato: Contato }) => {  
    return (
      <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => handleSelecionarContato(contato.id)}>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-xs">
                {obterIniciais(contato.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{contato.nome}</p>
              {contato.email && (
                <p className="text-xs text-gray-500">{contato.email}</p>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>{contato.telefone || "N/A"}</TableCell>
        <TableCell>{contato.origem}</TableCell>
        <TableCell>{formatarData(contato.ultimaConsulta)}</TableCell>
        <TableCell>
          {contato.tags && contato.tags.length > 0 ? (
            <div className="flex flex-wrap">
              {contato.tags.map((tag, index) => (
                <ContatoTag key={index} tag={tag} />
              ))}
            </div>
          ) : (
            <span className="text-gray-400">Sem tags</span>
          )}
        </TableCell>
        <TableCell>
          {contato.ultimaAvaliacao ? (
            <div className="flex items-center">
              <div className="flex mr-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < contato.ultimaAvaliacao!.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{contato.ultimaAvaliacao.plataforma}</span>
            </div>
          ) : (
            <span className="text-gray-400">Sem avaliação</span>
          )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSelecionarContato(contato.id)}>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSelecionarContato(contato.id);
                setNovoContatoModalAberto(true);
              }}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSelecionarContato(contato.id);
                setEnviarEmailModalAberto(true);
              }}>Enviar email</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSelecionarContato(contato.id);
                setEnviarSmsModalAberto(true);
              }}>Enviar SMS</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => {
                  setContatoParaExcluir(contato.id);
                  setConfirmarExclusaoModalAberto(true);
                }}
              >Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };
  
  // Componente de Detalhe do Contato
  const DetalheContato = ({ contato, onFechar }: { contato: Contato, onFechar: () => void }) => {  
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {contato.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{contato.nome}</CardTitle>
                <CardDescription className="flex flex-col mt-1">
                  {contato.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{contato.email}</span>
                    </div>
                  )}
                  {contato.telefone && (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{contato.telefone}</span>
                    </div>
                  )}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onFechar}>
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="informacoes" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Informações básicas</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Origem</p>
                          <p className="font-medium">{contato.origem}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Data de registro</p>
                          <p className="font-medium">{formatarData(contato.dataRegistro)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Histórico de consultas</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Última consulta</p>
                          <p className="font-medium">{formatarData(contato.ultimaConsulta)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Próxima consulta</p>
                          <p className="font-medium">{formatarData(contato.proximaConsulta)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                    <div className="mt-2">
                      {contato.tags && contato.tags.length > 0 ? (
                        <div className="flex flex-wrap">
                          {contato.tags.map((tag, index) => (
                            <ContatoTag key={index} tag={tag} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma tag atribuída</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Endereço</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md text-sm">
                      {contato.endereco ? (
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                            <div>
                              <p>{contato.endereco}</p>
                              <p>{contato.cidade}, {contato.estado}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Endereço não registrado</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Última avaliação</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      {contato.ultimaAvaliacao ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < contato.ultimaAvaliacao!.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                                />
                              ))}
                            </div>
                            <span className="text-gray-700">{contato.ultimaAvaliacao.plataforma}</span>
                          </div>
                          <p className="text-gray-500">Data: {formatarData(contato.ultimaAvaliacao.data)}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma avaliação registrada</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => setEnviarEmailModalAberto(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => setEnviarSmsModalAberto(true)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Enviar SMS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => setAgendarConsultaModalAberto(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar consulta
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="historico" className="pt-4">
              <div className="text-center py-10">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Histórico de campanhas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sem registros de campanhas enviadas para este contato.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="avaliacoes" className="pt-4">
              {contato.ultimaAvaliacao ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{contato.ultimaAvaliacao.plataforma}</h4>
                      <p className="text-sm text-gray-500">Data: {formatarData(contato.ultimaAvaliacao.data)}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < contato.ultimaAvaliacao!.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sem avaliações</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este contato ainda não realizou nenhuma avaliação.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <PageHeader 
        title="Contatos" 
        description="Gerencie sua base de pacientes/clientes."
      >
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button onClick={() => setNovoContatoModalAberto(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contato
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        {contatoSelecionado ? (
          <DetalheContato 
            contato={contatoSelecionado} 
            onFechar={handleFecharDetalhe} 
          />
        ) : null}
        
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar contatos..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[180px]">
                  <Select value={origem} onValueChange={setOrigem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as origens</SelectItem>
                      <SelectItem value="Agenda Odontológica">Agenda Odontológica</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Campanha">Campanha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[180px]">
                  <Select value={filtroTag} onValueChange={setFiltroTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as tags</SelectItem>
                      {todasTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => alternarOrdenacao('nome')}
                  >
                    Nome 
                    {ordenacao.coluna === 'nome' && (
                      <span className="ml-1">{ordenacao.ordem === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => alternarOrdenacao('ultimaConsulta')}
                  >
                    Última Consulta
                    {ordenacao.coluna === 'ultimaConsulta' && (
                      <span className="ml-1">{ordenacao.ordem === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contatosPaginados.length > 0 ? (
                  contatosPaginados.map(contato => (
                    <ContatoRow 
                      key={contato.id} 
                      contato={contato} 
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contato encontrado</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Não encontramos contatos com os filtros selecionados.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {contatosFiltrados.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Exibindo {indexInicial + 1}-{Math.min(indexInicial + itensPorPagina, contatosFiltrados.length)} de {contatosFiltrados.length} contatos
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
                        }}
                        className={paginaAtual === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPaginas, 5) }).map((_, index) => (
                      <PaginationItem key={index}>
                        <Button
                          variant={paginaAtual === index + 1 ? "default" : "outline"}
                          size="icon"
                          onClick={() => setPaginaAtual(index + 1)}
                          className="w-9 h-9"
                        >
                          {index + 1}
                        </Button>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
                        }}
                        className={paginaAtual === totalPaginas ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Itens por página:</span>
                  <Select value={itensPorPagina.toString()} onValueChange={value => {
                    setItensPorPagina(parseInt(value));
                    setPaginaAtual(1);
                  }}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">{contatos.length}</p>
              <p className="text-sm text-gray-500 mt-1">+12 no último mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Origem Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-brand">Agenda Odontológica</p>
              <p className="text-sm text-gray-500 mt-1">42% dos contatos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avaliaram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand">24%</p>
              <p className="text-sm text-gray-500 mt-1">+5% vs mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contatos sem email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">8%</p>
              <p className="text-sm text-gray-500 mt-1">-3% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal de Novo Contato */}
      <NovoContatoModal
        open={novoContatoModalAberto}
        onOpenChange={setNovoContatoModalAberto}
        onSave={handleSalvarNovoContato}
      />
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={confirmarExclusaoModalAberto} onOpenChange={setConfirmarExclusaoModalAberto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmarExclusaoModalAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleExcluirContato}
            >
              Excluir contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Agendar Consulta */}
      <Dialog open={agendarConsultaModalAberto} onOpenChange={setAgendarConsultaModalAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Consulta</DialogTitle>
            <DialogDescription>
              {contatoSelecionado && `Agendamento para ${contatoSelecionado.nome}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data-consulta">Data</Label>
                <Input
                  id="data-consulta"
                  type="date"
                  value={dataConsulta}
                  onChange={(e) => setDataConsulta(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora-consulta">Hora</Label>
                <Input
                  id="hora-consulta"
                  type="time"
                  value={horaConsulta}
                  onChange={(e) => setHoraConsulta(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tipo-consulta">Tipo de consulta</Label>
              <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                <SelectTrigger id="tipo-consulta">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="limpeza">Limpeza</SelectItem>
                  <SelectItem value="tratamento">Tratamento</SelectItem>
                  <SelectItem value="ortodontia">Ortodontia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                placeholder="Observações sobre a consulta..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAgendarConsultaModalAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleAgendarConsulta}
              disabled={!dataConsulta || !horaConsulta}
            >
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Enviar Email */}
      <Dialog open={enviarEmailModalAberto} onOpenChange={setEnviarEmailModalAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar Email</DialogTitle>
            <DialogDescription>
              {contatoSelecionado && `Email para ${contatoSelecionado.nome}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-assunto">Assunto</Label>
              <Input
                id="email-assunto"
                value={emailAssunto}
                onChange={(e) => setEmailAssunto(e.target.value)}
                placeholder="Assunto do email"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email-conteudo">Mensagem</Label>
              <textarea
                id="email-conteudo"
                className="w-full border border-gray-300 rounded-md p-3 min-h-[150px]"
                placeholder="Conteúdo do email..."
                value={emailConteudo}
                onChange={(e) => setEmailConteudo(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEnviarEmailModalAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleEnviarEmail}
              disabled={!emailAssunto || !emailConteudo}
            >
              Enviar Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Enviar SMS */}
      <Dialog open={enviarSmsModalAberto} onOpenChange={setEnviarSmsModalAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar SMS</DialogTitle>
            <DialogDescription>
              {contatoSelecionado && `SMS para ${contatoSelecionado.nome}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sms-mensagem">Mensagem</Label>
              <textarea
                id="sms-mensagem"
                className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                placeholder="Mensagem SMS..."
                value={smsMensagem}
                onChange={(e) => setSmsMensagem(e.target.value)}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 text-right">
                {smsMensagem.length}/160 caracteres
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEnviarSmsModalAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleEnviarSms}
              disabled={!smsMensagem}
            >
              Enviar SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
