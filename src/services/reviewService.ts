
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InternalReview {
  id: string;
  campaign_id: string;
  nome_paciente?: string | null;
  nota: number;
  comentario?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: {
    [key: number]: number;
  };
}

export const submitReview = async (
  campaign_id: string,
  nota: number,
  comentario?: string,
  nome_paciente?: string
): Promise<InternalReview | null> => {
  try {
    // Obter o IP do cliente através de um serviço de API
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip_address = ipData.ip;
    
    const { data, error } = await supabase
      .from("internal_reviews")
      .insert({
        campaign_id,
        nota,
        comentario,
        nome_paciente,
        ip_address
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao enviar avaliação:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    return null;
  }
};

export const getCampaignReviews = async (campaign_id: string): Promise<InternalReview[]> => {
  try {
    const { data, error } = await supabase
      .from("internal_reviews")
      .select("*")
      .eq("campaign_id", campaign_id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar avaliações:", error);
      toast.error("Erro ao buscar avaliações");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    toast.error("Erro ao buscar avaliações");
    return [];
  }
};

export const getReviewStats = async (campaign_id: string): Promise<ReviewStats | null> => {
  try {
    const reviews = await getCampaignReviews(campaign_id);
    
    if (!reviews.length) {
      return {
        avgRating: 0,
        totalReviews: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }
    
    const totalReviews = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.nota, 0);
    const avgRating = sum / totalReviews;
    
    // Calcular distribuição
    const distribution: {[key: number]: number} = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    reviews.forEach(review => {
      if (distribution[review.nota] !== undefined) {
        distribution[review.nota]++;
      }
    });
    
    return {
      avgRating,
      totalReviews,
      distribution
    };
  } catch (error) {
    console.error("Erro ao calcular estatísticas:", error);
    return null;
  }
};
