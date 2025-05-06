
import { useState } from "react";
import { Plus, Copy, Edit, Monitor, Tablet, Smartphone, Settings } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ColorPicker from "@/components/widgets/ColorPicker";

interface Widget {
  id: string;
  nome: string;
  tipo: "carrossel" | "badge" | "feed";
  ativo: boolean;
  dataCriacao: string;
  plataformas: string[];
  filtros: {
    notaMinima: number;
    maximo: number;
  };
  cores: {
    primaria: string;
    secundaria: string;
    texto?: string;
    fundo?: string;
  };
  desempenho: {
    impressoes: number;
    cliques: number;
  };
  configuracoes: {
    mostrarEstrelas: boolean;
    mostrarPlataforma: boolean;
    mostrarData: boolean;
  };
}

const widgetsExemplo: Widget[] = [
  {
    id: "1",
    nome: "Carrossel Principal Site",
    tipo: "carrossel",
    ativo: true,
    dataCriacao: "2023-09-03",
    plataformas: ["Google", "Doctoralia"],
    filtros: {
      notaMinima: 4,
      maximo: 10
    },
    cores: {
      primaria: "#28A745",
      secundaria: "#FFC107",
      texto: "#333333",
      fundo: "#FFFFFF"
    },
    desempenho: {
      impressoes: 1245,
      cliques: 87
    },
    configuracoes: {
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: true
    }
  },
  {
    id: "2",
    nome: "Badge Nota Média",
    tipo: "badge",
    ativo: true,
    dataCriacao: "2023-03-14",
    plataformas: ["Google"],
    filtros: {
      notaMinima: 1,
      maximo: 100
    },
    cores: {
      primaria: "#28A745",
      secundaria: "#FFC107",
      texto: "#333333",
      fundo: "#FFFFFF"
    },
    desempenho: {
      impressoes: 3560,
      cliques: 120
    },
    configuracoes: {
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: false
    }
  }
];

