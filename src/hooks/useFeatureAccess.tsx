
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useCallback } from "react";

export interface FeatureAccess {
  check: (featureKey: string) => boolean;
  tryAccess: (featureKey: string, planRequired?: string) => boolean;
}

/**
 * Hook para verificar acesso a funcionalidades baseado no plano do usuário
 * 
 * @returns Métodos para verificar e tentar acessar funcionalidades
 */
export const useFeatureAccess = (): FeatureAccess => {
  const { checkFeatureAccess, showPlanRestrictionModal } = useAccessControl();
  
  /**
   * Verifica se o usuário tem acesso a uma funcionalidade específica
   * @param featureKey Identificador único da funcionalidade
   * @returns true se tem acesso, false se não tem acesso
   */
  const check = useCallback((featureKey: string): boolean => {
    return checkFeatureAccess(featureKey);
  }, [checkFeatureAccess]);
  
  /**
   * Tenta acessar uma funcionalidade e mostra o modal de restrição se necessário
   * @param featureKey Identificador único da funcionalidade
   * @param planRequired Nome do plano necessário para acessar a funcionalidade
   * @returns true se tem acesso, false se não tem acesso
   */
  const tryAccess = useCallback((featureKey: string, planRequired?: string): boolean => {
    const hasAccess = checkFeatureAccess(featureKey);
    if (!hasAccess) {
      showPlanRestrictionModal(featureKey, planRequired);
    }
    return hasAccess;
  }, [checkFeatureAccess, showPlanRestrictionModal]);
  
  return { check, tryAccess };
};

export default useFeatureAccess;
