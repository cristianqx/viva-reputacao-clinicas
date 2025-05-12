
import { useEffect, useState } from "react";
import { Star, MessageSquare, BarChart4, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import RatingDistribution from "@/components/dashboard/RatingDistribution";
import RecentReviews from "@/components/dashboard/RecentReviews";
import CampaignPerformance from "@/components/dashboard/CampaignPerformance";
import AgendarButton from "@/components/dashboard/AgendarButton";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for rating distribution
  const ratingDistribution = [
    { rating: 5, count: 145, percentage: 72.5 },
    { rating: 4, count: 38, percentage: 19 },
    { rating: 3, count: 12, percentage: 6 },
    { rating: 2, count: 3, percentage: 1.5 },
    { rating: 1, count: 2, percentage: 1 },
  ];
  
  // Mock data for campaign performance
  const campaignData = {
    name: "Campanha Pós-Atendimento Abril/2023",
    sent: 250,
    opened: 200,
    clicked: 150,
    reviewed: 75,
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
                value="4.7"
                description="de 200 avaliações"
                icon={<Star className="h-8 w-8 fill-secondary text-secondary" />}
                trend={{ value: 0.3, isPositive: true, label: "último mês" }}
              />
              
              <StatsCard
                title="Total de Avaliações"
                value="200"
                icon={<MessageSquare className="h-8 w-8" />}
                trend={{ value: 12, isPositive: true, label: "último mês" }}
              />
              
              <StatsCard
                title="Taxa de Resposta"
                value="92%"
                description="184 de 200 respondidas"
                icon={<BarChart4 className="h-8 w-8" />}
                trend={{ value: 3, isPositive: true, label: "último mês" }}
              />
              
              <StatsCard
                title="Contatos"
                value="1,245"
                description="78% com email válido"
                icon={<Users className="h-8 w-8" />}
                trend={{ value: 56, isPositive: true, label: "último mês" }}
              />
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RatingDistribution 
                distribution={ratingDistribution} 
                total={200} 
              />
              
              <CampaignPerformance data={campaignData} />
              
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