// Componente de criação/edição de widget
const WidgetForm = ({ onSave, onCancel }: { onSave: (widget: any) => void, onCancel: () => void }) => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"carrossel" | "badge" | "feed">("carrossel");
  const [visualizacao, setVisualizacao] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [corPrimaria, setCorPrimaria] = useState("#28A745");
  const [corSecundaria, setCorSecundaria] = useState("#FFC107");
  const [corTexto, setCorTexto] = useState("#333333");
  const [corFundo, setCorFundo] = useState("#FFFFFF");
  const [mostrarEstrelas, setMostrarEstrelas] = useState(true);
  const [mostrarPlataforma, setMostrarPlataforma] = useState(true);
  const [mostrarData, setMostrarData] = useState(true);

  const handleSave = () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do widget é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const novoWidget = {
      nome,
      tipo,
      ativo: true,
      dataCriacao: new Date().toISOString().split('T')[0],
      plataformas: ["Google"],
      filtros: {
        notaMinima: 4,
        maximo: 10
      },
      cores: {
        primaria: corPrimaria,
        secundaria: corSecundaria,
        texto: corTexto,
        fundo: corFundo
      },
      configuracoes: {
        mostrarEstrelas,
        mostrarPlataforma,
        mostrarData
      }
    };

    onSave(novoWidget);
  };

  const renderPreview = () => {
    const starsDisplay = 
      mostrarEstrelas 
        ? <div className="flex mb-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={corSecundaria} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        : null;

    const platformDisplay = mostrarPlataforma ? <span style={{color: corTexto}} className="text-xs">Google</span> : null;
    
    const previewContent = (
      <div style={{ backgroundColor: corFundo, borderColor: corPrimaria }} className="border rounded-md p-4">
        <div className="text-lg font-medium mb-2" style={{ color: corPrimaria }}>Avaliações de Pacientes</div>
        <div className="p-3 border rounded-md mb-2" style={{ borderColor: corSecundaria }}>
          <div className="flex items-center justify-between mb-1">
            {starsDisplay}
            {platformDisplay}
          </div>
          <p style={{ color: corTexto }} className="text-sm">
            "Excelente atendimento! O Dr. João foi muito atencioso e explicou todo o procedimento detalhadamente."
          </p>
          <div className="text-right text-xs mt-1" style={{ color: corTexto }}>
            {mostrarData ? "Maria S. - 12/05/2023" : "Maria S."}
          </div>
        </div>
        <div className="text-xs text-right" style={{ color: corPrimaria }}>
          Powered by Reputação Viva
        </div>
      </div>
    );

    let wrapperClass = "";
    if (visualizacao === "tablet") {
      wrapperClass = "max-w-md mx-auto";
    } else if (visualizacao === "mobile") {
      wrapperClass = "max-w-xs mx-auto";
    }

    return (
      <div className={wrapperClass}>
        {previewContent}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Criar Novo Widget</h2>
        <p className="text-gray-500 mb-4">Personalize e configure seu widget de prova social</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nome-widget">Nome do Widget</Label>
          <Input
            id="nome-widget"
            placeholder="Ex: Carrossel para Homepage"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <Label>Tipo de Widget</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className={`border rounded-md p-4 cursor-pointer ${tipo === 'carrossel' ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setTipo('carrossel')}>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="radio" 
                  checked={tipo === 'carrossel'} 
                  onChange={() => setTipo('carrossel')} 
                />
                <Label className="font-medium cursor-pointer">Carrossel</Label>
              </div>
              <p className="text-sm text-gray-500">Exibe avaliações em um carrossel deslizante</p>
            </div>
            
            <div className={`border rounded-md p-4 cursor-pointer ${tipo === 'badge' ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setTipo('badge')}>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="radio" 
                  checked={tipo === 'badge'} 
                  onChange={() => setTipo('badge')} 
                />
                <Label className="font-medium cursor-pointer">Badge</Label>
              </div>
              <p className="text-sm text-gray-500">Exibe nota média e número de avaliações em formato compacto</p>
            </div>
            
            <div className={`border rounded-md p-4 cursor-pointer ${tipo === 'feed' ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setTipo('feed')}>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="radio" 
                  checked={tipo === 'feed'} 
                  onChange={() => setTipo('feed')} 
                />
                <Label className="font-medium cursor-pointer">Feed</Label>
              </div>
              <p className="text-sm text-gray-500">Lista de avaliações em formato vertical</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Personalização</h3>
              <Tabs defaultValue="cores">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="cores">Cores</TabsTrigger>
                  <TabsTrigger value="filtros">Filtros</TabsTrigger>
                </TabsList>
                <TabsContent value="cores" className="pt-4">
                  <div className="space-y-4">
                    <ColorPicker
                      label="Cor Primária"
                      value={corPrimaria}
                      onChange={setCorPrimaria}
                    />
                    
                    <ColorPicker
                      label="Cor Secundária"
                      value={corSecundaria}
                      onChange={setCorSecundaria}
                    />
                    
                    <ColorPicker
                      label="Cor do Texto"
                      value={corTexto}
                      onChange={setCorTexto}
                    />
                    
                    <ColorPicker
                      label="Cor de Fundo"
                      value={corFundo}
                      onChange={setCorFundo}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="filtros" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Plataformas</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="flex items-center space-x-2 border p-2 rounded-md">
                          <input type="checkbox" checked />
                          <Label className="text-sm">Google</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-2 rounded-md">
                          <input type="checkbox" />
                          <Label className="text-sm">Doctoralia</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-2 rounded-md">
                          <input type="checkbox" />
                          <Label className="text-sm">Facebook</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Nota mínima</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <div key={num} className={`flex items-center justify-center space-x-2 border p-2 rounded-md cursor-pointer ${num === 4 ? 'bg-primary text-white' : ''}`}>
                            <Label className="text-sm cursor-pointer">{num}+</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Máximo de avaliações</Label>
                      <Input type="number" defaultValue={10} min={1} max={50} className="w-full" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Exibição</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="exibir-estrelas">Mostrar estrelas</Label>
                <Switch
                  id="exibir-estrelas"
                  checked={mostrarEstrelas}
                  onCheckedChange={setMostrarEstrelas}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="exibir-plataforma">Mostrar plataforma</Label>
                <Switch
                  id="exibir-plataforma"
                  checked={mostrarPlataforma}
                  onCheckedChange={setMostrarPlataforma}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="exibir-data">Mostrar data</Label>
                <Switch
                  id="exibir-data"
                  checked={mostrarData}
                  onCheckedChange={setMostrarData}
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preview</h3>
              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="desktop" onClick={() => setVisualizacao("desktop")}>
                    <Monitor className="h-4 w-4 mr-2" />
                    Monitor
                  </TabsTrigger>
                  <TabsTrigger value="tablet" onClick={() => setVisualizacao("tablet")}>
                    <Tablet className="h-4 w-4 mr-2" />
                    Tablet
                  </TabsTrigger>
                  <TabsTrigger value="mobile" onClick={() => setVisualizacao("mobile")}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Celular
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="desktop" className="pt-4">
                  {renderPreview()}
                </TabsContent>
                <TabsContent value="tablet" className="pt-4">
                  {renderPreview()}
                </TabsContent>
                <TabsContent value="mobile" className="pt-4">
                  {renderPreview()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

// Componente principal da página
export default function Widgets() {
  const [widgets, setWidgets] = useState<Widget[]>(widgetsExemplo);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Copiar código de instalação
  const handleCopiarCodigo = (id: string) => {
    const script = `<script src="https://reputacaoviva.com.br/widgets/embed.js?id=${id}"></script>`;
    navigator.clipboard.writeText(script);
    toast({
      description: "Código copiado para a área de transferência!",
    });
  };
  
  // Editar widget
  const handleEditarWidget = (id: string) => {
    toast({
      description: `Editando widget ID: ${id}`,
    });
  };
  
  // Visualizar widget
  const handleVisualizarWidget = (id: string) => {
    toast({
      description: `Visualizando widget ID: ${id}`,
    });
  };
  
  // Criar novo widget
  const handleCriarWidget = (widget: any) => {
    const novoWidget = {
      id: (widgets.length + 1).toString(),
      ...widget,
      ativo: true,
      dataCriacao: new Date().toISOString().split('T')[0],
      desempenho: {
        impressoes: 0,
        cliques: 0
      }
    };
    
    setWidgets([novoWidget, ...widgets]);
    setMostrarForm(false);
    
    toast({
      title: "Sucesso",
      description: `O widget "${widget.nome}" foi criado com sucesso!`,
    });
  };
  
  // Cancelar criação
  const handleCancelarCriacaoWidget = () => {
    setMostrarForm(false);
  };

  return (
    <>
      <PageHeader 
        title="Widgets" 
        description="Crie widgets de prova social para o site da sua clínica."
      >
        <Button className="ml-auto" onClick={() => setMostrarForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Widget
        </Button>
      </PageHeader>
      
      <div className="p-6">
        {mostrarForm ? (
          <Card>
            <CardContent className="pt-6">
              <WidgetForm 
                onSave={handleCriarWidget}
                onCancel={handleCancelarCriacaoWidget}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-dashed border-2 cursor-pointer hover:border-primary hover:bg-gray-50" onClick={() => setMostrarForm(true)}>
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">Criar Novo Widget</h3>
                  <p className="text-gray-500 mt-2">Crie um widget para exibir avaliações no site da sua clínica</p>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widgets Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{widgets.filter(w => w.ativo).length}</div>
                  <div className="text-sm text-gray-500 mt-1">de {widgets.length} widgets criados</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total de Impressões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {widgets.reduce((sum, w) => sum + w.desempenho.impressoes, 0)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Cliques: {widgets.reduce((sum, w) => sum + w.desempenho.cliques, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-medium mb-4">Seus Widgets</h2>

            <div className="space-y-6">
              {widgets.map(widget => (
                <Card key={widget.id} className="overflow-hidden">
                  <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                      <Badge className={widget.ativo ? "bg-green-500" : "bg-gray-500"}>
                        {widget.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <div className="ml-3 space-x-2">
                        <Badge variant="outline">
                          {widget.tipo === "carrossel" ? "Carrossel" : 
                           widget.tipo === "badge" ? "Badge" : "Feed"}
                        </Badge>
                        <span className="text-sm text-gray-500">• Criado em {widget.dataCriacao}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditarWidget(widget.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> 
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleVisualizarWidget(widget.id)}
                      >
                        <Settings className="h-4 w-4 mr-1" /> 
                        Ver
                      </Button>
                    </div>
                  </div>
                  
                  <div className="px-4 py-4 border-t">
                    <h3 className="text-lg font-medium mb-2">{widget.nome}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700">Plataformas</h4>
                        <div className="flex flex-wrap gap-1">
                          {widget.plataformas.map(plataforma => (
                            <Badge 
                              key={plataforma} 
                              variant="outline"
                              className="bg-gray-50"
                            >
                              {plataforma}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700">Filtros</h4>
                        <div className="text-sm">
                          <p>Nota mínima: {widget.filtros.notaMinima}★</p>
                          <p>Máximo: {widget.filtros.maximo} avaliações</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700">Cores</h4>
                        <div className="flex gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ backgroundColor: widget.cores.primaria }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ backgroundColor: widget.cores.secundaria }}
                          />
                          {widget.cores.texto && (
                            <div 
                              className="w-6 h-6 rounded-full border" 
                              style={{ backgroundColor: widget.cores.texto }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">Desempenho</h4>
                      <div className="text-sm">
                        <p>Impressões: {widget.desempenho.impressoes.toLocaleString()}</p>
                        <p>Cliques: {widget.desempenho.cliques.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 border-t bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-mono text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto flex-1">
                        <code>&lt;script src="https://reputacaoviva.com.br/widgets/embed.js?id={widget.id}"&gt;&lt;/script&gt;</code>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0"
                        onClick={() => handleCopiarCodigo(widget.id)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
