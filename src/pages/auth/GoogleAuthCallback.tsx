
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Database } from "@/types/supabase";

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set correctly.');
}

// Initialize the Supabase client with fallback values if needed
const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Google OAuth configs
const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
const redirectUri = "https://preview--viva-reputacao-clinicas.lovable.app/auth/callback";

export default function GoogleAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Display error if Supabase is not properly configured
        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Supabase não está configurado corretamente. Verifique as variáveis de ambiente.');
          setLoading(false);
          return;
        }

        // Get the code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        
        if (!code) {
          setError("Código de autorização não encontrado");
          setLoading(false);
          return;
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError("Usuário não autenticado. Por favor, faça login.");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        // Exchange the authorization code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(`Erro ao obter tokens: ${errorData.error}`);
        }

        const tokenData = await tokenResponse.json();
        
        // Get user email from Google
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error("Erro ao obter informações do usuário Google");
        }
        
        const userInfo = await userInfoResponse.json();
        
        // Store tokens in Supabase
        const { error: insertError } = await supabase.from("gmb_connections").upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          created_at: new Date().toISOString(),
          google_email: userInfo.email,
          status: "active",
        });

        if (insertError) {
          throw new Error(`Erro ao salvar os tokens: ${insertError.message}`);
        }

        toast.success("Conta Google conectada com sucesso!");
        setLoading(false);
        
        // Redirect back to the integrations page after a short delay
        setTimeout(() => {
          navigate("/configuracoes?tab=integracao");
        }, 1500);
        
      } catch (err) {
        console.error("Erro no callback:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setLoading(false);
        
        setTimeout(() => {
          navigate("/configuracoes?tab=integracao");
        }, 3000);
      }
    }

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <h1 className="text-xl font-medium">Conectando sua conta Google...</h1>
        <p className="text-muted-foreground mt-2">Por favor, aguarde enquanto processamos sua autenticação.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-medium">Falha na autenticação</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
        <p className="mt-6">Redirecionando para a página de configurações...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl font-medium">Autenticação concluída!</h1>
      <p className="text-muted-foreground mt-2">Sua conta Google foi conectada com sucesso.</p>
      <p className="mt-6">Redirecionando para a página de configurações...</p>
    </div>
  );
}
