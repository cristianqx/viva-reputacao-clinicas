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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import NovoContatoModal from "@/components/modals/NovoContatoModal";
import FiltrosAvancadosModal from "@/components/modals/FiltrosAvancadosModal";
import AgendarConsultaModal from "@/components/modals/AgendarConsultaModal";
import ListaAgendamentos from "@/components/contatos/ListaAgendamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { obterAgendamentosPorContato } from "@/data/agendamentos";
import { adaptAgendamentos } from "@/utils/agendamentoAdapter";

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

// Componente de Linha da Tabela
const ContatoRow = ({ contato, onSelecionarContato }: { contato: Contato, onSelecionarContato: (id: string) => void }) => {
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Gera as iniciais do nome para o avatar
  const obterIniciais = (nome: string) => {
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };
  
  return (
    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => onSelecionarContato(contato.id)}>
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
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onSelecionarContato(contato.id);
            }}>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              toast({
                description: `Editando contato: ${contato.nome}`,
              });
            }}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              toast({
                description: `Enviando email para: ${contato.nome}`,
              });
            }}>Enviar email</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              toast({
                description: `Enviando SMS para: ${contato.nome}`,
              });
            }}>Enviar SMS</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              toast({
                title: "Contato excluído",
                description: `O contato ${contato.nome} foi excluído com sucesso.`,
                variant: "destructive"
              });
            }}>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
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

// Componente de Detalhe do Contato
const DetalheContato = ({ 
  contato, 
  onFechar 
}: { 
  contato: Contato, 
  onFechar: () => void 
}) => {
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };
  
  const [isAgendarConsultaModalOpen, setIsAgendarConsultaModalOpen] = useState(false);
  const agendamentosContato = adaptAgendamentos(obterAgendamentosPorContato(contato.id));
  
  const handleAgendarConsulta = () => {
    setIsAgendarConsultaModalOpen(true);
  };
  
  const handleEnviarEmail = () => {
    toast({
      description: `Enviando email para: ${contato.nome}`,
    });
  };
  
  const handleEnviarSMS = () => {
    toast({
      description: `Enviando SMS para: ${contato.nome}`,
    });
  };
  
  return (
    <>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
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
                    <h4 className="text-sm font-medium text-gray-700">Histórico de interações</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Última interação</p>
                          <p className="font-medium">{formatarData(contato.ultimaConsulta)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Próxima interação</p>
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
                <Button variant="default" size="sm" className="w-full md:w-auto" onClick={handleEnviarEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar email
                </Button>
                <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={handleEnviarSMS}>
                  <Phone className="mr-2 h-4 w-4" />
                  Enviar SMS
                </Button>
                <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={handleAgendarConsulta}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Novo Evento
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
            
            <TabsContent value="eventos" className="pt-4">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Eventos Agendados</h3>
                <Button size="sm" onClick={handleAgendarConsulta}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Evento
                </Button>
              </div>
              <ListaAgendamentos agendamentos={agendamentosContato} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AgendarConsultaModal 
        isOpen={isAgendarConsultaModalOpen}
        onClose={() => setIsAgendarConsultaModalOpen(false)}
        contatoId={contato.id}
        contatoNome={contato.nome}
      />
    </>
  );
};

// Componente principal da página
export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>(contatosExemplo);
  const [busca, setBusca] = useState("");
  const [origem, setOrigem] = useState("todas");
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [isNovoContatoModalOpen, setIsNovoContatoModalOpen] = useState(false);
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);

  // Filtrar contatos
  const contatosFiltrados = contatos.filter(contato => {
    // Filtro de origem
    if (origem !== "todas" && contato.origem !== origem) return false;
    
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

  const handleSelecionarContato = (id: string) => {
    const contato = contatos.find(c => c.id === id);
    if (contato) {
      setContatoSelecionado(contato);
    }
  };

  const handleFecharDetalhe = () => {
    setContatoSelecionado(null);
  };

  const handleNovoContato = (novoContato: any) => {
    setContatos([novoContato, ...contatos]);
  };

  const handleImportarContatos = () => {
    toast({
      description: "Função de importação iniciada",
    });
  };

  const handleFiltrosAvancados = (filtros: any) => {
    toast({
      description: "Filtros avançados aplicados",
    });
  };

  return (
    <>
      <PageHeader 
        title="Contatos" 
        description="Gerencie sua base de pacientes/clientes."
      >
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleImportarContatos}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button onClick={() => setIsNovoContatoModalOpen(true)}>
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
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsFiltrosModalOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Última Consulta</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contatosFiltrados.length > 0 ? (
                  contatosFiltrados.map(contato => (
                    <ContatoRow 
                      key={contato.id} 
                      contato={contato} 
                      onSelecionarContato={handleSelecionarContato} 
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
            <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
              Exibindo {contatosFiltrados.length} de {contatos.length} contatos
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

      {/* Modais */}
      <NovoContatoModal
        isOpen={isNovoContatoModalOpen}
        onClose={() => setIsNovoContatoModalOpen(false)}
        onSave={handleNovoContato}
      />
      
      <FiltrosAvancadosModal
        isOpen={isFiltrosModalOpen}
        onClose={() => setIsFiltrosModalOpen(false)}
        onApply={handleFiltrosAvancados}
        tipo="contatos"
      />
    </>
  );
}
