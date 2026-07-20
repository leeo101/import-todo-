import React, { useContext } from 'react';
import { Search, Sun, Moon, History, Settings, LogOut, LogIn, ShoppingCart, Info, User, Menu } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  loggedInUser,
  handleLogout,
  setAuthMode,
  setAuthModalOpen,
  setSelectedProductDetail,
  setIsCartOpen,
  cartItemCount,
  navigateToStore,
  setIsContactSlideOpen
}) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="filter-btn" 
            onClick={() => setIsContactSlideOpen(true)}
            style={{ padding: '0.4rem', background: 'transparent', border: 'none', color: 'var(--text-main)' }}
            title="Abrir Menú Principal"
          >
            <Menu size={24} />
          </button>
          
          <a href="#" className="logo" onClick={navigateToStore} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/images/logo.png" alt="ImportTodo Logo" style={{ height: '42px', borderRadius: '6px', objectFit: 'contain' }} />
          </a>
        </div>

        {/* Search bar inside store */}
        {currentView === 'store' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '350px', margin: '0 1rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar alimentos, herramientas, ropa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', borderRadius: '20px', height: '38px', fontSize: '0.85rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          </div>
        )}

        <div className="nav-actions">
          <button 
            className="cart-trigger" 
            onClick={toggleTheme} 
            title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            style={{ padding: '0.4rem' }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className={`filter-btn ${currentView === 'store' || currentView === 'product-detail' ? 'active' : ''}`}
            onClick={navigateToStore}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
          >
            Tienda
          </button>

          {loggedInUser ? (
            <>


              <button className="close-btn" onClick={handleLogout} title="Cerrar Sesión" style={{ color: 'var(--error)' }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button 
              className="add-to-cart-btn" 
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
            >
              <LogIn size={14} /> Ingresar
            </button>
          )}

          {(currentView === 'store' || currentView === 'product-detail') && (
            <button className="cart-trigger" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
