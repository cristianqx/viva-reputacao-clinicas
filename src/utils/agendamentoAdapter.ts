
import { Evento } from "@/services/contatosService";

// Define the possible status for an Evento
type EventoStatus = 'agendado' | 'realizado' | 'cancelado' | string;

// Define the possible status in capitalized form (for display)
export type AgendamentoStatus = 'Agendado' | 'Realizado' | 'Cancelado';

interface AgendamentoDisplay {
  id: string;
  contatoId: string;
  nomeContato: string;
  data: string;
  hora: string;
  tipoServico: string;
  profissional?: string;
  status: AgendamentoStatus;
  telefoneContato?: string;
  emailContato?: string;
  observacoes?: string;
}

export interface Agendamento {
  id: string;
  titulo: string;
  dataHora: string;
  status: "Agendado" | "Realizado" | "Cancelado";
  observacoes?: string;
}

// Function to adapt from data format in agendamentos.ts to the format used in ListaAgendamentos
export const adaptAgendamentos = (agendamentos: any[]): Agendamento[] => {
  return agendamentos.map((agendamento) => ({
    id: agendamento.id,
    titulo: agendamento.especialidade || agendamento.tipoServico || "Consulta",
    dataHora: agendamento.data,
    status: agendamento.status,
    observacoes: agendamento.observacoes,
  }));
};

export const convertEventoToAgendamentoDisplay = (evento: Evento, nomeContato: string): AgendamentoDisplay => {
  // Convert date and time
  const dataHora = new Date(evento.data_hora_inicio);
  const data = dataHora.toISOString().split('T')[0]; // YYYY-MM-DD format
  const hora = dataHora.toISOString().split('T')[1].substring(0, 5); // HH:MM format
  
  // Map the status (converting from lowercase in database to capitalized for display)
  let status: AgendamentoStatus = 'Agendado';
  if (evento.status && evento.status.toLowerCase() === 'realizado') {
    status = 'Realizado';
  } else if (evento.status && evento.status.toLowerCase() === 'cancelado') {
    status = 'Cancelado';
  }
  
  return {
    id: evento.id,
    contatoId: evento.contact_id,
    nomeContato,
    data,
    hora,
    tipoServico: evento.titulo || 'Consulta',
    profissional: evento.responsavel,
    status,
    observacoes: evento.descricao
  };
};

export const convertAgendamentoDisplayToEvento = (
  agendamento: Partial<AgendamentoDisplay>,
  userId: string,
  contatoId?: string
): Omit<Evento, 'id'> => {
  // Combine date and time into a full ISO string
  const dataHoraInicio = agendamento.data && agendamento.hora
    ? `${agendamento.data}T${agendamento.hora}:00`
    : new Date().toISOString();
  
  // Map status back to lowercase for database
  let status: EventoStatus = 'agendado';
  if (agendamento.status === 'Realizado') {
    status = 'realizado';
  } else if (agendamento.status === 'Cancelado') {
    status = 'cancelado';
  }
  
  return {
    user_id: userId,
    contact_id: contatoId || agendamento.contatoId || '',
    titulo: agendamento.tipoServico,
    descricao: agendamento.observacoes,
    responsavel: agendamento.profissional,
    data_hora_inicio: dataHoraInicio,
    status,
    origem: 'manual'
  };
};
