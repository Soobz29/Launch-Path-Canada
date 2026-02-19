// Supabase Edge Function: send-monthly-reminder
// Follows Deno runtime environment for Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

// Declare Deno to satisfy TypeScript in non-Deno environments (like local editor/build)
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase Client with Admin rights (Service Role Key required for sending emails/accessing all users)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Find users who unlocked the next month ~30 days ago and haven't completed it
    // We look for users whose `next_month_unlocked_at` is between 30 and 31 days ago
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    const thirtyOneDaysAgo = new Date(today.getTime() - (31 * 24 * 60 * 60 * 1000));

    // Get profiles with unlocked next steps
    // Note: In a real production scenario, you might want a more robust query or flag system
    const { data: usersToRemind, error: fetchError } = await supabase
      .from('users_profiles')
      .select('id, next_month_unlocked_at, visa_type')
      .gt('next_month_unlocked_at', thirtyOneDaysAgo.toISOString())
      .lt('next_month_unlocked_at', thirtyDaysAgo.toISOString())

    if (fetchError) throw fetchError

    console.log(`Found ${usersToRemind?.length ?? 0} users to remind.`)

    const results = []

    // 3. Loop through users and send emails
    for (const profile of usersToRemind || []) {
        // Fetch auth user to get email
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id)
        
        if (userError || !user || !user.email) {
            console.error(`Could not fetch user email for ID ${profile.id}`)
            continue
        }

        // Send Email via Supabase Auth (or you could use Resend/SendGrid here)
        // Since Supabase Auth doesn't have a generic "send email" endpoint for arbitrary content 
        // without a provider, we will log to console as requested by the prompt for simulation.
        // In production, use: await fetch('https://api.resend.com/emails', ...)
        
        const emailContent = {
            to: user.email,
            subject: "Your next credit step is waiting 🇨🇦",
            body: `
Hi there,

You unlocked your next credit-building step 30 days ago on Launch Path Canada.

Staying consistent is the most important thing you can do for your credit score right now. Small actions every month add up fast.

Log your progress here: https://launchpathcanada.com/dashboard

— Launch Path Canada
            `
        }

        console.log("--- SENDING EMAIL ---")
        console.log(`To: ${emailContent.to}`)
        console.log(`Subject: ${emailContent.subject}`)
        console.log(emailContent.body)
        console.log("---------------------")

        results.push({ userId: profile.id, status: 'sent' })
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})