
import React from "react";
import { Clock, CalendarCheck, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// Tipos
export interface Agendamento {
  id: string;
  titulo: string;
  dataHora: string;
  status: "Agendado" | "Realizado" | "Cancelado";
  observacoes?: string;
}

interface ListaAgendamentosProps {
  agendamentos: Agendamento[];
}

export default function ListaAgendamentos({ agendamentos }: ListaAgendamentosProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  if (agendamentos.length === 0) {
    return (
      <div className="text-center py-10">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento agendado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ainda não há eventos agendados para este contato.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {agendamentos.map((agendamento) => (
        <div 
          key={agendamento.id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                {agendamento.status === "Agendado" ? (
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                ) : agendamento.status === "Realizado" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                )}
                <div>
                  <h4 className="font-medium">{agendamento.titulo}</h4>
                  <p className="text-sm text-gray-500">
                    <Clock className="inline h-3.5 w-3.5 mr-1" />
                    {formatarData(agendamento.dataHora)}
                  </p>
                </div>
              </div>
              <Badge 
                variant={
                  agendamento.status === "Agendado" ? "outline" : 
                  agendamento.status === "Realizado" ? "default" : "destructive"
                }
                className={
                  agendamento.status === "Agendado" ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800" : 
                  agendamento.status === "Realizado" ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" : ""
                }
              >
                {agendamento.status}
              </Badge>
            </div>
            
            {agendamento.observacoes && (
              <div className="mt-3 text-sm text-gray-600">
                {agendamento.observacoes}
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              {agendamento.status === "Agendado" && (
                <>
                  <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como realizado
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              )}
              {agendamento.status !== "Agendado" && (
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar novo evento
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
