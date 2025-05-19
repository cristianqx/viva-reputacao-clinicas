
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
export interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  origem?: string;
  created_at?: string;
  user_id: string;
}

export interface Agendamento {
  id: string;
  contact_id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  titulo?: string;
  descricao?: string;
  origem?: string;
  google_calendar_event_id?: string;
  user_id: string;
}

// Function to get contatos
export const getContatos = async (): Promise<Contato[]> => {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar contatos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return [];
  }
};

// Function to get a specific contato by ID
export const getContatoById = async (id: string): Promise<Contato | null> => {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Erro ao buscar contato:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar contato:", error);
    return null;
  }
};

// Function to create a new contato
export const createContato = async (contato: Omit<Contato, 'id'>): Promise<Contato | null> => {
  try {
    // Get the user ID from localStorage
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from('contatos')
      .insert({
        ...contato,
        user_id: userId,
        origem: contato.origem || 'manual'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar contato:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    return null;
  }
};

// Function to update a contato
export const updateContato = async (id: string, contato: Partial<Contato>): Promise<Contato | null> => {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .update(contato)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao atualizar contato:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    return null;
  }
};

// Function to delete a contato
export const deleteContato = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contatos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Erro ao deletar contato:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar contato:", error);
    return false;
  }
};

// Function to get agendamentos for a specific contato
export const getAgendamentosByContatoId = async (contatoId: string): Promise<Agendamento[]> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('contact_id', contatoId)
      .order('data_hora_inicio', { ascending: true });
      
    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
};

// Function to create a new agendamento
export const createAgendamento = async (agendamento: Omit<Agendamento, 'id'>): Promise<Agendamento | null> => {
  try {
    // Get the user ID from localStorage
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        ...agendamento,
        user_id: userId,
        origem: agendamento.origem || 'manual'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar agendamento:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return null;
  }
};

// Function to update an agendamento
export const updateAgendamento = async (id: string, agendamento: Partial<Agendamento>): Promise<Agendamento | null> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(agendamento)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao atualizar agendamento:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return null;
  }
};

// Function to delete an agendamento
export const deleteAgendamento = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Erro ao deletar agendamento:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return false;
  }
};
