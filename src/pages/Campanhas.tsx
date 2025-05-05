
import PageHeader from "@/components/layout/PageHeader";

export default function Campanhas() {
  return (
    <>
      <PageHeader 
        title="Campanhas" 
        description="Crie e gerencie campanhas para solicitação de avaliações."
      />
      
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center py-12">
          <h2 className="text-xl font-medium text-gray-500">Módulo de Campanhas</h2>
          <p className="mt-2 text-gray-400">Em breve</p>
        </div>
      </div>
    </>
  );
}
