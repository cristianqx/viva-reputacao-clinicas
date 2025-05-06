
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageHeader from "@/components/layout/PageHeader";
import { User, Mail, Calendar, CreditCard, Download, ChevronRight, Plus, SquarePen, Lock, Shield, Bell, HelpCircle, Building } from "lucide-react";

interface Plano {
  id: string;
  nome: string;
  preco: number;
  periodo: string;
  recursos: string[];
  limitacoes: string[];
  recomendado?: boolean;
}

interface FormaPagamento {
  id: string;
  tipo: "cartao" | "boleto";
  detalhes: string;
  principal: boolean;
}

interface Recibo {
  id: string;
  data: string;
  valor: number;
  status: "pago" | "pendente" | "cancelado";
  referencia: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  dataRegistro: string;
  ultimoAcesso: string;
  permissoes: {
    administrador: boolean;
    gerenciarUsuarios: boolean;
    gerenciarCampanhas: boolean;
    gerenciarWidgets: boolean;
    responderAvaliacoes: boolean;
  };
  status: "ativo" | "pendente" | "inativo";
}

const planosDisponiveis: Plano[] = [
  {
    id: "plano-essencial",
    nome: "Essencial",
    preco: 149.90,
    periodo: "mês",
    recursos: [
      "Até 3 plataformas",
      "Até 200 contatos",
      "Captação de avaliações",
      "Widget de site básico",
      "Suporte via e-mail"
    ],
    limitacoes: [
      "Limite de 3 usuários",
      "Sem campanhas automatizadas",
      "Sem integração com sistema odontológico"
    ]
  },
  {
    id: "plano-profissional",
    nome: "Profissional",
    preco: 299.90,
    periodo: "mês",
    recursos: [
      "Até 6 plataformas",
      "Até 1000 contatos",
      "Captação de avaliações",
      "Widgets avançados",
      "Campanhas automatizadas",
      "Suporte via e-mail e chat",
      "Integrações básicas"
    ],
    limitacoes: [
      "Limite de 10 usuários",
      "API limitada"
    ],
    recomendado: true
  },
  {
    id: "plano-empresarial",
    nome: "Empresarial",
    preco: 499.90,
    periodo: "mês",
    recursos: [
      "Plataformas ilimitadas",
      "Contatos ilimitados",
      "Captação de avaliações",
      "Widgets personalizados",
      "Campanhas avançadas",
      "Suporte prioritário",
      "Integrações avançadas",
      "API completa",
      "Usuários ilimitados"
    ],
    limitacoes: []
  }
];

const formasPagamentoExemplo: FormaPagamento[] = [
  {
    id: "cartao-1",
    tipo: "cartao",
    detalhes: "•••• •••• •••• 5412 | Mastercard | Expira em 12/2025",
    principal: true
  },
  {
    id: "boleto-1",
    tipo: "boleto",
    detalhes: "Boleto bancário com vencimento todo dia 10",
    principal: false
  }
];

const recibosExemplo: Recibo[] = [
  {
    id: "rec-001",
    data: "2023-04-10",
    valor: 299.90,
    status: "pago",
    referencia: "REF-2023-04"
  },
  {
    id: "rec-002",
    data: "2023-03-10",
    valor: 299.90,
    status: "pago",
    referencia: "REF-2023-03"
  },
  {
    id: "rec-003",
    data: "2023-02-10",
    valor: 299.90,
    status: "pago",
    referencia: "REF-2023-02"
  },
  {
    id: "rec-004",
    data: "2023-01-10",
    valor: 149.90,
    status: "pago",
    referencia: "REF-2023-01"
  }
];

