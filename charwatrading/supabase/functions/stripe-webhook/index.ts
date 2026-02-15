// Supabase Edge Function: Stripe Webhook Handler
// Handles subscription lifecycle events from Stripe

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    const body = await req.text()

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutCompleted(supabase, stripe, session)
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionUpdated(supabase, stripe, subscription)
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionDeleted(supabase, subscription)
                break
            }

            case 'invoice.paid': {
                const invoice = event.data.object as Stripe.Invoice
                await handleInvoicePaid(supabase, invoice)
                break
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                await handlePaymentFailed(supabase, invoice)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }
    } catch (error) {
        console.error(`Error handling ${event.type}:`, error)
        return new Response(`Webhook handler error: ${error.message}`, { status: 500 })
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    })
})

// Handle successful checkout - activate subscriptions
async function handleCheckoutCompleted(
    supabase: any,
    stripe: Stripe,
    session: Stripe.Checkout.Session
) {
    const userId = session.metadata?.supabase_user_id
    const marketplaceIds = session.metadata?.marketplace_ids?.split(',') || []

    if (!userId || marketplaceIds.length === 0) {
        console.error('Missing metadata in checkout session')
        return
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
        expand: ['items.data']
    })

    // Get price -> marketplace mapping
    const { data: marketplaces } = await supabase
        .from('marketplaces')
        .select('id, stripe_price_id')
        .in('id', marketplaceIds)

    const priceToMarketplace = new Map(
        marketplaces?.map((m: any) => [m.stripe_price_id, m.id]) || []
    )

    // Upsert subscription items
    for (const item of subscription.items.data) {
        const marketplaceId = priceToMarketplace.get(item.price.id)
        if (marketplaceId) {
            await supabase
                .from('user_marketplace_subscriptions')
                .upsert({
                    user_id: userId,
                    marketplace_id: marketplaceId,
                    is_active: true,
                    stripe_subscription_item_id: item.id,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,marketplace_id' })
        }
    }

    // Update user profile
    await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    console.log(`Activated subscriptions for user ${userId}: ${marketplaceIds.join(', ')}`)
}

// Handle subscription updates (add/remove marketplaces)
async function handleSubscriptionUpdated(
    supabase: any,
    stripe: Stripe,
    subscription: Stripe.Subscription
) {
    const userId = subscription.metadata?.supabase_user_id
    if (!userId) return

    // Get all marketplace price mappings
    const { data: allMarketplaces } = await supabase
        .from('marketplaces')
        .select('id, stripe_price_id')

    const priceToMarketplace = new Map(
        allMarketplaces?.map((m: any) => [m.stripe_price_id, m.id]) || []
    )

    // Get active subscription items
    const activeMarketplaceIds = new Set<string>()
    for (const item of subscription.items.data) {
        const marketplaceId = priceToMarketplace.get(item.price.id)
        if (marketplaceId) {
            activeMarketplaceIds.add(marketplaceId)

            await supabase
                .from('user_marketplace_subscriptions')
                .upsert({
                    user_id: userId,
                    marketplace_id: marketplaceId,
                    is_active: true,
                    stripe_subscription_item_id: item.id,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,marketplace_id' })
        }
    }

    // Deactivate removed marketplace subscriptions
    const { data: userSubs } = await supabase
        .from('user_marketplace_subscriptions')
        .select('marketplace_id')
        .eq('user_id', userId)
        .eq('is_active', true)

    for (const sub of (userSubs || [])) {
        if (!activeMarketplaceIds.has(sub.marketplace_id)) {
            await supabase
                .from('user_marketplace_subscriptions')
                .update({ is_active: false, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('marketplace_id', sub.marketplace_id)
        }
    }

    // Update profile status
    const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'past_due' ? 'past_due'
        : 'inactive'

    await supabase
        .from('user_profiles')
        .update({
            subscription_status: status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.supabase_user_id
    if (!userId) return

    // Deactivate all marketplace subscriptions
    await supabase
        .from('user_marketplace_subscriptions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

    // Update profile
    await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    console.log(`Subscription canceled for user ${userId}`)
}

// Handle successful payment
async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

    if (profile) {
        await supabase
            .from('user_profiles')
            .update({
                subscription_status: 'active',
                updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)
    }
}

// Handle failed payment
async function handlePaymentFailed(supabase: any, invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

    if (profile) {
        await supabase
            .from('user_profiles')
            .update({
                subscription_status: 'past_due',
                updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)
    }
}
