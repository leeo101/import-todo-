import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';

const Cart = ({ cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal, onCheckout }) => {
  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart /> Tu Carrito
          </h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} className="cart-item-image" onError={(e) => { e.target.src = '/images/default.svg' }} />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <p className="cart-item-price">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(item.salePrice)}</p>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total:</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                if(onCheckout) onCheckout();
              }}
            >
              Confirmar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
