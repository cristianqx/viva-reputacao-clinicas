
import React from "react";
import { Button } from "@/components/ui/button";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Componente de exemplo que demonstra como usar o sistema de controle de acesso
 * Este componente NÃO precisa ser incluído na aplicação, é apenas um exemplo
 */
const FeatureAccessExample: React.FC = () => {
  const { tryAccess } = useFeatureAccess();
  
  const handlePremiumFeatureClick = () => {
    if (tryAccess("premium_feature", "Premium")) {
      // Se o usuário tem acesso, executa a lógica da funcionalidade premium
      console.log("Acessando funcionalidade premium...");
    }
    // Se não tem acesso, o modal de restrição será mostrado automaticamente
  };
  
  const handleBasicFeatureClick = () => {
    if (tryAccess("basic_feature", "Básico")) {
      // Se o usuário tem acesso, executa a lógica da funcionalidade básica
      console.log("Acessando funcionalidade básica...");
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Exemplo de Controle de Acesso</CardTitle>
        <CardDescription>
          Demonstração de como verificar acesso a funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Clique nos botões abaixo para testar o controle de acesso baseado em planos.
          Se você não tiver o plano necessário, um modal de restrição será exibido.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBasicFeatureClick}>
          Funcionalidade Básica
        </Button>
        <Button onClick={handlePremiumFeatureClick}>
          Funcionalidade Premium
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureAccessExample;
