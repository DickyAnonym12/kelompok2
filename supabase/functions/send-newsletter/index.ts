// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend';

console.log("Hello from send-newsletter Function!");

// Inisialisasi Resend dengan API Key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Siapkan CORS headers untuk mengizinkan request dari browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Mengizinkan semua origin (untuk development)
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Ini adalah "preflight request" yang dikirim browser sebelum request POST
  // untuk memeriksa izin CORS.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { campaign, emails } = await req.json();
    
    if (!campaign || !emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing campaign data or emails' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Sending campaign "${campaign.title}" to ${emails.length} subscribers.`);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Ganti dengan domain terverifikasi Anda
      to: emails,
      subject: campaign.title,
      html: campaign.content,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response(JSON.stringify({ error: 'Failed to send emails', details: error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: "Emails sent successfully!", data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-newsletter' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
