
import { useState, useEffect } from "react";
import { Calendar, Download, Filter, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/layout/PageHeader";
import FiltroPeriodoModal from "@/components/modals/FiltroPeriodoModal";
import { toast } from "sonner";
import { filtrarLogsFaturamento, getLogsFaturamento, getBillingStats, tiposFaturamento, statusFaturamento, type LogFaturamento, type BillingStats } from "@/services/billingService";

export default function LogsFaturamento() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [logs, setLogs] = useState<LogFaturamento[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogFaturamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ordenacao, setOrdenacao] = useState<{campo: keyof LogFaturamento, direcao: 'asc' | 'desc'}>({
    campo: 'created_at',
    direcao: 'desc'
  });
  const [stats, setStats] = useState<BillingStats>({
    total: 0,
    pendente: 0,
    pago: 0
  });

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      try {
        const logsData = await getLogsFaturamento();
        setLogs(logsData);
        setFilteredLogs(logsData);
        
        const statsData = await getBillingStats();
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados de faturamento");
      }
    }
    
    loadData();
  }, []);

  // Filtrar logs baseado no termo de busca
  useEffect(() => {
    const filtered = logs.filter((log) => {
      const termo = searchTerm.toLowerCase();
      return (
        tiposFaturamento[log.tipo as keyof typeof tiposFaturamento]?.toLowerCase().includes(termo) ||
        log.origem?.toLowerCase().includes(termo) ||
        statusFaturamento[log.status as keyof typeof statusFaturamento]?.toLowerCase().includes(termo) ||
        log.valor.toString().includes(termo)
      );
    });
    
    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  // Ordenar logs
  const ordenarLogs = (campo: keyof LogFaturamento) => {
    const novaDirecao = 
      ordenacao.campo === campo && ordenacao.direcao === 'asc' ? 'desc' : 'asc';
    
    const logsOrdenados = [...filteredLogs].sort((a, b) => {
      if (a[campo] < b[campo]) return novaDirecao === 'asc' ? -1 : 1;
      if (a[campo] > b[campo]) return novaDirecao === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredLogs(logsOrdenados);
    setOrdenacao({ campo, direcao: novaDirecao });
  };

  // Formatação de data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Download do extrato
  const handleDownloadExtrato = () => {
    const csvContent = [
      ["Data", "Tipo", "Origem", "Valor", "Status"],
      ...filteredLogs.map(log => [
        formatarData(log.created_at),
        tiposFaturamento[log.tipo as keyof typeof tiposFaturamento] || log.tipo,
        log.origem || "",
        `R$ ${log.valor.toFixed(2)}`,
        statusFaturamento[log.status as keyof typeof statusFaturamento] || log.status
      ])
    ]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `extrato-faturamento-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Extrato baixado com sucesso");
  };

  // Renderizar badge de status
  const renderStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string, label: string }> = {
      pago: { bg: "bg-green-100 text-green-800", label: "Pago" },
      pendente: { bg: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      falhou: { bg: "bg-red-100 text-red-800", label: "Falhou" }
    };
    
    const config = configs[status] || { bg: "bg-gray-100 text-gray-800", label: status };
    
    return (
      <Badge variant="outline" className={`${config.bg}`}>
        {config.label}
      </Badge>
    );
  };

  // Aplicar filtro de período
  const handleAplicarFiltroPeriodo = async (dataInicio: Date, dataFim: Date) => {
    try {
      const periodo = {
        inicio: dataInicio,
        fim: dataFim
      };
      
      const logsData = await filtrarLogsFaturamento(periodo);
      setLogs(logsData);
      setFilteredLogs(logsData);
      toast.info(`Filtro aplicado: ${dataInicio.toLocaleDateString()} a ${dataFim.toLocaleDateString()}`);
      setIsFilterOpen(false);
    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
      toast.error("Erro ao aplicar filtro");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Logs de Faturamento" 
        description="Visualize e acompanhe todas as cobranças do seu plano."
      />
      
      <div className="grid gap-4 md:grid-cols-3 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Faturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as cobranças
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.pendente.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Cobranças ainda não processadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.pago.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Cobranças já processadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="todos" className="w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="pagos">Pagos</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Filtrar período
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadExtrato}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                Exibindo {filteredLogs.length} registros
              </div>
              <div className="relative w-full max-w-sm">
                <Input
                  placeholder="Buscar por tipo, origem ou status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <TabsContent value="todos" className="m-0">
              <LogsTable 
                logs={filteredLogs} 
                formatarData={formatarData} 
                renderStatusBadge={renderStatusBadge} 
                ordenarLogs={ordenarLogs}
              />
            </TabsContent>
            
            <TabsContent value="pendentes" className="m-0">
              <LogsTable 
                logs={filteredLogs.filter(log => log.status === 'pendente')} 
                formatarData={formatarData} 
                renderStatusBadge={renderStatusBadge} 
                ordenarLogs={ordenarLogs}
              />
            </TabsContent>
            
            <TabsContent value="pagos" className="m-0">
              <LogsTable 
                logs={filteredLogs.filter(log => log.status === 'pago')} 
                formatarData={formatarData} 
                renderStatusBadge={renderStatusBadge} 
                ordenarLogs={ordenarLogs}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <FiltroPeriodoModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleAplicarFiltroPeriodo} 
      />
    </div>
  );
}

interface LogsTableProps {
  logs: LogFaturamento[];
  formatarData: (data: string) => string;
  renderStatusBadge: (status: string) => JSX.Element;
  ordenarLogs: (campo: keyof LogFaturamento) => void;
}

function LogsTable({ logs, formatarData, renderStatusBadge, ordenarLogs }: LogsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] cursor-pointer hover:bg-gray-50" onClick={() => ordenarLogs('created_at')}>
              <div className="flex items-center">
                Data
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => ordenarLogs('tipo')}>
              <div className="flex items-center">
                Tipo
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Origem</TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-gray-50" onClick={() => ordenarLogs('valor')}>
              <div className="flex items-center justify-end">
                Valor
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => ordenarLogs('status')}>
              <div className="flex items-center justify-center">
                Status
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatarData(log.created_at)}</TableCell>
                <TableCell>{tiposFaturamento[log.tipo as keyof typeof tiposFaturamento] || log.tipo}</TableCell>
                <TableCell>{log.origem || "-"}</TableCell>
                <TableCell className="text-right">R$ {log.valor.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(log.status)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
