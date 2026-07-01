import React from 'react';
import { API_URL } from '../config';

const Footer = () => {
  return (
    <footer className="glass" style={{
      margin: '2rem 5% 1rem',
      padding: '2rem',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }}>
      <div style={{ marginBottom: '1rem', fontWeight: 600, letterSpacing: '1px' }}>
        <span className="text-gradient-cyan">AETHER </span>
        <span style={{ color: 'var(--text-secondary)' }}>// Premium Tech & Gear</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        &copy; {new Date().getFullYear()} Aether Store. Built for Next-Gen Enthusiasts. All payments processed securely in test mode.
      </p>
    </footer>
  );
};

export default Footer;
