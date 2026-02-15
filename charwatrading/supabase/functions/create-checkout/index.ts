// Supabase Edge Function: Create Stripe Checkout Session
// Creates a checkout session for selected marketplace subscriptions

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get user from JWT
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const token = authHeader.replace('Bearer ', '')

        // Verify the JWT and get user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
            throw new Error('Invalid token')
        }

        // Parse request body
        const { marketplace_ids } = await req.json()
        if (!marketplace_ids || !Array.isArray(marketplace_ids) || marketplace_ids.length === 0) {
            throw new Error('marketplace_ids is required and must be a non-empty array')
        }

        // Get marketplace details with Stripe price IDs
        const { data: marketplaces, error: mpError } = await supabase
            .from('marketplaces')
            .select('id, name, stripe_price_id, price_cents')
            .in('id', marketplace_ids)
            .eq('is_active', true)

        if (mpError || !marketplaces || marketplaces.length === 0) {
            throw new Error('Invalid marketplace selection')
        }

        // Verify all selected marketplaces have Stripe price IDs
        const missingPrices = marketplaces.filter(m => !m.stripe_price_id)
        if (missingPrices.length > 0) {
            throw new Error(`Marketplaces not configured for billing: ${missingPrices.map(m => m.name).join(', ')}`)
        }

        // Get or create Stripe customer
        let { data: profile } = await supabase
            .from('user_profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        let customerId = profile?.stripe_customer_id

        if (!customerId) {
            // Create Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id
                }
            })
            customerId = customer.id

            // Store customer ID
            await supabase
                .from('user_profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        // Build line items from selected marketplaces
        const lineItems = marketplaces.map(mp => ({
            price: mp.stripe_price_id,
            quantity: 1,
        }))

        // Create Stripe Checkout Session
        const origin = req.headers.get('origin') || 'https://charwatrading.com'
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: lineItems,
            success_url: `${origin}/dashboard.html?checkout=success`,
            cancel_url: `${origin}/subscribe.html?checkout=canceled`,
            metadata: {
                supabase_user_id: user.id,
                marketplace_ids: marketplace_ids.join(',')
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: user.id,
                    marketplace_ids: marketplace_ids.join(',')
                }
            }
        })

        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ message: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
