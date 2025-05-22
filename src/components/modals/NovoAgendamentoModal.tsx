
import { useState, useEffect } from "react";
import { Calendar, Clock, X, PlusCircle, UserPlus } from "lucide-react";
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
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getContatos, Contato } from "@/services/contatosService";

interface NovoAgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contatoId?: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoTelefone?: string;
}

// Lista de serviços comuns - Agora com opções mais genéricas
const tiposServicos = [
  "Consulta/Atendimento",
  "Serviço Técnico",
  "Venda de Produto",
  "Sessão/Aula",
  "Manutenção",
  "Treinamento",
  "Entrega",
  "Consultoria",
  "Outro"
];

export default function NovoAgendamentoModal({ 
  isOpen, 
  onClose, 
  contatoId,
  contatoNome,
  contatoEmail,
  contatoTelefone
}: NovoAgendamentoModalProps) {
  // All hooks must be declared at the top level of the component
  const { tryAccess } = useFeatureAccess();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [nome, setNome] = useState(contatoNome || "");
  const [telefone, setTelefone] = useState(contatoTelefone || "");
  const [email, setEmail] = useState(contatoEmail || "");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [tipoServicoCustom, setTipoServicoCustom] = useState("");
  const [profissional, setProfissional] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erros, setErros] = useState<{[key: string]: string}>({});
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Check feature access and set hasAccess state
  useEffect(() => {
    const access = tryAccess("agendamento", "Premium");
    setHasAccess(access);
  }, [tryAccess]);
  
  // Fetch contatos when the modal is opened
  useEffect(() => {
    if (isOpen && !contatoId) {
      buscarContatos();
    }
  }, [isOpen, contatoId]);

  // Função para buscar contatos
  const buscarContatos = async () => {
    try {
      const contatosData = await getContatos();
      setContatos(contatosData);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  };

  // Early return if no access, but after all hooks are declared
  if (!hasAccess) {
    return null;
  }

  // Formatar telefone com máscara brasileira
  const formatarTelefone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, '');
    
    // Aplica a máscara
    let numeroFormatado = numeroLimpo;
    if (numeroLimpo.length <= 10) {
      // Formato: (99) 9999-9999
      if (numeroLimpo.length > 2) {
        numeroFormatado = `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2)}`;
      }
      if (numeroLimpo.length > 6) {
        numeroFormatado = `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6, 10)}`;
      }
    } else {
      // Formato: (99) 99999-9999
      if (numeroLimpo.length > 2) {
        numeroFormatado = `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2)}`;
      }
      if (numeroLimpo.length > 7) {
        numeroFormatado = `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7, 11)}`;
      }
    }
    
    return numeroFormatado;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};
    
    if (!nome) novosErros.nome = "O nome do cliente é obrigatório";
    if (!telefone) novosErros.telefone = "O telefone é obrigatório";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = "E-mail inválido";
    if (!data) novosErros.data = "A data é obrigatória";
    if (!hora) novosErros.hora = "A hora é obrigatória";
    if (!tipoServico) novosErros.tipoServico = "O tipo de interação é obrigatório";
    if (tipoServico === "Outro" && !tipoServicoCustom) novosErros.tipoServicoCustom = "Por favor, especifique a categoria";
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    // Determinando o tipo de serviço final (personalizado ou padrão)
    const servicoFinal = tipoServico === "Outro" ? tipoServicoCustom : tipoServico;
    
    // Dados do agendamento (para integração futura com backend)
    const novoAgendamento = {
      id: `agend-${Date.now()}`,
      contatoId: contatoId || `contato-${Date.now()}`,
      nome,
      telefone,
      email,
      dataHora: `${data}T${hora}:00`,
      tipoServico: servicoFinal,
      profissional,
      observacoes,
      status: "Agendado",
      criadoEm: new Date().toISOString()
    };
    
    console.log("Novo evento:", novoAgendamento);
    
    // Exibir toast de sucesso
    toast({
      title: "Evento salvo",
      description: `${servicoFinal} agendado para ${format(new Date(`${data}T${hora}:00`), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`,
    });
    
    // Limpar campos e fechar modal
    limparCampos();
    onClose();
  };
  
  const limparCampos = () => {
    if (!contatoNome) setNome("");
    if (!contatoTelefone) setTelefone("");
    if (!contatoEmail) setEmail("");
    setData("");
    setHora("");
    setTipoServico("");
    setTipoServicoCustom("");
    setProfissional("");
    setObservacoes("");
    setErros({});
  };

  // Função para filtrar contatos com base no termo de busca
  const contatosFiltrados = contatos.filter(
    (contato) => 
      contato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para criar novo contato
  const irParaNovoContato = () => {
    onClose(); // Fechar o modal de agendamento
    navigate('/contatos/novo', { state: { nomePreenchido: nome } });
  };

  // Função para selecionar um contato
  const selecionarContato = (contato: Contato) => {
    setNome(contato.nome);
    if (contato.telefone) setTelefone(contato.telefone);
    if (contato.email) setEmail(contato.email);
    setIsPopoverOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Novo Evento</DialogTitle>
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
            <Label htmlFor="nome" className={erros.nome ? "text-red-500" : ""}>
              Nome do Cliente*
            </Label>
            {!contatoNome ? (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        setSearchTerm(e.target.value);
                        if (e.target.value.length > 1) {
                          setIsPopoverOpen(true);
                        }
                      }}
                      onFocus={() => {
                        if (nome.length > 1) {
                          setIsPopoverOpen(true);
                        }
                      }}
                      className={erros.nome ? "border-red-500" : ""}
                      placeholder="Digite o nome do cliente"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar contato..." />
                    <CommandList>
                      <CommandEmpty>
                        <div className="flex flex-col items-center justify-center p-2">
                          <p className="text-sm text-gray-500">Nenhum contato encontrado.</p>
                          <Button 
                            variant="ghost" 
                            className="flex items-center mt-2 text-primary"
                            type="button"
                            onClick={irParaNovoContato}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar novo contato com esse nome
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup heading="Contatos">
                        {contatosFiltrados.slice(0, 5).map((contato) => (
                          <CommandItem
                            key={contato.id}
                            value={contato.nome}
                            onSelect={() => selecionarContato(contato)}
                            className="cursor-pointer"
                          >
                            {contato.nome}
                            {contato.telefone && <span className="text-xs text-gray-500 ml-2">{contato.telefone}</span>}
                          </CommandItem>
                        ))}
                        <CommandItem
                          value="criar-novo-contato"
                          onSelect={irParaNovoContato}
                          className="border-t pt-2 mt-2 text-primary"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Criar novo contato
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <Input
                id="nome"
                value={nome}
                disabled={true}
                className={erros.nome ? "border-red-500" : ""}
              />
            )}
            {erros.nome && <p className="text-sm text-red-500">{erros.nome}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="telefone" className={erros.telefone ? "text-red-500" : ""}>
                Telefone*
              </Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                className={erros.telefone ? "border-red-500" : ""}
                placeholder="(00) 00000-0000"
                disabled={!!contatoTelefone}
              />
              {erros.telefone && <p className="text-sm text-red-500">{erros.telefone}</p>}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email" className={erros.email ? "text-red-500" : ""}>
                E-mail (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={erros.email ? "border-red-500" : ""}
                disabled={!!contatoEmail}
              />
              {erros.email && <p className="text-sm text-red-500">{erros.email}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="data" className={erros.data ? "text-red-500" : ""}>
                Data da Interação*
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
                Hora da Interação*
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="tipoServico" className={erros.tipoServico ? "text-red-500" : ""}>
                Categoria*
              </Label>
              <Select
                value={tipoServico}
                onValueChange={setTipoServico}
              >
                <SelectTrigger id="tipoServico" className={erros.tipoServico ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicos.map((servico) => (
                    <SelectItem key={servico} value={servico}>{servico}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erros.tipoServico && <p className="text-sm text-red-500">{erros.tipoServico}</p>}
              
              {tipoServico === "Outro" && (
                <div className="mt-2">
                  <Input
                    id="tipoServicoCustom"
                    value={tipoServicoCustom}
                    onChange={(e) => setTipoServicoCustom(e.target.value)}
                    placeholder="Especifique a categoria"
                    className={erros.tipoServicoCustom ? "border-red-500" : ""}
                  />
                  {erros.tipoServicoCustom && <p className="text-sm text-red-500">{erros.tipoServicoCustom}</p>}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="profissional">
                Responsável (opcional)
              </Label>
              <Input
                id="profissional"
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="observacoes">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre o evento"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0E927D] hover:bg-[#0b7a69]">
              Salvar Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
