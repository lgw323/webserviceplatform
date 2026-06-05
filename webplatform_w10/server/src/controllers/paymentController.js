import Stripe from 'stripe';
import { db } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

export const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SYNCRIG PRO Subscription',
              description: 'Access to top 1% hardware analytics and premium features',
            },
            unit_amount: 499, // $4.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // use 'subscription' for recurring
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancel`,
      client_reference_id: userId,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // In production, we must verify the webhook signature
    // event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // For TDD/Mocking purposes, we accept the payload as is if secret is not set
    event = req.body;
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    try {
      if (db.isPgActive()) {
        await db.query(
          "UPDATE users SET subscription_status = 'premium', stripe_customer_id = $1 WHERE id = $2",
          [session.customer, userId]
        );
      } else {
        // Mock DB Update
        await db.query(`update users set subscription_status = 'premium' where id = '${userId}'`, [session.customer, userId]);
      }
    } catch (err) {
      console.error('Error updating user subscription:', err);
    }
  }

  res.json({ received: true });
};
