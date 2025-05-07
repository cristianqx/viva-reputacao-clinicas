
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Agendamento {
  id: string;
  contatoId: string;
  data: string;
  especialidade: string;
  observacoes?: string;
  status: "Agendado" | "Realizado" | "Cancelado";
  criadoEm: string;
}

// Dados de exemplo para agendamentos
export const agendamentosExemplo: Agendamento[] = [
  {
    id: "agend-1",
    contatoId: "1", // Ana Paula Silva
    data: "2023-06-15T14:30:00",
    especialidade: "Limpeza",
    observacoes: "Paciente relatou sensibilidade nos dentes anteriores",
    status: "Realizado",
    criadoEm: "2023-06-01T10:15:00"
  },
  {
    id: "agend-2",
    contatoId: "1", // Ana Paula Silva
    data: "2023-07-15T10:00:00",
    especialidade: "Ortodontia",
    status: "Agendado",
    criadoEm: "2023-06-15T15:00:00"
  },
  {
    id: "agend-3",
    contatoId: "3", // Mariana Costa
    data: "2023-06-20T09:15:00",
    especialidade: "Avaliação",
    status: "Agendado",
    criadoEm: "2023-06-05T11:30:00"
  },
  {
    id: "agend-4",
    contatoId: "5", // Juliana Almeida
    data: "2023-05-30T16:45:00",
    especialidade: "Endodontia",
    observacoes: "Canal no dente 26",
    status: "Realizado",
    criadoEm: "2023-05-20T09:00:00"
  }
];

// Função auxiliar para formatação da data de agendamento
export const formatarDataAgendamento = (dataString: string): string => {
  const data = new Date(dataString);
  return format(data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
};

// Função para obter agendamentos por contatoId
export const obterAgendamentosPorContato = (contatoId: string): Agendamento[] => {
  return agendamentosExemplo.filter(agendamento => agendamento.contatoId === contatoId);
};
