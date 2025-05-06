
import { useState } from "react";
import { Edit, Copy, Trash2, DesktopIcon, TabletIcon, SmartphoneIcon, ExternalLink, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColorPicker } from "@/components/widgets/ColorPicker";

interface Widget {
  id: string;
  nome: string;
  tipo: string;
  plataformas: string[];
  visualizacoes: number;
  localizacao: string;
  status: "ativo" | "inativo";
  styling: {
    corPrimaria: string;
    corSecundaria: string;
    corTexto: string;
    corFundo: string;
    forma: string;
    mostrarEstrelas: boolean;
    mostrarPlataforma: boolean;
    mostrarData: boolean;
    exibirAvaliacoes: number;
  };
}

// Dados de exemplo
const widgetsIniciais: Widget[] = [
  {
    id: "1",
    nome: "Widget Principal",
    tipo: "popup",
    plataformas: ["Google", "Facebook"],
    visualizacoes: 1250,
    localizacao: "Homepage",
    status: "ativo",
    styling: {
      corPrimaria: "#9b87f5",
      corSecundaria: "#7E69AB",
      corTexto: "#222222",
      corFundo: "#FFFFFF",
      forma: "arredondado",
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: true,
      exibirAvaliacoes: 3
    }
  },
  {
    id: "2",
    nome: "Widget Lateral",
    tipo: "flutuante",
    plataformas: ["Google", "Doctoralia"],
    visualizacoes: 843,
    localizacao: "Lateral Direita",
    status: "ativo",
    styling: {
      corPrimaria: "#0EA5E9",
      corSecundaria: "#3B82F6",
      corTexto: "#333333",
      corFundo: "#F6F6F7",
      forma: "quadrado",
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: false,
      exibirAvaliacoes: 5
    }
  },
  {
    id: "3",
    nome: "Badge de Avaliações",
    tipo: "badge",
    plataformas: ["Google"],
    visualizacoes: 2150,
    localizacao: "Footer",
    status: "inativo",
    styling: {
      corPrimaria: "#10B981",
      corSecundaria: "#F97316",
      corTexto: "#FFFFFF",
      corFundo: "#1A1F2C",
      forma: "arredondado",
      mostrarEstrelas: true,
      mostrarPlataforma: false,
      mostrarData: false,
      exibirAvaliacoes: 1
    }
  }
];

// Exemplo de avaliações para o preview
const avaliacoesExemplo = [
  {
    id: 1,
    paciente: "Maria Silva",
    avatar: "MS",
    plataforma: "Google",
    data: "15/04/2023",
    nota: 5,
    texto: "Excelente atendimento! A equipe é muito profissional e atenciosa. Recomendo."
  },
  {
    id: 2,
    paciente: "João Santos",
    avatar: "JS",
    plataforma: "Doctoralia",
    data: "10/04/2023",
    nota: 4,
    texto: "Muito bom atendimento. O doutor foi atencioso e resolveu meu problema."
  },
  {
    id: 3,
    paciente: "Ana Oliveira",
    avatar: "AO",
    plataforma: "Facebook",
    data: "05/04/2023",
    nota: 5,
    texto: "Ótima experiência! Clínica moderna e equipe muito bem preparada."
  },
  {
    id: 4,
    paciente: "Carlos Pereira",
    avatar: "CP",
    plataforma: "Google",
    data: "01/04/2023",
    nota: 4,
    texto: "Recomendo a clínica. Atendimento de qualidade e ambiente confortável."
  },
  {
    id: 5,
    paciente: "Lúcia Mendes",
    avatar: "LM",
    plataforma: "Instagram",
    data: "25/03/2023",
    nota: 5,
    texto: "A melhor clínica da região! Profissionais excelentes e atendimento nota 10."
  }
];

// Função para gerar o código de embed
const gerarCodigoEmbed = (widget: Widget) => {
  return `
<!-- Reputação Viva Widget -->
<div id="reputacao-viva-widget" data-widget-id="${widget.id}"></div>
<script src="https://cdn.reputacaoviva.com.br/widget.js" async></script>
<!-- Fim do Widget -->
`;
};

