
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PlanRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  planRequired?: string;
  isPlanExpired?: boolean;
  isInactivePlan?: boolean;
  onViewPlans: () => void; // Adicionada nova prop para lidar com a navegação
}

const PlanRestrictionModal: React.FC<PlanRestrictionModalProps> = ({
  isOpen,
  onClose,
  title = "Acesso Restrito",
  message = "Esta funcionalidade requer um plano diferente.",
  planRequired,
  isPlanExpired = false,
  isInactivePlan = false,
  onViewPlans, // Nova propriedade para lidar com a navegação
}) => {
  // Remover o useNavigate e usar a prop onViewPlans
  
  // Determinar a mensagem apropriada baseada no estado do plano
  const getModalMessage = () => {
    if (isPlanExpired) {
      return "Seu plano expirou. Renove para continuar usando.";
    } else if (isInactivePlan) {
      return "Seu plano está inativo. Entre em contato para reativá-lo.";
    } else if (planRequired) {
      return `Esta funcionalidade é exclusiva do Plano ${planRequired}.`;
    } else {
      return message;
    }
  };

  const handleViewPlans = () => {
    onClose();
    onViewPlans(); // Usar a função passada por props para navegação
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="font-montserrat sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        </DialogHeader>
        <DialogDescription className="text-md py-4">
          {getModalMessage()}
        </DialogDescription>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button
            onClick={handleViewPlans}
            className="bg-[#0E927D] hover:bg-[#0E927D]/90"
          >
            Ver Planos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanRestrictionModal;
