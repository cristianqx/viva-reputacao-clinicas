
import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface FiltrosAvancadosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filtros: any) => void;
  tipo: "campanhas" | "contatos" | "avaliacoes";
}

export default function FiltrosAvancadosModal({ isOpen, onClose, onApply, tipo }: FiltrosAvancadosModalProps) {
  const [filtros, setFiltros] = useState({
    // Filtros comuns
    periodo: "todos",
    
    // Filtros específicos para cada tipo
    // Campanhas
    tipoCampanha: "",
    origem: "",
    status: "",
    
    // Contatos
    origemContato: "",
    comEmail: false,
    comTelefone: false,
    comAvaliacao: false,
    tags: "",
    
    // Avaliações
    plataforma: "",
    nota: "",
    respondidas: false,
  });

  const handleChange = (campo: string, valor: any) => {
    setFiltros({
      ...filtros,
      [campo]: valor,
    });
  };

  const handleApply = () => {
    onApply(filtros);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Filtros avançados</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={filtros.periodo}
                onValueChange={(valor) => handleChange("periodo", valor)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                  <SelectItem value="todos">Todo o período</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtros específicos para campanhas */}
            {tipo === "campanhas" && (
              <>
                <div className="space-y-2">
                  <Label>Tipo de campanha</Label>
                  <Select
                    value={filtros.tipoCampanha}
                    onValueChange={(valor) => handleChange("tipoCampanha", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Origem dos contatos</Label>
                  <Select
                    value={filtros.origem}
                    onValueChange={(valor) => handleChange("origem", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as origens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agenda Odontológica">Agenda Odontológica</SelectItem>
                      <SelectItem value="Lista manual">Lista manual</SelectItem>
                      <SelectItem value="Importação CSV">Importação CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filtros.status}
                    onValueChange={(valor) => handleChange("status", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* Filtros específicos para contatos */}
            {tipo === "contatos" && (
              <>
                <div className="space-y-2">
                  <Label>Origem</Label>
                  <Select
                    value={filtros.origemContato}
                    onValueChange={(valor) => handleChange("origemContato", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as origens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agenda Odontológica">Agenda Odontológica</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Campanha">Campanha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input 
                    placeholder="Pesquisar por tags (ex: Ortodontia)" 
                    value={filtros.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="comEmail" 
                      checked={filtros.comEmail}
                      onCheckedChange={(checked) => handleChange("comEmail", checked)}
                    />
                    <Label htmlFor="comEmail">Apenas com email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="comTelefone" 
                      checked={filtros.comTelefone}
                      onCheckedChange={(checked) => handleChange("comTelefone", checked)}
                    />
                    <Label htmlFor="comTelefone">Apenas com telefone</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="comAvaliacao" 
                      checked={filtros.comAvaliacao}
                      onCheckedChange={(checked) => handleChange("comAvaliacao", checked)}
                    />
                    <Label htmlFor="comAvaliacao">Apenas com avaliação</Label>
                  </div>
                </div>
              </>
            )}
            
            {/* Filtros específicos para avaliações */}
            {tipo === "avaliacoes" && (
              <>
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select
                    value={filtros.plataforma}
                    onValueChange={(valor) => handleChange("plataforma", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as plataformas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Doctoralia">Doctoralia</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Nota</Label>
                  <Select
                    value={filtros.nota}
                    onValueChange={(valor) => handleChange("nota", valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as notas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 estrelas</SelectItem>
                      <SelectItem value="4">4 estrelas</SelectItem>
                      <SelectItem value="3">3 estrelas</SelectItem>
                      <SelectItem value="2">2 estrelas</SelectItem>
                      <SelectItem value="1">1 estrela</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="respondidas" 
                      checked={filtros.respondidas}
                      onCheckedChange={(checked) => handleChange("respondidas", checked)}
                    />
                    <Label htmlFor="respondidas">Apenas respondidas</Label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Limpar filtros
          </Button>
          <Button onClick={handleApply}>
            <Check className="h-4 w-4 mr-2" />
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
