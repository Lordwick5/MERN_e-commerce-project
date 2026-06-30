import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';

// Initialize Stripe. Uses placeholder key.
const stripePromise = loadStripe('pk_test_placeholder_key_replace_with_yours');

const Checkout = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    saveShippingAddress,
    clearCart,
  } = useContext(CartContext);

  // Form states
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const [addressSubmitted, setAddressSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [isMock, setIsMock] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping fields');
      return;
    }

    setError('');
    saveShippingAddress({ address, city, postalCode, country });
    setAddressSubmitted(true);
    setLoadingPayment(true);

    try {
      // Call backend to create payment intent
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setIsMock(data.isMock);
    } catch (err) {
      setError(err.message || 'Error configuring payment gateway.');
      setIsMock(true); // default to mock on failure so demo doesn't crash
      setClientSecret('mock_secret_fallback');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Create order in backend database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress: { address, city, postalCode, country },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || 'Failed to create order record');
      }

      // Update order to paid
      const payRes = await fetch(`/api/orders/${orderData._id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(paymentResult),
      });

      if (!payRes.ok) {
        const payData = await payRes.json();
        throw new Error(payData.message || 'Failed to update payment status');
      }

      clearCart();
      navigate('/order-success', { state: { orderId: orderData._id } });
    } catch (err) {
      setError(`Payment succeeded, but order record failed: ${err.message}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>
        Secure <span className="text-gradient-cyan">Checkout</span>
      </h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="grid-2">
        {/* Left Column: Form Flow */}
        <div>
          {!addressSubmitted ? (
            <div className="glass" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                1. Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    className="form-input"
                    placeholder="123 Cyberpunk St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      className="form-input"
                      placeholder="Neo City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="postalCode">Postal / ZIP Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      className="form-input"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    className="form-input"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Address Summary */}
              <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Shipping Details</h3>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setAddressSubmitted(false)}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {address}, {city}, {postalCode}, {country}
                </p>
              </div>

              {/* Payment Section */}
              <div className="glass" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  2. Payment Method
                </h2>

                {loadingPayment ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="spinner" />
                    <p style={{ color: 'var(--text-secondary)' }}>Configuring payment gateway...</p>
                  </div>
                ) : isMock ? (
                  /* Demo Mock card input view without Stripe Elements context */
                  <CheckoutForm
                    clientSecret="mock_secret"
                    totalPrice={totalPrice}
                    isMock={true}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  /* Live Stripe Elements Wrapper */
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      totalPrice={totalPrice}
                      isMock={false}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Review */}
        <div className="glass" style={{ padding: '2rem', height: 'fit-content', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
            Review Items
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: '#0d1222' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Qty: {item.qty} × ${item.price.toFixed(2)}
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  ${(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Shipping:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Estimated Tax:</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.3rem',
              fontWeight: 700,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '1rem',
              marginTop: '0.5rem'
            }}>
              <span>Total:</span>
              <span style={{ color: 'var(--accent-color)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
