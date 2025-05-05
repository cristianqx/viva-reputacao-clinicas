
import { BarChart } from "lucide-react";

interface CampaignData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  reviewed: number;
}

interface CampaignPerformanceProps {
  data: CampaignData;
}

export default function CampaignPerformance({ data }: CampaignPerformanceProps) {
  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
  };

  const openRate = calculateRate(data.opened, data.sent);
  const clickRate = calculateRate(data.clicked, data.opened);
  const conversionRate = calculateRate(data.reviewed, data.clicked);

  return (
    <div className="stats-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Performance da Última Campanha</h3>
        <BarChart className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-2">
        <h4 className="font-medium">{data.name}</h4>
      </div>

      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Enviados</p>
            <p className="text-lg font-semibold">{data.sent}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Abertos</p>
            <p className="text-lg font-semibold">{data.opened} <span className="text-xs text-gray-500">({openRate}%)</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Clicados</p>
            <p className="text-lg font-semibold">{data.clicked} <span className="text-xs text-gray-500">({clickRate}%)</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avaliações</p>
            <p className="text-lg font-semibold">{data.reviewed} <span className="text-xs text-gray-500">({conversionRate}%)</span></p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Conversão geral</p>
            <p className="text-sm font-medium">
              {calculateRate(data.reviewed, data.sent)}%
            </p>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${calculateRate(data.reviewed, data.sent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
