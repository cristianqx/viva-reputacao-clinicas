import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { 
  cleanupAuthState, 
  checkAuthStatus, 
  updateOnboardingCompletionStatus,
  performRobustLogin,
  performRobustLogout
} from '@/utils/supabaseAuth';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  planValidity: string;
  isActive: boolean;
  onboarding_completo: boolean;
  nome_completo?: string;
  nome_clinica?: string | null;
  endereco_clinica?: string | null;
  google_calendar_integrado?: boolean | null;
  google_my_business_link?: string | null;
  ativo?: boolean;
  data_validade?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nome_completo: string, telefone: string) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  updateOnboardingStatus: (completed: boolean, additionalData?: any) => Promise<boolean>;
  token?: string | null;
}

// Export the AuthContext so it can be imported in App.tsx
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  checkAuth: async () => false,
  updateOnboardingStatus: async () => false,
  token: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authStateInitialized, setAuthStateInitialized] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [pendingAuthCheck, setPendingAuthCheck] = useState(false);

  // Memoize the checkAuth function to prevent unnecessary re-renders
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Prevent duplicate auth checks
      if (pendingAuthCheck) {
        console.log('Skipping duplicate auth check - already in progress');
        return isAuthenticated;
      }

      // Add a cooldown period to prevent excessive auth checks
      const now = Date.now();
      if (now - lastCheckTime < 1000 && authStateInitialized) { // 1 second cooldown
        console.log('Skipping duplicate auth check - already checked recently');
        return isAuthenticated;
      }
      
      setLastCheckTime(now);
      setPendingAuthCheck(true);
      setIsLoading(true);
      console.log('Checking authentication status');
      
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao obter sessão:', error);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem("rv_user_id"); // Clear rv_user_id on error
        setIsLoading(false);
        setPendingAuthCheck(false);
        return false;
      }

      if (!session) {
        console.log('No active session found');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem("rv_user_id"); // Clear rv_user_id if no session
        setIsLoading(false);
        setPendingAuthCheck(false);
        return false;
      }

      // Set token from the session
      setToken(session.access_token);
      localStorage.setItem("supabase-auth-token", session.access_token); // Also store the token itself
      localStorage.setItem("rv_user_id", session.user.id); // Ensure rv_user_id is set with session user id
      console.log('Active session found, token and rv_user_id set');

      // Fetch user profile directly from the users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Erro ao buscar perfil do usuário:', profileError);
        // If error fetching profile, but we have valid session, try to use session data
        if (session.user) {
          const metadata = session.user.user_metadata || {};
          const currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: metadata.nome_completo || session.user.email || '',
            plan: metadata.plano_id || 'Free',
            planValidity: metadata.data_validade || '',
            isActive: true,
            onboarding_completo: metadata.onboarding_completo || false,
            nome_completo: metadata.nome_completo || '',
            nome_clinica: metadata.nome_clinica || null,
            endereco_clinica: metadata.endereco_clinica || null,
            google_calendar_integrado: metadata.google_calendar_integrado || null,
            google_my_business_link: metadata.google_my_business_link || null,
            ativo: true,
            data_validade: metadata.data_validade || ''
          };
          setUser(currentUser);
          // localStorage.setItem("rv_user_id", currentUser.id); // rv_user_id already set from session
          
          setIsAuthenticated(true);
          console.log('Using auth data since profile not found');
          setIsLoading(false);
          setPendingAuthCheck(false);
          return true;
        }
        
        setIsAuthenticated(false);
        localStorage.removeItem("rv_user_id"); // Clear rv_user_id on profile error
        setIsLoading(false);
        setPendingAuthCheck(false);
        return false;
      }

      if (userProfile) {
        console.log('User profile found in database:', userProfile);
        console.log('Onboarding status:', userProfile.onboarding_completo);
        
        const currentUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: userProfile.nome_completo || '',
          plan: userProfile.plano_id || 'Free',
          planValidity: userProfile.data_validade || '',
          isActive: userProfile.ativo || false,
          onboarding_completo: userProfile.onboarding_completo || false,
          nome_completo: userProfile.nome_completo || '',
          nome_clinica: userProfile.nome_clinica || null,
          endereco_clinica: userProfile.endereco_clinica || null,
          google_calendar_integrado: userProfile.google_calendar_integrado || false,
          google_my_business_link: userProfile.google_my_business_link || null,
          ativo: userProfile.ativo || false,
          data_validade: userProfile.data_validade || '',
        };
        setUser(currentUser);
        // localStorage.setItem("rv_user_id", currentUser.id); // rv_user_id already set from session

        setIsAuthenticated(true);
        setIsLoading(false);
        setPendingAuthCheck(false);
        return true;
      }
      
      setIsAuthenticated(false);
      localStorage.removeItem("rv_user_id"); // Clear rv_user_id if no profile found
      setIsLoading(false);
      setPendingAuthCheck(false);
      return false;
    } catch (error: any) {
      console.error('Error in checkAuth:', error);
      setError(error.message);
      setIsAuthenticated(false);
      localStorage.removeItem("rv_user_id"); // Clear rv_user_id on catch
      setIsLoading(false);
      setPendingAuthCheck(false);
      return false;
    }
  }, [isAuthenticated, authStateInitialized, lastCheckTime, pendingAuthCheck]);

  // Set up auth state listener only once when component mounts
  useEffect(() => {
    if (authStateInitialized) {
      // Already initialized, no need to set up again
      return;
    }
    
    console.log('Setting up auth state change listener');
    
    // Mark auth state as initialized to prevent duplicate checks
    setAuthStateInitialized(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setToken(session.access_token);
          localStorage.setItem("supabase-auth-token", session.access_token);
          localStorage.setItem("rv_user_id", session.user.id); // Ensure rv_user_id is set on SIGNED_IN
          setIsAuthenticated(true);
          
          // Use setTimeout to avoid potential deadlocks
          setTimeout(() => {
            checkAuth().catch(err => { 
              console.error('Error checking auth after state change:', err);
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('Signed out event received');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          localStorage.removeItem("rv_user_id");
          localStorage.removeItem("supabase-auth-token");
        }
      }
    );

    // Initial check for existing session
    checkAuth().catch(err => { 
      console.error('Error during initial auth check:', err);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, authStateInitialized]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting login process in AuthContext');

      // Use the robust login function from utils/supabaseAuth
      const result = await performRobustLogin(email, password);
      
      if (!result.success) {
        console.error('Login failed:', result.error);
        setError(result.error?.message || 'Falha na autenticação');
        localStorage.removeItem("rv_user_id"); // Clear rv_user_id on login failure
        return false;
      }

      const data = result.data;
      console.log('Login successful, user data:', data);

      if (data?.user) {
        console.log('Fetching user data for ID:', data.user.id);
        if (data.session) {
          setToken(data.session.access_token);
          localStorage.setItem("supabase-auth-token", data.session.access_token);
        }
        localStorage.setItem("rv_user_id", data.user.id); // Set rv_user_id after successful login
        
        // Buscar dados do usuário da tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setError('Erro ao carregar dados do usuário');
          localStorage.removeItem("rv_user_id"); // Clear rv_user_id
          return false;
        }

        if (!userData) {
          console.error('No user data found for ID:', data.user.id);
          setError('Dados do usuário não encontrados');
          localStorage.removeItem("rv_user_id"); // Clear rv_user_id
          return false;
        }

        console.log('User data from database:', userData);
        const currentUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: userData.nome_completo || '',
          plan: userData.plano_id || 'Free',
          planValidity: userData.data_validade || '',
          isActive: userData.ativo || false,
          onboarding_completo: userData.onboarding_completo || false,
          nome_completo: userData.nome_completo || '',
          nome_clinica: userData.nome_clinica || null,
          endereco_clinica: userData.endereco_clinica || null,
          google_calendar_integrado: userData.google_calendar_integrado || false,
          google_my_business_link: userData.google_my_business_link || null,
          ativo: userData.ativo || false,
          data_validade: userData.data_validade || '',
        };
        setUser(currentUser);
        // localStorage.setItem("rv_user_id", currentUser.id); // rv_user_id already set

        setIsAuthenticated(true);
        return true;
      }
      // If data.user is null for some reason after successful login
      localStorage.removeItem("rv_user_id");
      return false; 
    } catch (error: any) {
      console.error('Login error in AuthContext:', error);
      setError(error.message);
      localStorage.removeItem("rv_user_id"); // Clear rv_user_id on catch
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Starting logout process');
      
      // Use robust logout function from utils/supabaseAuth
      await performRobustLogout();
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem("rv_user_id");
      localStorage.removeItem("supabase-auth-token");
      
      // Clear local storage and sessionStorage completely
      cleanupAuthState();
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nome_completo: string, telefone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nome_completo: nome_completo,
            telefone: telefone,
            plano_ativo: 'Free',
            data_validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
            onboarding_completo: false,
          },
        },
      });

      if (error) {
        setError(error.message);
        toast("Erro", {
          description: "Erro ao criar usuário. Tente novamente.",
        });
        localStorage.removeItem("rv_user_id");
        return false;
      }

      if (data?.user) {
        const currentUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: nome_completo,
          plan: 'Free',
          planValidity: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
          isActive: true,
          onboarding_completo: false,
          nome_completo: nome_completo,
          ativo: true,
          data_validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
        };
        setUser(currentUser);
        localStorage.setItem("rv_user_id", currentUser.id); // Set rv_user_id on registration
        if (data.session) {
            setToken(data.session.access_token);
            localStorage.setItem("supabase-auth-token", data.session.access_token);
        }
      } else {
         localStorage.removeItem("rv_user_id"); // Ensure it's cleared if no user data
      }

      setIsAuthenticated(true);
      
      // Force refresh to ensure user data is fully loaded
      setTimeout(() => {
        checkAuth(); 
      }, 100);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      localStorage.removeItem("rv_user_id");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOnboardingStatus = async (completed: boolean, additionalData?: any): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      console.log("Updating onboarding status:", {completed, additionalData});

      // Use the utility function to update onboarding status with additional data if provided
      const result = await updateOnboardingCompletionStatus(completed, additionalData);
      
      if (!result.success) {
        console.error("Failed to update onboarding status using utility:", result.error);
        
        // Attempt direct DB update as a fallback
        if (additionalData) {
          const { error } = await supabase
            .from('users')
            .update({
              ...additionalData,
              onboarding_completo: completed
            })
            .eq('id', user.id);
            
          if (error) {
            console.error("Direct update also failed:", error);
            return false;
          }
        }
      }

      // Update local user state
      setUser(prev => {
        if (!prev) return prev;
        
        const updatedUser = { ...prev, onboarding_completo: completed };
        
        // Update additional fields if provided
        if (additionalData) {
          if (additionalData.nome_completo !== undefined) {
            updatedUser.nome_completo = additionalData.nome_completo;
          }
          
          if (additionalData.nome_clinica !== undefined) {
            updatedUser.nome_clinica = additionalData.nome_clinica;
          }
          
          if (additionalData.endereco_clinica !== undefined) {
            updatedUser.endereco_clinica = additionalData.endereco_clinica;
          }
          
          if (additionalData.google_calendar_integrado !== undefined) {
            updatedUser.google_calendar_integrado = additionalData.google_calendar_integrado;
          }
          
          if (additionalData.google_my_business_link !== undefined) {
            updatedUser.google_my_business_link = additionalData.google_my_business_link;
          }
        }
        
        return updatedUser;
      });
      
      // Force refresh the session
      await checkAuth();
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do onboarding:', error);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    logout,
    register,
    checkAuth,
    updateOnboardingStatus,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
