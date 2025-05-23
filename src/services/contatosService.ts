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
  tags?: string[];
}

// Updated to match new 'eventos' table structure instead of 'agendamentos'
export interface Evento {
  id: string;
  contact_id: string;
  data_hora_inicio: string;
  data_hora_fim?: string;
  titulo?: string;
  descricao?: string;
  origem?: string;
  status?: string;
  responsavel?: string;
  campaign_id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  whatsapp_message_id?: string;
}

// Keeping Agendamento interface for backward compatibility
export interface Agendamento extends Evento {
  // Alias for backward compatibility
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

// Updated function to get eventos for a specific contato
export const getEventosByContatoId = async (contatoId: string): Promise<Evento[]> => {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('contact_id', contatoId)
      .order('data_hora_inicio', { ascending: true });
      
    if (error) {
      console.error("Erro ao buscar eventos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
};

// Alias for backward compatibility
export const getAgendamentosByContatoId = getEventosByContatoId;

// Function to create a new evento
export const createEvento = async (evento: Omit<Evento, 'id'>): Promise<Evento | null> => {
  try {
    // Get the user ID from localStorage
    const userId = localStorage.getItem("rv_user_id");
    
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from('eventos')
      .insert({
        ...evento,
        user_id: userId,
        origem: evento.origem || 'manual'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar evento:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return null;
  }
};

// Alias for backward compatibility
export const createAgendamento = createEvento;

// Function to update an evento
export const updateEvento = async (id: string, evento: Partial<Evento>): Promise<Evento | null> => {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .update(evento)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao atualizar evento:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return null;
  }
};

// Alias for backward compatibility
export const updateAgendamento = updateEvento;

// Function to delete an evento
export const deleteEvento = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Erro ao deletar evento:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return false;
  }
};

// Alias for backward compatibility
export const deleteAgendamento = deleteEvento;
