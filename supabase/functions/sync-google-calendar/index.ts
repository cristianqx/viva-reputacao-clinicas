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

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function refreshCalendarToken(connection) {
  try {
    console.log("Refreshing access token for:", connection.google_email);
    
    const clientId = "976539767851-8puk3ucm86pt2m1qutb2oh78g1icdgda.apps.googleusercontent.com";
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
    
    const formData = new URLSearchParams();
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("refresh_token", connection.refresh_token);
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
      console.error("Error details:", errorText);
      
      // Mark connection as revoked
      await supabase
        .from('google_calendar_connections')
        .update({ status: "revoked" })
        .eq("id", connection.id);
        
      return null;
    }

    const tokenData = await tokenResponse.json();
    
    // Update the connection with new token
    const updatedConnection = {
      ...connection,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      created_at: new Date().toISOString(),
    };
    
    // Save to database
    await supabase
      .from('google_calendar_connections')
      .update({
        access_token: updatedConnection.access_token,
        token_type: updatedConnection.token_type,
        expires_in: updatedConnection.expires_in,
        created_at: updatedConnection.created_at
      })
      .eq("id", connection.id);
    
    return updatedConnection;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

async function getConnection(userId) {
  try {
    // Get connection from database
    const { data, error } = await supabase
      .from('google_calendar_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching connection or no connection found:", error);
      return null;
    }
    
    // Check if token needs to be refreshed
    const createdAt = new Date(data.created_at).getTime();
    const expiresAt = createdAt + (data.expires_in * 1000);
    const now = Date.now();
    
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (now > expiresAt - 5 * 60 * 1000) {
      console.log("Token expired or about to expire, refreshing...");
      return await refreshCalendarToken(data);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getConnection:", error);
    return null;
  }
}

async function getOrCreateContact(userId, contactInfo) {
  try {
    // If no email, try with phone
    if (!contactInfo.email && !contactInfo.phone) {
      console.log("No email or phone for contact:", contactInfo.name);
      return null;
    }
    
    let existingContact;
    
    // Try to find contact by email if available
    if (contactInfo.email) {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', userId)
        .eq('email', contactInfo.email)
        .maybeSingle();
      
      if (!error && data) {
        existingContact = data;
      }
    }
    
    // If not found by email and phone is available, try by phone
    if (!existingContact && contactInfo.phone) {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', userId)
        .eq('telefone', contactInfo.phone)
        .maybeSingle();
      
      if (!error && data) {
        existingContact = data;
      }
    }
    
    // If contact exists, return it
    if (existingContact) {
      console.log("Found existing contact:", existingContact.nome);
      return existingContact;
    }
    
    // Otherwise, create a new contact
    const { data: newContact, error } = await supabase
      .from('contatos')
      .insert({
        user_id: userId,
        nome: contactInfo.name || "Sem nome",
        email: contactInfo.email || null,
        telefone: contactInfo.phone || null,
        origem: "google_calendar"
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating contact:", error);
      return null;
    }
    
    console.log("Created new contact:", newContact.nome);
    return newContact;
  } catch (error) {
    console.error("Error in getOrCreateContact:", error);
    return null;
  }
}

async function syncAppointments(userId, connection) {
  try {
    console.log("Syncing appointments for user:", userId);
    
    // Calculate date range (from now to X days in future)
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90); // Next 90 days
    
    const timeMin = now.toISOString();
    const timeMax = futureDate.toISOString();
    
    // Get events from Google Calendar
    const calendarId = 'primary'; // Usually 'primary' for the user's main calendar
    const query = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      maxResults: '100'
    });
    
    const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${query}`;
    const eventsResponse = await fetch(eventsUrl, {
      headers: {
        'Authorization': `${connection.token_type} ${connection.access_token}`,
      }
    });
    
    if (!eventsResponse.ok) {
      console.error("Error fetching calendar events:", eventsResponse.status);
      return { eventsProcessed: 0, errors: 1 };
    }
    
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];
    console.log(`Found ${events.length} events`);
    
    let processedCount = 0;
    let errorCount = 0;
    
    // Process each event
    for (const event of events) {
      try {
        // Skip events without start/end times
        if (!event.start?.dateTime || !event.end?.dateTime) {
          console.log("Skipping all-day event or event without times:", event.summary);
          continue;
        }
        
        // Extract attendee info - could be null or empty
        let primaryAttendee = null;
        if (event.attendees && event.attendees.length > 0) {
          // Find first non-organizer attendee
          primaryAttendee = event.attendees.find(a => !a.organizer && !a.resource);
          
          // If all attendees are organizers, just use the first attendee
          if (!primaryAttendee && event.attendees.length > 0) {
            primaryAttendee = event.attendees[0];
          }
        }
        
        // Extract contact info
        const contactInfo = {
          name: primaryAttendee?.displayName || event.summary,
          email: primaryAttendee?.email || null,
          phone: null // Google Calendar doesn't typically expose phone numbers
        };
        
        // Get or create contact
        const contact = await getOrCreateContact(userId, contactInfo);
        if (!contact) {
          console.log("Couldn't find or create contact for event:", event.summary);
          errorCount++;
          continue;
        }
        
        // Check if appointment already exists
        const { data: existingAppointment } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('user_id', userId)
          .eq('google_calendar_event_id', event.id)
          .maybeSingle();
        
        if (existingAppointment) {
          // Update existing appointment
          const { error: updateError } = await supabase
            .from('agendamentos')
            .update({
              contact_id: contact.id,
              data_hora_inicio: event.start.dateTime,
              data_hora_fim: event.end.dateTime,
              titulo: event.summary || "Sem título",
              descricao: event.description || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingAppointment.id);
            
          if (updateError) {
            console.error("Error updating appointment:", updateError);
            errorCount++;
          } else {
            console.log("Updated appointment:", event.summary);
            processedCount++;
          }
        } else {
          // Create new appointment
          const { error: insertError } = await supabase
            .from('agendamentos')
            .insert({
              user_id: userId,
              contact_id: contact.id,
              data_hora_inicio: event.start.dateTime,
              data_hora_fim: event.end.dateTime,
              titulo: event.summary || "Sem título",
              descricao: event.description || null,
              origem: "google_calendar",
              google_calendar_event_id: event.id
            });
            
          if (insertError) {
            console.error("Error inserting appointment:", insertError);
            errorCount++;
          } else {
            console.log("Created new appointment:", event.summary);
            processedCount++;
          }
        }
      } catch (eventError) {
        console.error("Error processing event:", eventError);
        errorCount++;
      }
    }
    
    console.log(`Sync complete. Processed: ${processedCount}, Errors: ${errorCount}`);
    return { eventsProcessed: processedCount, errors: errorCount };
  } catch (error) {
    console.error("Error in syncAppointments:", error);
    return { eventsProcessed: 0, errors: 1 };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const authHeader = req.headers.get("authorization");
    const apikey = req.headers.get("apikey");
    let userId;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Handle JWT auth
      try {
        const token = authHeader.slice("Bearer ".length);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
          return new Response(
            JSON.stringify({ error: "Invalid token or unauthorized" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
          );
        }
        
        userId = user.id;
      } catch (authError) {
        console.error("Auth error:", authError);
        return new Response(
          JSON.stringify({ error: "Authentication error" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
    } else if (apikey && apikey === supabaseKey) {
      // Allow service role key and explicitly provided userId
      const body = await req.json();
      userId = body.userId;
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "userId required when using service key" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get connection for user
    const connection = await getConnection(userId);
    if (!connection) {
      return new Response(
        JSON.stringify({ error: "No active Google Calendar connection found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Sync appointments
    const result = await syncAppointments(userId, connection);
    
    return new Response(
      JSON.stringify(result),
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
