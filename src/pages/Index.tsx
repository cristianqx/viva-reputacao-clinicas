
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import { checkPendingOAuth, getUserSession } from "@/services/googleBusinessApi";

const Index = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const init = async () => {
      // Verificar se há uma sessão salva
      const savedSession = getUserSession();
      
      if (savedSession) {
        console.log("Sessão encontrada no armazenamento local. Validando...");
      }
      
      await checkAuth();
      
      // Verificar se há operação OAuth pendente
      if (isAuthenticated) {
        checkPendingOAuth();
      }
    };
    
    init();
  }, [checkAuth, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1CB65D]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

export default Index;
