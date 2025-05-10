
import { supabase } from "@/integrations/supabase/client";

interface LogFaturamento {
  id: string;
  user_id: string;
  tipo: string;
  origem: string | null;
  valor: number;
  status: string;
  created_at: string;
}

interface BillingStats {
  total: number;
  pendente: number;
  pago: number;
}

interface FiltroPeriodo {
  inicio: Date;
  fim: Date;
}

/**
 * Busca todos os logs de faturamento de um usuário
 */
export async function getLogsFaturamento(userId?: string): Promise<LogFaturamento[]> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      userId = user.id;
    }
    
    const { data, error } = await supabase
      .from('logs_faturamento')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar logs de faturamento:", error);
      return [];
    }
    
    return data as LogFaturamento[];
  } catch (error) {
    console.error("Erro ao buscar logs de faturamento:", error);
    return [];
  }
}

/**
 * Busca estatísticas de faturamento de um usuário
 */
export async function getBillingStats(userId?: string): Promise<BillingStats> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, pendente: 0, pago: 0 };
      userId = user.id;
    }
    
    const logs = await getLogsFaturamento(userId);
    
    const stats = {
      total: logs.reduce((sum, log) => sum + log.valor, 0),
      pendente: logs.filter(log => log.status === 'pendente')
                    .reduce((sum, log) => sum + log.valor, 0),
      pago: logs.filter(log => log.status === 'pago')
                .reduce((sum, log) => sum + log.valor, 0)
    };
    
    return stats;
  } catch (error) {
    console.error("Erro ao calcular estatísticas de faturamento:", error);
    return { total: 0, pendente: 0, pago: 0 };
  }
}

/**
 * Registra uma nova cobrança no sistema
 */
export async function registrarCobranca(
  tipo: string, 
  origem: string | null = null
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase.rpc(
      'registrar_faturamento',
      { 
        p_user_id: user.id,
        p_tipo: tipo,
        p_origem: origem
      }
    );
    
    if (error) {
      console.error("Erro ao registrar cobrança:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao registrar cobrança:", error);
    return false;
  }
}

/**
 * Filtra logs por período e tipo
 */
export async function filtrarLogsFaturamento(
  periodo: FiltroPeriodo,
  tipo?: string,
  status?: string
): Promise<LogFaturamento[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    let query = supabase
      .from('logs_faturamento')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', periodo.inicio.toISOString())
      .lte('created_at', periodo.fim.toISOString());
    
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao filtrar logs de faturamento:", error);
      return [];
    }
    
    return data as LogFaturamento[];
  } catch (error) {
    console.error("Erro ao filtrar logs de faturamento:", error);
    return [];
  }
}

export const tiposFaturamento = {
  'avaliacao_google': 'Avaliação Google',
  'avaliacao_formulario': 'Avaliação Formulário',
};

export const statusFaturamento = {
  'pendente': 'Pendente',
  'pago': 'Pago',
  'falhou': 'Falhou'
};

export type { LogFaturamento, BillingStats, FiltroPeriodo };
