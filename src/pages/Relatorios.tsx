
import { useState } from "react";
import { BarChart, Calendar, Download, FileText, Filter, PieChart, TrendingUp, ChevronDown, Share2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from "recharts";

// Dados de exemplo para os gráficos
const dadosAvaliacoesTemp = [
  { mes: 'Jan', google: 18, doctoralia: 12, facebook: 5 },
  { mes: 'Fev', google: 22, doctoralia: 15, facebook: 8 },
  { mes: 'Mar', google: 25, doctoralia: 18, facebook: 10 },
  { mes: 'Abr', google: 30, doctoralia: 20, facebook: 12 },
  { mes: 'Mai', google: 28, doctoralia: 22, facebook: 8 },
  { mes: 'Jun', google: 32, doctoralia: 25, facebook: 15 }
];

const dadosDistribuicaoNotas = [
  { name: '5 estrelas', value: 145 },
  { name: '4 estrelas', value: 38 },
  { name: '3 estrelas', value: 12 },
  { name: '2 estrelas', value: 3 },
  { name: '1 estrela', value: 2 }
];

const COLORS = ['#28A745', '#88D488', '#FFC107', '#FF9800', '#DC3545'];

const dadosCampanhasDesempenho = [
  { name: 'Pós-Atendimento Abr', enviados: 250, abertos: 180, clicados: 75, avaliados: 32 },
  { name: 'Pacientes Ortodontia', enviados: 120, abertos: 95, clicados: 48, avaliados: 20 },
  { name: 'Clareamento', enviados: 85, abertos: 70, clicados: 35, avaliados: 15 },
  { name: 'Revisão Semestral', enviados: 180, abertos: 145, clicados: 62, avaliados: 28 }
];

const dadosConversaoMensal = [
  { mes: 'Jan', taxa: 12 },
  { mes: 'Fev', taxa: 14 },
  { mes: 'Mar', taxa: 18 },
  { mes: 'Abr', taxa: 16 },
  { mes: 'Mai', taxa: 21 },
  { mes: 'Jun', taxa: 24 }
];

// Componente principal da página
export default function Relatorios() {
  const [periodo, setPeriodo] = useState("6meses");
  const [exportando, setExportando] = useState(false);

  // Filtrar dados de acordo com o período selecionado
  // Na prática, isso seria feito com requisições à API
  const filtrarDadosPorPeriodo = (periodo: string) => {
    // Simulação de filtragem - aqui estamos apenas usando os mesmos dados
    // Em um cenário real, faríamos uma requisição com o período correto
    return dadosAvaliacoesTemp;
  };

  const dadosAvaliacoes = filtrarDadosPorPeriodo(periodo);

  const handleExportarRelatorio = () => {
    setExportando(true);
    
    // Simulação de tempo de exportação
    setTimeout(() => {
      setExportando(false);
      // Aqui seria feito o download do relatório
    }, 1500);
  };

  return (
    <>
      <PageHeader 
        title="Relatórios" 
        description="Analise o desempenho da reputação e das campanhas."
      >
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Período
          </Button>
          <Button 
            onClick={handleExportarRelatorio}
            disabled={exportando}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportando ? "Exportando..." : "Exportar"}
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-xl font-semibold text-brand mb-4 sm:mb-0">Visão Geral da Reputação</h2>
          <div className="flex items-center space-x-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="12meses">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avaliações Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand">200</div>
              <div className="flex items-center text-sm mt-1">
                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                <span className="text-green-500 font-medium">↑ 12%</span>
                <span className="text-gray-500 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nota Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand">4.7</div>
              <div className="flex items-center text-sm mt-1">
                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                <span className="text-green-500 font-medium">↑ 0.3</span>
                <span className="text-gray-500 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxa de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand">92%</div>
              <div className="flex items-center text-sm mt-1">
                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                <span className="text-green-500 font-medium">↑ 3%</span>
                <span className="text-gray-500 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
              <CardDescription className="text-xs">Envios → Avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand">24%</div>
              <div className="flex items-center text-sm mt-1">
                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                <span className="text-green-500 font-medium">↑ 5%</span>
                <span className="text-gray-500 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="avaliacoes" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
            <TabsTrigger value="plataformas">Plataformas</TabsTrigger>
            <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avaliacoes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Evolução de Avaliações por Plataforma</CardTitle>
                      <CardDescription>Últimos 6 meses</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Exportar CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={dadosAvaliacoes}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="google" name="Google" fill="#4285F4" />
                        <Bar dataKey="doctoralia" name="Doctoralia" fill="#28A745" />
                        <Bar dataKey="facebook" name="Facebook" fill="#1877F2" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Distribuição de Notas</CardTitle>
                      <CardDescription>Todas as plataformas</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Exportar CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={dadosDistribuicaoNotas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosDistribuicaoNotas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="campanhas">
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Desempenho de Campanhas</CardTitle>
                      <CardDescription>Comparativo das últimas campanhas</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Exportar CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={dadosCampanhasDesempenho}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="enviados" name="Enviados" fill="#003366" />
                        <Bar dataKey="abertos" name="Abertos" fill="#007BFF" />
                        <Bar dataKey="clicados" name="Clicados" fill="#FFC107" />
                        <Bar dataKey="avaliados" name="Avaliados" fill="#28A745" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Taxa de Abertura Média</p>
                      <p className="font-semibold text-lg">82%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Taxa de Clique Média</p>
                      <p className="font-semibold text-lg">40%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversão para Avaliação</p>
                      <p className="font-semibold text-lg">16%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Custo por Avaliação</p>
                      <p className="font-semibold text-lg">R$ 2,40</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evolução da Taxa de Conversão</CardTitle>
                    <CardDescription>Envios para avaliações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={dadosConversaoMensal}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="taxa" name="Taxa de Conversão (%)" fill="#28A745" />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Melhores Campanhas</CardTitle>
                    <CardDescription>Por taxa de conversão</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dadosCampanhasDesempenho
                        .map(item => ({
                          ...item,
                          taxaConversao: (item.avaliados / item.enviados) * 100
                        }))
                        .sort((a, b) => b.taxaConversao - a.taxaConversao)
                        .slice(0, 4)
                        .map((campanha, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="font-medium text-sm text-primary">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{campanha.name}</p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${campanha.taxaConversao}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-3 text-right">
                              <p className="font-semibold">{campanha.taxaConversao.toFixed(1)}%</p>
                              <p className="text-xs text-gray-500">{campanha.avaliados} de {campanha.enviados}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plataformas">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Google My Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-brand">4.8</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill={i < 5 ? "#FFC107" : "none"}
                          stroke="#FFC107"
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mx-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-500">Baseado em 125 avaliações</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-20 text-sm">5 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">80%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">4 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">15%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">3 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '3%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">3%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">2 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">1%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">1 estrela</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">1%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Doctoralia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-brand">4.6</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill={i < 4.6 ? "#FFC107" : "none"}
                          stroke="#FFC107"
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mx-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-500">Baseado em 65 avaliações</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-20 text-sm">5 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">70%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">4 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">20%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">3 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">7%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">2 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">2%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">1 estrela</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">1%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Facebook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-brand">4.9</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill={i < 5 ? "#FFC107" : "none"}
                          stroke="#FFC107"
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mx-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-500">Baseado em 10 avaliações</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-20 text-sm">5 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">90%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">4 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">10%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">3 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">0%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">2 estrelas</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">0%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm">1 estrela</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm">0%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Comparativo de Plataformas</CardTitle>
                      <CardDescription>Desempenho nos últimos 6 meses</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Plataforma</th>
                          <th className="text-center p-2">Avaliações</th>
                          <th className="text-center p-2">Nota Média</th>
                          <th className="text-center p-2">Respondidas</th>
                          <th className="text-center p-2">Taxa de Resposta</th>
                          <th className="text-center p-2">Tendência</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Google</td>
                          <td className="text-center p-2">125</td>
                          <td className="text-center p-2">4.8</td>
                          <td className="text-center p-2">120</td>
                          <td className="text-center p-2">96%</td>
                          <td className="text-center p-2 text-green-500">↑ 12%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Doctoralia</td>
                          <td className="text-center p-2">65</td>
                          <td className="text-center p-2">4.6</td>
                          <td className="text-center p-2">58</td>
                          <td className="text-center p-2">89%</td>
                          <td className="text-center p-2 text-green-500">↑ 18%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Facebook</td>
                          <td className="text-center p-2">10</td>
                          <td className="text-center p-2">4.9</td>
                          <td className="text-center p-2">6</td>
                          <td className="text-center p-2">60%</td>
                          <td className="text-center p-2 text-gray-500">-</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Total</td>
                          <td className="text-center p-2 font-semibold">200</td>
                          <td className="text-center p-2 font-semibold">4.7</td>
                          <td className="text-center p-2 font-semibold">184</td>
                          <td className="text-center p-2 font-semibold">92%</td>
                          <td className="text-center p-2 text-green-500">↑ 14%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tendencias">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Principais Tendências</CardTitle>
                  <CardDescription>Análise dos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center border-b pb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Aumento nas avaliações de 5 estrelas</h4>
                        <p className="text-sm text-gray-500">Crescimento de 18% em relação ao período anterior</p>
                      </div>
                    </div>
                    <div className="flex items-center border-b pb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <BarChart className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Melhoria na taxa de resposta</h4>
                        <p className="text-sm text-gray-500">Aumento de 15% na velocidade média de resposta</p>
                      </div>
                    </div>
                    <div className="flex items-center border-b pb-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <PieChart className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Crescimento na Doctoralia</h4>
                        <p className="text-sm text-gray-500">Plataforma com maior crescimento (35%)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Menções positivas sobre atendimento</h4>
                        <p className="text-sm text-gray-500">Aumento de 22% nas menções sobre qualidade do atendimento</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Oportunidades de Melhoria</CardTitle>
                  <CardDescription>Baseado na análise de avaliações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="font-medium">Tempo de espera para atendimento</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        15% das avaliações com nota baixa mencionam tempo de espera como problema.
                      </p>
                      <div className="mt-2 flex">
                        <Button variant="outline" size="sm" className="text-xs">Ver avaliações</Button>
                      </div>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-medium">Agendamento online</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Clientes sugerem melhoria no sistema de agendamento online.
                      </p>
                      <div className="mt-2 flex">
                        <Button variant="outline" size="sm" className="text-xs">Ver avaliações</Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Comunicação pós-atendimento</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Oportunidade para melhorar as comunicações de follow-up após consultas.
                      </p>
                      <div className="mt-2 flex">
                        <Button variant="outline" size="sm" className="text-xs">Ver avaliações</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relatórios Salvos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <FileText className="h-5 w-5 text-primary mb-2" />
                    <span className="text-xs text-gray-500">15/03/2023</span>
                  </div>
                  <h3 className="font-medium">Relatório Mensal Março</h3>
                  <p className="text-sm text-gray-500 mt-1">Resumo completo de métricas</p>
                </div>
                <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <FileText className="h-5 w-5 text-primary mb-2" />
                    <span className="text-xs text-gray-500">10/02/2023</span>
                  </div>
                  <h3 className="font-medium">Desempenho Campanhas Q1</h3>
                  <p className="text-sm text-gray-500 mt-1">Análise das campanhas do trimestre</p>
                </div>
                <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <FileText className="h-5 w-5 text-primary mb-2" />
                    <span className="text-xs text-gray-500">05/01/2023</span>
                  </div>
                  <h3 className="font-medium">Análise Anual 2022</h3>
                  <p className="text-sm text-gray-500 mt-1">Comparativo completo anual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
