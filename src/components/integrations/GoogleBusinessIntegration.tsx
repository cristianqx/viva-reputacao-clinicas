
// O arquivo já existe, então apenas o atualizaremos mantendo as partes compatíveis
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getGoogleMyBusinessLink,
  updateGoogleMyBusinessLink,
  hasGoogleMyBusinessLink
} from "@/services/googleBusinessApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoogleBusinessIntegrationProps {
  isConnected?: boolean;
  isLoading?: boolean;
}

const GoogleBusinessIntegration = ({ 
  isConnected = false,
  isLoading = false 
}: GoogleBusinessIntegrationProps) => {
  const [isGmbLoading, setIsGmbLoading] = useState(isLoading);
  const [gmbUrl, setGmbUrl] = useState<string>("");
  const [hasGmbLink, setHasGmbLink] = useState(isConnected);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGmbLink = async () => {
      const link = await getGoogleMyBusinessLink();
      if (link) {
        setGmbUrl(link);
        setHasGmbLink(true);
      }
    };

    fetchGmbLink();
  }, []);

  const handleSaveLink = async () => {
    if (!gmbUrl.trim()) {
      toast.error("Por favor, insira um link válido");
      return;
    }

    // Validar se começa com http:// ou https://
    if (!gmbUrl.startsWith("http://") && !gmbUrl.startsWith("https://")) {
      toast.error("O link deve começar com http:// ou https://");
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateGoogleMyBusinessLink(gmbUrl);
      if (success) {
        setHasGmbLink(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-md border border-gray-200 shadow-sm bg-white">
      <div className="flex-shrink-0 w-12 h-12 rounded bg-[#E6F4F1] flex items-center justify-center md:mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#179C8A]">
          <path d="M15.5 2h-7A2.5 2.5 0 0 0 6 4.5v15A2.5 2.5 0 0 0 8.5 22h7a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 15.5 2z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">Google Meu Negócio</h3>
            {hasGmbLink && (
              <div className="flex items-center text-green-700 text-sm">
                <Check className="h-4 w-4 mr-1" /> Link configurado
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Configure o link do seu Google Meu Negócio para receber avaliações públicas. 
            Os pacientes com notas altas serão redirecionados para deixar avaliações públicas.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gmb_link">Link do Google Meu Negócio</Label>
              <div className="flex gap-2">
                <Input 
                  id="gmb_link" 
                  placeholder="https://g.page/nome-da-sua-clinica" 
                  value={gmbUrl}
                  onChange={(e) => setGmbUrl(e.target.value)}
                />
                <Button 
                  onClick={handleSaveLink} 
                  disabled={isSaving}
                  className="bg-[#0E927D] hover:bg-[#0c7f6d] whitespace-nowrap"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Ex: https://g.page/nome-da-sua-clinica ou https://maps.app.goo.gl/your-link
              </p>
            </div>
            
            {hasGmbLink && (
              <div className="pt-2">
                <a 
                  href={gmbUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#0E927D] hover:text-[#0c7f6d] text-sm"
                >
                  Visualizar sua página no Google Meu Negócio <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleBusinessIntegration;
