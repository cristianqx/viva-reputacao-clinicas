
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquareText, ThumbsUp, AlertTriangle, ExternalLink } from "lucide-react";
import { PlataformaIcon } from "@/components/avaliacoes/PlataformaIcon";
import { FiltrosAvaliacao } from "@/components/avaliacoes/FiltrosAvaliacao";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dados de exemplo
const avaliacoesIniciais = [
  {
    id: "1",
    paciente: "Ana Silva",
    plataforma: "google",
    data: "2023-04-15",
    nota: 5,
    texto: "Excelente atendimento! O Dr. Marcos foi muito atencioso e profissional. Já marquei meu retorno.",
    respondida: true,
    resposta: "Obrigado pelo feedback positivo, Ana! Ficamos felizes em saber que teve uma boa experiência. Até o próximo atendimento!"
  },
  {
    id: "2",
    paciente: "Carlos Oliveira",
    plataforma: "facebook",
    data: "2023-04-10",
    nota: 4,
    texto: "Bom atendimento e ambiente agradável. Só achei um pouco demorado.",
    respondida: true,
    resposta: "Agradecemos seu feedback, Carlos! Estamos trabalhando para melhorar nossos tempos de espera. Sua opinião é muito importante para nós."
  },
  {
    id: "3",
    paciente: "Mariana Costa",
    plataforma: "google",
    data: "2023-04-05",
    nota: 5,
    texto: "Encontrei a clínica por indicação e só tenho elogios! Atendimento de primeira, instalações modernas e equipe super preparada.",
    respondida: false
  },
  {
    id: "4",
    paciente: "Roberto Almeida",
    plataforma: "doctoralia",
    data: "2023-04-02",
    nota: 3,
    texto: "Atendimento médico bom, mas a recepção poderia ser mais atenciosa. Tive que esperar bastante mesmo com horário marcado.",
    respondida: false
  },
  {
    id: "5",
    paciente: "Juliana Santos",
    plataforma: "instagram",
    data: "2023-03-28",
    nota: 5,
    texto: "Minha experiência foi excelente! A Dra. Carla é incrível, super cuidadosa e atenciosa. Recomendo!",
    respondida: true,
    resposta: "Juliana, muito obrigado pelas palavras! A Dra. Carla ficou muito feliz com seu comentário. Estamos à disposição sempre que precisar!"
  },
  {
    id: "6",
    paciente: "Fernando Gomes",
    plataforma: "google",
    data: "2023-03-25",
    nota: 2,
    texto: "Não gostei da experiência. Esperei mais de 40 minutos e o atendimento foi apressado. Não voltarei.",
    respondida: true,
    resposta: "Fernando, lamentamos que sua experiência não tenha sido positiva. Gostaríamos de conversar melhor sobre o ocorrido para melhorarmos nosso atendimento. Por favor, entre em contato conosco."
  },
  {
    id: "7",
    paciente: "Patricia Lima",
    plataforma: "doctoralia",
    data: "2023-03-20",
    nota: 5,
    texto: "Ótima clínica! Atendimento eficiente, ambiente limpo e equipe muito profissional.",
    respondida: false
  },
  {
    id: "8",
    paciente: "Ricardo Souza",
    plataforma: "facebook",
    data: "2023-03-18",
    nota: 4,
    texto: "Fui bem atendido e o tratamento está dando resultado. O único ponto negativo é o estacionamento que é pequeno.",
    respondida: false
  }
];

interface Avaliacao {
  id: string;
  paciente: string;
  plataforma: string;
  data: string;
  nota: number;
  texto: string;
  respondida: boolean;
  resposta?: string;
}

