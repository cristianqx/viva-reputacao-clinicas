
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import { checkPendingOAuth, getUserSession } from "@/services/googleBusinessApi";
import { checkPendingCalendarOAuth } from "@/services/googleCalendarApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      // Verificar se há uma sessão salva
      const savedSession = getUserSession();
      
      if (savedSession) {
        console.log("Sessão encontrada no armazenamento local. Validando...");
      }
      
      try {
        await checkAuth();
        
        // Verificar se há operação OAuth pendente apenas se o usuário estiver autenticado
        if (isAuthenticated) {
          checkPendingOAuth();
          checkPendingCalendarOAuth();
        }
      } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao inicializar a aplicação. Tente novamente.",
          variant: "destructive",
        });
      }
    };
    
    init();
  }, [checkAuth, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E927D]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

export default Index;
