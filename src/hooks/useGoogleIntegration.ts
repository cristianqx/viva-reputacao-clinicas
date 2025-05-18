
import { useState, useEffect } from 'react';
import { getGoogleMyBusinessLink } from '@/services/googleBusinessApi';

export function useGoogleIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmbLink, setGmbLink] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const link = await getGoogleMyBusinessLink();
      setIsConnected(!!link);
      setGmbLink(link);
    } catch (error) {
      console.error('Erro ao verificar conexão com Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    gmbLink,
    refreshConnection: checkConnection
  };
}
