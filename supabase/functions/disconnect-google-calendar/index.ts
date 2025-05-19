
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the Auth context of the logged in user
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user ID from token
    const token = authHeader.slice("Bearer ".length);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token or unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Get current connection
    const { data: connection } = await supabase
      .from('google_calendar_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    
    if (connection) {
      console.log("Revoking calendar connection for user:", userId);
      
      // Try to revoke token at Google
      try {
        const revokeResponse = await fetch(`https://oauth2.googleapis.com/revoke?token=${connection.access_token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        
        if (revokeResponse.ok) {
          console.log("Successfully revoked token at Google");
        } else {
          console.error("Failed to revoke token at Google:", revokeResponse.status);
        }
      } catch (revokeError) {
        console.error("Error revoking token at Google:", revokeError);
      }
      
      // Update connection status to revoked
      const { error: updateError } = await supabase
        .from('google_calendar_connections')
        .update({ status: 'revoked' })
        .eq('id', connection.id);
      
      if (updateError) {
        console.error("Error updating connection status:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update connection status" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    } else {
      console.log("No active connection found for user:", userId);
    }
    
    // Update user's google_calendar_integrado flag
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ google_calendar_integrado: false })
      .eq('id', userId);
    
    if (userUpdateError) {
      console.error("Error updating user flag:", userUpdateError);
      return new Response(
        JSON.stringify({ error: "Failed to update user status" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Google Calendar disconnected successfully" }),
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
