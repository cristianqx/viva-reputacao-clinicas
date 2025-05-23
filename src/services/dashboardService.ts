
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RatingStats {
  averageRating: string;
  totalReviews: number;
  distribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export interface CampaignStats {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  reviewed: number;
}

export interface ContactStats {
  total: number;
  withEmail: number;
  emailPercentage: number;
}

export interface ResponseRateStats {
  rate: string;
  responded: number;
  total: number;
}

export const getDashboardStats = async (): Promise<{
  ratings: RatingStats;
  contacts: ContactStats;
  responseRate: ResponseRateStats;
  recentCampaign: CampaignStats | null;
}> => {
  try {
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      toast.error("Usuário não autenticado");
      throw new Error("User not authenticated");
    }
    
    // Initialize default return values
    const result = {
      ratings: {
        averageRating: "0",
        totalReviews: 0,
        distribution: [
          { rating: 5, count: 0, percentage: 0 },
          { rating: 4, count: 0, percentage: 0 },
          { rating: 3, count: 0, percentage: 0 },
          { rating: 2, count: 0, percentage: 0 },
          { rating: 1, count: 0, percentage: 0 }
        ]
      },
      contacts: {
        total: 0,
        withEmail: 0,
        emailPercentage: 0
      },
      responseRate: {
        rate: "0%",
        responded: 0,
        total: 0
      },
      recentCampaign: null
    };
    
    // Get campaigns for this user
    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("user_id", userId);
      
    if (campaignsError) {
      console.error("Error fetching campaigns:", campaignsError);
      return result;
    }
    
    if (!campaigns || campaigns.length === 0) {
      return result;
    }
    
    const campaignIds = campaigns.map(c => c.id);
    
    // Get reviews for these campaigns
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("internal_reviews")
      .select("nota")
      .in("campaign_id", campaignIds);
      
    if (!reviewsError && reviewsData && reviewsData.length > 0) {
      // Calculate rating stats
      const total = reviewsData.length;
      const sum = reviewsData.reduce((acc, review) => acc + review.nota, 0);
      const avg = total > 0 ? (sum / total).toFixed(1) : "0";
      
      // Calculate distribution
      const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      
      reviewsData.forEach(review => {
        if (review.nota >= 1 && review.nota <= 5) {
          counts[review.nota as keyof typeof counts]++;
        }
      });
      
      const distribution = Object.entries(counts).map(([rating, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return {
          rating: parseInt(rating),
          count,
          percentage
        };
      }).sort((a, b) => b.rating - a.rating); // Sort by rating descending (5 to 1)
      
      result.ratings = {
        averageRating: avg,
        totalReviews: total,
        distribution
      };
    }
    
    // Get contacts stats
    const { data: contactsData, error: contactsError } = await supabase
      .from("contatos")
      .select("id, email")
      .eq("user_id", userId);
      
    if (!contactsError && contactsData) {
      const total = contactsData.length;
      const withEmail = contactsData.filter(c => c.email && c.email.trim() !== '').length;
      const emailPercentage = total > 0 ? Math.round((withEmail / total) * 100) : 0;
      
      result.contacts = {
        total,
        withEmail,
        emailPercentage
      };
    }
    
    // Get most recent campaign with messages
    const { data: recentCampaign, error: recentCampaignError } = await supabase
      .from("campaigns")
      .select(`
        id,
        nome,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (!recentCampaignError && recentCampaign && recentCampaign.length > 0) {
      const campaign = recentCampaign[0];
      
      // Get messages for this campaign
      const { data: messagesData, error: messagesError } = await supabase
        .from("whatsapp_messages")
        .select("status")
        .eq("campaign_id", campaign.id);
        
      if (!messagesError && messagesData) {
        const sent = messagesData.length;
        const opened = messagesData.filter(m => m.status === "delivered" || m.status === "read").length;
        const clicked = messagesData.filter(m => m.status === "read").length;
        
        // Get reviews for this campaign
        const { data: reviewData, error: reviewError } = await supabase
          .from("internal_reviews")
          .select("id")
          .eq("campaign_id", campaign.id);
          
        const reviewed = !reviewError && reviewData ? reviewData.length : 0;
        
        result.recentCampaign = {
          name: campaign.nome,
          sent,
          opened,
          clicked,
          reviewed
        };
      }
    }
    
    // Get overall response rate
    const { data: allMessages, error: allMessagesError } = await supabase
      .from("whatsapp_messages")
      .select("status")
      .eq("user_id", userId);
      
    if (!allMessagesError && allMessages) {
      const total = allMessages.length;
      const responded = allMessages.filter(m => m.status === "read" || m.status === "delivered").length;
      const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
      
      result.responseRate = {
        rate: `${rate}%`,
        responded,
        total
      };
    }
    
    return result;
    
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      ratings: {
        averageRating: "0",
        totalReviews: 0,
        distribution: [
          { rating: 5, count: 0, percentage: 0 },
          { rating: 4, count: 0, percentage: 0 },
          { rating: 3, count: 0, percentage: 0 },
          { rating: 2, count: 0, percentage: 0 },
          { rating: 1, count: 0, percentage: 0 }
        ]
      },
      contacts: {
        total: 0,
        withEmail: 0,
        emailPercentage: 0
      },
      responseRate: {
        rate: "0%",
        responded: 0,
        total: 0
      },
      recentCampaign: null
    };
  }
};

export const getRecentReviews = async (limit: number = 3) => {
  try {
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      return [];
    }
    
    // Get campaigns for this user
    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("user_id", userId);
      
    if (campaignsError || !campaigns || campaigns.length === 0) {
      return [];
    }
    
    const campaignIds = campaigns.map(c => c.id);
    
    // Get reviews for these campaigns
    const { data: reviews, error: reviewsError } = await supabase
      .from("internal_reviews")
      .select("*")
      .in("campaign_id", campaignIds)
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (reviewsError) {
      console.error("Error fetching recent reviews:", reviewsError);
      return [];
    }
    
    return reviews || [];
    
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return [];
  }
};
