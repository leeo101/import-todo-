import React from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = ({
  cheapestProducts,
  activeBannerIndex,
  setActiveBannerIndex,
  navigateToDetail,
  BANNERS,
  categories,
  activeCategory,
  setActiveCategory,
  setSearchQuery,
  loading,
  filteredProductsList,
  wishlist,
  toggleWishlist,
  addToCart,
  buyNow
}) => {
  return (
    <>
      {/* Hero Carousel Banner Header */}
      <header className="hero container" style={{ paddingBottom: '0.5rem' }}>
        {cheapestProducts.length > 0 ? (
          // 1. CHEAPEST PRODUCTS SLIDER
          (() => {
            const activeIndex = activeBannerIndex % cheapestProducts.length;
            const currentProduct = cheapestProducts[activeIndex];
            return (
              <div 
                onClick={() => navigateToDetail(currentProduct)}
                style={{ 
                  background: 'linear-gradient(to right, rgba(9,13,22,0.95), rgba(6,182,212,0.06))',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '20px',
                  padding: '2.25rem',
                  marginBottom: '2.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(6,182,212,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '2rem',
                  minHeight: '260px',
                  cursor: 'pointer'
                }} className="hero-banner-container">
                
                <div style={{ flex: '1 1 55%', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                  <span className="hero-badge" style={{ alignSelf: 'flex-start', margin: 0, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    🔥 OFERTA RECOMENDADA
                  </span>
                  <h2 style={{ fontSize: '2.1rem', fontWeight: 'bold', lineHeight: '1.2', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                    {currentProduct.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)', fontFamily: 'Outfit' }}>
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(currentProduct.salePrice)}
                    </span>
                    <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold' }}>Envío Directo</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                    {cheapestProducts.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveBannerIndex(idx); }}
                        style={{
                          width: activeIndex === idx ? '24px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: activeIndex === idx ? 'var(--accent-cyan)' : 'var(--border-light)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ 
                  flex: '1 1 40%', 
                  height: '220px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-light)',
                  background: '#fff',
                  padding: '10px'
                }} className="banner-img-wrap">
                  <img 
                    src={currentProduct.image} 
                    alt={currentProduct.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = '/images/default.svg' }}
                  />
                </div>
              </div>
            );
          })()
        ) : (
          // 2. STATIC BANNERS SLIDER (FALLBACK)
          <div style={{ 
            background: 'linear-gradient(to right, rgba(9,13,22,0.9), rgba(6,182,212,0.04))',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            padding: '2.25rem',
            marginBottom: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            minHeight: '260px'
          }} className="hero-banner-container">
            <div style={{ flex: '1 1 55%', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              <span className="hero-badge" style={{ alignSelf: 'flex-start', margin: 0 }}>
                {BANNERS[activeBannerIndex % BANNERS.length].badge}
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 'bold', lineHeight: '1.2', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                {BANNERS[activeBannerIndex % BANNERS.length].title}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {BANNERS[activeBannerIndex % BANNERS.length].desc}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {BANNERS.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveBannerIndex(idx)}
                    style={{
                      width: (activeBannerIndex % BANNERS.length) === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: (activeBannerIndex % BANNERS.length) === idx ? 'var(--accent-cyan)' : 'var(--border-light)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ 
              flex: '1 1 40%', 
              height: '220px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--border-light)'
            }} className="banner-img-wrap">
              <img 
                src={BANNERS[activeBannerIndex % BANNERS.length].image} 
                alt="Promo Illustration" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #090d16 12%, transparent 80%)' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/images/logo.png" alt="ImportTodo Logo" style={{ height: '140px', borderRadius: '16px', border: 'none', filter: 'drop-shadow(0 8px 16px rgba(6,182,212,0.25))' }} />
        </div>
        <div className="hero-badge" style={{ margin: '0 auto' }}>
          <Sparkles size={14} /> Importaciones Directas al Costo
        </div>
        <h1 className="hero-title" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          Importaciones <span>Sin Intermediarios</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '2.5rem' }}>
          Traemos todo lo que necesitas directo desde fábrica internacional: alimentos, herramientas industriales, indumentaria y tecnología al precio más bajo garantizado.
        </p>

        {/* Categories filters */}
        <div className="filters-bar">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Catalog Grid */}
      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <p>Cargando catálogo de ImportTodo...</p>
          </div>
        ) : filteredProductsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <p>No se encontraron productos en esta sección.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProductsList.map(product => {
              const isFavorite = wishlist.some(fav => fav.id === product.id);
              return (
                <ProductCard 
                  key={product.id}
                  product={product} 
                  isFavorite={isFavorite}
                  navigateToDetail={navigateToDetail}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  buyNow={buyNow}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
