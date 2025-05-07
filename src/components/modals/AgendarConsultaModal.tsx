
import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgendarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contatoId: string;
  contatoNome: string;
}

// Lista de especialidades odontológicas comuns
const especialidades = [
  "Consulta Inicial",
  "Avaliação",
  "Limpeza",
  "Clareamento",
  "Ortodontia",
  "Endodontia",
  "Periodontia",
  "Implante",
  "Prótese",
  "Cirurgia",
  "Odontopediatria",
  "Radiografia"
];

export default function AgendarConsultaModal({ 
  isOpen, 
  onClose, 
  contatoId,
  contatoNome
}: AgendarConsultaModalProps) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erros, setErros] = useState<{[key: string]: string}>({});

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};
    
    if (!data) novosErros.data = "A data é obrigatória";
    if (!hora) novosErros.hora = "A hora é obrigatória";
    if (!especialidade) novosErros.especialidade = "A especialidade é obrigatória";
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    // Dados do agendamento
    const novoAgendamento = {
      id: `agend-${Date.now()}`,
      contatoId,
      data: `${data}T${hora}:00`,
      especialidade,
      observacoes,
      status: "Agendado",
      criadoEm: new Date().toISOString()
    };
    
    // Aqui poderia salvar no estado global ou banco de dados
    // Por enquanto, vamos simular o salvamento
    
    toast({
      title: "Agendamento salvo",
      description: `Consulta de ${especialidade} agendada para ${format(new Date(`${data}T${hora}:00`), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`,
    });
    
    // Limpar campos e fechar modal
    setData("");
    setHora("");
    setEspecialidade("");
    setObservacoes("");
    setErros({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Agendar Consulta</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Paciente</Label>
            <div className="p-2 bg-gray-50 border rounded-md text-sm font-medium">
              {contatoNome}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="data" className={erros.data ? "text-red-500" : ""}>
                Data da Consulta*
              </Label>
              <div className="relative">
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={`pl-10 ${erros.data ? "border-red-500" : ""}`}
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {erros.data && <p className="text-sm text-red-500">{erros.data}</p>}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="hora" className={erros.hora ? "text-red-500" : ""}>
                Hora da Consulta*
              </Label>
              <div className="relative">
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className={`pl-10 ${erros.hora ? "border-red-500" : ""}`}
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {erros.hora && <p className="text-sm text-red-500">{erros.hora}</p>}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="especialidade" className={erros.especialidade ? "text-red-500" : ""}>
              Serviço/Especialidade*
            </Label>
            <Select
              value={especialidade}
              onValueChange={setEspecialidade}
            >
              <SelectTrigger className={erros.especialidade ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.especialidade && <p className="text-sm text-red-500">{erros.especialidade}</p>}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="observacoes">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre o agendamento"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
