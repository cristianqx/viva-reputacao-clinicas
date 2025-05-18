
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
export interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
}

// Mock data for "contatos" since we don't have that table in Supabase yet
const mockContatos: Contato[] = [
  { id: '1', nome: 'João Silva', email: 'joao@example.com', telefone: '(11) 98765-4321' },
  { id: '2', nome: 'Maria Oliveira', email: 'maria@example.com', telefone: '(11) 91234-5678' },
  { id: '3', nome: 'Pedro Santos', email: 'pedro@example.com', telefone: '(11) 99876-5432' }
];

// Function to get contatos
export const getContatos = async (): Promise<Contato[]> => {
  // We're using the mock data for now since we don't have a contatos table
  // When the table is created, replace this with actual Supabase query
  // const { data, error } = await supabase.from('contatos').select('*')
  return mockContatos;
};

// Function to create a new contato
export const createContato = async (contato: Omit<Contato, 'id'>): Promise<Contato> => {
  // Mock implementation
  const newContato: Contato = {
    id: `contato-${Date.now()}`,
    ...contato
  };
  // Return the created contato
  return newContato;
};
