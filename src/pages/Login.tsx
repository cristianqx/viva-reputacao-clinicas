import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Mic } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const StarSVG = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#FFCD3C">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const { login, isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const navigate = useNavigate();

  // Check authentication status only once when component mounts
  useEffect(() => {
    // Don't check for redirects if we're already submitting a login
    if (isSubmitting) return;
    
    // Only redirect if authenticated, not loading, and we've already checked
    if (isAuthenticated && !isLoading) {
      console.log("User authenticated in Login, checking redirect path", user);
      
      // Add a delay to prevent immediate redirects that might cause loops
      const redirectTimer = setTimeout(async () => {
        // Always fetch fresh user data from the database to make onboarding decisions
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fresh user data for redirect:", error);
          return;
        }
        
        const shouldRedirectToOnboarding = userData ? 
          userData.onboarding_completo === false : 
          user?.onboarding_completo === false;
        
        if (shouldRedirectToOnboarding) {
          console.log("User needs onboarding, redirecting to onboarding");
          navigate('/onboarding', { replace: true });
        } else {
          console.log("User onboarding complete, redirecting to dashboard");
          navigate('/dashboard', { replace: true });
        }
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    } else if (!redirectChecked && !isLoading) {
      setRedirectChecked(true);
    }
  }, [isAuthenticated, navigate, isLoading, redirectChecked, user, isSubmitting]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      console.log("Tentando fazer login com:", email);
      const success = await login(email, password);
      if (!success) {
        console.error("Erro durante login");
        toast.error("Usuário e/ou senha incorretos. Verifique suas credenciais e tente novamente.");
        setIsSubmitting(false);
        return;
      }
      // Não faz mais nada aqui, o redirecionamento será feito no useEffect
    } catch (error: any) {
      console.error("Erro inesperado durante login:", error);
      toast.error(error?.message || "Ocorreu um erro ao tentar fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Novo useEffect para buscar onboarding e redirecionar
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const checkOnboarding = async () => {
        const { data: userData, error } = await supabase
          .from('users')
          .select('onboarding_completo')
          .eq('id', user.id)
          .single();
        if (error || !userData) {
          toast.error("Erro ao carregar dados do usuário. Por favor, tente novamente.");
          return;
        }
        if (userData.onboarding_completo === false) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        toast.success("Login realizado com sucesso.");
      };
      checkOnboarding();
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 relative">
      {/* Lado esquerdo - Logo e mensagem */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center items-center text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-4 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0E927D] rounded-full flex items-center justify-center shadow-lg">
              <Mic className="w-20 h-20 text-white" />
            </div>
            {/* Estrela amarela sobreposta */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 flex items-center justify-center">
              <StarSVG className="w-8 h-8 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1F36] mb-2 font-montserrat">Reputação Viva</h1>
        </div>
        <h2 className="text-xl md:text-2xl font-medium text-[#1A1F36] mb-4 font-montserrat">
          Transforme a reputação da sua clínica com feedbacks reais.
        </h2>
        <p className="text-gray-500 max-w-md font-montserrat">
          Colete avaliações, gerencie sua presença online e atraia mais pacientes para sua clínica odontológica.
        </p>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 bg-[#F5F7FA] p-8 md:p-12 flex flex-col justify-center relative">
        {/* Overlay de loading com microfone verde e estrela */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20">
            <div className="relative w-20 h-20 flex items-center justify-center mb-4">
              <div className="rounded-full bg-[#0E927D] w-16 h-16 flex items-center justify-center animate-spin-slow">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center">
                <StarSVG className="w-6 h-6" />
              </div>
            </div>
            <span className="text-[#179C8A] font-semibold text-lg">Autenticando...</span>
          </div>
        )}
        {/* Logo duplicado para o lado direito (pequena) */}
        <div className="absolute top-8 right-8">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 bg-[#0E927D] rounded-full flex items-center justify-center">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center">
              <StarSVG className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1F36] mb-8 font-montserrat">Acesse sua conta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm text-[#0E927D] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className={`${errors.password ? 'border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0E927D] hover:bg-[#0B7562] transition-colors font-montserrat"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
