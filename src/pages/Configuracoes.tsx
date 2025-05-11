import { useState, useEffect } from "react";
import { Settings, User, Building, Plug, CreditCard, Bell, Users, Lock, Shield, HelpCircle, ChevronRight, Save, X, CheckCircle, ExternalLink } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import GoogleBusinessIntegration from "@/components/integrations/GoogleBusinessIntegration";
import { useGoogleIntegration } from "@/hooks/useGoogleIntegration";

// Componente principal da página
export default function Configuracoes() {
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const { isConnected, isLoading } = useGoogleIntegration();

  // Verificar se há um parâmetro tab na URL e atualizar a aba ativa
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleSalvar = () => {
    setSalvando(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      
      setTimeout(() => {
        setSucesso(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <PageHeader 
        title="Configurações" 
        description="Gerencie as configurações da sua conta."
      />
      
      <div className="p-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex">
            <div className="w-64 mr-6 shrink-0 hidden md:block">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-brand">Configurações</h3>
                <p className="text-sm text-gray-500">Gerencie sua conta e integrações</p>
              </div>
              
              <TabsList className="flex flex-col h-auto items-stretch space-y-1 bg-transparent p-0">
                <TabsTrigger 
                  value="perfil" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="clinica" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Clínica
                </TabsTrigger>
                <TabsTrigger 
                  value="usuarios" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Usuários e Permissões
                </TabsTrigger>
                <TabsTrigger 
                  value="integracao" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <Plug className="h-4 w-4 mr-2" />
                  Integrações
                </TabsTrigger>
                <TabsTrigger 
                  value="faturamento" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Faturamento
                </TabsTrigger>
                <TabsTrigger 
                  value="notificacoes" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger 
                  value="seguranca" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger 
                  value="ajuda" 
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 text-gray-700"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ajuda e Suporte
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1">
              {sucesso && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Alterações salvas com sucesso!</span>
                </div>
              )}
              
              {/* Mantemos os mesmos TabsContent para as outras abas */}
              <TabsContent value="perfil" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil Pessoal</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais de usuário
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="shrink-0">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xl">CD</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Foto do Perfil</h3>
                        <p className="text-sm text-gray-500">
                          Esta foto será exibida no seu perfil e notificações
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Alterar foto</Button>
                          <Button variant="ghost" size="sm">Remover</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" defaultValue="Carlos Dourado" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="carlos@clinicadental.com.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" defaultValue="(11) 98765-4321" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input id="cargo" defaultValue="Administrador" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma</Label>
                      <Select defaultValue="pt-BR">
                        <SelectTrigger id="idioma">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Este é o idioma que será usado para toda a interface
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleSalvar}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvar} disabled={salvando}>
                      {salvando ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="clinica" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados da Clínica</CardTitle>
                    <CardDescription>
                      Informações da sua clínica que serão utilizadas nas avaliações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="shrink-0">
                        <div className="h-24 w-24 border rounded-md flex items-center justify-center bg-gray-50">
                          <Building className="h-12 w-12 text-gray-300" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Logo da Clínica</h3>
                        <p className="text-sm text-gray-500">
                          Este logo será exibido nos widgets e relatórios
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Enviar logo</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome-clinica">Nome da Clínica</Label>
                        <Input id="nome-clinica" defaultValue="Clínica Dental" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="especialidade">Especialidade Principal</Label>
                        <Select defaultValue="odontologia-geral">
                          <SelectTrigger id="especialidade">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="odontologia-geral">Odontologia Geral</SelectItem>
                            <SelectItem value="ortodontia">Ortodontia</SelectItem>
                            <SelectItem value="implantodontia">Implantodontia</SelectItem>
                            <SelectItem value="estetica-dental">Estética Dental</SelectItem>
                            <SelectItem value="endodontia">Endodontia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone-clinica">Telefone</Label>
                        <Input id="telefone-clinica" defaultValue="(11) 3456-7890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-clinica">Email</Label>
                        <Input id="email-clinica" type="email" defaultValue="contato@clinicadental.com.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" type="url" defaultValue="https://clinicadental.com.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input id="endereco" defaultValue="Av. Paulista, 1000" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" defaultValue="Bela Vista" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" defaultValue="São Paulo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select defaultValue="SP">
                          <SelectTrigger id="estado">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" defaultValue="01310-100" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="sobre">Sobre a Clínica</Label>
                      <Textarea 
                        id="sobre" 
                        placeholder="Descreva sua clínica em poucas palavras..." 
                        className="min-h-[100px]"
                        defaultValue="Clínica Dental é uma clínica odontológica especializada em tratamentos de qualidade com foco no bem-estar e satisfação dos pacientes. Oferecemos serviços de odontologia geral, ortodontia, implantes e estética dental."
                      />
                      <p className="text-sm text-gray-500">
                        Esta descrição poderá ser usada em widgets e perfis públicos
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvar} disabled={salvando}>
                      {salvando ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar dados da clínica
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="usuarios" className="mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Usuários e Permissões</CardTitle>
                        <CardDescription>
                          Gerencie os usuários com acesso ao sistema
                        </CardDescription>
                      </div>
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Convidar usuário
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>CD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Carlos Dourado</p>
                            <p className="text-sm text-gray-500">carlos@clinicadental.com.br</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className="mr-3">Proprietário</Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>AP</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Ana Paula Silva</p>
                            <p className="text-sm text-gray-500">ana.silva@clinicadental.com.br</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3">Administrador</Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>ML</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Maria Lima</p>
                            <p className="text-sm text-gray-500">maria.lima@clinicadental.com.br</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3">Secretária</Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-base font-medium mb-4">Papéis e Permissões</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Proprietário</h4>
                            <Badge>Seu papel atual</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Acesso completo a todas as funcionalidades e configurações.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Gerenciar usuários</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Configurações da conta</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Faturamento</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Todas as integrações</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <h4 className="font-medium mb-2">Administrador</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Acesso a maioria das funcionalidades, exceto faturamento e configurações da conta.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Gerenciar campanhas</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Responder avaliações</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Gerenciar contatos</span>
                            </div>
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-red-500 mr-1.5" />
                              <span className="text-gray-500">Faturamento</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <h4 className="font-medium mb-2">Secretária</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Acesso limitado a respostas e gerenciamento de contatos.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Responder avaliações</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                              <span>Gerenciar contatos</span>
                            </div>
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-red-500 mr-1.5" />
                              <span className="text-gray-500">Criar campanhas</span>
                            </div>
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-red-500 mr-1.5" />
                              <span className="text-gray-500">Configurações</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integracao" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrações</CardTitle>
                    <CardDescription>
                      Conecte-se a outros serviços para automatizar seu fluxo de trabalho
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Google Meu Negócio - Novo componente de integração */}
                      <GoogleBusinessIntegration 
                        isConnected={isConnected} 
                        isLoading={isLoading} 
                      />
                      
                      {/* Doctoralia - Mantenha o componente existente */}
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 fill-green-500">
                                <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0-1.3 1.5-2.4 3.7-2.4 2.3.2 4.1 1.3 4.1 2.6 0 1.3-1.5 2.4-3.7 2.4-2.3 0-4.1-1.1-4.1-2.6zm-13.7-1.1c-.4-1.3 1.1-2.8 3.2-3.4 2.1-.4 4.1.2 4.5 1.5.4 1.3-1.1 2.8-3.2 3.4-2.1.4-4.1-.2-4.5-1.5zm-12.3-5.4c-.9-1.1-.2-2.8 1.7-3.9 1.7-1.3 3.9-1.1 4.8 0 .9 1.1.2 2.8-1.7 3.9-1.9 1.3-3.9 1.1-4.8 0zm-9.1-9.1c-.9-.6-.8-2.1.2-3.4 1.1-1.3 2.8-1.9 3.7-1.3.9.6.8 2.1-.2 3.4-1.1 1.3-2.8 1.9-3.7 1.3zm-6.5-9.7c-.9-.6-1.1-1.9-.2-3 .8-1.1 2.4-1.5 3.2-.9.9.6 1.1 1.9.2 3-.6 1.1-2.3 1.5-3.2.9zm-6.7-7.4c-.4-.9 0-1.9 1.1-2.4 1.1-.6 2.4-.2 2.8.6.4.9 0 1.9-1.1 2.4-1.1.5-2.4.2-2.8-.6z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Doctoralia</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para ver e responder avaliações da Doctoralia
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Configurando</Badge>
                            <Button variant="outline" size="sm">Gerenciar</Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Facebook - Mantenha o componente existente */}
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6 fill-blue-600">
                                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Facebook</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para ver e responder avaliações do Facebook
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">Conectar</Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Manter o restante das integrações */}
                      
                      <Separator />
                      
                      <h3 className="text-base font-medium">Integrações com Agendas Odontológicas</h3>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-teal-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 fill-teal-500">
                                <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm329 153c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47.2-47.2c-9.4-9.4-24.6-9.4-33.9 0-9.4 9.4-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 345z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Simples Dental</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Importe seus pacientes e agendamentos
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button size="sm">Conectar</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faturamento" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Faturamento</CardTitle>
                    <CardDescription>
                      Gerencie seu plano, pagamentos e faturas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium">Plano Profissional</h3>
                          <p className="text-sm text-gray-500 mt-1">R$ 149,90/mês</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ativo</Badge>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Próxima cobrança:</span>
                          <span className="font-medium">15/06/2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Método de pagamento:</span>
                          <span className="font-medium">Cartão de crédito (final 4567)</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="sm">Alterar plano</Button>
                        <Button variant="outline" size="sm">Atualizar pagamento</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Histórico de faturas</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Data</th>
                              <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Descrição</th>
                              <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Valor</th>
                              <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="py-2 px-3 text-right text-sm font-medium text-gray-500"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-3 text-sm">15/05/2023</td>
                              <td className="py-3 px-3 text-sm">Plano Profissional - Mensal</td>
                              <td className="py-3 px-3 text-sm">R$ 149,90</td>
                              <td className="py-3 px-3 text-sm">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Pago</Badge>
                              </td>
                              <td className="py-3 px-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-auto p-1">Download</Button>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-3 text-sm">15/04/2023</td>
                              <td className="py-3 px-3 text-sm">Plano Profissional - Mensal</td>
                              <td className="py-3 px-3 text-sm">R$ 149,90</td>
                              <td className="py-3 px-3 text-sm">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Pago</Badge>
                              </td>
                              <td className="py-3 px-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-auto p-1">Download</Button>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-3 text-sm">15/03/2023</td>
                              <td className="py-3 px-3 text-sm">Plano Profissional - Mensal</td>
                              <td className="py-3 px-3 text-sm">R$ 149,90</td>
                              <td className="py-3 px-3 text-sm">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Pago</Badge>
                              </td>
                              <td className="py-3 px-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-auto p-1">Download</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notificacoes" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>
                      Configure como e quando deseja receber notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-3">Notificações por email</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Novas avaliações</p>
                            <p className="text-sm text-gray-500">Receba um email quando houver nova avaliação</p>
                          </div>
                          <Switch defaultChecked id="email-reviews" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Resumo semanal</p>
                            <p className="text-sm text-gray-500">Receba um resumo semanal de performance</p>
                          </div>
                          <Switch defaultChecked id="email-weekly" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Alertas de campanha</p>
                            <p className="text-sm text-gray-500">Notificações sobre status de campanhas</p>
                          </div>
                          <Switch id="email-campaigns" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Notificações no sistema</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Avaliações negativas</p>
                            <p className="text-sm text-gray-500">Alerta quando receber avaliações de 1-2 estrelas</p>
                          </div>
                          <Switch defaultChecked id="system-negative" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Novos agendamentos</p>
                            <p className="text-sm text-gray-500">Notificar sobre novos agendamentos feitos</p>
                          </div>
                          <Switch defaultChecked id="system-appointments" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Relatórios automáticos</h3>
                      <div className="rounded-lg border p-4">
                        <div className="mb-4">
                          <Label htmlFor="report-frequency">Frequência de envio</Label>
                          <Select defaultValue="weekly">
                            <SelectTrigger id="report-frequency">
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="report-email">Email para relatórios</Label>
                          <Input id="report-email" defaultValue="carlos@clinicadental.com.br" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input id="report-reviews" type="checkbox" className="mr-2" defaultChecked />
                            <Label htmlFor="report-reviews">Relatório de avaliações</Label>
                          </div>
                          <div className="flex items-center">
                            <input id="report-campaigns" type="checkbox" className="mr-2" defaultChecked />
                            <Label htmlFor="report-campaigns">Performance das campanhas</Label>
                          </div>
                          <div className="flex items-center">
                            <input id="report-appointments" type="checkbox" className="mr-2" />
                            <Label htmlFor="report-appointments">Relatório de agendamentos</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSalvar} disabled={salvando}>
                      {salvando ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar preferências
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="seguranca" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Gerencie opções de segurança e autenticação da sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Alterar senha</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha atual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova senha</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <Button className="mt-2">Alterar senha</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Autenticação de dois fatores</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Ativar autenticação de dois fatores</p>
                          <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                        <Switch id="enable-2fa" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Sessões ativas</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Chrome no Windows</p>
                              <div className="text-sm text-gray-500 mt-1">
                                <p>São Paulo, SP • Esta sessão</p>
                                <p>Último acesso: Hoje às 14:32</p>
                              </div>
                            </div>
                            <Badge>Atual</Badge>
                          </div>
                        </div>
                        <div className="p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Safari no iPhone</p>
                              <div className="text-sm text-gray-500 mt-1">
                                <p>São Paulo, SP</p>
                                <p>Último acesso: Ontem às 18:45</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500">Encerrar</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-3">Encerrar todas as outras sessões</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 border border-red-200 rounded-md">
                      <h3 className="text-base font-medium text-red-600 mb-2">Zona de perigo</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Ao excluir sua conta, todos os dados serão removidos permanentemente.
                        Esta ação não pode ser desfeita.
                      </p>
                      <Button variant="outline" className="text-red-500 border-red-300 hover:bg-red-50">
                        Excluir conta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ajuda" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Ajuda e Suporte</CardTitle>
                    <CardDescription>
                      Central de ajuda e recursos para você utilizar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md hover:bg-gray-50">
                        <h3 className="font-medium text-base mb-2">Central de Ajuda</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Encontre respostas para suas perguntas na nossa base de conhecimento
                        </p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Acessar central de ajuda
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-md hover:bg-gray-50">
                        <h3 className="font-medium text-base mb-2">Tutoriais em Vídeo</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Assista tutoriais de como utilizar os recursos da plataforma
                        </p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver tutoriais
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-md hover:bg-gray-50">
                        <h3 className="font-medium text-base mb-2">Fale Conosco</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Entre em contato com nossa equipe de suporte
                        </p>
                        <Button size="sm">
                          Abrir chamado de suporte
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-md hover:bg-gray-50">
                        <h3 className="font-medium text-base mb-2">Agendar Treinamento</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Agende uma sessão personalizada com nossa equipe
                        </p>
                        <Button variant="outline" size="sm">
                          Solicitar treinamento
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Perguntas Frequentes</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded border hover:bg-gray-50">
                          <p className="font-medium">Como responder avaliações automaticamente?</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Configure respostas automáticas em Campanhas {'>'}  Respostas Automáticas
                          </p>
                        </div>
                        
                        <div className="p-3 rounded border hover:bg-gray-50">
                          <p className="font-medium">Como integrar com meu software odontológico?</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Acesse Configurações {'>'}  Integrações e selecione seu software
                          </p>
                        </div>
                        
                        <div className="p-3 rounded border hover:bg-gray-50">
                          <p className="font-medium">Como personalizar o widget de avaliações?</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Navegue até Widgets {'>'}  Personalizar e altere as cores e estilos
                          </p>
                        </div>
                        
                        <div className="p-3 rounded border hover:bg-gray-50">
                          <p className="font-medium">O que fazer com avaliações negativas?</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Responda rapidamente e ofereça solução para o problema relatado
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Dados de contato do suporte</h3>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Email:</span> suporte@reputacaoviva.com.br</p>
                        <p><span className="font-medium">Telefone:</span> (11) 3456-7890</p>
                        <p><span className="font-medium">Horário:</span> Segunda a Sexta, das 9h às 18h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
