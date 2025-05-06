
import { useState } from "react";
import { Boxes, Code, Plus, Copy, ExternalLink, Check, Monitor, Smartphone, Laptop, PanelLeft, Settings, ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Tipos
type WidgetTipo = "carrossel" | "badge" | "feed";
type WidgetStatus = "ativo" | "inativo";

interface Widget {
  id: string;
  nome: string;
  tipo: WidgetTipo;
  status: WidgetStatus;
  dataCriacao: string;
  personalizacao: {
    cores: {
      primaria: string;
      secundaria: string;
      texto: string;
      fundo: string;
    };
    fonte?: string;
    mostrarEstrelas: boolean;
    mostrarPlataforma: boolean;
    mostrarData: boolean;
    filtros: {
      plataformas: string[];
      notaMinima: number;
      maxAvaliacoes: number;
    };
  };
  estatisticas?: {
    impressoes: number;
    cliques: number;
  };
}

// Dados de exemplo
const widgetsExemplo: Widget[] = [
  {
    id: "1",
    nome: "Carrossel Principal Site",
    tipo: "carrossel",
    status: "ativo",
    dataCriacao: "2023-03-10",
    personalizacao: {
      cores: {
        primaria: "#28A745",
        secundaria: "#FFC107",
        texto: "#333333",
        fundo: "#FFFFFF"
      },
      fonte: "Inter",
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: false,
      filtros: {
        plataformas: ["google", "doctoralia"],
        notaMinima: 4,
        maxAvaliacoes: 10
      }
    },
    estatisticas: {
      impressoes: 1245,
      cliques: 87
    }
  },
  {
    id: "2",
    nome: "Badge Nota Média",
    tipo: "badge",
    status: "ativo",
    dataCriacao: "2023-03-15",
    personalizacao: {
      cores: {
        primaria: "#28A745",
        secundaria: "#FFC107",
        texto: "#FFFFFF",
        fundo: "#003366"
      },
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: false,
      filtros: {
        plataformas: ["google"],
        notaMinima: 1,
        maxAvaliacoes: 100
      }
    },
    estatisticas: {
      impressoes: 3560,
      cliques: 120
    }
  },
  {
    id: "3",
    nome: "Feed de Avaliações Página de Depoimentos",
    tipo: "feed",
    status: "ativo",
    dataCriacao: "2023-03-20",
    personalizacao: {
      cores: {
        primaria: "#007BFF",
        secundaria: "#FFC107",
        texto: "#333333",
        fundo: "#F8F9FA"
      },
      fonte: "Poppins",
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: true,
      filtros: {
        plataformas: ["google", "doctoralia", "facebook"],
        notaMinima: 5,
        maxAvaliacoes: 20
      }
    },
    estatisticas: {
      impressoes: 876,
      cliques: 43
    }
  }
];

// Componente de exemplo de Carrossel
const ExemploCarrossel = ({ cores }: { cores: Widget["personalizacao"]["cores"] }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4" style={{ backgroundColor: cores.fundo }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: cores.primaria }}>Avaliações de Pacientes</h3>
        </div>
        <div className="flex">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border mr-2" style={{ borderColor: cores.primaria }}>
            <PanelLeft size={14} style={{ color: cores.primaria }} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: cores.primaria }}>
            <ArrowRight size={14} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="border rounded p-3" style={{ borderColor: cores.secundaria }}>
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mr-0.5" style={{ color: cores.secundaria }}>★</div>
            ))}
          </div>
          <div className="text-xs" style={{ color: cores.texto }}>Google</div>
        </div>
        <p className="text-sm mb-2" style={{ color: cores.texto }}>
          "Excelente atendimento! O Dr. João foi muito atencioso e explicou todo o procedimento detalhadamente."
        </p>
        <p className="text-xs font-medium" style={{ color: cores.texto }}>Maria S.</p>
      </div>
      
      <div className="text-center mt-3">
        <span className="text-xs flex items-center justify-center" style={{ color: cores.primaria }}>
          Powered by <span className="font-bold ml-1">Reputação Viva</span>
        </span>
      </div>
    </div>
  );
};

