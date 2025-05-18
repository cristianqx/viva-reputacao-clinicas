import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, ChevronRight, Calendar, Link } from "lucide-react";
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";
import { useGoogleCalendarIntegration } from "@/hooks/useGoogleCalendarIntegration";
import { supabase } from "@/integrations/supabase/client";

// Animation variants for step transitions
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: -100
  }
};

// Step configuration
enum OnboardingStep {
  PROFILE = 0,
  GOOGLE_CALENDAR = 1,
  GOOGLE_MY_BUSINESS = 2
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    const savedStep = window.sessionStorage.getItem('onboardingStep');
    return savedStep ? Number(savedStep) : OnboardingStep.PROFILE;
  });
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeClinica, setNomeClinica] = useState("");
  const [enderecoClinica, setEnderecoClinica] = useState("");
  const [gmbLink, setGmbLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [onboardingConfig, setOnboardingConfig] = useState({
    google_calendar_integrado: false,
    gmb_link: null as string | null
  });
  
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth, updateOnboardingStatus } = useAuth();
  const { isConnected: isCalendarConnected, refreshConnection } = useGoogleCalendarIntegration();

  // Protect route - redirect unauthenticated users or users who completed onboarding
  useEffect(() => {
    console.log("Onboarding page mounted, checking auth state");
    console.log("Auth loading:", authLoading, "isAuthenticated:", isAuthenticated);
    console.log("User onboarding status:", user?.onboarding_completo);
    
    const checkAuthAndFetchData = async () => {
      if (authLoading) {
        console.log("Auth state still loading, waiting...");
        return;
      }
      if (!isAuthenticated || !user) {
        console.log("User not authenticated, redirecting to login");
        navigate('/login');
        return;
      }
      const { data: freshUserData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.error("Error fetching fresh user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        return;
      }
      if (freshUserData?.onboarding_completo) {
        console.log("Onboarding already completed, redirecting to dashboard");
        navigate('/dashboard');
        return;
      }
      // Só repopule campos e mexa no step se for o primeiro step
      if (!initialCheckDone && freshUserData && currentStep === 0) {
        console.log("Fresh user data loaded:", freshUserData);
        if (freshUserData.nome_completo) {
          setNomeCompleto(freshUserData.nome_completo);
        }
        if (freshUserData.nome_clinica) {
          setNomeClinica(freshUserData.nome_clinica || "");
        }
        if (freshUserData.endereco_clinica) {
          setEnderecoClinica(freshUserData.endereco_clinica || "");
        }
        if (freshUserData.google_my_business_link) {
          setGmbLink(freshUserData.google_my_business_link || "");
        }
        setOnboardingConfig({
          google_calendar_integrado: freshUserData.google_calendar_integrado || false,
          gmb_link: freshUserData.google_my_business_link || null
        });
        setInitialCheckDone(true);
      }
    };
    if (!initialCheckDone) {
      checkAuthAndFetchData();
    }
  }, [user, isAuthenticated, authLoading, navigate, initialCheckDone, currentStep]);

  // Update state when Google Calendar connection changes
  useEffect(() => {
    setOnboardingConfig(prev => ({ 
      ...prev, 
      google_calendar_integrado: isCalendarConnected 
    }));
  }, [isCalendarConnected]);

  // Handle profile form inputs
  const handleChangeNomeCompleto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCompleto(e.target.value);
  };
  
  const handleChangeNomeClinica = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeClinica(e.target.value);
  };
  
  const handleChangeEnderecoClinica = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnderecoClinica(e.target.value);
  };

  // Handle GMB link input
  const handleChangeGmbLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGmbLink(e.target.value);
  };

  // Handle step navigation
  const goToNextStep = () => {
    // Calculate next step first
    const nextStep = currentStep + 1;
    
    // Save to sessionStorage BEFORE setting state
    window.sessionStorage.setItem('onboardingStep', String(nextStep));

    // Then update the state
    setCurrentStep(nextStep as OnboardingStep);
  };

  // Skip Google Calendar step
  const skipGoogleCalendar = () => {
    setOnboardingConfig(prev => ({ 
      ...prev, 
      google_calendar_integrado: false 
    }));
    goToNextStep();
  };

  // Skip GMB step
  const skipGoogleMyBusiness = () => {
    setOnboardingConfig(prev => ({ 
      ...prev, 
      gmb_link: null 
    }));
    finalizarOnboarding();
  };

  // Save GMB link and go to next step
  const saveGmbLinkAndContinue = async () => {
    if (gmbLink && !gmbLink.startsWith("https://")) {
      toast.error("O link do Google Meu Negócio deve iniciar com https://");
      return;
    }

    try {
      setIsSaving(true);
      
      // Save GMB link to config
      setOnboardingConfig(prev => ({ 
        ...prev, 
        gmb_link: gmbLink || null 
      }));

      finalizarOnboarding();
    } catch (error) {
      console.error('Erro ao salvar link do GMB:', error);
      toast.error("Ocorreu um erro ao salvar o link. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Overlay de loading agradável
  const renderLoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50 pointer-events-auto">
      <div className="relative w-20 h-20 flex items-center justify-center mb-4">
        <div className="rounded-full bg-[#0E927D] w-16 h-16 flex items-center justify-center animate-spin-slow">
          <Check className="w-8 h-8 text-white" />
        </div>
      </div>
      <span className="text-[#179C8A] font-semibold text-lg">Salvando...</span>
    </div>
  );

  // Complete the profile setup
  const completeProfileSetup = async () => {
    if (!nomeCompleto || !nomeClinica) {
      toast.error("Por favor, preencha seu nome e o nome da clínica");
      return;
    }
    setIsSaving(true);
    try {
      // Get the current authenticated user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Não foi possível verificar a sessão de usuário');
      }
      const userId = session.user.id;
      const updateData = {
        nome_completo: nomeCompleto,
        nome_clinica: nomeClinica || null,
        endereco_clinica: enderecoClinica || null
      };
      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);
      if (error) {
        console.error('Erro na atualização:', error);
        throw error;
      }
      toast.success("Perfil atualizado com sucesso");
      goToNextStep();
      setIsSaving(false);
      checkAuth(); // Atualiza contexto em background
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error("Ocorreu um erro ao salvar as informações. Tente novamente.");
      setIsSaving(false);
    }
  };

  // Complete the onboarding process
  const finalizarOnboarding = async () => {
    setIsSaving(true);
    try {
      // Get current user session to ensure we have the user ID
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Não foi possível verificar a sessão de usuário');
      }
      
      const userId = session.user.id;
      console.log('Finalizando onboarding para usuário:', userId);
      
      // Buscar dados frescos do usuário para garantir que temos nomeCompleto e nomeClinica
      const { data: freshUserData, error: fetchError } = await supabase
        .from('users')
        .select('nome_completo, nome_clinica')
        .eq('id', userId)
        .single();
      
      if (fetchError || !freshUserData) {
        console.error('Erro ao buscar dados do usuário para finalizar onboarding:', fetchError);
        toast.error("Erro ao carregar seus dados. Por favor, tente novamente.");
        return;
      }
      
      // Validar usando os dados frescos
      if (!freshUserData.nome_completo || !freshUserData.nome_clinica) {
         console.warn('Nome completo ou nome da clínica faltando nos dados frescos', freshUserData);
         toast.error("Por favor, preencha seu nome e o nome da clínica antes de finalizar");
         // Opcional: voltar para o step de perfil se os dados estiverem faltando
         setCurrentStep(OnboardingStep.PROFILE);
         window.sessionStorage.setItem('onboardingStep', String(OnboardingStep.PROFILE));
         return;
      }

      // Prepare all the data for the onboarding update, enviando apenas campos preenchidos
      const onboardingData: Record<string, any> = {
        onboarding_completo: true
      };
      // Usar dados frescos ou estado local, priorizando frescos para nome/clinica
      onboardingData.nome_completo = freshUserData.nome_completo;
      onboardingData.nome_clinica = freshUserData.nome_clinica;

      // Para outros campos, podemos usar o estado local ou verificar freshUserData se apropriado
      if (enderecoClinica) onboardingData.endereco_clinica = enderecoClinica;
      if (onboardingConfig.google_calendar_integrado !== undefined) onboardingData.google_calendar_integrado = onboardingConfig.google_calendar_integrado;
      if (gmbLink) onboardingData.google_my_business_link = gmbLink;
      
      console.log('Salvando configurações de onboarding:', onboardingData);
      
      // First try using the direct Supabase update to ensure data is saved
      const { error } = await supabase
        .from("users")
        .update(onboardingData)
        .eq("id", userId);
        
      if (error) {
        console.error('Erro ao atualizar diretamente:', error);
        throw error;
      }
      
      // Also update via the Auth Context method as a backup (opcional)
      // const updateSuccess = await updateOnboardingStatus(true, onboardingData);
      
      // if (!updateSuccess) {
      //   console.warn("O método de contexto não atualizou com sucesso, mas a atualização direta funcionou");
      // }
      
      // Show success message
      toast.success("Configuração finalizada com sucesso!");
      
      // Navigate to dashboard IMMEDIATELY after successful save
      console.log("Redirecionando para dashboard após onboarding completo");
      window.sessionStorage.removeItem('onboardingStep');
      navigate('/dashboard', { replace: true });

    } catch (error: any) {
      console.error('Erro ao finalizar onboarding:', error);
      toast.error(error.message || "Ocorreu um erro ao salvar as configurações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render step indicators
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= OnboardingStep.PROFILE ? 'bg-[#0E927D] text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${currentStep > OnboardingStep.PROFILE ? 'bg-[#0E927D]' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= OnboardingStep.GOOGLE_CALENDAR ? 'bg-[#0E927D] text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${currentStep > OnboardingStep.GOOGLE_CALENDAR ? 'bg-[#0E927D]' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= OnboardingStep.GOOGLE_MY_BUSINESS ? 'bg-[#0E927D] text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.PROFILE:
        return (
          <motion.div 
            key="profile"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Bem-vindo(a) ao Reputação Viva!</h2>
              <p className="text-gray-600">
                Para começar, precisamos de algumas informações sobre você e sua clínica.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nomeCompleto" className="text-gray-700 font-medium">
                  Seu Nome Completo
                </Label>
                <Input
                  type="text"
                  id="nomeCompleto"
                  placeholder="Digite seu nome completo"
                  value={nomeCompleto}
                  onChange={handleChangeNomeCompleto}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="nomeClinica" className="text-gray-700 font-medium">
                  Nome da Sua Clínica
                </Label>
                <Input
                  type="text"
                  id="nomeClinica"
                  placeholder="Digite o nome da sua clínica"
                  value={nomeClinica}
                  onChange={handleChangeNomeClinica}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="enderecoClinica" className="text-gray-700 font-medium">
                  Endereço da Clínica
                </Label>
                <Textarea
                  id="enderecoClinica"
                  placeholder="Digite o endereço da sua clínica"
                  value={enderecoClinica}
                  onChange={handleChangeEnderecoClinica}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={completeProfileSetup} 
                className="bg-[#0E927D] hover:bg-[#0b7a69] gap-2" 
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Próximo'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case OnboardingStep.GOOGLE_CALENDAR:
        return (
          <motion.div 
            key="googleCalendar"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#E6F4F1] flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-[#0E927D]" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Integração com Google Calendar</h2>
              <p className="text-gray-600 mb-2">
                Conecte o Google Calendar para gerenciar seus agendamentos automaticamente.
              </p>
              <p className="text-gray-600 text-sm">
                Ao conectar, você poderá sincronizar suas consultas e receber lembretes.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <GoogleCalendarIntegration
                isConnected={isCalendarConnected}
                isLoading={isLoading}
              />
            </div>

            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={skipGoogleCalendar}
                className="text-gray-500"
              >
                Pular esta etapa
              </Button>
              
              <Button 
                onClick={goToNextStep} 
                className="bg-[#0E927D] hover:bg-[#0b7a69] gap-2"
                disabled={isSaving}
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case OnboardingStep.GOOGLE_MY_BUSINESS:
        return (
          <motion.div 
            key="googleMyBusiness"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#E6F4F1] flex items-center justify-center">
                  <Link className="h-8 w-8 text-[#0E927D]" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Google Meu Negócio</h2>
              <p className="text-gray-600 mb-2">
                Configure o link do seu Google Meu Negócio para receber avaliações públicas.
              </p>
              <p className="text-gray-600 text-sm">
                Os pacientes com notas altas serão redirecionados para deixar avaliações públicas.
              </p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="gmbLink" className="block text-gray-700 font-medium">
                Link do Google Meu Negócio
              </Label>
              <Input
                type="text"
                id="gmbLink"
                placeholder="https://g.page/nome-da-sua-clinica"
                value={gmbLink}
                onChange={handleChangeGmbLink}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Ex: https://g.page/nome-da-sua-clinica ou https://maps.app.goo.gl/your-link
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={skipGoogleMyBusiness}
                className="text-gray-500"
              >
                Pular esta etapa
              </Button>
              
              <Button 
                onClick={saveGmbLinkAndContinue} 
                className="bg-[#0E927D] hover:bg-[#0b7a69] gap-2"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Finalizar Configuração'}
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  // Show loading state while checking authentication
  if (authLoading && !initialCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-10 h-10 border-4 border-[#0E927D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // If no authenticated user, show simple message instead of full UI
  if (!isAuthenticated && !initialCheckDone) {
    // Redirect will happen via useEffect, but show loading state meanwhile
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-10 h-10 mx-auto border-4 border-[#0E927D] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Verificando sessão...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        {isSaving && renderLoadingOverlay()}
        {renderStepIndicator()}
        {renderStepContent()}
      </div>
    </div>
  );
}
