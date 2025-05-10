
import { useState, useEffect } from "react";
import { X, Calendar, Download, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getLogsFaturamento, type LogFaturamento } from "@/services/billingService";

interface ExtratoAvaliacoesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tipos
type StatusPagamento = "pago" | "pendente" | "falhou";

interface Avaliacao {
  id: string;
  origem: "Google" | "Facebook" | "Formulário";
  dataClique: string;
  dataAvaliacao: string;
  valor: number;
  statusPagamento: StatusPagamento;
  campanha: string;
  contato: string;
}

export default function ExtratoAvaliacoesModal({ isOpen, onClose }: ExtratoAvaliacoesModalProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<{campo: keyof Avaliacao, direcao: 'asc' | 'desc'}>({
    campo: 'dataAvaliacao',
    direcao: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados reais do faturamento
  useEffect(() => {
    if (!isOpen) return;

    async function carregarDados() {
      setIsLoading(true);
      try {
        const logs = await getLogsFaturamento();
        const avaliacoesFiltradas = logs
          .filter(log => 
            log.tipo === 'avaliacao_google' || 
            log.tipo === 'avaliacao_formulario' || 
            log.tipo === 'avaliacao_facebook'
          )
          .map(log => mapLogToAvaliacao(log));
        
        setAvaliacoes(avaliacoesFiltradas);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        toast.error("Erro ao carregar dados de avaliações");
      } finally {
        setIsLoading(false);
      }
    }
    
    carregarDados();
  }, [isOpen]);

  // Mapear log de faturamento para avaliação
  const mapLogToAvaliacao = (log: LogFaturamento): Avaliacao => {
    let origem: "Google" | "Facebook" | "Formulário" = "Formulário";
    
    if (log.tipo === 'avaliacao_google') origem = "Google";
    else if (log.tipo === 'avaliacao_facebook') origem = "Facebook";
    
    return {
      id: log.id,
      origem,
      dataClique: log.created_at,
      dataAvaliacao: log.created_at,
      valor: log.valor,
      statusPagamento: log.status as StatusPagamento,
      campanha: log.origem || "Campanha padrão",
      contato: "Cliente"
    };
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ordenar avaliacoes
  const ordenarAvaliacoes = (campo: keyof Avaliacao) => {
    const novaDirecao = 
      ordenacao.campo === campo && ordenacao.direcao === 'asc' ? 'desc' : 'asc';
    
    const avaliacoesOrdenadas = [...avaliacoes].sort((a, b) => {
      if (a[campo] < b[campo]) return novaDirecao === 'asc' ? -1 : 1;
      if (a[campo] > b[campo]) return novaDirecao === 'asc' ? 1 : -1;
      return 0;
    });
    
    setAvaliacoes(avaliacoesOrdenadas);
    setOrdenacao({ campo, direcao: novaDirecao });
  };

  // Filtrar avaliacoes
  const avaliacoesFiltradas = avaliacoes.filter(avaliacao => {
    const textoBusca = busca.toLowerCase();
    return (
      avaliacao.origem.toLowerCase().includes(textoBusca) ||
      avaliacao.campanha.toLowerCase().includes(textoBusca) ||
      avaliacao.contato.toLowerCase().includes(textoBusca)
    );
  });

  // Calcular total
  const totalValor = avaliacoesFiltradas.reduce((total, avaliacao) => {
    return avaliacao.statusPagamento === 'pago' ? total + avaliacao.valor : total;
  }, 0);

  // Baixar extrato
  const handleDownloadExtrato = () => {
    const csvContent = [
      ["Data do clique", "Data da avaliação", "Origem", "Campanha", "Contato", "Valor", "Status"],
      ...avaliacoesFiltradas.map(avaliacao => [
        formatarData(avaliacao.dataClique),
        formatarData(avaliacao.dataAvaliacao),
        avaliacao.origem,
        avaliacao.campanha,
        avaliacao.contato,
        `R$ ${avaliacao.valor.toFixed(2)}`,
        avaliacao.statusPagamento
      ])
    ]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `extrato-avaliacoes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Extrato baixado com sucesso");
  };

  // Renderizar badge de status
  const renderStatusBadge = (status: StatusPagamento) => {
    const configs = {
      pago: { bg: "bg-green-100 text-green-800", label: "Pago" },
      pendente: { bg: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      falhou: { bg: "bg-red-100 text-red-800", label: "Falhou" }
    };
    
    const config = configs[status];
    
    return (
      <Badge variant="outline" className={`${config.bg}`}>
        {config.label}
      </Badge>
    );
  };

  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Extrato de Avaliações</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{mesAtual}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadExtrato}>
                <Download className="h-4 w-4 mr-1" />
                Baixar extrato
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">
              <strong>Total pago:</strong> R$ {totalValor.toFixed(2)}
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar avaliação..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] cursor-pointer hover:bg-gray-50" onClick={() => ordenarAvaliacoes('origem')}>
                    <div className="flex items-center">
                      Origem
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => ordenarAvaliacoes('dataClique')}>
                    <div className="flex items-center">
                      Data do clique
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => ordenarAvaliacoes('dataAvaliacao')}>
                    <div className="flex items-center">
                      Data da avaliação
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Carregando avaliações...
                    </TableCell>
                  </TableRow>
                ) : avaliacoesFiltradas.length > 0 ? (
                  avaliacoesFiltradas.map((avaliacao) => (
                    <TableRow key={avaliacao.id}>
                      <TableCell>{avaliacao.origem}</TableCell>
                      <TableCell>{formatarData(avaliacao.dataClique)}</TableCell>
                      <TableCell>{formatarData(avaliacao.dataAvaliacao)}</TableCell>
                      <TableCell>{avaliacao.campanha}</TableCell>
                      <TableCell>{avaliacao.contato}</TableCell>
                      <TableCell className="text-right">R$ {avaliacao.valor.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        {renderStatusBadge(avaliacao.statusPagamento)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhuma avaliação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>* As avaliações são contabilizadas quando um usuário clica no link de avaliação e realiza uma avaliação na plataforma correspondente.</p>
            <p>* O valor de R$ 2,00 é cobrado por avaliação efetivamente registrada.</p>
            <p>* Avaliações com status "Pendente" serão processadas em até 24 horas.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