// Componente de exemplo de Badge
const ExemploBadge = ({ cores }: { cores: Widget["personalizacao"]["cores"] }) => {
  return (
    <div className="inline-block rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="flex items-center p-3" style={{ backgroundColor: cores.primaria }}>
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mr-0.5 text-lg" style={{ color: cores.secundaria }}>★</div>
          ))}
        </div>
        <div className="text-sm font-bold" style={{ color: cores.texto }}>4.8/5</div>
      </div>
      <div className="p-2 text-xs text-center" style={{ backgroundColor: cores.fundo, color: cores.texto }}>
        Baseado em 243 avaliações
      </div>
    </div>
  );
};

// Componente de exemplo de Feed
const ExemploFeed = ({ cores }: { cores: Widget["personalizacao"]["cores"] }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4" style={{ backgroundColor: cores.fundo }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: cores.primaria }}>O que nossos pacientes dizem</h3>
      
      <div className="space-y-3">
        <div className="border-b pb-3" style={{ borderColor: `${cores.primaria}30` }}>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mr-0.5" style={{ color: cores.secundaria }}>★</div>
              ))}
            </div>
            <div className="text-xs" style={{ color: cores.texto }}>Google</div>
          </div>
          <p className="text-sm mb-1" style={{ color: cores.texto }}>
            "Clínica excelente! Recomendo a todos que buscam atendimento de qualidade."
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium" style={{ color: cores.texto }}>Carlos O.</p>
            <p className="text-xs" style={{ color: `${cores.texto}80` }}>01/03/2023</p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mr-0.5" style={{ color: cores.secundaria }}>★</div>
              ))}
            </div>
            <div className="text-xs" style={{ color: cores.texto }}>Doctoralia</div>
          </div>
          <p className="text-sm mb-1" style={{ color: cores.texto }}>
            "Profissionais muito competentes e ambiente super agradável. Super satisfeita com o resultado."
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium" style={{ color: cores.texto }}>Ana P.</p>
            <p className="text-xs" style={{ color: `${cores.texto}80` }}>28/02/2023</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-xs flex items-center justify-center" style={{ color: cores.primaria }}>
          Powered by <span className="font-bold ml-1">Reputação Viva</span>
        </span>
      </div>
    </div>
  );
};

// Componente de preview do widget
const WidgetPreview = ({ tipo, cores }: { tipo: WidgetTipo, cores: Widget["personalizacao"]["cores"] }) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button className="p-2 rounded-md bg-white border">
          <Monitor size={16} />
        </button>
        <button className="p-2 rounded-md bg-white border">
          <Laptop size={16} />
        </button>
        <button className="p-2 rounded-md bg-white border">
          <Smartphone size={16} />
        </button>
      </div>
      
      <div className="flex justify-center">
        {tipo === "carrossel" && <ExemploCarrossel cores={cores} />}
        {tipo === "badge" && <ExemploBadge cores={cores} />}
        {tipo === "feed" && <ExemploFeed cores={cores} />}
      </div>
    </div>
  );
};

