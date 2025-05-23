
import { useEffect, useState } from "react";
import { Star, MessageSquare, BarChart4, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import RatingDistribution from "@/components/dashboard/RatingDistribution";
import RecentReviews from "@/components/dashboard/RecentReviews";
import CampaignPerformance from "@/components/dashboard/CampaignPerformance";
import AgendarButton from "@/components/dashboard/AgendarButton";
import { getDashboardStats } from "@/services/dashboardService";
import { toast } from "sonner";

interface RatingDistributionData {
  rating: number;
  count: number;
  percentage: number;
}

interface CampaignPerformanceData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  reviewed: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistributionData[]>([]);
  const [campaignData, setCampaignData] = useState<CampaignPerformanceData | null>(null);
  const [averageRating, setAverageRating] = useState<string>("0");
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [responseRate, setResponseRate] = useState<{ rate: string; responded: number; total: number }>({
    rate: "0%",
    responded: 0,
    total: 0
  });
  const [contactStats, setContactStats] = useState<{ total: number; withEmail: number; emailPercentage: number }>({
    total: 0,
    withEmail: 0,
    emailPercentage: 0
  });
  const [trends, setTrends] = useState<{ 
    rating: { value: number, isPositive: boolean },
    reviews: { value: number, isPositive: boolean },
    response: { value: number, isPositive: boolean },
    contacts: { value: number, isPositive: boolean }
  }>({
    rating: { value: 0, isPositive: true },
    reviews: { value: 0, isPositive: true },
    response: { value: 0, isPositive: true },
    contacts: { value: 0, isPositive: true }
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      const stats = await getDashboardStats();
      
      // Set ratings data
      setAverageRating(stats.ratings.averageRating);
      setTotalReviews(stats.ratings.totalReviews);
      setRatingDistribution(stats.ratings.distribution);
      
      // Set contact stats
      setContactStats(stats.contacts);
      
      // Set response rate
      setResponseRate(stats.responseRate);
      
      // Set campaign data
      if (stats.recentCampaign) {
        setCampaignData(stats.recentCampaign);
      }
      
      // Set trends - for now using placeholder values
      // In a real scenario, these would be calculated by comparing current vs previous period data
      setTrends({
        rating: { value: stats.ratings.totalReviews > 0 ? 0.3 : 0, isPositive: true },
        reviews: { value: stats.ratings.totalReviews > 0 ? 12 : 0, isPositive: true },
        response: { value: stats.responseRate.total > 0 ? 3 : 0, isPositive: true },
        contacts: { value: stats.contacts.total > 0 ? 5 : 0, isPositive: true }
      });
      
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Visão geral da reputação online da sua clínica."
        action={<AgendarButton />}
      />
      
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Nota Média"
                value={averageRating}
                description={`de ${totalReviews} avaliações`}
                icon={<Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />}
                trend={totalReviews > 0 ? trends.rating : undefined}
              />
              
              <StatsCard
                title="Total de Avaliações"
                value={totalReviews.toString()}
                icon={<MessageSquare className="h-8 w-8" />}
                trend={totalReviews > 0 ? trends.reviews : undefined}
              />
              
              <StatsCard
                title="Taxa de Resposta"
                value={responseRate.rate}
                description={`${responseRate.responded} de ${responseRate.total} respondidas`}
                icon={<BarChart4 className="h-8 w-8" />}
                trend={responseRate.total > 0 ? trends.response : undefined}
              />
              
              <StatsCard
                title="Contatos"
                value={contactStats.total.toString()}
                description={`${contactStats.emailPercentage}% com email válido`}
                icon={<Users className="h-8 w-8" />}
                trend={contactStats.total > 0 ? trends.contacts : undefined}
              />
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RatingDistribution 
                  distribution={ratingDistribution} 
                  total={totalReviews} 
                />
              </div>
              
              <div className="lg:col-span-1">
                {campaignData ? (
                  <CampaignPerformance data={campaignData} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500">Nenhuma campanha disponível</p>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <RecentReviews />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
