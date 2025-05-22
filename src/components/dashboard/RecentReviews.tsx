
import { useEffect, useState } from "react";
import { ExternalLink, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  author: string;
  platform: "google" | "doctoralia" | "facebook";
  rating: number;
  content: string;
  date: string;
  responded: boolean;
}

export default function RecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    // Simulated data loading
    const mockReviews: Review[] = [
      {
        id: "1",
        author: "Maria Silva",
        platform: "google",
        rating: 5,
        content: "Excelente atendimento! O Dr. Paulo é muito atencioso e explicou todo o procedimento detalhadamente. A equipe é muito profissional.",
        date: "2023-05-02",
        responded: true,
      },
      {
        id: "2",
        author: "João Oliveira",
        platform: "doctoralia",
        rating: 4,
        content: "Bom serviço, mas o tempo de espera foi um pouco maior do que o esperado. De qualquer forma, o tratamento foi ótimo.",
        date: "2023-05-01",
        responded: false,
      },
      {
        id: "3",
        author: "Ana Santos",
        platform: "google",
        rating: 5,
        content: "Melhor clínica da região! Atendimento sempre excelente e preços justos. Recomendo!",
        date: "2023-04-28",
        responded: false,
      },
    ];
    
    setReviews(mockReviews);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getPlatformColor = (platform: Review["platform"]) => {
    switch (platform) {
      case "google":
        return "text-[#4285F4]";
      case "doctoralia":
        return "text-[#0098D0]";
      case "facebook":
        return "text-[#1877F2]";
      default:
        return "text-gray-500";
    }
  };

  const getPlatformName = (platform: Review["platform"]) => {
    switch (platform) {
      case "google":
        return "Google";
      case "doctoralia":
        return "Doctoralia";
      case "facebook":
        return "Facebook";
      default:
        return platform;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">Avaliações Recentes</h3>
          <a href="/avaliacoes" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Ver todas
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-medium">{review.author}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={cn("text-xs font-medium", getPlatformColor(review.platform))}>
                        {getPlatformName(review.platform)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={cn(
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{review.content}</p>
                
                <div className="mt-3 flex justify-end">
                  <button
                    className={cn(
                      "text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1",
                      review.responded
                        ? "bg-gray-100 text-gray-500"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <MessageSquare size={12} />
                    {review.responded ? "Respondido" : "Responder"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhuma avaliação recente.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