// Componente de widget card
const WidgetCard = ({ widget }: { widget: Widget }) => {
  const tipoLabel = {
    carrossel: "Carrossel",
    badge: "Badge",
    feed: "Feed"
  };
  
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  
  const handleCopiarCodigo = () => {
    // Código de exemplo para o widget
    const codigo = `<script src="https://reputacaoviva.com.br/widgets/embed.js?id=${widget.id}"></script>`;
    navigator.clipboard.writeText(codigo);
    setCodigoCopiado(true);
    
    setTimeout(() => {
      setCodigoCopiado(false);
    }, 2000);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg font-medium">{widget.nome}</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <Badge className="mr-2" variant={widget.status === "ativo" ? "default" : "secondary"}>
                {widget.status === "ativo" ? "Ativo" : "Inativo"}
              </Badge>
              <span>{tipoLabel[widget.tipo]}</span>
              <span className="mx-2">•</span>
              <span className="text-sm">Criado em {formatarData(widget.dataCriacao)}</span>
            </CardDescription>
          </div>
          <div>
            <Button variant="outline" size="sm" className="mr-2">
              <Settings className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="default" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Plataformas</h4>
            <div className="flex flex-wrap mt-1">
              {widget.personalizacao.filtros.plataformas.map((plataforma, index) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1">
                  {plataforma === "google" ? "Google" : 
                   plataforma === "doctoralia" ? "Doctoralia" : "Facebook"}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Filtros</h4>
            <p className="text-sm mt-1">
              Nota mínima: {widget.personalizacao.filtros.notaMinima}★
              <br />
              Máximo: {widget.personalizacao.filtros.maxAvaliacoes} avaliações
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Cores</h4>
            <div className="flex mt-1">
              <div className="w-6 h-6 rounded-full mr-1" style={{ backgroundColor: widget.personalizacao.cores.primaria }}></div>
              <div className="w-6 h-6 rounded-full mr-1" style={{ backgroundColor: widget.personalizacao.cores.secundaria }}></div>
              <div className="w-6 h-6 rounded-full mr-1 border" style={{ backgroundColor: widget.personalizacao.cores.fundo }}></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Desempenho</h4>
            <p className="text-sm mt-1">
              {widget.estatisticas ? (
                <>
                  Impressões: {widget.estatisticas.impressoes}
                  <br />
                  Cliques: {widget.estatisticas.cliques}
                </>
              ) : (
                "Sem dados"
              )}
            </p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium">Código de Instalação</h4>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {`<script src="https://reputacaoviva.com.br/widgets/embed.js?id=${widget.id}"></script>`}
              </pre>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopiarCodigo}
              className="ml-4"
            >
              {codigoCopiado ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal da página
export default function Widgets() {
  const [widgets, setWidgets] = useState<Widget[]>(widgetsExemplo);
  const [criandoWidget, setCriandoWidget] = useState(false);
  const [novoWidget, setNovoWidget] = useState<Partial<Widget>>({
    nome: "",
    tipo: "carrossel",
    personalizacao: {
      cores: {
        primaria: "#28A745",
        secundaria: "#FFC107",
        texto: "#333333",
        fundo: "#FFFFFF"
      },
      mostrarEstrelas: true,
      mostrarPlataforma: true,
      mostrarData: false,
      filtros: {
        plataformas: ["google", "doctoralia"],
        notaMinima: 4,
        maxAvaliacoes: 10
      }
    }
  });

  const handleCriarWidget = () => {
    setCriandoWidget(true);
  };

  const handleCancelarCriacao = () => {
    setCriandoWidget(false);
  };

  const handleSalvarWidget = () => {
    const novoId = `${widgets.length + 1}`;
    const widgetCompleto: Widget = {
      id: novoId,
      nome: novoWidget.nome || `Novo Widget ${novoId}`,
      tipo: novoWidget.tipo as WidgetTipo || "carrossel",
      status: "ativo",
      dataCriacao: new Date().toISOString().split('T')[0],
      personalizacao: novoWidget.personalizacao as Widget["personalizacao"]
    };
    
    setWidgets([...widgets, widgetCompleto]);
    setCriandoWidget(false);
    setNovoWidget({
      nome: "",
      tipo: "carrossel",
      personalizacao: {
        cores: {
          primaria: "#28A745",
          secundaria: "#FFC107",
          texto: "#333333",
          fundo: "#FFFFFF"
        },
        mostrarEstrelas: true,
        mostrarPlataforma: true,
        mostrarData: false,
        filtros: {
          plataformas: ["google", "doctoralia"],
          notaMinima: 4,
          maxAvaliacoes: 10
        }
      }
    });
  };

  const handleUpdateNovoWidget = (campo: string, valor: any) => {
    setNovoWidget(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleUpdateCores = (campo: string, valor: string) => {
    setNovoWidget(prev => ({
      ...prev,
      personalizacao: {
        ...prev.personalizacao!,
        cores: {
          ...prev.personalizacao!.cores,
          [campo]: valor
        }
      }
    }));
  };

  const handleUpdateFiltros = (campo: string, valor: any) => {
    setNovoWidget(prev => ({
      ...prev,
      personalizacao: {
        ...prev.personalizacao!,
        filtros: {
          ...prev.personalizacao!.filtros,
          [campo]: valor
        }
      }
    }));
  };

  return (
    <>
      <PageHeader 
        title="Widgets" 
        description="Crie widgets de prova social para o site da sua clínica."
      >
        <Button 
          onClick={handleCriarWidget}
          disabled={criandoWidget}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Widget
        </Button>
      </PageHeader>
      
      <div className="p-6">
        {criandoWidget ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Criar Novo Widget</CardTitle>
              <CardDescription>
                Personalize e configure seu widget de prova social
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="nome" className="mb-2 block">Nome do Widget</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Carrossel para Homepage"
                  value={novoWidget.nome}
                  onChange={(e) => handleUpdateNovoWidget('nome', e.target.value)}
                  className="w-full max-w-md"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Tipo de Widget</h3>
                <RadioGroup 
                  value={novoWidget.tipo} 
                  onValueChange={(value) => handleUpdateNovoWidget('tipo', value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="carrossel" id="tipo-carrossel" />
                    <div>
                      <Label htmlFor="tipo-carrossel" className="font-medium">Carrossel</Label>
                      <p className="text-sm text-gray-500 mt-1">Exibe avaliações em um carrossel deslizante</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="badge" id="tipo-badge" />
                    <div>
                      <Label htmlFor="tipo-badge" className="font-medium">Badge</Label>
                      <p className="text-sm text-gray-500 mt-1">Exibe nota média e número de avaliações em formato compacto</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="feed" id="tipo-feed" />
                    <div>
                      <Label htmlFor="tipo-feed" className="font-medium">Feed</Label>
                      <p className="text-sm text-gray-500 mt-1">Lista de avaliações em formato vertical</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Tabs defaultValue="personalizacao" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="personalizacao">Personalização</TabsTrigger>
                      <TabsTrigger value="filtros">Filtros</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personalizacao" className="pt-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium mb-3">Cores</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cor-primaria" className="text-xs mb-1 block">Cor Primária</Label>
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 rounded-md mr-2 border"
                                  style={{ backgroundColor: novoWidget.personalizacao?.cores.primaria }}
                                ></div>
                                <Input
                                  id="cor-primaria"
                                  type="text"
                                  value={novoWidget.personalizacao?.cores.primaria}
                                  onChange={(e) => handleUpdateCores('primaria', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cor-secundaria" className="text-xs mb-1 block">Cor Secundária</Label>
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 rounded-md mr-2 border"
                                  style={{ backgroundColor: novoWidget.personalizacao?.cores.secundaria }}
                                ></div>
                                <Input
                                  id="cor-secundaria"
                                  type="text"
                                  value={novoWidget.personalizacao?.cores.secundaria}
                                  onChange={(e) => handleUpdateCores('secundaria', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cor-texto" className="text-xs mb-1 block">Cor do Texto</Label>
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 rounded-md mr-2 border"
                                  style={{ backgroundColor: novoWidget.personalizacao?.cores.texto }}
                                ></div>
                                <Input
                                  id="cor-texto"
                                  type="text"
                                  value={novoWidget.personalizacao?.cores.texto}
                                  onChange={(e) => handleUpdateCores('texto', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cor-fundo" className="text-xs mb-1 block">Cor de Fundo</Label>
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 rounded-md mr-2 border"
                                  style={{ backgroundColor: novoWidget.personalizacao?.cores.fundo }}
                                ></div>
                                <Input
                                  id="cor-fundo"
                                  type="text"
                                  value={novoWidget.personalizacao?.cores.fundo}
                                  onChange={(e) => handleUpdateCores('fundo', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium mb-3">Exibição</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="mostrar-estrelas">Mostrar estrelas</Label>
                              <Switch 
                                id="mostrar-estrelas" 
                                checked={novoWidget.personalizacao?.mostrarEstrelas}
                                onCheckedChange={(checked) => {
                                  setNovoWidget(prev => ({
                                    ...prev,
                                    personalizacao: {
                                      ...prev.personalizacao!,
                                      mostrarEstrelas: checked
                                    }
                                  }));
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="mostrar-plataforma">Mostrar plataforma</Label>
                              <Switch 
                                id="mostrar-plataforma"
                                checked={novoWidget.personalizacao?.mostrarPlataforma}
                                onCheckedChange={(checked) => {
                                  setNovoWidget(prev => ({
                                    ...prev,
                                    personalizacao: {
                                      ...prev.personalizacao!,
                                      mostrarPlataforma: checked
                                    }
                                  }));
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="mostrar-data">Mostrar data</Label>
                              <Switch 
                                id="mostrar-data"
                                checked={novoWidget.personalizacao?.mostrarData}
                                onCheckedChange={(checked) => {
                                  setNovoWidget(prev => ({
                                    ...prev,
                                    personalizacao: {
                                      ...prev.personalizacao!,
                                      mostrarData: checked
                                    }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="filtros" className="pt-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium mb-3">Plataformas</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge 
                              variant={novoWidget.personalizacao?.filtros.plataformas.includes("google") ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const plataformas = [...(novoWidget.personalizacao?.filtros.plataformas || [])];
                                const index = plataformas.indexOf("google");
                                if (index > -1) {
                                  plataformas.splice(index, 1);
                                } else {
                                  plataformas.push("google");
                                }
                                handleUpdateFiltros('plataformas', plataformas);
                              }}
                            >
                              Google
                            </Badge>
                            <Badge 
                              variant={novoWidget.personalizacao?.filtros.plataformas.includes("doctoralia") ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const plataformas = [...(novoWidget.personalizacao?.filtros.plataformas || [])];
                                const index = plataformas.indexOf("doctoralia");
                                if (index > -1) {
                                  plataformas.splice(index, 1);
                                } else {
                                  plataformas.push("doctoralia");
                                }
                                handleUpdateFiltros('plataformas', plataformas);
                              }}
                            >
                              Doctoralia
                            </Badge>
                            <Badge 
                              variant={novoWidget.personalizacao?.filtros.plataformas.includes("facebook") ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const plataformas = [...(novoWidget.personalizacao?.filtros.plataformas || [])];
                                const index = plataformas.indexOf("facebook");
                                if (index > -1) {
                                  plataformas.splice(index, 1);
                                } else {
                                  plataformas.push("facebook");
                                }
                                handleUpdateFiltros('plataformas', plataformas);
                              }}
                            >
                              Facebook
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium mb-3">Nota Mínima</h3>
                          <Select 
                            value={String(novoWidget.personalizacao?.filtros.notaMinima)} 
                            onValueChange={(value) => handleUpdateFiltros('notaMinima', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a nota mínima" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 estrela ou mais</SelectItem>
                              <SelectItem value="2">2 estrelas ou mais</SelectItem>
                              <SelectItem value="3">3 estrelas ou mais</SelectItem>
                              <SelectItem value="4">4 estrelas ou mais</SelectItem>
                              <SelectItem value="5">5 estrelas apenas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-3">Número Máximo de Avaliações</h3>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={novoWidget.personalizacao?.filtros.maxAvaliacoes}
                            onChange={(e) => handleUpdateFiltros('maxAvaliacoes', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Preview</h3>
                  {novoWidget.tipo && novoWidget.personalizacao && (
                    <WidgetPreview 
                      tipo={novoWidget.tipo as WidgetTipo} 
                      cores={novoWidget.personalizacao.cores}
                    />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancelarCriacao}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarWidget}>
                Salvar Widget
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-dashed border-2 border-gray-300 cursor-pointer hover:border-primary hover:bg-gray-50" onClick={handleCriarWidget}>
                <CardContent className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Criar Novo Widget</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Crie um widget para exibir avaliações no site da sua clínica
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Widgets Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand">{widgets.filter(w => w.status === "ativo").length}</div>
                  <p className="text-sm text-gray-500 mt-1">de {widgets.length} widgets criados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total de Impressões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand">
                    {widgets.reduce((acc, curr) => acc + (curr.estatisticas?.impressoes || 0), 0)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Cliques: {widgets.reduce((acc, curr) => acc + (curr.estatisticas?.cliques || 0), 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Seus Widgets</h2>
              </div>
              
              <div className="p-4">
                {widgets.map(widget => (
                  <WidgetCard key={widget.id} widget={widget} />
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajuda e Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                      <Code className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-medium">Guia de Instalação</h3>
                      <p className="text-sm text-gray-500 mt-1">Aprenda a instalar os widgets em seu site</p>
                    </div>
                    <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                      <Settings className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-medium">Personalizações Avançadas</h3>
                      <p className="text-sm text-gray-500 mt-1">Opções adicionais para personalizar seus widgets</p>
                    </div>
                    <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                      <ExternalLink className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-medium">Exemplos e Inspirações</h3>
                      <p className="text-sm text-gray-500 mt-1">Veja como outras clínicas usam os widgets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
