
import { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface NovoContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contato: any) => void;
}

export default function NovoContatoModal({ isOpen, onClose, onSave }: NovoContatoModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [origem, setOrigem] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [showImportOptions, setShowImportOptions] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImportWhatsApp = () => {
    // Simulação de importação do WhatsApp
    toast({
      title: "Importação iniciada",
      description: "Conectando à API do WhatsApp Business...",
    });
    
    // Simulando conclusão após 2 segundos
    setTimeout(() => {
      toast({
        title: "Importação concluída",
        description: "10 contatos foram importados do WhatsApp Business",
      });
      setShowImportOptions(false);
    }, 2000);
  };

  const handleImportCSV = () => {
    // Simulação de importação CSV
    toast({
      description: "Funcionalidade de importação CSV será implementada em breve",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do contato é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const novoContato = {
      id: Date.now().toString(),
      nome,
      email: email || undefined,
      telefone: telefone || undefined,
      origem: origem || "Manual",
      tags,
      dataRegistro: new Date().toISOString(),
    };

    onSave(novoContato);
    toast({
      title: "Sucesso",
      description: "Contato cadastrado com sucesso!",
    });
    
    // Reset form
    setNome("");
    setEmail("");
    setTelefone("");
    setOrigem("");
    setTags([]);
    setShowImportOptions(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Novo Contato</DialogTitle>
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
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="Ex: (00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Select
                value={origem}
                onValueChange={setOrigem}
              >
                <SelectTrigger id="origem">
                  <SelectValue placeholder="Selecione uma origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agenda Odontológica">Agenda Odontológica</SelectItem>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Formulário Interno">Formulário Interno</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Campanha">Campanha</SelectItem>
                  <SelectItem value="Manual">Cadastro Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tags">Tags</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowImportOptions(!showImportOptions)}
                >
                  <Upload className="h-4 w-4 mr-1" /> 
                  Importar contatos
                </Button>
              </div>
              
              {showImportOptions && (
                <div className="p-3 bg-gray-50 rounded-md space-y-2 mb-2">
                  <h4 className="text-sm font-medium">Opções de importação</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={handleImportWhatsApp}
                    >
                      WhatsApp Business
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={handleImportCSV}
                    >
                      Arquivo CSV
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  placeholder="Adicione tags (ex: Ortodontia)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1">
                      {tag}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
