import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { API_URL } from '../config';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      margin: '1rem 5% 2rem',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '2px' }}>
        <span style={{
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.8rem'
        }}>⚡</span>
        <span className="text-gradient-cyan">AETHER</span>
      </Link>

      {/* Hamburger menu button for small screens */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '1.5rem'
        }}
        className="menu-toggle"
      >
        ☰
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }} className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 500 }}>
          Catalog
        </Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
          <span>Cart</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              background: 'var(--accent-gradient)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(248, 87, 166, 0.4)'
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {userInfo && userInfo.isAdmin && (
          <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            border: '1px solid rgba(0, 242, 254, 0.3)',
            padding: '0.3rem 0.8rem',
            borderRadius: '4px',
            color: 'var(--accent-color)'
          }}>
            Admin
          </Link>
        )}

        {userInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Hello, <strong style={{ color: 'var(--text-primary)' }}>{userInfo.name.split(' ')[0]}</strong>
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
            Sign In
          </Link>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .menu-toggle {
            display: block !important;
          }
          .nav-links {
            display: none !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(13, 18, 34, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            gap: 1.5rem !important;
            box-shadow: var(--shadow-main);
          }
          .nav-links.open {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
