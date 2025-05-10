
import { registrarCobranca } from "./billingService";
import { toast } from "sonner";

/**
 * Registra uma avaliação recebida no Google Business
 * @param origem Origem da avaliação (Google, Formulário, etc)
 * @param campanha ID ou nome da campanha
 * @returns true se registrado com sucesso, false caso contrário
 */
export async function registrarAvaliacao(origem: string, campanha: string | null = null): Promise<boolean> {
  try {
    let tipo = 'avaliacao_formulario';
    
    if (origem.toLowerCase().includes('google')) {
      tipo = 'avaliacao_google';
    } else if (origem.toLowerCase().includes('facebook')) {
      tipo = 'avaliacao_facebook';
    }
    
    // Registra a cobrança no sistema
    const sucesso = await registrarCobranca(tipo, campanha);
    
    if (sucesso) {
      console.log(`Avaliação registrada com sucesso: ${tipo} de ${origem}`);
      return true;
    } else {
      console.error("Falha ao registrar avaliação no sistema de cobrança");
      return false;
    }
  } catch (error) {
    console.error("Erro ao registrar avaliação:", error);
    toast.error("Erro ao registrar avaliação");
    return false;
  }
}

/**
 * Gera um link de avaliação do Google My Business
 * @param placeId ID do local no Google
 * @param campaignId ID da campanha (opcional)
 * @returns URL do link de avaliação
 */
export function gerarLinkAvaliacaoGoogle(placeId: string, campaignId?: string): string {
  const baseUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  
  // Se houver um ID de campanha, adiciona como parâmetro para rastreamento
  if (campaignId) {
    return `${baseUrl}&campaign=${campaignId}`;
  }
  
  return baseUrl;
}
