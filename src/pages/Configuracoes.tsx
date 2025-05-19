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
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";

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
                <div className="space-y-8">
                  {/* Seção 1: Integrações Google */}
                  <Card className="bg-[#F6FCFA] border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#179C8A]">Integrações Google</CardTitle>
                      <CardDescription className="text-gray-700">
                        Conecte suas contas Google para acessar recursos adicionais como coleta automática de avaliações e gerenciamento de agendamentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                      {/* Google Meu Negócio */}
                      <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                        <div className="flex-shrink-0 w-12 h-12 rounded bg-[#E6F4F1] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#179C8A]"><path d="M15.5 2h-7A2.5 2.5 0 0 0 6 4.5v15A2.5 2.5 0 0 0 8.5 22h7a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 15.5 2z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-base">Google Meu Negócio</h3>
                            <Button className="bg-[#0E927D] hover:bg-[#0c7f6d] text-white font-medium px-5" size="sm">
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6"/><path d="M15 10l-3-3-3 3"/></svg>
                              Conectar Google Meu Negócio
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Use o Google Meu Negócio para gerenciar suas avaliações online e melhorar a visibilidade da sua clínica nos resultados de busca.</p>
                        </div>
                      </div>
                      {/* Google Calendar */}
                      <GoogleCalendarIntegration />
                    </CardContent>
                  </Card>

                  {/* Seção 2: Outras Integrações */}
                  <Card className="bg-[#F6FCFA] border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#179C8A]">Outras Integrações</CardTitle>
                      <CardDescription className="text-gray-700">
                        Conecte serviços adicionais para melhorar a comunicação com seus pacientes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                      {/* WhatsApp Business */}
                      <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                        <div className="flex-shrink-0 w-12 h-12 rounded bg-[#E6F4F1] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#179C8A]"><path d="M16.7 13.4a5.5 5.5 0 0 1-2.1.4c-.5 0-.9-.1-1.3-.2a7.1 7.1 0 0 1-2.7-1.7 7.1 7.1 0 0 1-1.7-2.7c-.1-.4-.2-.8-.2-1.3 0-.7.1-1.4.4-2.1a1 1 0 0 0-.2-1.1l-1.2-1.2a1 1 0 0 0-1.4 0A9 9 0 1 0 12 21a9 9 0 0 0 7.6-13.6 1 1 0 0 0-1.1-.2z" stroke="currentColor" strokeWidth="1.5"/><path d="M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-base">WhatsApp Business</h3>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#FFCD3C] text-gray-800">Em breve</span>
                              <Button className="bg-[#0E927D] hover:bg-[#0c7f6d] text-white font-medium px-5" size="sm" disabled>
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6"/><path d="M15 10l-3-3-3 3"/></svg>
                                Configurar WhatsApp Business
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Use o WhatsApp Business para enviar solicitações de avaliação diretamente aos seus clientes e melhorar a comunicação com eles.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
