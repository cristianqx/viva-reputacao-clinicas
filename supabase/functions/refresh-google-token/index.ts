
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

// Create a Supabase client with the Auth context of the logged in user
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const { refresh_token, connection_id } = await req.json();
    
    if (!refresh_token || !connection_id) {
      return new Response(
        JSON.stringify({ error: "Refresh token and connection ID are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log("Refreshing token for connection:", connection_id);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Validate the connection exists
    const { data: connection, error: connectionError } = await supabase
      .from('google_calendar_connections')
      .select('*')
      .eq('id', connection_id)
      .single();
      
    if (connectionError || !connection) {
      console.error("Connection not found:", connectionError);
      return new Response(
        JSON.stringify({ error: "Connection not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Call Google API to refresh the token
    const formData = new URLSearchParams();
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("refresh_token", refresh_token);
    formData.append("grant_type", "refresh_token");
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!tokenResponse.ok) {
      console.error("Token refresh failed:", tokenResponse.status);
      const errorText = await tokenResponse.text();
      console.error("Details:", errorText);
      
      return new Response(
        JSON.stringify({ error: "Failed to refresh token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token refreshed successfully");
    
    // Update the connection with the new token data
    const { data: updatedConnection, error: updateError } = await supabase
      .from('google_calendar_connections')
      .update({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        created_at: new Date().toISOString()
      })
      .eq("id", connection_id)
      .select()
      .single();
      
    if (updateError) {
      console.error("Failed to update connection:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update connection" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Return the updated connection
    return new Response(
      JSON.stringify({ 
        success: true,
        connection: updatedConnection 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
})