export default function Widgets() {
  const [widgets, setWidgets] = useState<Widget[]>(widgetsIniciais);
  const [widgetAtual, setWidgetAtual] = useState<Widget | null>(null);
  const [modoPreview, setModoPreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [modalCodigoAberto, setModalCodigoAberto] = useState(false);
  const [widgetParaExcluir, setWidgetParaExcluir] = useState<string | null>(null);
  
  // Inicializa com o primeiro widget para o preview
  useState(() => {
    if (widgets.length > 0 && !widgetAtual) {
      setWidgetAtual(widgets[0]);
    }
  });
  
  // Função para editar widget
  const salvarWidget = (widget: Widget) => {
    if (widget.id) {
      // Editando widget existente
      setWidgets(widgets.map(w => w.id === widget.id ? widget : w));
    } else {
      // Novo widget
      const novoWidget: Widget = {
        ...widget,
        id: Date.now().toString(),
        visualizacoes: 0
      };
      setWidgets([...widgets, novoWidget]);
    }
    setModalEditarAberto(false);
  };
  
  // Função para criar novo widget
  const criarNovoWidget = () => {
    const novoWidget: Widget = {
      id: "",
      nome: "Novo Widget",
      tipo: "popup",
      plataformas: ["Google"],
      visualizacoes: 0,
      localizacao: "Homepage",
      status: "ativo",
      styling: {
        corPrimaria: "#9b87f5",
        corSecundaria: "#7E69AB",
        corTexto: "#222222",
        corFundo: "#FFFFFF",
        forma: "arredondado",
        mostrarEstrelas: true,
        mostrarPlataforma: true,
        mostrarData: true,
        exibirAvaliacoes: 3
      }
    };
    
    setWidgetAtual(novoWidget);
    setModalEditarAberto(true);
  };
  
  // Função para excluir widget
  const excluirWidget = () => {
    if (widgetParaExcluir) {
      setWidgets(widgets.filter(w => w.id !== widgetParaExcluir));
      
      // Se o widget excluído for o atual, selecionamos outro
      if (widgetAtual && widgetAtual.id === widgetParaExcluir) {
        const outroWidget = widgets.find(w => w.id !== widgetParaExcluir);
        setWidgetAtual(outroWidget || null);
      }
      
      setWidgetParaExcluir(null);
      setModalExcluirAberto(false);
    }
  };
  
  // Função para mostrar o código de embed
  const mostrarCodigoEmbed = (widget: Widget) => {
    setWidgetAtual(widget);
    setModalCodigoAberto(true);
  };
  
  // Componente de edição de widget
  const EditorWidget = ({ widget, onSalvar }: { widget: Widget, onSalvar: (widget: Widget) => void }) => {
    const [editandoWidget, setEditandoWidget] = useState<Widget>({ ...widget });
    
    const atualizarEstilo = (chave: string, valor: any) => {
      setEditandoWidget({
        ...editandoWidget,
        styling: {
          ...editandoWidget.styling,
          [chave]: valor
        }
      });
    };
    
    const togglePlataforma = (plataforma: string) => {
      if (editandoWidget.plataformas.includes(plataforma)) {
        setEditandoWidget({
          ...editandoWidget,
          plataformas: editandoWidget.plataformas.filter(p => p !== plataforma)
        });
      } else {
        setEditandoWidget({
          ...editandoWidget,
          plataformas: [...editandoWidget.plataformas, plataforma]
        });
      }
    };
    
    return (
      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="nome-widget">Nome do widget</Label>
            <Input
              id="nome-widget"
              value={editandoWidget.nome}
              onChange={(e) => setEditandoWidget({ ...editandoWidget, nome: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tipo-widget">Tipo de widget</Label>
            <Select 
              value={editandoWidget.tipo} 
              onValueChange={(valor) => setEditandoWidget({ ...editandoWidget, tipo: valor })}
            >
              <SelectTrigger id="tipo-widget">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popup">Popup</SelectItem>
                <SelectItem value="flutuante">Flutuante</SelectItem>
                <SelectItem value="badge">Badge</SelectItem>
                <SelectItem value="embutido">Embutido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="localizacao-widget">Localização no site</Label>
            <Input
              id="localizacao-widget"
              value={editandoWidget.localizacao}
              onChange={(e) => setEditandoWidget({ ...editandoWidget, localizacao: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Plataformas de avaliação</Label>
            <div className="flex flex-wrap gap-2">
              {["Google", "Facebook", "Doctoralia", "Instagram"].map((plataforma) => (
                <div key={plataforma} className="flex items-center space-x-2">
                  <Switch
                    id={`plataforma-${plataforma}`}
                    checked={editandoWidget.plataformas.includes(plataforma)}
                    onCheckedChange={() => togglePlataforma(plataforma)}
                  />
                  <Label htmlFor={`plataforma-${plataforma}`} className="font-normal">
                    {plataforma}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status-widget">Status</Label>
            <Select 
              value={editandoWidget.status} 
              onValueChange={(valor: "ativo" | "inativo") => setEditandoWidget({ ...editandoWidget, status: valor })}
            >
              <SelectTrigger id="status-widget">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-3">
          <h3 className="text-lg font-medium">Aparência</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              color={editandoWidget.styling.corPrimaria}
              onChange={(valor) => atualizarEstilo("corPrimaria", valor)}
              label="Cor primária"
            />
            
            <ColorPicker
              color={editandoWidget.styling.corSecundaria}
              onChange={(valor) => atualizarEstilo("corSecundaria", valor)}
              label="Cor secundária"
            />
            
            <ColorPicker
              color={editandoWidget.styling.corTexto}
              onChange={(valor) => atualizarEstilo("corTexto", valor)}
              label="Cor do texto"
            />
            
            <ColorPicker
              color={editandoWidget.styling.corFundo}
              onChange={(valor) => atualizarEstilo("corFundo", valor)}
              label="Cor de fundo"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="forma-widget">Formato</Label>
            <Select 
              value={editandoWidget.styling.forma} 
              onValueChange={(valor) => atualizarEstilo("forma", valor)}
            >
              <SelectTrigger id="forma-widget">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arredondado">Arredondado</SelectItem>
                <SelectItem value="quadrado">Quadrado</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="avaliacoes-exibidas">Número de avaliações</Label>
            <Select 
              value={editandoWidget.styling.exibirAvaliacoes.toString()} 
              onValueChange={(valor) => atualizarEstilo("exibirAvaliacoes", parseInt(valor))}
            >
              <SelectTrigger id="avaliacoes-exibidas">
                <SelectValue placeholder="Quantidade de avaliações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 avaliação</SelectItem>
                <SelectItem value="3">3 avaliações</SelectItem>
                <SelectItem value="5">5 avaliações</SelectItem>
                <SelectItem value="10">10 avaliações</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Opções de exibição</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="mostrar-estrelas"
                  checked={editandoWidget.styling.mostrarEstrelas}
                  onCheckedChange={(checked) => atualizarEstilo("mostrarEstrelas", checked)}
                />
                <Label htmlFor="mostrar-estrelas" className="font-normal">
                  Mostrar estrelas
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="mostrar-plataforma"
                  checked={editandoWidget.styling.mostrarPlataforma}
                  onCheckedChange={(checked) => atualizarEstilo("mostrarPlataforma", checked)}
                />
                <Label htmlFor="mostrar-plataforma" className="font-normal">
                  Mostrar plataforma
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="mostrar-data"
                  checked={editandoWidget.styling.mostrarData}
                  onCheckedChange={(checked) => atualizarEstilo("mostrarData", checked)}
                />
                <Label htmlFor="mostrar-data" className="font-normal">
                  Mostrar data
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setModalEditarAberto(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSalvar(editandoWidget)}>
            Salvar Widget
          </Button>
        </DialogFooter>
      </div>
    );
  };
  
  // Componente para preview do widget
  const WidgetPreview = ({ widget, modo }: { widget: Widget, modo: "desktop" | "tablet" | "mobile" }) => {
    if (!widget) return null;
    
    // Aplicar estilos baseado no modo de visualização
    const containerClass = `
      overflow-hidden 
      ${widget.styling.forma === "arredondado" ? "rounded-lg" : 
        widget.styling.forma === "quadrado" ? "" : 
        "rounded-full"}
      ${modo === "desktop" ? "w-full max-w-xl" : 
        modo === "tablet" ? "w-[380px]" : 
        "w-[320px]"}
    `;
    
    const displayedReviews = avaliacoesExemplo.slice(0, widget.styling.exibirAvaliacoes);
    
    return (
      <div className={containerClass} style={{ backgroundColor: widget.styling.corFundo }}>
        <div className="p-4" style={{ color: widget.styling.corTexto }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Avaliações da Clínica</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">4.8</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill={i < 4 ? widget.styling.corPrimaria : "#E0E0E0"}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-3 last:border-0">
                <div className="flex items-start">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                    style={{ backgroundColor: widget.styling.corPrimaria }}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{review.paciente}</h4>
                      {widget.styling.mostrarPlataforma && (
                        <span className="text-xs text-gray-500">{review.plataforma}</span>
                      )}
                    </div>
                    
                    {widget.styling.mostrarEstrelas && (
                      <div className="flex my-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4"
                            fill={i < review.nota ? widget.styling.corPrimaria : "#E0E0E0"}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm mt-1">{review.texto}</p>
                    
                    {widget.styling.mostrarData && (
                      <p className="text-xs text-gray-500 mt-1">{review.data}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <div className="text-sm">
              Powered by <span className="font-semibold">Reputação Viva</span>
            </div>
            <button
              className="text-sm px-3 py-1 rounded"
              style={{ backgroundColor: widget.styling.corPrimaria, color: "#FFF" }}
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <PageHeader 
        title="Widgets" 
        description="Gerencie e personalize os widgets de avaliações para seu site."
      >
        <div className="flex space-x-2">
          <Button onClick={criarNovoWidget}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Widget
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between">
                  <span>Widgets Disponíveis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Plataformas</TableHead>
                        <TableHead>Visualizações</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {widgets.map(widget => (
                        <TableRow key={widget.id} className="cursor-pointer" onClick={() => setWidgetAtual(widget)}>
                          <TableCell className="font-medium">{widget.nome}</TableCell>
                          <TableCell className="capitalize">{widget.tipo}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {widget.plataformas.map(plataforma => (
                                <span 
                                  key={plataforma} 
                                  className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs"
                                >
                                  {plataforma}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{widget.visualizacoes.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              widget.status === "ativo" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {widget.status === "ativo" ? "Ativo" : "Inativo"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setWidgetAtual(widget);
                                  setModalEditarAberto(true);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => mostrarCodigoEmbed(widget)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Código HTML
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => {
                                  setWidgetParaExcluir(widget.id);
                                  setModalExcluirAberto(true);
                                }}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {widgetAtual && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Preview do Widget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Tabs value={modoPreview} onValueChange={(v: "desktop" | "tablet" | "mobile") => setModoPreview(v)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="desktop">
                          <DesktopIcon className="h-4 w-4 mr-2" />
                          Desktop
                        </TabsTrigger>
                        <TabsTrigger value="tablet">
                          <TabletIcon className="h-4 w-4 mr-2" />
                          Tablet
                        </TabsTrigger>
                        <TabsTrigger value="mobile">
                          <SmartphoneIcon className="h-4 w-4 mr-2" />
                          Mobile
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className={`border p-6 rounded-lg flex justify-center items-center bg-gray-50 ${
                    modoPreview === "desktop" ? "min-h-[550px]" : 
                    modoPreview === "tablet" ? "min-h-[500px]" : 
                    "min-h-[450px]"
                  }`}>
                    <WidgetPreview widget={widgetAtual} modo={modoPreview} />
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => mostrarCodigoEmbed(widgetAtual)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Obter código para o site
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Edição de Widget */}
      <Dialog open={modalEditarAberto} onOpenChange={setModalEditarAberto}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {widgetAtual && widgetAtual.id ? "Editar Widget" : "Novo Widget"}
            </DialogTitle>
          </DialogHeader>
          
          {widgetAtual && (
            <EditorWidget 
              widget={widgetAtual} 
              onSalvar={salvarWidget} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão de Widget */}
      <Dialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este widget? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalExcluirAberto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirWidget}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Código de Embed */}
      <Dialog open={modalCodigoAberto} onOpenChange={setModalCodigoAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Código para Integração</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-2">
            Adicione este código HTML ao seu site para exibir o widget de avaliações:
          </p>
          <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="text-xs">
              {widgetAtual && gerarCodigoEmbed(widgetAtual)}
            </pre>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                if (widgetAtual) {
                  navigator.clipboard.writeText(gerarCodigoEmbed(widgetAtual));
                  // Poderia adicionar uma notificação de sucesso aqui
                  alert("Código copiado para a área de transferência!");
                }
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar Código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componente auxiliar para o ícone de mais opções
const MoreHorizontalIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
