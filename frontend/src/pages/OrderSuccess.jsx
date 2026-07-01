import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const OrderSuccess = () => {
  const location = useLocation();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, userInfo]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {/* Icon checkmark */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '2px solid #10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
        Order <span className="text-gradient-cyan">Confirmed!</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Thank you for your purchase. Your payment was processed successfully. We've received your order and are preparing it for shipment.
      </p>

      {error ? (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          Unable to display order summary: {error}
        </div>
      ) : order ? (
        <div className="glass" style={{ padding: '2.5rem', textAlign: 'left', marginBottom: '3rem', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ORDER ID</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--accent-color)' }}>{order._id}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DATE</span>
              <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TOTAL</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice.toFixed(2)}</div>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Shipping Address</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          {/* Items Purchased List */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Items Ordered</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {order.orderItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {item.name} <strong style={{ color: 'var(--text-primary)' }}>× {item.qty}</strong>
                  </span>
                  <span style={{ fontWeight: 600 }}>${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        orderId && <div className="spinner" />
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
