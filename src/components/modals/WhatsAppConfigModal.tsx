
import { useState } from "react";
import { X, Save, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppConfigModal({ isOpen, onClose }: WhatsAppConfigModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [enableTemplates, setEnableTemplates] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !phoneNumber.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a API Key e o número de telefone.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Configuração salva",
      description: "Integração com WhatsApp Business configurada com sucesso.",
    });
    
    onClose();
  };

  const handleTestConnection = () => {
    if (!apiKey.trim() || !phoneNumber.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a API Key e o número de telefone para testar a conexão.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulação de teste de conexão
    toast({
      title: "Conexão estabelecida",
      description: "Conexão com a API do WhatsApp Business realizada com sucesso!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Configurar WhatsApp Business
          </DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2 h-auto" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Status da integração</h3>
                <p className="text-sm text-gray-500">Ative ou desative a integração com WhatsApp Business</p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                id="whatsapp-active"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  placeholder="Sua chave API do WhatsApp Business"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                />
                <p className="text-xs text-gray-500">
                  Encontre sua API Key no painel do WhatsApp Business.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone-number">Número de telefone</Label>
                <Input
                  id="phone-number"
                  placeholder="Ex: +5511999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Número verificado na sua conta de WhatsApp Business.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome do negócio</Label>
                <Input
                  id="business-name"
                  placeholder="Ex: Clínica Dental"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestConnection}
                >
                  Testar conexão
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-base font-medium">Configurações avançadas</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Usar templates de mensagens</p>
                  <p className="text-xs text-gray-500">
                    Habilite para usar templates aprovados pelo WhatsApp
                  </p>
                </div>
                <Switch
                  checked={enableTemplates}
                  onCheckedChange={setEnableTemplates}
                  id="enable-templates"
                />
              </div>
              
              {enableTemplates && (
                <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                  <p className="text-sm">
                    Os templates precisam ser aprovados pela Meta antes de serem usados.
                    Para mais informações, consulte a 
                    <a 
                      href="https://business.facebook.com/business/help/2055875911147248" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      documentação oficial
                    </a>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-1" /> 
              Salvar configurações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
