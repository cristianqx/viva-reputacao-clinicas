
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NovoContatoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contato: any) => void;
}

export function NovoContatoModal({ open, onOpenChange, onSave }: NovoContatoModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("SP");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [origem, setOrigem] = useState("manual");
  
  // Validação básica
  const isValidEmail = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = telefone === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone);
  const isValid = nome.trim() !== "" && isValidEmail && isValidPhone;
  
  const handleAddTag = () => {
    if (tag.trim() !== "" && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSalvar = () => {
    if (!isValid) return;
    
    const novoContato = {
      id: Date.now().toString(),
      nome,
      email: email || undefined,
      telefone: telefone || undefined,
      endereco: endereco || undefined,
      cidade: cidade || undefined,
      estado: estado || undefined,
      tags: tags.length > 0 ? tags : undefined,
      origem,
      dataRegistro: new Date().toISOString()
    };
    
    onSave(novoContato);
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setCidade("");
    setEstado("SP");
    setTag("");
    setTags([]);
    setOrigem("manual");
  };
  
  const formatTelefone = (value: string) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, "");
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (cleanValue.length <= 2) {
      return cleanValue;
    } else if (cleanValue.length <= 7) {
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
    } else {
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
    }
  };
  
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTelefone(e.target.value);
    setTelefone(formattedValue);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input 
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className={!isValidEmail ? "border-red-500" : ""}
            />
            {!isValidEmail && (
              <p className="text-xs text-red-500">Digite um e-mail válido</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="telefone">Celular</Label>
            <Input 
              id="telefone"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(11) 98765-4321"
              maxLength={15}
              className={!isValidPhone ? "border-red-500" : ""}
            />
            {!isValidPhone && (
              <p className="text-xs text-red-500">Digite um telefone válido: (11) 98765-4321</p>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, complemento"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input 
                id="cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">Acre</SelectItem>
                <SelectItem value="AL">Alagoas</SelectItem>
                <SelectItem value="AP">Amapá</SelectItem>
                <SelectItem value="AM">Amazonas</SelectItem>
                <SelectItem value="BA">Bahia</SelectItem>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="DF">Distrito Federal</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="GO">Goiás</SelectItem>
                <SelectItem value="MA">Maranhão</SelectItem>
                <SelectItem value="MT">Mato Grosso</SelectItem>
                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="PA">Pará</SelectItem>
                <SelectItem value="PB">Paraíba</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
                <SelectItem value="PE">Pernambuco</SelectItem>
                <SelectItem value="PI">Piauí</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO">Rondônia</SelectItem>
                <SelectItem value="RR">Roraima</SelectItem>
                <SelectItem value="SC">Santa Catarina</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="SE">Sergipe</SelectItem>
                <SelectItem value="TO">Tocantins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="origem">Origem</Label>
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger id="origem">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Cadastro manual</SelectItem>
                <SelectItem value="site">Site</SelectItem>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="campanha">Campanha</SelectItem>
                <SelectItem value="agenda">Agenda Odontológica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center">
              <Input 
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite e pressione Enter"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleAddTag}
                className="ml-2"
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t, index) => (
                  <Badge key={index} variant="outline" className="gap-1 py-1 pl-2 pr-1">
                    {t}
                    <button 
                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5" 
                      onClick={() => handleRemoveTag(t)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
            <UserPlus className="mr-2 h-4 w-4" />
            Salvar contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
