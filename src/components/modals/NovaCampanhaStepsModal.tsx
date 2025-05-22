
import { useState, useEffect } from "react";
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Campaign, createCampaign } from "@/services/campaignService";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NovaCampanhaStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campanha: any) => void;
}

type PlataformaAvaliacao = "google" | "facebook" | "personalizado";
type Step = 1 | 2 | 3 | 4;

export default function NovaCampanhaStepsModal({ 
  isOpen, 
  onClose, 
  onSave 
}: NovaCampanhaStepsModalProps) {
  // Estados para os campos do formulário
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [nome, setNome] = useState("");
  const [diasAposEvento, setDiasAposEvento] = useState("3");
  
  const [plataformaAvaliacao, setPlataformaAvaliacao] = useState<PlataformaAvaliacao>("google");
  const [linkAvaliacao, setLinkAvaliacao] = useState("");
  
  const [mensagemTemplate, setMensagemTemplate] = useState(
    "Olá {{nome_cliente}}! 👋\n\nComo foi sua experiência na {{nome_empresa}}?\nSua opinião é muito importante para nós! 😊\n\nClique aqui para avaliar: {{link_avaliacao}}\n\nAgradecemos sua confiança! 🙏"
  );
  
  const [notaMinima, setNotaMinima] = useState<number>(4);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioFim, setHorarioFim] = useState("18:00");
  const [avancadoAberto, setAvancadoAberto] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Progresso do step
  const getStepProgress = () => {
    return currentStep * 25;
  };

  // Validação dos campos
  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!nome.trim()) {
        newErrors.nome = "O nome da campanha é obrigatório";
      }
      
      const dias = parseInt(diasAposEvento);
      if (isNaN(dias) || dias < 0 || dias > 30) {
        newErrors.diasAposEvento = "Informe um número entre 0 e 30";
      }
    }
    
    if (step === 2) {
      if (!linkAvaliacao.trim()) {
        newErrors.linkAvaliacao = "O link de avaliação é obrigatório";
      } else {
        try {
          new URL(linkAvaliacao);
        } catch (e) {
          newErrors.linkAvaliacao = "Informe um link válido";
        }
      }
    }
    
    if (step === 3) {
      if (!mensagemTemplate.trim()) {
        newErrors.mensagemTemplate = "A mensagem é obrigatória";
      }
      
      if (!mensagemTemplate.includes("{{link_avaliacao}}")) {
        newErrors.mensagemTemplate = "A mensagem deve incluir a variável {{link_avaliacao}}";
      }
      
      if (mensagemTemplate.length > 1000) {
        newErrors.mensagemTemplate = "A mensagem deve ter no máximo 1000 caracteres";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipuladores de navegação
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as Step);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Substituição de variáveis para preview
  const getPreviewMessage = () => {
    const exemploSubstituicoes = {
      '{{nome_cliente}}': 'João Silva',
      '{{nome_empresa}}': 'Clínica Dental',
      '{{servico}}': 'Limpeza dental',
      '{{data_evento}}': '15/05/2024',
      '{{link_avaliacao}}': 'https://rep.viva/w/a1b2c3'
    };

    let messagePreviewed = mensagemTemplate;
    Object.entries(exemploSubstituicoes).forEach(([key, value]) => {
      messagePreviewed = messagePreviewed.replace(new RegExp(key, 'g'), value);
    });

    return messagePreviewed;
  };

  // Geração de link rastreável de exemplo
  const getLinkRastreavel = () => {
    return `https://rep.viva/w/${generateRandomId()}?cliente=123&campanha=456`;
  };

  // Gerar ID aleatório para links
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // Salvar ou criar campanha
  const handleSaveDraft = async () => {
    try {
      const campanha = buildCampanhaObject("rascunho");
      await createCampaign(
        campanha.nome,
        "", // descrição não é usada no MVP
        notaMinima
      );
      onSave(campanha);
      toast.success(`Campanha "${nome}" salva como rascunho!`);
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar rascunho da campanha.");
      console.error("Erro ao salvar campanha:", error);
    }
  };

  const handleCreateCampaign = async () => {
    // Validar todos os steps antes de criar
    const step1Valid = validateStep(1);
    const currentStepBackup = currentStep;
    
    setCurrentStep(2);
    const step2Valid = validateStep(2);
    
    setCurrentStep(3);
    const step3Valid = validateStep(3);
    
    setCurrentStep(currentStepBackup);
    
    if (!(step1Valid && step2Valid && step3Valid)) {
      toast.error("Por favor, corrija os erros antes de criar a campanha.");
      return;
    }
    
    try {
      const campanha = buildCampanhaObject("ativa");
      await createCampaign(
        campanha.nome,
        "", // descrição não é usada no MVP
        notaMinima
      );
      onSave(campanha);
      toast.success(`Campanha "${nome}" criada com sucesso!`);
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar campanha.");
      console.error("Erro ao criar campanha:", error);
    }
  };

  // Criar objeto de campanha
  const buildCampanhaObject = (status: "ativa" | "rascunho") => {
    return {
      id: generateRandomId(),
      nome,
      canais: ["whatsapp"],
      mensagens: {
        whatsapp: mensagemTemplate
      },
      status,
      diasAposEvento: parseInt(diasAposEvento),
      plataformaAvaliacao,
      linkAvaliacao,
      notaMinima,
      horarioEnvio: {
        inicio: horarioInicio,
        fim: horarioFim
      },
      dataCriacao: new Date().toISOString(),
      progresso: 0,
      estatisticas: {
        enviados: 0,
        abertos: 0,
        clicados: 0,
        avaliados: 0
      }
    };
  };

  // Resetar formulário
  const resetForm = () => {
    setCurrentStep(1);
    setNome("");
    setDiasAposEvento("3");
    setPlataformaAvaliacao("google");
    setLinkAvaliacao("");
    setMensagemTemplate("Olá {{nome_cliente}}! 👋\n\nComo foi sua experiência na {{nome_empresa}}?\nSua opinião é muito importante para nós! 😊\n\nClique aqui para avaliar: {{link_avaliacao}}\n\nAgradecemos sua confiança! 🙏");
    setNotaMinima(4);
    setHorarioInicio("08:00");
    setHorarioFim("18:00");
    setAvancadoAberto(false);
    setErrors({});
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Renderização condicional dos passos
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-base font-medium">Nome da Campanha *</Label>
              <Input
                id="nome"
                placeholder="Ex: Pós-Consulta Médica"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={cn(errors.nome && "border-red-500")}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasAposEvento" className="text-base font-medium">
                Enviar após quantos dias do evento? *
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="diasAposEvento"
                  type="number"
                  min="0"
                  max="30"
                  value={diasAposEvento}
                  onChange={(e) => setDiasAposEvento(e.target.value)}
                  className={cn("w-20", errors.diasAposEvento && "border-red-500")}
                />
                <span>dias</span>
              </div>
              {errors.diasAposEvento ? (
                <p className="text-red-500 text-sm mt-1">{errors.diasAposEvento}</p>
              ) : (
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Info className="h-4 w-4 mr-1" />
                  Recomendamos entre 1-7 dias para melhor resposta
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">🎯 Onde o cliente será direcionado para avaliar?</Label>
            
            <RadioGroup 
              value={plataformaAvaliacao} 
              onValueChange={(value) => setPlataformaAvaliacao(value as PlataformaAvaliacao)}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="google" id="google" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="google" className="font-medium">
                      Google Meu Negócio (Recomendado)
                    </Label>
                    <Input
                      placeholder="https://g.page/seu-negocio/review"
                      value={plataformaAvaliacao === "google" ? linkAvaliacao : ""}
                      onChange={(e) => setLinkAvaliacao(e.target.value)}
                      disabled={plataformaAvaliacao !== "google"}
                      className={cn(plataformaAvaliacao === "google" && errors.linkAvaliacao && "border-red-500")}
                    />
                    {plataformaAvaliacao === "google" && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Cole o link do seu perfil do Google
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="facebook" id="facebook" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="facebook" className="font-medium">
                      Facebook
                    </Label>
                    <Input
                      placeholder="https://facebook.com/sua-pagina"
                      value={plataformaAvaliacao === "facebook" ? linkAvaliacao : ""}
                      onChange={(e) => setLinkAvaliacao(e.target.value)}
                      disabled={plataformaAvaliacao !== "facebook"}
                      className={cn(plataformaAvaliacao === "facebook" && errors.linkAvaliacao && "border-red-500")}
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="personalizado" id="personalizado" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="personalizado" className="font-medium">
                      Link Personalizado
                    </Label>
                    <Input
                      placeholder="https://seu-site.com/avaliacoes"
                      value={plataformaAvaliacao === "personalizado" ? linkAvaliacao : ""}
                      onChange={(e) => setLinkAvaliacao(e.target.value)}
                      disabled={plataformaAvaliacao !== "personalizado"}
                      className={cn(plataformaAvaliacao === "personalizado" && errors.linkAvaliacao && "border-red-500")}
                    />
                  </div>
                </div>
              </div>
            </RadioGroup>
            
            {errors.linkAvaliacao && (
              <p className="text-red-500 text-sm">{errors.linkAvaliacao}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mensagemTemplate" className="text-base font-medium">
                💬 Mensagem do WhatsApp
              </Label>
              <p className="text-sm text-gray-500">✏️ Personalize sua mensagem:</p>
              <Textarea
                id="mensagemTemplate"
                value={mensagemTemplate}
                onChange={(e) => setMensagemTemplate(e.target.value)}
                className={cn("min-h-[200px] font-sans", errors.mensagemTemplate && "border-red-500")}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Caracteres: {mensagemTemplate.length}/1000</span>
                {mensagemTemplate.includes("{{link_avaliacao}}") && (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Link de avaliação incluído
                  </span>
                )}
              </div>
              {errors.mensagemTemplate && (
                <p className="text-red-500 text-sm">{errors.mensagemTemplate}</p>
              )}
            </div>

            <div className="space-y-2 border rounded-md p-4 bg-gray-50">
              <p className="font-medium text-sm">🏷️ Variáveis Disponíveis:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="text-gray-700">
                  <code className="bg-blue-100 px-1 rounded">{'{{nome_cliente}}'}</code> - Nome do cliente
                </div>
                <div className="text-gray-700">
                  <code className="bg-blue-100 px-1 rounded">{'{{nome_empresa}}'}</code> - Nome da sua empresa
                </div>
                <div className="text-gray-700">
                  <code className="bg-blue-100 px-1 rounded">{'{{servico}}'}</code> - Serviço prestado (opcional)
                </div>
                <div className="text-gray-700">
                  <code className="bg-blue-100 px-1 rounded">{'{{data_evento}}'}</code> - Data do evento
                </div>
                <div className="text-gray-700">
                  <code className="bg-blue-100 px-1 rounded">{'{{link_avaliacao}}'}</code> - Link para avaliação (automático)
                </div>
              </div>
            </div>

            <div className="space-y-2 border rounded-md p-4 bg-blue-50">
              <p className="font-medium text-sm text-blue-800">💡 Dicas para melhor conversão:</p>
              <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
                <li>Use emojis para deixar mais amigável 😊</li>
                <li>Mantenha a mensagem curta e objetiva</li>
                <li>Seja educado e agradeça</li>
                <li>Explique a importância da avaliação</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium text-lg mb-3">👁️ Preview da Mensagem</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Clínica Dental</p>
                      <p className="text-xs text-gray-500">WhatsApp Business</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-gray-800 relative border-l-4 border-green-500">
                    <div className="whitespace-pre-line text-sm">
                      {getPreviewMessage()}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-right">Agora</div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4">
                <p className="text-sm font-medium">🔗 Link que será gerado:</p>
                <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all mt-1">
                  {getLinkRastreavel()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Check className="h-3 w-3 mr-1" /> 
                  Link rastreável e único para cada cliente
                </p>
              </div>
            </div>

            <Collapsible 
              open={avancadoAberto} 
              onOpenChange={setAvancadoAberto}
              className="border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                ⚙️ Configurações Avançadas
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform", 
                  avancadoAberto && "rotate-90"
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 border-t space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Nota mínima para direcionar à avaliação externa:</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <Button
                        key={nota}
                        type="button"
                        variant={notaMinima === nota ? "default" : "outline"}
                        className="h-10 w-10 p-0"
                        onClick={() => setNotaMinima(nota)}
                      >
                        {nota}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Notas abaixo disso serão filtradas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Horário preferencial para envio:</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                      className="w-24"
                    />
                    <span>às</span>
                    <Input
                      type="time"
                      value={horarioFim}
                      onChange={(e) => setHorarioFim(e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Envios apenas neste intervalo
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Informações Básicas",
    "Destino da Avaliação",
    "Template da Mensagem",
    "Revisar e Finalizar"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium flex items-center gap-2">
            ✨ Nova Campanha{" "}
            <span className="text-sm font-normal text-gray-500">
              (Passo {currentStep} de 4: {stepTitles[currentStep - 1]})
            </span>
          </DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Progress value={getStepProgress()} className="h-2 mb-6" />
        
        <div className="py-4">
          {renderStep()}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={goToPreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {currentStep < 4 && (
              <Button onClick={goToNextStep}>
                Avançar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          {currentStep === 4 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                📄 Salvar como Rascunho
              </Button>
              <Button 
                className="bg-[#10B981] hover:bg-[#0b7a69]"
                onClick={handleCreateCampaign}
              >
                🚀 Criar Campanha
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
