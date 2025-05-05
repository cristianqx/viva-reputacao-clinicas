
import PageHeader from "@/components/layout/PageHeader";

export default function Widgets() {
  return (
    <>
      <PageHeader 
        title="Widgets" 
        description="Crie widgets de prova social para o site da sua clínica."
      />
      
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center py-12">
          <h2 className="text-xl font-medium text-gray-500">Módulo de Widgets</h2>
          <p className="mt-2 text-gray-400">Em breve</p>
        </div>
      </div>
    </>
  );
}
