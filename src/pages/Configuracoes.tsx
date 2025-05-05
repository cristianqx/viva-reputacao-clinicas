
import { useState } from "react";
import { Settings, User, Building, Plug, CreditCard, Bell, Users, Lock, Shield, HelpCircle, ChevronRight, Save, X, CheckCircle } from "lucide-react";
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

// Componente principal da página
export default function Configuracoes() {
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

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
        <Tabs defaultValue="perfil" className="w-full">
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
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-6 w-6 fill-blue-500">
                                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Google Meu Negócio</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para ver e responder avaliações do Google
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>
                            <Button variant="outline" size="sm">Gerenciar</Button>
                          </div>
                        </div>
                      </div>
                      
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
                      
                      <Separator />
                      
                      <h3 className="text-base font-medium">Integrações com Agendas Odontológicas</h3>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-teal-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 fill-teal-500">
                                <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Simples Dental</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para automatizar solicitações de avaliações após consultas
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>
                            <Button variant="outline" size="sm">Gerenciar</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 fill-purple-500">
                                <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Dental Office</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para automatizar solicitações de avaliações após consultas
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">Conectar</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-orange-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 fill-orange-500">
                                <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">Clinicorp</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Conecte-se para automatizar solicitações de avaliações após consultas
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">Conectar</Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <h3 className="text-base font-medium">Integrações para Comunicações</h3>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6 fill-blue-500">
                                <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">SendGrid</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Integração para envio de emails de campanhas
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>
                            <Button variant="outline" size="sm">Gerenciar</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6 fill-green-500">
                                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-base">TotalVoice</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Integração para envio de SMS de campanhas
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">Conectar</Button>
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
                    <CardTitle>Faturamento e Assinatura</CardTitle>
                    <CardDescription>
                      Gerencie seu plano, pagamentos e faturas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-base">Plano Atual</h3>
                            <div className="flex items-baseline mt-1">
                              <span className="text-2xl font-bold text-brand">Plano Essencial</span>
                              <span className="ml-2 text-sm text-gray-500">R$ 99,90/mês</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Renovação automática em 15/05/2023
                            </p>
                          </div>
                          <Button>Atualizar plano</Button>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Usuários</p>
                            <p className="font-medium">1 de 1</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Envios de Email</p>
                            <p className="font-medium">320 de 500</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Envios de SMS</p>
                            <p className="font-medium">45 de 100</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Método de Pagamento</h3>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-6 bg-blue-500 rounded mr-3"></div>
                              <div>
                                <p className="font-medium">Cartão de Crédito</p>
                                <p className="text-sm text-gray-500">VISA terminando em 4242</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Editar</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Histórico de Faturas</h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 text-sm font-medium text-gray-500">Data</th>
                                <th className="text-left p-2 text-sm font-medium text-gray-500">Descrição</th>
                                <th className="text-right p-2 text-sm font-medium text-gray-500">Valor</th>
                                <th className="text-right p-2 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-right p-2 text-sm font-medium text-gray-500">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm">
                              <tr className="border-b">
                                <td className="p-2">15/04/2023</td>
                                <td className="p-2">Plano Essencial - Mensal</td>
                                <td className="p-2 text-right">R$ 99,90</td>
                                <td className="p-2 text-right">
                                  <Badge className="bg-green-100 text-green-800">Pago</Badge>
                                </td>
                                <td className="p-2 text-right">
                                  <Button variant="ghost" size="sm">Recibo</Button>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2">15/03/2023</td>
                                <td className="p-2">Plano Essencial - Mensal</td>
                                <td className="p-2 text-right">R$ 99,90</td>
                                <td className="p-2 text-right">
                                  <Badge className="bg-green-100 text-green-800">Pago</Badge>
                                </td>
                                <td className="p-2 text-right">
                                  <Button variant="ghost" size="sm">Recibo</Button>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2">15/02/2023</td>
                                <td className="p-2">Plano Essencial - Mensal</td>
                                <td className="p-2 text-right">R$ 99,90</td>
                                <td className="p-2 text-right">
                                  <Badge className="bg-green-100 text-green-800">Pago</Badge>
                                </td>
                                <td className="p-2 text-right">
                                  <Button variant="ghost" size="sm">Recibo</Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
                      Configure suas preferências de notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium mb-3">Notificações por Email</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Novas avaliações</p>
                              <p className="text-sm text-gray-500">Receba emails quando novas avaliações forem recebidas</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Avaliações negativas</p>
                              <p className="text-sm text-gray-500">Receba emails para avaliações com 3 estrelas ou menos</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Resumo semanal</p>
                              <p className="text-sm text-gray-500">Receba um resumo semanal das atividades</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Campanhas</p>
                              <p className="text-sm text-gray-500">Receba relatórios de desempenho de campanhas</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Integrações</p>
                              <p className="text-sm text-gray-500">Receba notificações sobre status de integrações</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-base font-medium mb-3">Notificações do Sistema</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Novas avaliações</p>
                              <p className="text-sm text-gray-500">Mostrar notificação no sistema quando chegar uma nova avaliação</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Lembretes de resposta</p>
                              <p className="text-sm text-gray-500">Receba lembretes para avaliações não respondidas</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Atualizações de campanhas</p>
                              <p className="text-sm text-gray-500">Receba notificações sobre o status das campanhas</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
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
                      Gerencie as configurações de segurança da sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Alterar Senha</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="senha-atual">Senha Atual</Label>
                          <Input id="senha-atual" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nova-senha">Nova Senha</Label>
                          <Input id="nova-senha" type="password" />
                          <p className="text-xs text-gray-500">
                            A senha deve ter pelo menos 8 caracteres e incluir números e caracteres especiais
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                          <Input id="confirmar-senha" type="password" />
                        </div>
                        
                        <Button>Atualizar Senha</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Autenticação em Dois Fatores</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Sessões Ativas</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Gerencie os dispositivos conectados à sua conta
                          </p>
                        </div>
                        <Button variant="outline">Ver Sessões</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium text-red-600">Excluir Conta</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Esta ação é permanente e não pode ser desfeita
                          </p>
                        </div>
                        <Button variant="destructive">Excluir Conta</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ajuda" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Ajuda e Suporte</CardTitle>
                    <CardDescription>
                      Encontre respostas para suas dúvidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Perguntas Frequentes</h3>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium">Como conectar minha agenda odontológica?</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Acesse a seção de Integrações e selecione seu software de agenda. Siga as instruções para autorizar o acesso.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium">Como criar minha primeira campanha?</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Acesse a seção de Campanhas e clique em "Nova Campanha". Siga o assistente para configurar sua campanha.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium">Como adicionar mais usuários à minha conta?</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Vá para Configurações {'>>'} Usuários e Permissões e clique em "Convidar usuário". Depende do seu plano.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Contato de Suporte</h3>
                      
                      <div className="p-4 border rounded-md">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="assunto">Assunto</Label>
                            <Input id="assunto" className="mt-1" placeholder="Ex: Problema com integração" />
                          </div>
                          
                          <div>
                            <Label htmlFor="mensagem">Mensagem</Label>
                            <Textarea 
                              id="mensagem" 
                              className="mt-1 min-h-[120px]" 
                              placeholder="Descreva sua dúvida ou problema..." 
                            />
                          </div>
                          
                          <Button>Enviar Mensagem</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md text-center">
                        <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">Central de Ajuda</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Acesse nossa base de conhecimento completa
                        </p>
                        <Button variant="link" className="mt-2">Acessar</Button>
                      </div>
                      
                      <div className="p-4 border rounded-md text-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 448 512" 
                          className="h-8 w-8 mx-auto mb-2 fill-primary"
                        >
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        <h3 className="font-medium">WhatsApp</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Entre em contato via WhatsApp
                        </p>
                        <Button variant="link" className="mt-2">Conversar</Button>
                      </div>
                      
                      <div className="p-4 border rounded-md text-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 512 512" 
                          className="h-8 w-8 mx-auto mb-2 fill-primary"
                        >
                          <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                        </svg>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Envie um email para suporte@reputacaoviva.com.br
                        </p>
                        <Button variant="link" className="mt-2">Enviar Email</Button>
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
