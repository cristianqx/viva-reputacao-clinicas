
import { Agendamento as DataAgendamento } from "@/data/agendamentos";
import { Agendamento as ComponentAgendamento } from "@/components/contatos/ListaAgendamentos";

/**
 * Adapta o formato de Agendamento do arquivo de dados para o formato usado pelo componente
 */
export const adaptAgendamentos = (agendamentos: DataAgendamento[]): ComponentAgendamento[] => {
  return agendamentos.map(agendamento => ({
    id: agendamento.id,
    titulo: agendamento.especialidade,
    dataHora: agendamento.data,
    status: agendamento.status,
    observacoes: agendamento.observacoes
  }));
};

/**
 * Encontra agendamentos elegíveis para envio de campanhas com base nos dias após o evento
 * @param agendamentos Lista de agendamentos
 * @param diasAposEvento Número de dias após o evento para acionar a campanha
 * @returns Lista de IDs de agendamentos elegíveis
 */
export const getAgendamentosElegiveisCampanha = (
  agendamentos: DataAgendamento[],
  diasAposEvento: number = 3
): string[] => {
  const hoje = new Date();
  const dataLimite = new Date(hoje);
  dataLimite.setDate(dataLimite.getDate() - diasAposEvento);
  
  return agendamentos
    .filter(agendamento => {
      if (agendamento.status !== "realizado") return false;
      
      const dataAgendamento = new Date(agendamento.data);
      return dataAgendamento <= dataLimite;
    })
    .map(agendamento => agendamento.id);
};
