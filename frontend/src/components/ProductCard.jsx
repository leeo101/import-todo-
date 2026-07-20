import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

const ProductCard = ({ product, isFavorite, navigateToDetail, toggleWishlist, addToCart, buyNow, hideActions = false }) => {
  return (
    <div className="product-card" onClick={() => navigateToDetail(product)}>
      <div className="product-image-container">
        <span className="product-badge">{product.category}</span>
        {!hideActions && (
          <button 
            onClick={(e) => toggleWishlist(product, e)}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(9, 13, 22, 0.75)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              color: isFavorite ? 'var(--error)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              fontSize: '0.95rem'
            }}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
        <div className="utility-score">
          ★ {product.utilityScore} {!hideActions && <span style={{ fontSize: '0.65rem', fontWeight: 'normal' }}>útil</span>}
        </div>
        <img src={product.image} alt={product.title} className="product-image" onError={(e) => { e.target.src = '/images/default.svg' }} />
      </div>
      <div className="product-info">
        <h3 className="product-title" style={hideActions ? { fontSize: '1rem' } : {}}>{product.title}</h3>
        {!hideActions && <p className="product-desc">{product.description}</p>}
        <div className="product-footer" onClick={(e) => e.stopPropagation()} style={hideActions ? { marginTop: '0.5rem' } : { flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="price-box" style={hideActions ? { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' } : {}}>
            {!hideActions && <span className="price-label">Precio Oferta</span>}
            <span className="price-value" style={hideActions ? { fontSize: '1rem', color: 'var(--accent-cyan)' } : {}}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(product.salePrice)}</span>
            {hideActions && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>★ {product.utilityScore}</span>}
          </div>
          {!hideActions && (
            product.stock > 0 ? (
              <div style={{ display: 'flex', gap: '0.4rem', width: '100%', marginTop: '0.5rem' }}>
                <button 
                  className="glass-btn"
                  style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  onClick={() => addToCart(product)}
                  title="Añadir al Carrito"
                >
                  <ShoppingCart size={14} /> Carrito
                </button>
                <button 
                  className="add-to-cart-btn"
                  style={{ flex: 1.2, padding: '0.6rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', color: '#fff' }}
                  onClick={() => buyNow ? buyNow(product) : addToCart(product)}
                >
                  <Zap size={14} /> Comprar
                </button>
              </div>
            ) : (
              <span style={{ color: 'var(--error)', fontSize: '0.9rem', fontWeight: '600' }}>Sin stock</span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
