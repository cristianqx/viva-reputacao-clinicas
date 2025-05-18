
import { useState } from "react";
import NovoAgendamentoModal from "./NovoAgendamentoModal";

interface AgendarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contatoId: string;
  contatoNome: string;
  contatoEmail?: string;
  contatoTelefone?: string;
}

export default function AgendarConsultaModal({ 
  isOpen, 
  onClose, 
  contatoId,
  contatoNome,
  contatoEmail,
  contatoTelefone
}: AgendarConsultaModalProps) {
  return (
    <NovoAgendamentoModal
      isOpen={isOpen}
      onClose={onClose}
      contatoId={contatoId}
      contatoNome={contatoNome}
      contatoEmail={contatoEmail}
      contatoTelefone={contatoTelefone}
    />
  );
}
