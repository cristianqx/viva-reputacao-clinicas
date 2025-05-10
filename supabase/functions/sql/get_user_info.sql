
-- Função para obter informações do usuário pelo ID
CREATE OR REPLACE FUNCTION public.get_user_info(p_user_id UUID)
RETURNS SETOF RECORD AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id as user_id, 
    email, 
    nome_completo, 
    plano_id, 
    ativo, 
    data_validade
  FROM 
    public.users
  WHERE 
    id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
