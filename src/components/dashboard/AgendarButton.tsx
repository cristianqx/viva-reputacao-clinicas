
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NovoAgendamentoModal from "@/components/modals/NovoAgendamentoModal";

export default function AgendarButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button 
        className="bg-[#10B981] hover:bg-[#0b7a69] text-white" 
        onClick={openModal}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Evento
      </Button>
      
      <NovoAgendamentoModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
