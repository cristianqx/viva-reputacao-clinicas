
import { useState, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getRecentReviews } from "@/services/dashboardService";

interface ReviewData {
  id: string;
  nome_paciente: string;
  nota: number;
  comentario?: string;
  created_at: string;
}

export default function RecentReviews() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchRecentReviews();
  }, []);
  
  const fetchRecentReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsData = await getRecentReviews(3);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-500">Avaliações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-4">
                <div className="bg-gray-200 rounded-full h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{review.nome_paciente || "Paciente Anônimo"}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={cn(
                          i < review.nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              {review.comentario && (
                <p className="text-sm text-gray-600 line-clamp-2">{review.comentario}</p>
              )}
              <div className="border-t border-gray-100 pt-2 mt-1"></div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhuma avaliação recente</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full justify-center" disabled>
          Ver todas as avaliações
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
