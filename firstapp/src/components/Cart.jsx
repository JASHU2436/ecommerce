import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`https://ecommerce-50gq.onrender.com/api/cart?userId=${userId}`)
        .then(res => setCartItems(res.data.items || []))
        .catch(err => console.error("Cart fetch error:", err));
    }
  }, [userId]);

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.product?.price || 0) * item.quantity), 0);
  const tax = subtotal * 0.18; 
  const totalAmount = subtotal + tax;

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        {/* Left Side: Items List */}
        <div style={styles.itemsSection}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Your Shopping Bag</h2>
            <span style={styles.countBadge}>{cartItems.length} Items</span>
          </div>
          
          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}>🛍️</div>
              <h3 style={{color: '#4a5568', fontWeight: '600'}}>Your bag is empty</h3>
              <p style={{color: '#718096', marginBottom: '25px'}}>Looks like you haven't added anything yet.</p>
              <button onClick={() => window.location.href='/'} style={styles.shopBtn}>Explore Store</button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={styles.productCard}>
                <div style={styles.productInfo}>
                  {/* Decorative Gradient Icon */}
                  <div style={styles.itemIcon}>
                    {item.product?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div style={styles.itemName}>{item.product?.name}</div>
                    <div style={styles.itemCategory}>{item.product?.category || 'Premium Collection'}</div>
                    <div style={styles.qtyRow}>
                       <span style={styles.qtyLabel}>Quantity:</span>
                       <span style={styles.qtyValue}>{item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.priceContainer}>
                  <div style={styles.rowTotal}>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</div>
                  <div style={styles.unitPrice}>₹{parseFloat(item.product?.price).toLocaleString('en-IN')} / unit</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            
            <div style={styles.summaryRow}>
              <span style={styles.label}>Subtotal</span>
              <span style={styles.value}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div style={styles.summaryRow}>
              <span style={styles.label}>Estimated GST (18%)</span>
              <span style={styles.value}>₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.label}>Delivery</span>
              <span style={styles.freeText}>FREE</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <div style={styles.totalLabel}>Grand Total</div>
              <div style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</div>
            </div>

            <button style={styles.checkoutBtn}>
              Checkout Securely
              <span style={{marginLeft: '10px'}}>→</span>
            </button>

            <div style={styles.trustFooter}>
               <p style={styles.secureText}>🔒 256-bit SSL Secure Checkout</p>
               <div style={styles.cardIcons}>💳 VISA • Mastercard • UPI</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  pageBackground: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '60px 20px',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  },
  container: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '40px',
    flexWrap: 'wrap',
  },
  itemsSection: {
    flex: '1.6',
    minWidth: '350px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0,
  },
  countBadge: {
    background: '#e2e8f0',
    color: '#475569',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease',
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  itemIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    boxShadow: '0 8px 15px rgba(99, 102, 241, 0.2)',
  },
  itemName: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#334155',
  },
  itemCategory: {
    fontSize: '13px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  qtyRow: {
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  qtyLabel: { fontSize: '14px', color: '#64748b' },
  qtyValue: { fontWeight: '700', color: '#1e293b' },
  priceContainer: { textAlign: 'right' },
  rowTotal: { fontSize: '22px', fontWeight: '800', color: '#1e293b' },
  unitPrice: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },

  summarySection: {
    flex: '1',
    minWidth: '320px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '32px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    position: 'sticky',
    top: '40px',
  },
  summaryTitle: {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '25px',
    color: '#1e293b',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  label: { color: '#64748b', fontSize: '15px' },
  value: { color: '#1e293b', fontWeight: '600' },
  freeText: { color: '#10b981', fontWeight: '700' },
  divider: {
    border: '0',
    borderTop: '2px dashed #f1f5f9',
    margin: '25px 0',
  },
  totalRow: {
    marginBottom: '30px',
  },
  totalLabel: { fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  totalValue: { fontSize: '36px', fontWeight: '900', color: '#6366f1' },
  checkoutBtn: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)',
  },
  trustFooter: {
    marginTop: '25px',
    textAlign: 'center',
  },
  secureText: { fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' },
  cardIcons: { fontSize: '11px', color: '#cbd5e1', fontWeight: '600' },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: '#fff',
    borderRadius: '32px',
    border: '2px dashed #e2e8f0',
  },
  shopBtn: {
    padding: '12px 32px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  }
};

export default Cart;