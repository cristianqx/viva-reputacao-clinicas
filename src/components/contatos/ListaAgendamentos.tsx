
import { Calendar, Clock, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agendamento, formatarDataAgendamento } from "@/data/agendamentos";
import { toast } from "@/hooks/use-toast";

interface ListaAgendamentosProps {
  agendamentos: Agendamento[];
}

export default function ListaAgendamentos({ agendamentos }: ListaAgendamentosProps) {
  if (!agendamentos || agendamentos.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Sem agendamentos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Este contato ainda não possui agendamentos registrados.
        </p>
      </div>
    );
  }

  const handleStatusChange = (agendamentoId: string, novoStatus: "Realizado" | "Cancelado") => {
    // Aqui implementaríamos a lógica real de atualização do status
    toast({
      description: `Status do agendamento atualizado para ${novoStatus}`,
    });
  };

  // Ordenar agendamentos: futuros primeiro, depois por data
  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    // Se um é agendado e outro não, o agendado vem primeiro
    if (a.status === "Agendado" && b.status !== "Agendado") return -1;
    if (a.status !== "Agendado" && b.status === "Agendado") return 1;
    // Se ambos têm o mesmo status, ordena por data (mais recente primeiro)
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  return (
    <div className="space-y-4">
      {agendamentosOrdenados.map((agendamento) => (
        <div key={agendamento.id} className="bg-gray-50 p-4 rounded-md border">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={`rounded-full p-2 mr-3 ${
                agendamento.status === "Realizado" ? "bg-green-100" :
                agendamento.status === "Cancelado" ? "bg-red-100" : "bg-blue-100"
              }`}>
                {agendamento.status === "Realizado" ? (
                  <Check className={`h-5 w-5 text-green-600`} />
                ) : agendamento.status === "Cancelado" ? (
                  <AlertCircle className={`h-5 w-5 text-red-600`} />
                ) : (
                  <Clock className={`h-5 w-5 text-blue-600`} />
                )}
              </div>
              <div>
                <div className="font-medium">{agendamento.especialidade}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatarDataAgendamento(agendamento.data)}
                </div>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`
                ${agendamento.status === "Realizado" ? "bg-green-50 text-green-700 border-green-200" : 
                  agendamento.status === "Cancelado" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-blue-50 text-blue-700 border-blue-200"}
              `}
            >
              {agendamento.status}
            </Badge>
          </div>
          
          {agendamento.observacoes && (
            <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded border">
              {agendamento.observacoes}
            </div>
          )}
          
          {agendamento.status === "Agendado" && (
            <div className="mt-3 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => handleStatusChange(agendamento.id, "Realizado")}
              >
                Marcar como Realizado
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleStatusChange(agendamento.id, "Cancelado")}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
