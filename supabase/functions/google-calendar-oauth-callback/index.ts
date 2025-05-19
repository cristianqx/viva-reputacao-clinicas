
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google OAuth configs
const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
const redirectUri = "https://viva-reputacao-clinicas.lovable.app/auth/google-calendar-callback";

// Create a Supabase client with the Auth context of the logged in user
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Grab the auth code from the request body
    const { code, state } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Código de autorização ausente" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log("Recebido código de autorização:", code.substring(0, 10) + "...");
    
    // Validate state and extract user_id
    // In a real implementation, state should be validated against a stored value for CSRF protection
    let userId;
    try {
      // For simple implementation, state can be the userId or encrypted data containing it
      userId = state || "";
      console.log("User ID from state:", userId);
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Estado inválido ou usuário não identificado" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } catch (error) {
      console.error("Erro ao extrair user ID do state:", error);
      return new Response(
        JSON.stringify({ error: "Erro ao identificar usuário" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Exchange the auth code for access and refresh tokens
    const tokenFormData = new URLSearchParams();
    tokenFormData.append("code", code);
    tokenFormData.append("client_id", clientId);
    tokenFormData.append("client_secret", clientSecret);
    tokenFormData.append("redirect_uri", redirectUri);
    tokenFormData.append("grant_type", "authorization_code");
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenFormData,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Falha na troca de tokens: ${errorText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful");

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info:", userInfoResponse.status);
      return new Response(
        JSON.stringify({ error: "Falha ao obter informações do usuário Google" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const userInfo = await userInfoResponse.json();
    console.log("Got user info for:", userInfo.email);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if a connection already exists for this user and Google account
    const { data: existingConnection, error: queryError } = await supabase
      .from('google_calendar_connections')
      .select('id')
      .eq('user_id', userId)
      .eq('google_email', userInfo.email)
      .eq('status', 'active')
      .maybeSingle();
      
    if (queryError) {
      console.error("Error checking existing connection:", queryError);
    }
    
    let result;
    if (existingConnection) {
      // Update existing connection
      console.log("Updating existing connection:", existingConnection.id);
      const { data, error } = await supabase
        .from('google_calendar_connections')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || existingConnection.refresh_token, // Keep existing if not provided
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          created_at: new Date().toISOString()
        })
        .eq('id', existingConnection.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating connection:", error);
        return new Response(
          JSON.stringify({ error: "Falha ao atualizar conexão existente" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      result = data;
    } else {
      // Create new connection
      console.log("Creating new connection for:", userInfo.email);
      const { data, error } = await supabase
        .from('google_calendar_connections')
        .insert({
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          google_email: userInfo.email,
          status: "active"
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating connection:", error);
        return new Response(
          JSON.stringify({ error: "Falha ao salvar nova conexão" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      result = data;
    }

    // Update user's google_calendar_integrado flag
    const { error: updateError } = await supabase
      .from('users')
      .update({ google_calendar_integrado: true })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating user:", updateError);
      // Non-blocking, we continue even if this fails
    } else {
      console.log("Updated user google_calendar_integrado flag");
    }

    // Run initial sync if needed (or queue it)
    try {
      // Call the sync function directly or queue it for async processing
      console.log("Scheduling initial sync for user:", userId);
      
      // In a production environment, we would queue this for async processing
      // For this demo, we'll make a request to the sync function
      const syncFunctionUrl = `${supabaseUrl}/functions/v1/sync-google-calendar`;
      fetch(syncFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ userId }),
      }).catch(error => {
        console.error("Error scheduling initial sync:", error);
      });
      
      console.log("Initial sync scheduled");
    } catch (error) {
      console.error("Error scheduling initial sync:", error);
      // Non-blocking, we continue even if this fails
    }

    // Return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Google Calendar conectado com sucesso",
        email: userInfo.email
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
})