const usuariosExemplo: Usuario[] = [
  {
    id: "user-1",
    nome: "Administrador",
    email: "admin@clinicadental.com.br",
    cargo: "Administrador",
    dataRegistro: "2022-01-15",
    ultimoAcesso: "2023-04-15",
    permissoes: {
      administrador: true,
      gerenciarUsuarios: true,
      gerenciarCampanhas: true,
      gerenciarWidgets: true,
      responderAvaliacoes: true
    },
    status: "ativo"
  },
  {
    id: "user-2",
    nome: "Maria Silva",
    email: "maria@clinicadental.com.br",
    cargo: "Recepcionista",
    dataRegistro: "2022-02-10",
    ultimoAcesso: "2023-04-14",
    permissoes: {
      administrador: false,
      gerenciarUsuarios: false,
      gerenciarCampanhas: true,
      gerenciarWidgets: false,
      responderAvaliacoes: true
    },
    status: "ativo"
  },
  {
    id: "user-3",
    nome: "João Santos",
    email: "joao@clinicadental.com.br",
    cargo: "Dentista",
    dataRegistro: "2022-03-05",
    ultimoAcesso: "2023-04-10",
    permissoes: {
      administrador: false,
      gerenciarUsuarios: false,
      gerenciarCampanhas: false,
      gerenciarWidgets: false,
      responderAvaliacoes: true
    },
    status: "ativo"
  },
  {
    id: "user-4",
    nome: "Ana Oliveira",
    email: "ana@clinicadental.com.br",
    cargo: "Marketing",
    dataRegistro: "2022-10-20",
    ultimoAcesso: "2023-04-13",
    permissoes: {
      administrador: false,
      gerenciarUsuarios: false,
      gerenciarCampanhas: true,
      gerenciarWidgets: true,
      responderAvaliacoes: true
    },
    status: "ativo"
  },
  {
    id: "user-5",
    nome: "Carlos Pereira",
    email: "carlos@clinicadental.com.br",
    cargo: "Gerente",
    dataRegistro: "2023-01-05",
    ultimoAcesso: "2023-04-12",
    permissoes: {
      administrador: false,
      gerenciarUsuarios: true,
      gerenciarCampanhas: true,
      gerenciarWidgets: true,
      responderAvaliacoes: true
    },
    status: "pendente"
  }
];

