
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, RadioGroup, RadioIndicator, RadioItem } from "@radix-ui/react-radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface NovaCampanhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (campanha: any) => void;
}

export function NovaCampanhaModal({ open, onOpenChange, onSave }: NovaCampanhaModalProps) {
  const [nomeCampanha, setNomeCampanha] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("whatsapp");
  const [mensagem, setMensagem] = useState("");
  const [tipoDisparo, setTipoDisparo] = useState("manual");
  const [dataDisparo, setDataDisparo] = useState<Date | undefined>();
  const [recorrencia, setRecorrencia] = useState("unica");
  const [intervaloRecorrencia, setIntervaloRecorrencia] = useState("7");
  const [tagsContatos, setTagsContatos] = useState("todos");
  const [diasApos, setDiasApos] = useState("7");
  const [eventos, setEventos] = useState<string[]>([]);
  
  // Validações
  const isValid = nomeCampanha.trim() !== "" && mensagem.trim() !== "";
  
  const handleSalvar = () => {
    if (!isValid) return;
    
    const novaCampanha = {
      id: Date.now().toString(),
      nome: nomeCampanha,
      tipoMensagem,
      mensagem,
      tipoDisparo,
      dataDisparo,
      recorrencia,
      intervaloRecorrencia: parseInt(intervaloRecorrencia),
      tagsContatos,
      diasApos: parseInt(diasApos),
      eventos,
      status: "ativa",
      dataCriacao: new Date().toISOString()
    };
    
    onSave(novaCampanha);
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNomeCampanha("");
    setTipoMensagem("whatsapp");
    setMensagem("");
    setTipoDisparo("manual");
    setDataDisparo(undefined);
    setRecorrencia("unica");
    setIntervaloRecorrencia("7");
    setTagsContatos("todos");
    setDiasApos("7");
    setEventos([]);
  };
  
  const toggleEvento = (evento: string) => {
    if (eventos.includes(evento)) {
      setEventos(eventos.filter(e => e !== evento));
    } else {
      setEventos([...eventos, evento]);
    }
  };
  
  // Preview de mensagem
  const getPreview = () => {
    let previewContent = mensagem;
    
    if (previewContent.trim() === "") {
      return (
        <div className="text-center py-6 text-gray-400">
          <AlertCircle className="mx-auto h-12 w-12 mb-2" />
          <p>Digite uma mensagem para ver o preview</p>
        </div>
      );
    }
    
    // Simular substituição de variáveis
    previewContent = previewContent
      .replace(/\{nome\}/g, "João Silva")
      .replace(/\{data\}/g, format(new Date(), "dd/MM/yyyy"))
      .replace(/\{hora\}/g, "14:30")
      .replace(/\{clinica\}/g, "Clínica Dental");
      
    return (
      <div className={
        tipoMensagem === "whatsapp" 
          ? "bg-gray-100 p-4 rounded-lg border border-gray-200"
          : "bg-white p-4 rounded-lg border border-gray-200"
      }>
        {previewContent}
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome-campanha">Nome da campanha *</Label>
            <Input 
              id="nome-campanha"
              value={nomeCampanha}
              onChange={(e) => setNomeCampanha(e.target.value)}
              placeholder="Ex: Lembrete de consulta"
            />
          </div>
          
          <Tabs defaultValue="whatsapp" value={tipoMensagem} onValueChange={setTipoMensagem}>
            <Label>Tipo de mensagem *</Label>
            <TabsList className="grid grid-cols-3 mt-2">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="email">E-mail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="whatsapp" className="mt-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="mensagem-whatsapp">Mensagem *</Label>
                  <Textarea 
                    id="mensagem-whatsapp"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Olá {nome}, gostaríamos de confirmar sua consulta para o dia {data} às {hora} na {clinica}."
                    className="min-h-[120px] mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {"{nome}"}, {"{data}"}, {"{hora}"} e {"{clinica}"} para personalizar a mensagem.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Preview</h4>
                  {getPreview()}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sms" className="mt-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="mensagem-sms">Mensagem *</Label>
                  <Textarea 
                    id="mensagem-sms"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Olá {nome}, confirmamos sua consulta para {data} às {hora}. Atenciosamente, {clinica}."
                    className="min-h-[120px] mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {"{nome}"}, {"{data}"}, {"{hora}"} e {"{clinica}"} para personalizar a mensagem.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Preview</h4>
                  {getPreview()}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input 
                    id="assunto"
                    placeholder="Confirmação de consulta"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mensagem-email">Mensagem *</Label>
                  <Textarea 
                    id="mensagem-email"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Olá {nome},&#10;&#10;Confirmamos sua consulta para o dia {data} às {hora}.&#10;&#10;Atenciosamente,&#10;Equipe {clinica}"
                    className="min-h-[150px] mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {"{nome}"}, {"{data}"}, {"{hora}"} e {"{clinica}"} para personalizar a mensagem.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Preview</h4>
                  {getPreview()}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Configurações de disparo</h4>
            
            <div className="grid gap-4">
              <div>
                <Label className="mb-2 block">Tipo de disparo</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="disparo-manual" 
                      checked={tipoDisparo === "manual"}
                      onChange={() => setTipoDisparo("manual")}
                      className="h-4 w-4 text-primary" 
                    />
                    <label htmlFor="disparo-manual" className="text-sm font-medium">
                      Disparo manual
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="disparo-programado" 
                      checked={tipoDisparo === "programado"}
                      onChange={() => setTipoDisparo("programado")}
                      className="h-4 w-4 text-primary" 
                    />
                    <label htmlFor="disparo-programado" className="text-sm font-medium">
                      Disparo programado
                    </label>
                  </div>
                  
                  {tipoDisparo === "programado" && (
                    <div className="ml-6 mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataDisparo ? format(dataDisparo, "dd/MM/yyyy") : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataDisparo}
                            onSelect={setDataDisparo}
                            initialFocus
                            locale={ptBR}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="disparo-automatico" 
                      checked={tipoDisparo === "automatico"}
                      onChange={() => setTipoDisparo("automatico")}
                      className="h-4 w-4 text-primary" 
                    />
                    <label htmlFor="disparo-automatico" className="text-sm font-medium">
                      Disparo automático
                    </label>
                  </div>
                  
                  {tipoDisparo === "automatico" && (
                    <div className="ml-6 mt-1 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dias-apos" className="text-sm">Dias após</Label>
                          <Select value={diasApos} onValueChange={setDiasApos}>
                            <SelectTrigger id="dias-apos" className="mt-1">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 dia</SelectItem>
                              <SelectItem value="2">2 dias</SelectItem>
                              <SelectItem value="3">3 dias</SelectItem>
                              <SelectItem value="5">5 dias</SelectItem>
                              <SelectItem value="7">7 dias</SelectItem>
                              <SelectItem value="14">14 dias</SelectItem>
                              <SelectItem value="30">30 dias</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="evento" className="text-sm">Evento</Label>
                          <Select defaultValue="consulta">
                            <SelectTrigger id="evento" className="mt-1">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consulta">Consulta</SelectItem>
                              <SelectItem value="aniversario">Aniversário</SelectItem>
                              <SelectItem value="cadastro">Cadastro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm block mb-1">Condições (opcional)</Label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch id="tag-ortodontia" checked={eventos.includes("ortodontia")} onCheckedChange={() => toggleEvento("ortodontia")} />
                            <Label htmlFor="tag-ortodontia" className="text-sm font-normal">Tag: Ortodontia</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="tag-implante" checked={eventos.includes("implante")} onCheckedChange={() => toggleEvento("implante")} />
                            <Label htmlFor="tag-implante" className="text-sm font-normal">Tag: Implante</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="tag-limpeza" checked={eventos.includes("limpeza")} onCheckedChange={() => toggleEvento("limpeza")} />
                            <Label htmlFor="tag-limpeza" className="text-sm font-normal">Tag: Limpeza</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Recorrência</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="recorrencia-unica" 
                      checked={recorrencia === "unica"}
                      onChange={() => setRecorrencia("unica")}
                      className="h-4 w-4 text-primary" 
                    />
                    <label htmlFor="recorrencia-unica" className="text-sm font-medium">
                      Campanha única
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="recorrencia-repetir" 
                      checked={recorrencia === "repetir"}
                      onChange={() => setRecorrencia("repetir")}
                      className="h-4 w-4 text-primary" 
                    />
                    <label htmlFor="recorrencia-repetir" className="text-sm font-medium">
                      Repetir campanha
                    </label>
                  </div>
                  
                  {recorrencia === "repetir" && (
                    <div className="ml-6 mt-1 grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="intervalo-recorrencia" className="text-sm">A cada</Label>
                        <Select value={intervaloRecorrencia} onValueChange={setIntervaloRecorrencia}>
                          <SelectTrigger id="intervalo-recorrencia" className="mt-1">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 dias</SelectItem>
                            <SelectItem value="14">14 dias</SelectItem>
                            <SelectItem value="30">30 dias</SelectItem>
                            <SelectItem value="60">60 dias</SelectItem>
                            <SelectItem value="90">90 dias</SelectItem>
                            <SelectItem value="180">180 dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags-contatos" className="mb-2 block">Contatos</Label>
                <Select value={tagsContatos} onValueChange={setTagsContatos}>
                  <SelectTrigger id="tags-contatos">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os contatos</SelectItem>
                    <SelectItem value="ortodontia">Tag: Ortodontia</SelectItem>
                    <SelectItem value="implante">Tag: Implante</SelectItem>
                    <SelectItem value="limpeza">Tag: Limpeza</SelectItem>
                    <SelectItem value="plano-amil">Tag: Plano Amil</SelectItem>
                    <SelectItem value="plano-bradesco">Tag: Plano Bradesco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar} 
            className="w-full sm:w-auto"
            disabled={!isValid}
          >
            Salvar campanha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
