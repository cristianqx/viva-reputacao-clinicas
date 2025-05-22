import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Campaign {
  id: string;
  user_id: string;
  nome: string;
  descricao: string | null;
  nota_minima_redirecionamento: number;
  ativa: boolean;
  created_at: string;
  updated_at: string;
  canal?: "whatsapp" | "email" | "sms";
  mensagem_template?: string;
  dias_apos_evento?: number;
  plataforma_avaliacao?: string;
  link_avaliacao?: string;
  horario_inicio?: string;
  horario_fim?: string;
}

export const createCampaign = async (
  nome: string,
  descricao?: string,
  nota_minima_redirecionamento: number = 4
): Promise<Campaign | null> => {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    
    if (!userSession.session) {
      toast.error("Sessão inválida. Faça login novamente.");
      return null;
    }
    
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        nome,
        descricao,
        nota_minima_redirecionamento,
        user_id: userSession.session.user.id,
        canal: "whatsapp" // Definindo WhatsApp como canal padrão para o MVP
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar campanha:", error);
      toast.error("Erro ao criar campanha: " + error.message);
      return null;
    }
    
    toast.success("Campanha criada com sucesso!");
    return data;
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    toast.error("Erro ao criar campanha");
    return null;
  }
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar campanhas:", error);
      toast.error("Erro ao buscar campanhas");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    toast.error("Erro ao buscar campanhas");
    return [];
  }
};

export const getCampaign = async (id: string): Promise<Campaign | null> => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Erro ao buscar campanha:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar campanha:", error);
    return null;
  }
};

export const updateCampaign = async (
  id: string,
  updates: Partial<Campaign>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("campaigns")
      .update(updates)
      .eq("id", id);
    
    if (error) {
      console.error("Erro ao atualizar campanha:", error);
      toast.error("Erro ao atualizar campanha");
      return false;
    }
    
    toast.success("Campanha atualizada com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar campanha:", error);
    toast.error("Erro ao atualizar campanha");
    return false;
  }
};

export const deleteCampaign = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Erro ao excluir campanha:", error);
      toast.error("Erro ao excluir campanha");
      return false;
    }
    
    toast.success("Campanha excluída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao excluir campanha:", error);
    toast.error("Erro ao excluir campanha");
    return false;
  }
};

export const getPublicReviewLink = (campaignId: string, clienteId?: string): string => {
  // Use window.location.origin para obter a URL base da aplicação
  const baseUrl = `${window.location.origin}/avaliar/${campaignId}`;
  
  // Adiciona parâmetros de rastreamento se houver ID do cliente
  if (clienteId) {
    return `${baseUrl}?cliente=${clienteId}&ts=${Date.now()}`;
  }
  
  return baseUrl;
};
