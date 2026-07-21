import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Star, ShoppingBag, Scale, Maximize2, Info, Truck, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({
  selectedProductDetail,
  navigateToStore,
  activeImageIndex,
  setActiveImageIndex,
  addToCart,
  buyNow,
  MOCK_REVIEWS = [],
  relatedProducts,
  navigateToDetail
}) => {
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [userRating, setUserRating] = useState(5);
  const [userNameInput, setUserNameInput] = useState('');
  const [userCommentInput, setUserCommentInput] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Dynamic customs & shipping calculation
  const supplierName = selectedProductDetail.supplierName || 'Proveedor Internacional';
  const shippingCostUSD = selectedProductDetail.shippingCostUSD !== undefined ? selectedProductDetail.shippingCostUSD : 0.0;
  const deliveryDays = selectedProductDetail.deliveryDays || 14;
  const originalUSD = selectedProductDetail.originalPrice || (selectedProductDetail.salePrice / 1450);

  // AFIP/ARCA Customs rule: 50% duty above $50 USD for individual shipments, or $0 if free threshold
  const estimatedCustomsUSD = originalUSD > 50 ? Number(((originalUSD - 50) * 0.5).toFixed(2)) : 0.00;
  const totalLandedUSD = Number((originalUSD + shippingCostUSD + estimatedCustomsUSD).toFixed(2));

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!userNameInput.trim() || !userCommentInput.trim()) return;

    const newRev = {
      name: userNameInput.trim(),
      date: 'Hoy',
      rating: userRating,
      comment: userCommentInput.trim()
    };

    setReviewsList([newRev, ...reviewsList]);
    setUserNameInput('');
    setUserCommentInput('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <main className="container" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <button 
          onClick={navigateToStore} 
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', padding: 0 }}
        >
          <ArrowLeft size={16} /> Catálogo
        </button>
        <ChevronRight size={14} />
        <span>{selectedProductDetail.category}</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedProductDetail.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }} className="product-detail-layout">
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              const productImages = selectedProductDetail.images && selectedProductDetail.images.length > 0
                ? selectedProductDetail.images
                : [selectedProductDetail.image || '/images/default.svg'];
              const safeIndex = activeImageIndex < productImages.length ? activeImageIndex : 0;
              const currentImage = productImages[safeIndex];

              return (
                <>
                  <div style={{ background: 'rgba(9, 13, 22, 0.5)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', justify: 'center', height: '380px', boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4)' }}>
                    <img 
                      src={currentImage} 
                      alt={selectedProductDetail.title} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/images/default.svg' }}
                    />
                  </div>
                  
                  {productImages.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.25rem 0', scrollbarWidth: 'thin' }}>
                      {productImages.map((imgUrl, idx) => (
                        <img 
                          key={idx}
                          src={imgUrl}
                          alt={`thumbnail-${idx}`}
                          onClick={() => setActiveImageIndex(idx)}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '8px', 
                            objectFit: 'contain', 
                            border: safeIndex === idx ? '2px solid var(--accent-cyan)' : '1px solid var(--border-light)', 
                            cursor: 'pointer',
                            background: '#fff',
                            padding: '2px',
                            flexShrink: 0,
                            transition: 'border-color 0.2s ease'
                          }}
                          onError={(e) => { e.target.src = '/images/default.svg' }}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              *Imágenes reales de {supplierName}. Selecciona las miniaturas para inspeccionar el producto.
            </span>
          </div>

          <div style={{ flex: '1.5 1.5 450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                {selectedProductDetail.category} • Proveedor: {supplierName}
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: '1.2' }}>
                {selectedProductDetail.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--warning)', margin: '0.75rem 0' }}>
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" opacity="0.4" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: '600' }}>
                  ★ {selectedProductDetail.utilityScore || 9.2} / 10 • {reviewsList.length} Opiniones de compradores
                </span>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--bg-card), rgba(6,182,212,0.02))', border: '1px solid var(--border-glow)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precio Final en Tu Puerta</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'Outfit' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(selectedProductDetail.salePrice)}</span>
                  <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold' }}>Envío Puerta a Puerta</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Unidades disponibles: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{selectedProductDetail.stock} unidades</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {selectedProductDetail.stock > 0 ? (
                  <>
                    <button 
                      className="glass-btn"
                      style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => addToCart(selectedProductDetail)}
                    >
                      <ShoppingBag size={18} /> Añadir al Carrito
                    </button>

                    <button 
                      className="add-to-cart-btn"
                      style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', color: '#fff', boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => buyNow ? buyNow(selectedProductDetail) : addToCart(selectedProductDetail)}
                    >
                      ⚡ Comprar Ahora
                    </button>
                  </>
                ) : (
                  <button className="submit-btn" style={{ background: 'var(--border-light)', cursor: 'not-allowed', color: 'var(--text-muted)' }} disabled>
                    Agotado Temporalmente
                  </button>
                )}
              </div>
            </div>

            {/* --- 🛃 CALCULADORA DE COSTOS & ENVIOS AL COSTO --- */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Truck size={18} style={{ color: 'var(--accent-cyan)' }} /> Desglose de Envío & Aduana ({supplierName})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Costo Fábrica Original</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(originalUSD * 1450)}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>(USD ${originalUSD.toFixed(2)})</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Flete Internacional ({supplierName})</span>
                  <span style={{ fontWeight: 'bold', color: shippingCostUSD === 0 ? 'var(--success)' : 'var(--text-main)' }}>
                    {shippingCostUSD === 0 ? 'GRATIS 🚚' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(shippingCostUSD * 1450)}
                  </span>
                  {shippingCostUSD > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>(USD ${shippingCostUSD.toFixed(2)})</span>}
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tasa Aduana Estimada (AFIP/ARCA)</span>
                  <span style={{ fontWeight: 'bold', color: estimatedCustomsUSD === 0 ? 'var(--success)' : 'var(--warning)' }}>
                    {estimatedCustomsUSD === 0 ? 'Sin Cargo ($0 ARS)' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(estimatedCustomsUSD * 1450)}
                  </span>
                  {estimatedCustomsUSD > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>(USD ${estimatedCustomsUSD.toFixed(2)})</span>}
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tiempo Estimado Entrega</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{deliveryDays} a {deliveryDays + 5} días hábiles</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '600' }}>Descripción del Artículo</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {selectedProductDetail.description}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '600' }}>📐 Ficha Técnica Logística</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '1.25rem', borderRadius: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peso de Despacho (Neto)</span>
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '1.05rem' }}>
                    <Scale size={16} style={{ color: 'var(--accent-cyan)' }} /> {selectedProductDetail.weight || '250 g'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dimensiones del Paquete</span>
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '1.05rem' }}>
                    <Maximize2 size={16} style={{ color: 'var(--accent-cyan)' }} /> {selectedProductDetail.dimensions || '15 x 10 x 5 cm'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origen de Despacho</span>
                  <div style={{ fontWeight: 'bold', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                    {supplierName} Official Direct Import
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Categoría Registrada</span>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                    {selectedProductDetail.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ⭐ SECCIÓN DE RESEÑAS E INTERACCIÓN --- */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Opiniones y Valoraciones de Clientes ({reviewsList.length})</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Garantía de compra 100% verificado</span>
          </div>

          {/* Formulario de Nueva Reseña */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem' }}>Deja tu Opinión sobre este Producto</h4>
            
            {reviewSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> ¡Gracias por tu opinión! Tu reseña ha sido publicada.
              </div>
            )}

            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Tu Nombre (ej. Carlos M.)" 
                  value={userNameInput}
                  onChange={e => setUserNameInput(e.target.value)}
                  style={{ flex: '1 1 200px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
                  required
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calificación:</span>
                  {[1, 2, 3, 4, 5].map(starVal => (
                    <Star 
                      key={starVal} 
                      size={18} 
                      fill={starVal <= userRating ? 'var(--warning)' : 'none'} 
                      stroke={starVal <= userRating ? 'var(--warning)' : 'var(--text-muted)'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setUserRating(starVal)}
                    />
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Escribe tu opinión sobre la calidad, el tiempo de entrega y el empaque del producto..." 
                rows="3"
                value={userCommentInput}
                onChange={e => setUserCommentInput(e.target.value)}
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                required
              />

              <button 
                type="submit" 
                className="add-to-cart-btn"
                style={{ width: 'fit-content', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Send size={16} /> Publicar Reseña
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {reviewsList.map((rev, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{rev.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{rev.date}</span>
                </div>
                <div style={{ display: 'flex', color: 'var(--warning)', gap: '0.1rem', marginBottom: '0.75rem' }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem', marginTop: '1rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Otros productos relacionados</h3>
            <div className="products-grid">
              {relatedProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product} 
                  navigateToDetail={navigateToDetail}
                  hideActions={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
