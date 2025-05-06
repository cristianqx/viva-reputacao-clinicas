
import React, { useState } from "react";
import { BarChart3, ArrowRight, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ExtratoAvaliacoesModal from "@/components/modals/ExtratoAvaliacoesModal";

export default function ExtratoAvaliacoes() {
  const [isExtratoModalOpen, setIsExtratoModalOpen] = useState(false);
  
  // Dados de exemplo para o extrato
  const dados = {
    avaliacoes: {
      total: 65,
      mes: {
        atual: 12,
        anterior: 9
      },
      porOrigem: {
        google: 38,
        facebook: 15,
        formulario: 12
      }
    },
    cobranca: {
      valorTotal: 130.00,
      pendente: 24.00,
      pago: 106.00
    }
  };
  
  // Calcular porcentagem de aumento
  const calcularAumento = () => {
    if (dados.avaliacoes.mes.anterior === 0) return 100;
    return Math.round(((dados.avaliacoes.mes.atual - dados.avaliacoes.mes.anterior) / dados.avaliacoes.mes.anterior) * 100);
  };
  
  const aumento = calcularAumento();
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Extrato de Avaliações</CardTitle>
              <CardDescription>Rastreamento e cobrança por avaliação</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Total de avaliações</span>
                  <span className="font-semibold">{dados.avaliacoes.total}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Google</span>
                  <span className="font-semibold">{dados.avaliacoes.porOrigem.google}</span>
                </div>
                <Progress value={(dados.avaliacoes.porOrigem.google / dados.avaliacoes.total) * 100} className="h-2 bg-gray-100" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Facebook</span>
                  <span className="font-semibold">{dados.avaliacoes.porOrigem.facebook}</span>
                </div>
                <Progress value={(dados.avaliacoes.porOrigem.facebook / dados.avaliacoes.total) * 100} className="h-2 bg-gray-100" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Formulário</span>
                  <span className="font-semibold">{dados.avaliacoes.porOrigem.formulario}</span>
                </div>
                <Progress value={(dados.avaliacoes.porOrigem.formulario / dados.avaliacoes.total) * 100} className="h-2 bg-gray-100" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Abril 2023</p>
                    <p className="text-xs text-gray-500">
                      {dados.avaliacoes.mes.atual} avaliações este mês
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className={aumento >= 0 ? "text-green-600" : "text-red-600"}>
                    {aumento >= 0 ? "↑" : "↓"} {Math.abs(aumento)}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Valor total: R$ {dados.cobranca.valorTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      <span className="text-green-600 mr-2">R$ {dados.cobranca.pago.toFixed(2)} pago</span>
                      <span className="text-yellow-600">R$ {dados.cobranca.pendente.toFixed(2)} pendente</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 mb-2">R$ 2,00 por avaliação efetivamente registrada</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsExtratoModalOpen(true)}>
            Ver extrato detalhado
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
      
      <ExtratoAvaliacoesModal 
        isOpen={isExtratoModalOpen} 
        onClose={() => setIsExtratoModalOpen(false)} 
      />
    </>
  );
}
