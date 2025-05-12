
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import NovoAgendamentoModal from "@/components/modals/NovoAgendamentoModal";

export default function AgendarButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#0E927D] hover:bg-[#0b7a69]"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Novo Agendamento
      </Button>
      
      <NovoAgendamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
