import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { checkPendingOAuth } from "@/services/googleBusinessApi";
import { checkPendingCalendarOAuth } from "@/services/googleCalendarApi";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // Prevent multiple simultaneous auth checks
      if (!isInitialized && !isCheckingAuth) {
        try {
          console.log("Initializing app, checking auth status");
          setIsCheckingAuth(true);
          await checkAuth();
          setIsInitialized(true);
          
          // Only check OAuth operations if authenticated
          if (isAuthenticated && user) {
            console.log("User authenticated, checking OAuth operations");
            // Get the latest user data directly from DB to ensure we have correct onboarding status
            const { data: freshUserData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
              
            if (error) {
              console.error("Error fetching fresh user data:", error);
            } else if (freshUserData) {
              console.log("Fresh user data from DB:", freshUserData);
              setUserData(freshUserData);
              // Add OAuth checks after fresh data is fetched
              checkPendingOAuth();
              checkPendingCalendarOAuth();
            }
          }
          
          setCheckComplete(true);
          setIsCheckingAuth(false);
        } catch (error) {
          console.error("Erro ao inicializar a aplicação:", error);
          toast("Erro", {
            description: "Ocorreu um erro ao inicializar a aplicação. Tente novamente.",
          });
          setCheckComplete(true);
          setIsCheckingAuth(false);
        }
      }
    };
    
    init();
  }, [checkAuth, isAuthenticated, isInitialized, user, isCheckingAuth]);

  // Show loading state while checking
  if (isLoading || !checkComplete) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E927D]"></div>
      </div>
    );
  }

  // Redirect based on authentication and onboarding status
  if (isAuthenticated) {
    // Always use the freshest data from the database to make redirect decisions
    const onboardingComplete = userData?.onboarding_completo ?? user?.onboarding_completo ?? false;
    
    // If onboarding is not completed, redirect to onboarding
    if (!onboardingComplete) {
      console.log("Onboarding não completado, redirecionando para onboarding");
      return <Navigate to="/onboarding" replace />;
    }
    
    // Otherwise redirect to dashboard
    console.log("Usuário autenticado, redirecionando para dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to login if not authenticated
  console.log("Usuário não autenticado, redirecionando para login");
  return <Navigate to="/login" replace />;
};

export default Index;
