import Stripe from 'stripe';

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith('sk_test_placeholder')) {
    return null;
  }
  try {
    return new Stripe(secretKey);
  } catch (error) {
    console.error('Stripe initialization failed:', error.message);
    return null;
  }
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ message: 'Invalid payment amount' });
    return;
  }

  const stripe = getStripeInstance();

  try {
    if (!stripe) {
      // Fallback: Stripe is not configured or placeholder is used
      console.warn('Stripe not configured or using placeholders. Returning mock client secret.');
      res.json({
        clientSecret: 'mock_secret_stripe_disabled_for_demo_mode_client_secret',
        isMock: true,
      });
      return;
    }

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      isMock: false,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({ message: 'Error processing payment request', details: error.message });
  }
};

export { createPaymentIntent };
