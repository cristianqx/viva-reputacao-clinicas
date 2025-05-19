import React, { useEffect } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { useAccessControl } from "@/contexts/AccessControlContext";
import PlanRestrictionModal from "@/components/modals/PlanRestrictionModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Adicionando o contexto de acesso e navegação aqui
  const { 
    isPlanRestrictionModalOpen, 
    hidePlanRestrictionModal, 
    restrictedFeature,
    isPlanExpired,
    isPlanActive
  } = useAccessControl();
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Função para navegar para a página de planos
  const handleViewPlans = () => {
    navigate("/landing");
  };

  return (
    <div className="min-h-screen flex flex-col font-montserrat">
      <div className="flex flex-1">
        <SidebarNavigation />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
      
      {/* Adicionando o modal dentro do contexto do Router */}
      <PlanRestrictionModal
        isOpen={isPlanRestrictionModalOpen}
        onClose={hidePlanRestrictionModal}
        planRequired={restrictedFeature?.planRequired}
        isPlanExpired={isPlanExpired()}
        isInactivePlan={!isPlanActive()}
        onViewPlans={handleViewPlans}
      />
    </div>
  );
}
