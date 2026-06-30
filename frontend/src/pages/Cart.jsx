import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    addToCart,
    removeFromCart,
  } = useContext(CartContext);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>
        Shopping <span className="text-gradient-cyan">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Your cart is currently empty.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="grid-2">
          {/* Left Column: Cart Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.5rem',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#0d1222',
                  }}
                />

                {/* Product Name */}
                <div style={{ flexGrow: 1, minWidth: '150px' }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {item.name}
                  </Link>
                </div>

                {/* Pricing */}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '80px' }}>
                  ${item.price.toFixed(2)}
                </div>

                {/* Qty Selector */}
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                    className="form-input"
                    style={{ padding: '0.4rem 0.8rem', background: '#0d1222', width: '80px' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem', borderRadius: '6px' }}
                  title="Remove item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Glass panel */}
          <div className="glass" style={{ padding: '2rem', height: 'fit-content', border: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (15%):</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '1rem',
              fontSize: '1.3rem',
              fontWeight: 700
            }}>
              <span>Total Price:</span>
              <span style={{ color: 'var(--accent-color)' }}>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
