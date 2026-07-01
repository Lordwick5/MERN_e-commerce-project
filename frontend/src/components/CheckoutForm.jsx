import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../config';

const CheckoutForm = ({ clientSecret, totalPrice, isMock, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    // MOCK PAYMENT PATH
    if (isMock) {
      setTimeout(() => {
        setProcessing(false);
        setSucceeded(true);
        onSuccess({
          id: 'mock_pay_id_' + Math.random().toString(36).substr(2, 9),
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: 'mock_buyer@example.com',
        });
      }, 1500);
      return;
    }

    // STRIPE LIVE/TEST KEY PATH
    if (!stripe || !elements) {
      setError('Stripe has not initialized correctly.');
      setProcessing(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        onSuccess({
          id: payload.paymentIntent.id,
          status: payload.paymentIntent.status,
          update_time: new Date(payload.paymentIntent.created * 1000).toISOString(),
          email_address: 'buyer@example.com', // placeholder
        });
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#f3f4f6',
        fontFamily: 'Outfit, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#6b7280',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <div style={{
        padding: '1.2rem',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem',
      }}>
        {isMock ? (
          <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px dashed #fce38a', borderRadius: '4px', background: 'rgba(252, 227, 138, 0.05)' }}>
            <span style={{ fontSize: '0.85rem', color: '#fce38a' }}>
              ⚠️ Demo Mode: Stripe API keys not set. Running simulated transaction checkout.
            </span>
          </div>
        ) : (
          <CardElement options={cardStyle} />
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ fontSize: '0.9rem', padding: '0.75rem' }}>
          {error}
        </div>
      )}

      <button
        disabled={processing || succeeded || (!stripe && !isMock)}
        className="btn btn-primary"
        style={{ width: '100%', padding: '1rem' }}
      >
        {processing ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span className="spinner" style={{ width: '20px', height: '20px', margin: '0', borderWidth: '2px' }} />
            Processing Secure Payment...
          </span>
        ) : succeeded ? (
          'Payment Successful!'
        ) : (
          `Pay $${totalPrice.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
