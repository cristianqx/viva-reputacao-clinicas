
import { useState } from "react";
import { X, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NovaCampanhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campanha: any) => void;
}

type CanalTipo = "email" | "sms" | "whatsapp";

export default function NovaCampanhaModal({ isOpen, onClose, onSave }: NovaCampanhaModalProps) {
  const [nome, setNome] = useState("");
  const [canais, setCanais] = useState<CanalTipo[]>(["email"]);
  const [mensagem, setMensagem] = useState("");
  const [origem, setOrigem] = useState("");
  const [disparo, setDisparo] = useState<"automatico" | "manual">("manual");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [recorrencia, setRecorrencia] = useState("diaria");
  const [canalAtivo, setCanalAtivo] = useState<CanalTipo>("email");
  const [mensagens, setMensagens] = useState<Record<CanalTipo, string>>({
    email: "",
    sms: "",
    whatsapp: ""
  });
  const [linkRastreavel, setLinkRastreavel] = useState(true);
  const [diasAposConsulta, setDiasAposConsulta] = useState("3");

  // Toggle canal
  const handleToggleCanal = (canal: CanalTipo) => {
    if (canais.includes(canal)) {
      setCanais(canais.filter(c => c !== canal));
      if (canalAtivo === canal && canais.length > 1) {
        setCanalAtivo(canais.filter(c => c !== canal)[0]);
      }
    } else {
      setCanais([...canais, canal]);
      setCanalAtivo(canal);
    }
  };

  // Atualiza mensagem do canal ativo
  const handleMensagemChange = (texto: string) => {
    setMensagens({
      ...mensagens,
      [canalAtivo]: texto
    });
  };

  // Preview de email/SMS/WhatsApp
  const renderPreview = () => {
    const mensagemAtiva = mensagens[canalAtivo] || "";
    
    if (canalAtivo === "email") {
      return (
        <div className="border rounded-md p-4 bg-white">
          <div className="border-b pb-2 mb-2">
            <div className="font-bold">Assunto: Avalie sua experiência na Clínica Dental</div>
            <div className="text-gray-500 text-sm">De: Reputação Viva</div>
            <div className="text-gray-500 text-sm">Para: paciente@email.com</div>
          </div>
          <div className="py-2">
            {mensagemAtiva || "Sua mensagem personalizada aparecerá aqui..."}
          </div>
          <div className="pt-4 border-t mt-4">
            <div className="bg-blue-100 text-blue-800 rounded p-3 text-center">
              ⭐⭐⭐⭐⭐
              <div className="font-medium mt-1">Como foi sua experiência?</div>
              <div className="flex justify-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button key={num} className="bg-blue-500 text-white rounded-full w-8 h-8">
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (canalAtivo === "sms") {
      return (
        <div className="border rounded-md p-4 bg-gray-50 max-w-xs mx-auto">
          <div className="bg-green-100 p-3 rounded-lg text-gray-800 relative">
            <div className="mb-2 font-medium">Clínica Dental</div>
            <p className="text-sm">
              {mensagemAtiva || "Avalie sua experiência na Clínica Dental: https://rep.viva/a1b2c3"}
            </p>
            <div className="text-xs text-gray-500 mt-2 text-right">14:25</div>
          </div>
        </div>
      );
    } else { // WhatsApp
      return (
        <div className="border rounded-md p-4 bg-gray-50 max-w-xs mx-auto">
          <div className="bg-green-50 p-3 rounded-lg text-gray-800 relative border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Clínica Dental</div>
                <div className="text-xs text-gray-500">WhatsApp Business</div>
              </div>
            </div>
            <p className="text-sm">
              {mensagemAtiva || "Olá! Gostaríamos de saber sua opinião sobre nosso atendimento. Clique aqui para avaliar: https://rep.viva/w/a1b2c3"}
            </p>
            <div className="text-xs text-gray-500 mt-2 text-right">Agora</div>
          </div>
        </div>
      );
    }
  };

  // Gerando link rastreável de exemplo
  const getLinkRastreavel = () => {
    if (linkRastreavel) {
      return `https://g.page/clinica-exemplo/review?ref=rv-123456-789012`;
    }
    return `https://g.page/clinica-exemplo/review`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome da campanha é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (canais.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um canal de envio.",
        variant: "destructive"
      });
      return;
    }

    const novaCampanha = {
      id: Date.now().toString(),
      nome,
      canais,
      mensagens,
      status: dataAgendamento ? "agendada" : "rascunho",
      agendada: !!dataAgendamento,
      dataAgendamento: dataAgendamento || undefined,
      dataCriacao: new Date().toISOString(),
      origem,
      disparo,
      recorrente: isRecorrente,
      recorrencia: isRecorrente ? recorrencia : undefined,
      linkRastreavel,
      diasAposConsulta: disparo === "automatico" ? parseInt(diasAposConsulta) : undefined,
      estatisticas: {
        enviados: 0,
        abertos: 0,
        clicados: 0,
        avaliados: 0
      },
      progresso: 0,
    };

    onSave(novaCampanha);
    toast({
      title: "Sucesso",
      description: `Campanha "${nome}" criada com sucesso!`,
    });
    
    // Reset form
    setNome("");
    setCanais(["email"]);
    setMensagens({ email: "", sms: "", whatsapp: "" });
    setCanalAtivo("email");
    setOrigem("");
    setDisparo("manual");
    setDataAgendamento("");
    setIsRecorrente(false);
    setRecorrencia("diaria");
    setLinkRastreavel(true);
    setDiasAposConsulta("3");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Nova Campanha</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da campanha *</Label>
              <Input
                id="nome"
                placeholder="Ex: Pós-Atendimento Junho 2023"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Canais de envio</Label>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={canais.includes("email") ? "default" : "outline"}
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleToggleCanal("email")}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar por Email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={canais.includes("sms") ? "default" : "outline"}
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleToggleCanal("sms")}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        SMS
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar por SMS</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={canais.includes("whatsapp") ? "default" : "outline"}
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleToggleCanal("whatsapp")}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar por WhatsApp</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                {canais.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>Configuração da mensagem</Label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        <Tabs defaultValue={canalAtivo} value={canalAtivo} onValueChange={(value) => setCanalAtivo(value as CanalTipo)} className="w-full">
                          <TabsList className="w-full">
                            {canais.includes("email") && (
                              <TabsTrigger 
                                value="email" 
                                className={canalAtivo === "email" ? "border-b-2 border-primary" : ""}
                              >
                                <Mail className="h-4 w-4 mr-1" /> Email
                              </TabsTrigger>
                            )}
                            {canais.includes("sms") && (
                              <TabsTrigger 
                                value="sms" 
                                className={canalAtivo === "sms" ? "border-b-2 border-primary" : ""}
                              >
                                <Phone className="h-4 w-4 mr-1" /> SMS
                              </TabsTrigger>
                            )}
                            {canais.includes("whatsapp") && (
                              <TabsTrigger 
                                value="whatsapp" 
                                className={canalAtivo === "whatsapp" ? "border-b-2 border-primary" : ""}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
                              </TabsTrigger>
                            )}
                          </TabsList>
                          
                          <TabsContent value="email" className="mt-3">
                            <Textarea
                              placeholder="Digite o texto do email..."
                              rows={5}
                              value={mensagens.email}
                              onChange={(e) => handleMensagemChange(e.target.value)}
                            />
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="link-rastreavel-email" className="text-sm">Link rastreável</Label>
                                <Switch 
                                  id="link-rastreavel-email" 
                                  checked={linkRastreavel}
                                  onCheckedChange={setLinkRastreavel}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {linkRastreavel 
                                  ? "O link incluirá parâmetros para rastrear a origem da avaliação." 
                                  : "Sem rastreamento de origem."}
                              </div>
                              <div className="text-xs bg-gray-100 p-2 mt-2 rounded break-all">
                                Exemplo: {getLinkRastreavel()}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="sms" className="mt-3">
                            <Textarea
                              placeholder="Digite sua mensagem SMS (máx. 160 caracteres)"
                              rows={5}
                              value={mensagens.sms}
                              onChange={(e) => handleMensagemChange(e.target.value)}
                              maxLength={160}
                            />
                            <div className="text-right text-xs text-gray-500">
                              {mensagens.sms.length}/160 caracteres
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="link-rastreavel-sms" className="text-sm">Link rastreável</Label>
                                <Switch 
                                  id="link-rastreavel-sms" 
                                  checked={linkRastreavel}
                                  onCheckedChange={setLinkRastreavel}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {linkRastreavel 
                                  ? "O link incluirá parâmetros para rastrear a origem da avaliação." 
                                  : "Sem rastreamento de origem."}
                              </div>
                              <div className="text-xs bg-gray-100 p-2 mt-2 rounded break-all">
                                Exemplo: {getLinkRastreavel()}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="whatsapp" className="mt-3">
                            <Textarea
                              placeholder="Digite sua mensagem WhatsApp..."
                              rows={5}
                              value={mensagens.whatsapp}
                              onChange={(e) => handleMensagemChange(e.target.value)}
                            />
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="link-rastreavel-whatsapp" className="text-sm">Link rastreável</Label>
                                <Switch 
                                  id="link-rastreavel-whatsapp" 
                                  checked={linkRastreavel}
                                  onCheckedChange={setLinkRastreavel}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {linkRastreavel 
                                  ? "O link incluirá parâmetros para rastrear a origem da avaliação." 
                                  : "Sem rastreamento de origem."}
                              </div>
                              <div className="text-xs bg-gray-100 p-2 mt-2 rounded break-all">
                                Exemplo: {getLinkRastreavel()}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem dos contatos</Label>
                  <Select
                    value={origem}
                    onValueChange={setOrigem}
                  >
                    <SelectTrigger id="origem">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agenda Odontológica">Agenda Odontológica</SelectItem>
                      <SelectItem value="Lista manual">Lista manual</SelectItem>
                      <SelectItem value="Importação CSV">Importação CSV</SelectItem>
                      <SelectItem value="Tags">Filtro por tags</SelectItem>
                      <SelectItem value="WhatsApp">Contatos do WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de disparo</Label>
                  <RadioGroup 
                    className="flex flex-col space-y-2" 
                    defaultValue="manual" 
                    value={disparo}
                    onValueChange={(value) => setDisparo(value as "automatico" | "manual")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="disparo-manual" />
                      <Label htmlFor="disparo-manual">Manual (enviar quando eu quiser)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="automatico" id="disparo-automatico" />
                      <Label htmlFor="disparo-automatico">Automático (após evento específico)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {disparo === "automatico" && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="dias-apos">Dias após a consulta</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="dias-apos"
                        type="number"
                        min="0"
                        max="30"
                        className="w-20"
                        value={diasAposConsulta}
                        onChange={(e) => setDiasAposConsulta(e.target.value)}
                      />
                      <span className="text-sm text-gray-500">dias</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      A mensagem será enviada automaticamente este número de dias após a consulta ser marcada como "Realizada".
                    </p>
                  </div>
                )}
                
                {disparo === "manual" && (
                  <div className="space-y-2">
                    <Label htmlFor="agendamento">Agendamento</Label>
                    <Input
                      id="agendamento"
                      type="datetime-local"
                      value={dataAgendamento}
                      onChange={(e) => setDataAgendamento(e.target.value)}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch 
                        id="recorrente" 
                        checked={isRecorrente}
                        onCheckedChange={setIsRecorrente}
                      />
                      <Label htmlFor="recorrente">Campanha recorrente</Label>
                    </div>
                    
                    {isRecorrente && (
                      <Select
                        value={recorrencia}
                        onValueChange={setRecorrencia}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a recorrência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diária</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="border rounded-md p-4">
                <h3 className="font-medium text-lg mb-3">Preview</h3>
                <Tabs defaultValue="desktop" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="desktop">Monitor</TabsTrigger>
                    <TabsTrigger value="tablet">Tablet</TabsTrigger>
                    <TabsTrigger value="mobile">Celular</TabsTrigger>
                  </TabsList>
                  <TabsContent value="desktop" className="mt-4">
                    {renderPreview()}
                  </TabsContent>
                  <TabsContent value="tablet" className="mt-4">
                    <div className="max-w-md mx-auto">
                      {renderPreview()}
                    </div>
                  </TabsContent>
                  <TabsContent value="mobile" className="mt-4">
                    <div className="max-w-xs mx-auto">
                      {renderPreview()}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {dataAgendamento ? "Agendar Campanha" : "Criar Campanha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