export default function Configuracoes() {
  const [planoAtual, setPlanoAtual] = useState(planosDisponiveis[1]); // Plano Profissional
  const [formasPagamento, setFormasPagamento] = useState(formasPagamentoExemplo);
  const [recibos, setRecibos] = useState(recibosExemplo);
  const [usuarios, setUsuarios] = useState(usuariosExemplo);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);
  const [modalConvidarUsuario, setModalConvidarUsuario] = useState(false);
  const [modalMudarPlano, setModalMudarPlano] = useState(false);
  const [modalEditarPagamento, setModalEditarPagamento] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [cargoConvite, setCargoConvite] = useState("");
  const [permissoesConvite, setPermissoesConvite] = useState({
    administrador: false,
    gerenciarUsuarios: false,
    gerenciarCampanhas: false,
    gerenciarWidgets: false,
    responderAvaliacoes: true
  });
  const [visualizandoRecibo, setVisualizandoRecibo] = useState<Recibo | null>(null);
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const editarUsuario = (usuario: Usuario) => {
    setEditandoUsuario({...usuario});
    setModalEditarUsuario(true);
  };
  
  const salvarEdicaoUsuario = () => {
    if (!editandoUsuario) return;
    
    setUsuarios(usuarios.map(u => 
      u.id === editandoUsuario.id ? editandoUsuario : u
    ));
    
    setModalEditarUsuario(false);
    setEditandoUsuario(null);
  };
  
  const convidarUsuario = () => {
    if (!emailConvite || !cargoConvite) return;
    
    const novoUsuario: Usuario = {
      id: `user-${Date.now()}`,
      nome: emailConvite.split('@')[0], // Temporário até o usuário completar o cadastro
      email: emailConvite,
      cargo: cargoConvite,
      dataRegistro: new Date().toISOString().split('T')[0],
      ultimoAcesso: "",
      permissoes: {...permissoesConvite},
      status: "pendente"
    };
    
    setUsuarios([...usuarios, novoUsuario]);
    setModalConvidarUsuario(false);
    setEmailConvite("");
    setCargoConvite("");
    setPermissoesConvite({
      administrador: false,
      gerenciarUsuarios: false,
      gerenciarCampanhas: false,
      gerenciarWidgets: false,
      responderAvaliacoes: true
    });
  };
  
  const atualizarPermissao = (permissao: keyof Usuario['permissoes'], valor: boolean) => {
    if (editandoUsuario) {
      setEditandoUsuario({
        ...editandoUsuario,
        permissoes: {
          ...editandoUsuario.permissoes,
          [permissao]: valor
        }
      });
    }
  };
  
  const atualizarPermissaoConvite = (permissao: keyof Usuario['permissoes'], valor: boolean) => {
    setPermissoesConvite({
      ...permissoesConvite,
      [permissao]: valor
    });
  };
  
  const visualizarRecibo = (recibo: Recibo) => {
    setVisualizandoRecibo(recibo);
    // Em uma aplicação real, isso abriria um PDF ou redirecionaria para uma página de detalhes
    window.open(`#recibo-${recibo.id}`, '_blank');
  };
  
  return (
    <>
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas configurações, plano e usuários."
      />
      
      <div className="p-6">
        <Tabs defaultValue="conta">
          <div className="mb-6">
            <TabsList className="grid w-full max-w-3xl grid-cols-4">
              <TabsTrigger value="conta">Conta</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
              <TabsTrigger value="ajuda">Ajuda</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Aba de Conta */}
          <TabsContent value="conta">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil da Clínica</CardTitle>
                  <CardDescription>
                    Informações básicas sobre sua clínica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-white">CD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">Clínica Dental</h3>
                      <p className="text-sm text-gray-500">São Paulo, SP</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-clinica">Nome da clínica</Label>
                      <Input id="nome-clinica" defaultValue="Clínica Dental" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input id="endereco" defaultValue="Av. Paulista, 1000 - Bela Vista" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" defaultValue="São Paulo" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input id="estado" defaultValue="SP" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" defaultValue="(11) 3456-7890" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email-contato">Email de contato</Label>
                      <Input id="email-contato" defaultValue="contato@clinicadental.com.br" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button>Salvar alterações</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>
                    Conecte-se com outras plataformas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Facebook</h3>
                          <p className="text-sm text-gray-500">Conectar página da clínica</p>
                        </div>
                      </div>
                      <Button variant="outline">Conectar</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Google</h3>
                          <p className="text-sm text-gray-500">Conectar perfil do Google Business</p>
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Conectado
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">LinkedIn</h3>
                          <p className="text-sm text-gray-500">Conectar página da empresa</p>
                        </div>
                      </div>
                      <Button variant="outline">Conectar</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Sistema Odontológico</h3>
                          <p className="text-sm text-gray-500">Integrar com seu sistema de gestão</p>
                        </div>
                      </div>
                      <Button>Configurar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure como deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email</Label>
                        <p className="text-sm text-gray-500">
                          Receber notificações por email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-novas-avaliacoes" className="flex items-center text-sm">
                          Novas avaliações
                        </Label>
                        <Switch id="email-novas-avaliacoes" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-relatorios" className="flex items-center text-sm">
                          Relatórios semanais
                        </Label>
                        <Switch id="email-relatorios" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-campanhas" className="flex items-center text-sm">
                          Campanhas enviadas
                        </Label>
                        <Switch id="email-campanhas" defaultChecked />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Navegador</Label>
                        <p className="text-sm text-gray-500">
                          Notificações no navegador
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="browser-avaliacoes-negativas" className="flex items-center text-sm">
                          Avaliações negativas
                        </Label>
                        <Switch id="browser-avaliacoes-negativas" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="browser-lembretes" className="flex items-center text-sm">
                          Lembretes de tarefas
                        </Label>
                        <Switch id="browser-lembretes" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button>Salvar preferências</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Aba de Usuários */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuários e Permissões</CardTitle>
                  <CardDescription>
                    Gerencie os usuários que têm acesso ao sistema
                  </CardDescription>
                </div>
                <Button onClick={() => setModalConvidarUsuario(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Convidar usuário
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuarios.map(usuario => (
                    <div 
                      key={usuario.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => editarUsuario(usuario)}
                    >
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white">
                            {usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{usuario.nome}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="mr-1 h-3 w-3" />
                            {usuario.email}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {usuario.cargo}
                            </Badge>
                            {usuario.status === "ativo" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                Ativo
                              </Badge>
                            ) : usuario.status === "pendente" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                                Pendente
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
                          e.stopPropagation();
                          editarUsuario(usuario);
                        }}>
                          Editar
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Faturamento */}
          <TabsContent value="faturamento">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                  <CardDescription>
                    Informações sobre seu plano e faturamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium">{planoAtual.nome}</h3>
                          {planoAtual.recomendado && (
                            <Badge className="bg-primary">Recomendado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Renovação automática em 10/05/2023
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          R$ {planoAtual.preco.toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">/{planoAtual.periodo}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Recursos incluídos:</h4>
                      <ul className="ml-5 space-y-1 list-disc text-sm">
                        {planoAtual.recursos.map((recurso, index) => (
                          <li key={index}>{recurso}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Limitações:</h4>
                      {planoAtual.limitacoes.length > 0 ? (
                        <ul className="ml-5 space-y-1 list-disc text-sm">
                          {planoAtual.limitacoes.map((limitacao, index) => (
                            <li key={index}>{limitacao}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">Sem limitações neste plano.</p>
                      )}
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => setModalMudarPlano(true)}>
                        Atualizar plano
                      </Button>
                      <Button variant="outline">
                        Ver detalhes do plano
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>
                    Gerencie suas formas de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formasPagamento.map(forma => (
                      <div key={forma.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          {forma.tipo === "cartao" ? (
                            <CreditCard className="h-5 w-5 mr-4 text-gray-500" />
                          ) : (
                            <svg className="h-5 w-5 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                          <div>
                            <p className="font-medium">
                              {forma.tipo === "cartao" ? "Cartão de Crédito" : "Boleto Bancário"}
                              {forma.principal && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                                  Principal
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{forma.detalhes}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setModalEditarPagamento(true)}>
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="mt-4 w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar forma de pagamento
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>
                    Veja seus recibos e histórico de pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left font-medium">Data</th>
                          <th className="px-4 py-3 text-left font-medium">Referência</th>
                          <th className="px-4 py-3 text-left font-medium">Valor</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Recibo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recibos.map(recibo => (
                          <tr key={recibo.id} className="border-b last:border-0">
                            <td className="px-4 py-3">{formatarData(recibo.data)}</td>
                            <td className="px-4 py-3">{recibo.referencia}</td>
                            <td className="px-4 py-3">R$ {recibo.valor.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={
                                recibo.status === "pago" 
                                  ? "bg-green-50 text-green-700" 
                                  : recibo.status === "pendente"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                              }>
                                {recibo.status === "pago" ? "Pago" : 
                                 recibo.status === "pendente" ? "Pendente" : "Cancelado"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => visualizarRecibo(recibo)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Visualizar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Aba de Ajuda */}
          <TabsContent value="ajuda">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Central de Ajuda</CardTitle>
                  <CardDescription>
                    Encontre respostas para suas dúvidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <Input
                        className="pl-10"
                        placeholder="Buscar por dúvidas frequentes..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Como adicionar mais usuários à minha conta?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-500 mt-1">
                            Vá para Configurações {"->"} Usuários e Permissões e clique em "Convidar usuário". Depende do seu plano.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Como posso integrar o widget ao meu site?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-500 mt-1">
                            Acesse a seção "Widgets", escolha o widget desejado e clique em "Obter código para o site". Copie o código HTML fornecido e adicione-o ao seu site.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Como importar contatos de pacientes?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-500 mt-1">
                            Na seção "Contatos", clique no botão "Importar" e siga as instruções. Você pode importar arquivos CSV ou Excel com seus dados de pacientes.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>É possível integrar com meu sistema odontológico?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-500 mt-1">
                            Sim! Temos integrações com os principais sistemas odontológicos do mercado. Vá para "Configurações {'>'} Conta {'>'} Integrações" para configurar.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Como criar campanhas automáticas?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-500 mt-1">
                            Acesse a seção "Campanhas", clique em "Nova Campanha" e escolha a opção "Disparo automático". Você pode configurar gatilhos como aniversários, pós-consulta, etc.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Suporte</CardTitle>
                  <CardDescription>
                    Entre em contato com nossa equipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <HelpCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Central de Ajuda</h3>
                          <p className="text-sm text-gray-500">
                            Acesse nossa base de conhecimento completa
                          </p>
                        </div>
                        <Button variant="ghost" className="ml-auto">Acessar</Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Chat ao Vivo</h3>
                          <p className="text-sm text-gray-500">
                            Converse com um especialista em tempo real
                          </p>
                        </div>
                        <Badge className="ml-auto">Online</Badge>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">E-mail</h3>
                          <p className="text-sm text-gray-500">
                            suporte@reputacaoviva.com.br
                          </p>
                        </div>
                        <Button variant="ghost" className="ml-auto">Enviar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Gerencie as configurações de segurança da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Autenticação em duas etapas</h3>
                          <p className="text-sm text-gray-500">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Atividade da conta</h3>
                          <p className="text-sm text-gray-500">
                            Monitore acessos e atividades na sua conta
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost">Ver histórico</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Alertas de segurança</h3>
                          <p className="text-sm text-gray-500">
                            Receba alertas sobre atividades suspeitas
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal de Editar Usuário */}
      <Dialog open={modalEditarUsuario} onOpenChange={setModalEditarUsuario}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Edite informações e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          
          {editandoUsuario && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {editandoUsuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{editandoUsuario.nome}</h3>
                  <p className="text-sm text-gray-500">{editandoUsuario.email}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input 
                  id="cargo" 
                  value={editandoUsuario.cargo}
                  onChange={(e) => setEditandoUsuario({...editandoUsuario, cargo: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editandoUsuario.status} 
                  onValueChange={(value: "ativo" | "pendente" | "inativo") => 
                    setEditandoUsuario({...editandoUsuario, status: value})
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2 pt-2">
                <Label>Permissões</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-admin" className="flex items-center cursor-pointer">
                      <span>Administrador do sistema</span>
                    </Label>
                    <Switch 
                      id="perm-admin" 
                      checked={editandoUsuario.permissoes.administrador}
                      onCheckedChange={(checked) => atualizarPermissao("administrador", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-usuarios" className="flex items-center cursor-pointer">
                      <span>Gerenciar usuários</span>
                    </Label>
                    <Switch 
                      id="perm-usuarios" 
                      checked={editandoUsuario.permissoes.gerenciarUsuarios}
                      onCheckedChange={(checked) => atualizarPermissao("gerenciarUsuarios", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-campanhas" className="flex items-center cursor-pointer">
                      <span>Gerenciar campanhas</span>
                    </Label>
                    <Switch 
                      id="perm-campanhas" 
                      checked={editandoUsuario.permissoes.gerenciarCampanhas}
                      onCheckedChange={(checked) => atualizarPermissao("gerenciarCampanhas", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-widgets" className="flex items-center cursor-pointer">
                      <span>Gerenciar widgets</span>
                    </Label>
                    <Switch 
                      id="perm-widgets" 
                      checked={editandoUsuario.permissoes.gerenciarWidgets}
                      onCheckedChange={(checked) => atualizarPermissao("gerenciarWidgets", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-avaliacoes" className="flex items-center cursor-pointer">
                      <span>Responder avaliações</span>
                    </Label>
                    <Switch 
                      id="perm-avaliacoes" 
                      checked={editandoUsuario.permissoes.responderAvaliacoes}
                      onCheckedChange={(checked) => atualizarPermissao("responderAvaliacoes", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setModalEditarUsuario(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={salvarEdicaoUsuario}>
              Salvar alterações
            </Button>
            <Button variant="destructive" className="sm:ml-auto">
              Remover usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Convidar Usuário */}
      <Dialog open={modalConvidarUsuario} onOpenChange={setModalConvidarUsuario}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Envie um convite para um novo usuário acessar o sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-convite">E-mail *</Label>
              <Input 
                id="email-convite" 
                type="email" 
                placeholder="email@exemplo.com"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cargo-convite">Cargo *</Label>
              <Input 
                id="cargo-convite" 
                placeholder="Ex: Gerente, Recepcionista, etc."
                value={cargoConvite}
                onChange={(e) => setCargoConvite(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2 pt-2">
              <Label>Permissões</Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="conv-admin" className="flex items-center cursor-pointer">
                    <span>Administrador do sistema</span>
                  </Label>
                  <Switch 
                    id="conv-admin" 
                    checked={permissoesConvite.administrador}
                    onCheckedChange={(checked) => atualizarPermissaoConvite("administrador", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="conv-usuarios" className="flex items-center cursor-pointer">
                    <span>Gerenciar usuários</span>
                  </Label>
                  <Switch 
                    id="conv-usuarios" 
                    checked={permissoesConvite.gerenciarUsuarios}
                    onCheckedChange={(checked) => atualizarPermissaoConvite("gerenciarUsuarios", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="conv-campanhas" className="flex items-center cursor-pointer">
                    <span>Gerenciar campanhas</span>
                  </Label>
                  <Switch 
                    id="conv-campanhas" 
                    checked={permissoesConvite.gerenciarCampanhas}
                    onCheckedChange={(checked) => atualizarPermissaoConvite("gerenciarCampanhas", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="conv-widgets" className="flex items-center cursor-pointer">
                    <span>Gerenciar widgets</span>
                  </Label>
                  <Switch 
                    id="conv-widgets" 
                    checked={permissoesConvite.gerenciarWidgets}
                    onCheckedChange={(checked) => atualizarPermissaoConvite("gerenciarWidgets", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="conv-avaliacoes" className="flex items-center cursor-pointer">
                    <span>Responder avaliações</span>
                  </Label>
                  <Switch 
                    id="conv-avaliacoes" 
                    checked={permissoesConvite.responderAvaliacoes}
                    onCheckedChange={(checked) => atualizarPermissaoConvite("responderAvaliacoes", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalConvidarUsuario(false)}>
              Cancelar
            </Button>
            <Button 
              variant="default" 
              onClick={convidarUsuario}
              disabled={!emailConvite || !cargoConvite}
            >
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Mudar Plano */}
      <Dialog open={modalMudarPlano} onOpenChange={setModalMudarPlano}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Escolha seu Plano</DialogTitle>
            <DialogDescription>
              Selecione o plano mais adequado para sua clínica
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {planosDisponiveis.map((plano) => (
                <div
                  key={plano.id}
                  className={`relative rounded-lg border p-4 transition-all hover:shadow ${
                    plano.id === planoAtual.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : ""
                  } ${plano.recomendado ? "border-primary" : ""}`}
                >
                  {plano.recomendado && (
                    <Badge className="absolute -top-2 right-4 bg-primary">
                      Recomendado
                    </Badge>
                  )}
                  
                  <h3 className="text-lg font-medium">{plano.nome}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">
                      R$ {plano.preco.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">/{plano.periodo}</span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <ul className="space-y-2 text-sm">
                      {plano.recursos.map((recurso, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{recurso}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plano.limitacoes.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {plano.limitacoes.map((limitacao, i) => (
                          <li key={i} className="flex items-start text-gray-500">
                            <svg
                              className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{limitacao}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      variant={plano.id === planoAtual.id ? "outline" : "default"}
                      className="w-full"
                      onClick={() => {
                        setPlanoAtual(plano);
                        setModalMudarPlano(false);
                      }}
                    >
                      {plano.id === planoAtual.id ? "Plano Atual" : "Selecionar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Precisa de um plano personalizado?
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Entre em contato com nossa equipe para uma oferta sob medida para sua clínica.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalMudarPlano(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Editar Forma de Pagamento */}
      <Dialog open={modalEditarPagamento} onOpenChange={setModalEditarPagamento}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Forma de Pagamento</DialogTitle>
            <DialogDescription>
              Atualize suas informações de pagamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tipo-pagamento">Tipo de pagamento</Label>
              <Select defaultValue="cartao">
                <SelectTrigger id="tipo-pagamento">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  <SelectItem value="boleto">Boleto Bancário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="numero-cartao">Número do cartão</Label>
              <Input id="numero-cartao" placeholder="•••• •••• •••• ••••" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="validade">Validade</Label>
                <Input id="validade" placeholder="MM/AA" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="titular">Nome do titular</Label>
              <Input id="titular" placeholder="Como está no cartão" />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="pagamento-principal" defaultChecked />
              <Label htmlFor="pagamento-principal">
                Definir como forma de pagamento principal
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditarPagamento(false)}>
              Cancelar
            </Button>
            <Button variant="default">
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
