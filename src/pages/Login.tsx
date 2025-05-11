
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

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
    
    try {
      console.log("Tentando fazer login com:", email);
      const success = await login(email, password);
      console.log("Resultado do login:", success);
      
      if (success) {
        console.log("Login bem-sucedido, redirecionando para /dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro durante login:", error);
      toast.error("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Lado esquerdo - Logo e mensagem */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center items-center text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-[#0E927D] rounded-full flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-14 h-14 text-white"
                fill="currentColor"
              >
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#FFCD3C] rounded-full flex items-center justify-center shadow-md">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-white"
                fill="currentColor"
              >
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1F36] mb-2">Reputação Viva</h1>
        </div>
        <h2 className="text-xl md:text-2xl font-medium text-[#1A1F36] mb-4">
          Transforme a reputação da sua clínica com feedbacks reais.
        </h2>
        <p className="text-gray-500 max-w-md">
          Colete avaliações, gerencie sua presença online e atraia mais pacientes para sua clínica odontológica.
        </p>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 bg-[#F5F7FA] p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1F36] mb-8">Acesse sua conta</h2>
          
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
              className="w-full bg-[#0E927D] hover:bg-[#0B7562] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