interface FiltrosProps {
  dataInicio?: Date;
  dataFim?: Date;
  plataforma?: string;
  nota?: number;
  respondida?: boolean;
}

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(avaliacoesIniciais);
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<FiltrosProps>({});
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);
  const [resposta, setResposta] = useState("");

  // Filtrar avaliações
  const avaliacoesFiltradas = avaliacoes.filter(avaliacao => {
    // Filtro de busca
    if (busca && !avaliacao.paciente.toLowerCase().includes(busca.toLowerCase()) && 
        !avaliacao.texto.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    
    // Filtro de data
    if (filtros.dataInicio && new Date(avaliacao.data) < filtros.dataInicio) {
      return false;
    }
    
    if (filtros.dataFim) {
      // Ajustar data fim para o final do dia
      const dataFimAjustada = new Date(filtros.dataFim);
      dataFimAjustada.setHours(23, 59, 59, 999);
      if (new Date(avaliacao.data) > dataFimAjustada) {
        return false;
      }
    }
    
    // Filtro de plataforma
    if (filtros.plataforma && filtros.plataforma !== "todas" && avaliacao.plataforma !== filtros.plataforma) {
      return false;
    }
    
    // Filtro de nota
    if (filtros.nota !== undefined && avaliacao.nota !== filtros.nota) {
      return false;
    }
    
    // Filtro de status (respondida)
    if (filtros.respondida !== undefined && avaliacao.respondida !== filtros.respondida) {
      return false;
    }
    
    return true;
  });
  
  // Calcular paginação
  const totalPaginas = Math.ceil(avaliacoesFiltradas.length / itensPorPagina);
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const avaliacoesPaginadas = avaliacoesFiltradas.slice(indexInicial, indexInicial + itensPorPagina);
  
  // Estatísticas
  const totalAvaliacoes = avaliacoes.length;
  const mediaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / totalAvaliacoes;
  const totalGoogleAvaliacoes = avaliacoes.filter(a => a.plataforma === "google").length;
  const totalRespondidas = avaliacoes.filter(a => a.respondida).length;
  const percentualResponsividade = (totalRespondidas / totalAvaliacoes) * 100;
  
  // Função para lidar com a resposta
  const handleResponder = () => {
    if (!avaliacaoSelecionada || !resposta.trim()) return;
    
    const novasAvaliacoes = avaliacoes.map(avaliacao => {
      if (avaliacao.id === avaliacaoSelecionada.id) {
        return { ...avaliacao, respondida: true, resposta };
      }
      return avaliacao;
    });
    
    setAvaliacoes(novasAvaliacoes);
    setAvaliacaoSelecionada(null);
    setResposta("");
  };
  
  // Função para o componente de estrelas
  const Estrelas = ({ nota }: { nota: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  // Obter iniciais do nome
  const obterIniciais = (nome: string) => {
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };
  
  return (
    <>
      <PageHeader 
        title="Avaliações" 
        description="Visualize e responda avaliações de pacientes em diversas plataformas."
      >
        <div className="flex space-x-2">
          <Button>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver todos os canais
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-brand">{totalAvaliacoes}</p>
                  <p className="text-sm text-gray-500">Total de avaliações</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nota Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-brand">{mediaNotas.toFixed(1)}</p>
                    <span className="text-gray-500 ml-1">/5</span>
                  </div>
                  <div className="flex mt-1">
                    <Estrelas nota={Math.round(mediaNotas)} />
                  </div>
                </div>
                <svg
                  className="h-8 w-8 text-yellow-500 fill-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Google</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-brand">{totalGoogleAvaliacoes}</p>
                  <p className="text-sm text-gray-500">Avaliações no Google</p>
                </div>
                <PlataformaIcon platform="google" className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Responsividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-brand">{percentualResponsividade.toFixed(0)}%</p>
                  <p className="text-sm text-gray-500">{totalRespondidas} respondidas</p>
                </div>
                <MessageSquareText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou conteúdo..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Tabs defaultValue="todas" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <FiltrosAvaliacao
                onFilterChange={(newFiltros) => {
                  setFiltros(newFiltros);
                  setPaginaAtual(1);
                }}
              />
            </div>
          </div>
          
          {avaliacoesPaginadas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoesPaginadas.map((avaliacao) => (
                    <TableRow key={avaliacao.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-white text-xs">
                              {obterIniciais(avaliacao.paciente)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{avaliacao.paciente}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <PlataformaIcon platform={avaliacao.plataforma} />
                          <span className="capitalize">{avaliacao.plataforma}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatarData(avaliacao.data)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex mb-1">
                            <Estrelas nota={avaliacao.nota} />
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">{avaliacao.texto}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {avaliacao.respondida ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Respondida
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAvaliacaoSelecionada(avaliacao)}
                          disabled={avaliacao.respondida}
                        >
                          {avaliacao.respondida ? 'Ver resposta' : 'Responder'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não encontramos avaliações com os filtros selecionados.
              </p>
            </div>
          )}
          
          {avaliacoesFiltradas.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Exibindo {indexInicial + 1}-{Math.min(indexInicial + itensPorPagina, avaliacoesFiltradas.length)} de {avaliacoesFiltradas.length} avaliações
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
                    
                    {Array.from({ length: totalPaginas }).map((_, index) => (
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
        
        {avaliacaoSelecionada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Responder Avaliação</h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {obterIniciais(avaliacaoSelecionada.paciente)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{avaliacaoSelecionada.paciente}</div>
                      <div className="text-sm text-gray-500">
                        {formatarData(avaliacaoSelecionada.data)} • <span className="capitalize">{avaliacaoSelecionada.plataforma}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mb-2">
                    <Estrelas nota={avaliacaoSelecionada.nota} />
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-gray-800 mb-4">
                    {avaliacaoSelecionada.texto}
                  </div>
                </div>
                
                {avaliacaoSelecionada.respondida ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Sua resposta:</h4>
                    <div className="bg-blue-50 p-3 rounded-md text-gray-800">
                      {avaliacaoSelecionada.resposta}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label htmlFor="resposta" className="block text-sm font-medium mb-2">
                      Sua resposta:
                    </label>
                    <textarea
                      id="resposta"
                      className="w-full border border-gray-300 rounded-md p-3 min-h-[120px]"
                      placeholder="Digite sua resposta..."
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAvaliacaoSelecionada(null)}>
                  {avaliacaoSelecionada.respondida ? 'Fechar' : 'Cancelar'}
                </Button>
                
                {!avaliacaoSelecionada.respondida && (
                  <Button onClick={handleResponder} disabled={!resposta.trim()}>
                    Enviar resposta
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
