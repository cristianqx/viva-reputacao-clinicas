import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, ChevronRight, Calendar, Link, Mic } from "lucide-react";
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

const StarSVG = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#FFCD3C">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
);

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
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const hasCheckedRef = useRef(false);
  
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth, updateOnboardingStatus } = useAuth();

  // useEffect para verificar status do onboarding e redirecionar UMA vez ao autenticar
  useEffect(() => {
    // Aguarda autenticação e user id estarem disponíveis
    if (authLoading || !isAuthenticated || !user?.id) {
      console.log("Onboarding useEffect: Autenticação ou user ID não disponível.");
      return;
    }

    // Verifica se a checagem já foi feita nesta instância do componente
    if (hasCheckedRef.current) {
      console.log("Onboarding useEffect: Checagem de status já realizada.");
      return;
    }

    // Marca a checagem como feita imediatamente
    hasCheckedRef.current = true;
    console.log("Onboarding useEffect: Iniciando checagem de status de onboarding para user:", user.id);

    const checkOnboardingStatusAndRedirect = async () => {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('onboarding_completo') // Buscar APENAS a flag de onboarding
          .eq('id', user.id)
          .single();
  
        if (error || !userData) {
          console.error("Erro ao buscar status de onboarding:", error);
          // Em caso de erro, não podemos determinar o status, talvez melhor ir para o dashboard
          // ou tratar o erro de forma mais específica, mas para evitar loop, redireciona
          navigate('/dashboard', { replace: true });
          toast.error("Erro ao carregar status de onboarding. Redirecionando.");
          return;
        }
  
        if (userData.onboarding_completo) {
          console.log("Onboarding já completo, redirecionando para dashboard.");
          navigate('/dashboard', { replace: true });
        } else {
          console.log("Onboarding não completo, permanecendo na página.");
          // Se o onboarding não está completo, garantir que o estado 'initialCheckDone' seja true
          // para que o conteúdo da tela de onboarding seja renderizado corretamente
          setInitialCheckDone(true);
        }
      } catch (err) {
        console.error("Erro inesperado na checagem de onboarding:", err);
        // Em caso de erro, também redireciona para evitar loop
        navigate('/dashboard', { replace: true });
        toast.error("Erro inesperado na checagem de onboarding. Redirecionando.");
      }
    };
  
    checkOnboardingStatusAndRedirect();

  }, [authLoading, isAuthenticated, user, navigate]); // Dependências: apenas estado de auth e user, e navigate
  
  // useEffect para popular dados do perfil APENAS se o onboarding NÃO ESTIVER completo e user estiver disponível
  // Este useEffect é separado para não interferir na lógica de checagem inicial/redirecionamento
  useEffect(() => {
    // Popula dados se user estiver autenticado, initialCheckDone for true (indicando que onboarding não está completo)
    // e se estiver no passo do perfil (para evitar fetches desnecessários em outros passos)
    if (isAuthenticated && user?.id && initialCheckDone && currentStep === OnboardingStep.PROFILE) {
      console.log("Populating profile data for onboarding step 1.");
      // Fetch completo apenas para popular os campos do profile se eles ainda não estiverem preenchidos
      const fetchFullUserData = async () => {
          const { data: fullUserData, error: fullFetchError } = await supabase
           .from('users')
           .select('*')
           .eq('id', user.id)
           .maybeSingle(); // maybeSingle para lidar caso não encontre (embora não deva ocorrer aqui)

        if (fullFetchError || !fullUserData) {
           console.error("Error fetching full user data to populate fields:", fullFetchError);
           toast.error("Erro ao carregar dados completos do usuário para preenchimento.");
           return;
        }

        // Populate fields only if they are currently empty
        if (fullUserData.nome_completo && !nomeCompleto) setNomeCompleto(fullUserData.nome_completo);
        if (fullUserData.nome_clinica && !nomeClinica) setNomeClinica(fullUserData.nome_clinica || "");
        if (fullUserData.endereco_clinica && !enderecoClinica) setEnderecoClinica(fullUserData.endereco_clinica || "");
        if (fullUserData.google_my_business_link && !gmbLink) setGmbLink(fullUserData.google_my_business_link || "");

        // Update onboardingConfig based on fetched data for steps 2 and 3
        setOnboardingConfig(prev => ({
           ...prev,
           google_calendar_integrado: fullUserData.google_calendar_integrado || false,
           gmb_link: fullUserData.google_my_business_link || null
        }));

         console.log("Profile fields populated.");
      };
      fetchFullUserData();
    } else {
      console.log("Skipping profile data population useEffect.", {isAuthenticated, userId: user?.id, initialCheckDone, currentStep});
    }
  }, [isAuthenticated, user, initialCheckDone, currentStep, nomeCompleto, nomeClinica, enderecoClinica, gmbLink]); // Dependências: estado de auth/user, flag de checagem inicial, step atual, e campos para evitar loop de populate

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

  // Full screen loading overlay
  const renderFullScreenLoading = () => (
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-50">
      <div className="relative w-20 h-20 flex items-center justify-center mb-4">
        <div className="rounded-full bg-[#0E927D] w-16 h-16 flex items-center justify-center animate-spin-slow">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center">
          <StarSVG className="w-6 h-6" />
        </div>
      </div>
      <span className="text-[#179C8A] font-semibold text-lg">Finalizando configuração...</span>
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
    if (isSaving || redirecting || isFinalizing) return;
    setIsSaving(true);
    setIsFinalizing(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Não foi possível verificar a sessão de usuário');
      }
      
      const userId = session.user.id;
      console.log('Finalizando onboarding para usuário:', userId);
      
      // Fetch fresh user data for validation
      const { data: freshUserData, error: fetchError } = await supabase
        .from('users')
        .select('nome_completo, nome_clinica')
        .eq('id', userId)
        .single();
      
      if (fetchError || !freshUserData) {
        throw new Error('Erro ao buscar dados do usuário');
      }
      
      if (!freshUserData.nome_completo || !freshUserData.nome_clinica) {
        toast.error("Por favor, preencha seu nome e o nome da clínica antes de finalizar");
        setCurrentStep(OnboardingStep.PROFILE);
        window.sessionStorage.removeItem('onboardingStep');
        return;
      }

      // Prepare update data
      const onboardingData = {
        onboarding_completo: true,
        nome_completo: freshUserData.nome_completo,
        nome_clinica: freshUserData.nome_clinica,
        endereco_clinica: enderecoClinica || null,
        google_calendar_integrado: onboardingConfig.google_calendar_integrado,
        google_my_business_link: gmbLink || null
      };
      
      // Update user data
      const { error: updateError } = await supabase
        .from("users")
        .update(onboardingData)
        .eq("id", userId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Configuração finalizada com sucesso!");
      
      // Clear session storage and trigger redirect
      window.sessionStorage.removeItem('onboardingStep');
      setRedirecting(true);

    } catch (error: any) {
      console.error('Erro ao finalizar onboarding:', error);
      toast.error(error.message || "Ocorreu um erro ao salvar as configurações");
      setIsSaving(false);
      setIsFinalizing(false);
      setRedirecting(false);
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

  // Google Calendar Step Content Component
  const GoogleCalendarStepContent = ({ isFinalizing, redirecting, setOnboardingConfig }) => {
    const { isConnected: isCalendarConnected, refreshConnection } = useGoogleCalendarIntegration();

    // Update state when Google Calendar connection changes
    useEffect(() => {
      // Only update if currently on Google Calendar step, not finalizing or redirecting, and the calendar integrated status has actually changed.
      // Use functional update to get the latest state and prevent unnecessary renders.
      setOnboardingConfig(prev => {
        // Check if on correct step and not in transition
        if (currentStep === OnboardingStep.GOOGLE_CALENDAR && !isFinalizing && !redirecting) {
          // Check if the calendar integrated status has actually changed
          if (prev.google_calendar_integrado !== isCalendarConnected) {
            console.log("Updating onboardingConfig for Google Calendar status:", isCalendarConnected);
            return {
              ...prev,
              google_calendar_integrado: isCalendarConnected
            };
          }
        }
        return prev; // Return previous state if no update is needed or conditions are not met
      });

      // Add logging for potential issues with the hook state
      if (!isCalendarConnected && currentStep === OnboardingStep.GOOGLE_CALENDAR && !isFinalizing && !redirecting) {
        console.warn("Google Calendar integration hook reports not connected while on the calendar step.", { isCalendarConnected });
      }

    }, [isCalendarConnected, setOnboardingConfig, currentStep, isFinalizing, redirecting]); // Dependencies include connection status and step/transition states

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
            isLoading={false} // Assuming isLoading is handled within useGoogleCalendarIntegration or not needed here
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
        // Render the Google Calendar Step Content component
        return <GoogleCalendarStepContent isFinalizing={isFinalizing} redirecting={redirecting} setOnboardingConfig={setOnboardingConfig} />;

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
  
  // Show loading state while checking authentication or finalizing/redirecting
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
  
  // Render only the full screen loading when finalizing or redirecting
  if (isFinalizing || redirecting) {
    return renderFullScreenLoading();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {isSaving && renderLoadingOverlay()}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        {renderStepIndicator()}
        {renderStepContent()}
      </div>
    </div>
  );
}
