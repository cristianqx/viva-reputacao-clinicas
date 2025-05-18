
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AccessControlContextType {
  checkFeatureAccess: (featureKey: string) => boolean;
  showPlanRestrictionModal: (featureKey?: string, planRequired?: string) => void;
  hidePlanRestrictionModal: () => void;
  isPlanRestrictionModalOpen: boolean;
  restrictedFeature: { featureKey?: string; planRequired?: string } | null;
  isPlanActive: () => boolean;
  isPlanExpired: () => boolean;
}

const AccessControlContext = createContext<AccessControlContextType>({} as AccessControlContextType);

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error("useAccessControl must be used within an AccessControlProvider");
  }
  return context;
};

interface AccessControlProviderProps {
  children: ReactNode;
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isPlanRestrictionModalOpen, setIsPlanRestrictionModalOpen] = useState(false);
  const [restrictedFeature, setRestrictedFeature] = useState<{ featureKey?: string; planRequired?: string } | null>(null);

  // Checks if plan is active (not expired)
  const isPlanActive = useCallback(() => {
    if (!user) return false;
    return user.isActive === true;
  }, [user]);

  // Checks if plan is expired
  const isPlanExpired = useCallback(() => {
    if (!user) return false;
    const today = new Date();
    const expirationDate = new Date(user.planValidity);
    return today > expirationDate;
  }, [user]);

  // Check if user's plan allows access to specific features
  // This is a simplified implementation - you would expand this with actual feature-plan mappings
  const checkFeatureAccess = useCallback((featureKey: string): boolean => {
    // First check if user exists and has active plan
    if (!user || !isPlanActive() || isPlanExpired()) {
      return false;
    }

    // This would be expanded with real feature-plan logic
    // For now, we'll assume all features are accessible with an active plan
    return true;
  }, [user, isPlanActive, isPlanExpired]);

  const showPlanRestrictionModal = useCallback((featureKey?: string, planRequired?: string) => {
    setRestrictedFeature({ featureKey, planRequired });
    setIsPlanRestrictionModalOpen(true);
  }, []);

  const hidePlanRestrictionModal = useCallback(() => {
    setIsPlanRestrictionModalOpen(false);
    setRestrictedFeature(null);
  }, []);

  return (
    <AccessControlContext.Provider
      value={{
        checkFeatureAccess,
        showPlanRestrictionModal,
        hidePlanRestrictionModal,
        isPlanRestrictionModalOpen,
        restrictedFeature,
        isPlanActive,
        isPlanExpired
      }}
    >
      {children}
    </AccessControlContext.Provider>
  );
};
