import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerId = session.customer as string
    const email = session.customer_details?.email

    if (email) {
      // Vérifie si l'utilisateur existe déjà dans Supabase Auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === email)

      if (existingUser) {
        // Utilisateur existant → met à jour is_pro
        await supabase
          .from('profiles')
          .update({ is_pro: true, stripe_customer_id: customerId, email: email })
          .eq('id', existingUser.id)
      } else {
        // Nouvel utilisateur → crée le compte automatiquement
        const { data: newUser } = await supabase.auth.admin.createUser({
          email: email,
          email_confirm: true,
        })

        if (newUser?.user) {
          // Met à jour le profil
          await supabase
            .from('profiles')
            .update({ is_pro: true, stripe_customer_id: customerId, email: email })
            .eq('id', newUser.user.id)

          // Envoie un email pour définir le mot de passe
          await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
          })
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabase
      .from('profiles')
      .update({ is_pro: false })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}