
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDistributionProps {
  distribution: { 
    rating: number; 
    count: number; 
    percentage: number 
  }[];
  total: number;
}

export default function RatingDistribution({ distribution, total }: RatingDistributionProps) {
  return (
    <div className="stats-card space-y-4">
      <h3 className="text-sm font-medium text-gray-500">Distribuição de Avaliações</h3>
      
      <div className="space-y-3">
        {distribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{item.rating}</span>
              <Star className="h-4 w-4 fill-secondary text-secondary" />
            </div>
            
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={cn(
                    "h-full rounded-full",
                    item.rating >= 4 ? "bg-primary" : 
                    item.rating >= 3 ? "bg-secondary" : "bg-destructive"
                  )}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
            
            <div className="w-12 text-right">
              <span className="text-sm text-gray-500">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Total de {total} avaliações
        </p>
      </div>
    </div>
  );
}
