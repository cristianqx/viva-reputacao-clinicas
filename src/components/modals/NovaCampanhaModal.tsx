
import { useState } from "react";
import { X, Mail, Phone, Calendar } from "lucide-react";
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

interface NovaCampanhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campanha: any) => void;
}

export default function NovaCampanhaModal({ isOpen, onClose, onSave }: NovaCampanhaModalProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"email" | "sms">("email");
  const [mensagem, setMensagem] = useState("");
  const [origem, setOrigem] = useState("");
  const [disparo, setDisparo] = useState<"automatico" | "manual">("manual");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [recorrencia, setRecorrencia] = useState("diaria");

  // Preview de email/SMS
  const renderPreview = () => {
    if (tipo === "email") {
      return (
        <div className="border rounded-md p-4 bg-white">
          <div className="border-b pb-2 mb-2">
            <div className="font-bold">Assunto: Avalie sua experiência na Clínica Dental</div>
            <div className="text-gray-500 text-sm">De: Reputação Viva</div>
            <div className="text-gray-500 text-sm">Para: paciente@email.com</div>
          </div>
          <div className="py-2">
            {mensagem || "Sua mensagem personalizada aparecerá aqui..."}
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
    } else {
      return (
        <div className="border rounded-md p-4 bg-gray-50 max-w-xs mx-auto">
          <div className="bg-green-100 p-3 rounded-lg text-gray-800 relative">
            <div className="mb-2 font-medium">Clínica Dental</div>
            <p className="text-sm">
              {mensagem || "Avalie sua experiência na Clínica Dental: https://rep.viva/a1b2c3"}
            </p>
            <div className="text-xs text-gray-500 mt-2 text-right">14:25</div>
          </div>
        </div>
      );
    }
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

    const novaCampanha = {
      id: Date.now().toString(),
      nome,
      tipo,
      status: dataAgendamento ? "agendada" : "rascunho",
      agendada: !!dataAgendamento,
      dataAgendamento: dataAgendamento || undefined,
      dataCriacao: new Date().toISOString(),
      mensagem,
      origem,
      disparo,
      recorrente: isRecorrente,
      recorrencia: isRecorrente ? recorrencia : undefined,
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
      description: "Campanha criada com sucesso!",
    });
    
    // Reset form
    setNome("");
    setTipo("email");
    setMensagem("");
    setOrigem("");
    setDisparo("manual");
    setDataAgendamento("");
    setIsRecorrente(false);
    setRecorrencia("diaria");
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
              <Label>Tipo de campanha</Label>
              <RadioGroup 
                className="flex space-x-4" 
                defaultValue="email" 
                value={tipo}
                onValueChange={(value) => setTipo(value as "email" | "sms")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="tipo-email" />
                  <Label htmlFor="tipo-email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="tipo-sms" />
                  <Label htmlFor="tipo-sms" className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    SMS
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Texto da mensagem</Label>
                  <Textarea
                    id="mensagem"
                    placeholder={tipo === "email" ? "Digite o texto do email..." : "Digite sua mensagem SMS (máx. 160 caracteres)"}
                    rows={5}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    maxLength={tipo === "sms" ? 160 : undefined}
                  />
                  {tipo === "sms" && (
                    <div className="text-right text-xs text-gray-500">
                      {mensagem.length}/160 caracteres
                    </div>
                  )}
                </div>
                
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
