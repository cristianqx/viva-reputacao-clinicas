
import { useState } from "react";
import NovoAgendamentoModal from "./NovoAgendamentoModal";

interface AgendarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contatoId: string;
  contatoNome: string;
}

export default function AgendarConsultaModal({ 
  isOpen, 
  onClose, 
  contatoId,
  contatoNome
}: AgendarConsultaModalProps) {
  return (
    <NovoAgendamentoModal
      isOpen={isOpen}
      onClose={onClose}
      contatoId={contatoId}
      contatoNome={contatoNome}
    />
  );
}
