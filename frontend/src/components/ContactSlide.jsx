import React from 'react';
import { X, User, Settings, LogIn, LogOut, Shield, Phone, ChevronRight, Store } from 'lucide-react';

const ContactSlide = ({ 
  isOpen, 
  onClose, 
  loggedInUser, 
  setCurrentView, 
  setSelectedProductDetail, 
  setAuthModalOpen, 
  setAuthMode,
  onOpenPrivacyModal,
  onOpenContactModal,
  handleLogout
}) => {
  const navigateTo = (view) => {
    setCurrentView(view);
    setSelectedProductDetail(null);
    onClose();
  };

  return (
    <>
      {/* Dark Blur Overlay */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          onClick={onClose}
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        />
      )}
      
      {/* Solid Left Drawer Panel */}
      <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* User Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0057ff, #00f0ff)', 
          padding: '2.5rem 1.5rem 1.5rem 1.5rem', 
          color: '#ffffff',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            title="Cerrar Menú"
            style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              background: 'rgba(0,0,0,0.25)', 
              border: 'none', 
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', 
              color: '#ffffff' 
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '50%', 
              background: '#ffffff', 
              color: '#0057ff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <User size={30} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bienvenido</p>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#ffffff' }}>
                {loggedInUser ? loggedInUser.name : 'Usuario ImportTodo'}
              </h3>
              {loggedInUser && (
                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', opacity: 0.85 }}>
                  {loggedInUser.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '1rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Navegación
          </div>

          <button 
            onClick={() => navigateTo('store')}
            className="sidebar-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Store size={20} color="var(--accent-cyan)" />
              <span>Catálogo Principal</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          {loggedInUser && (
            <>
              <button 
                onClick={() => navigateTo('profile')}
                className="sidebar-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <User size={20} color="var(--accent-cyan)" />
                  <span>Mi Perfil</span>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>

              {(loggedInUser.isAdmin || loggedInUser.role === 'admin' || loggedInUser.email?.toLowerCase() === 'enzorodriguez31@gmail.com') && (
                <button 
                  onClick={() => navigateTo('admin')}
                  className="sidebar-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <Settings size={20} color="var(--accent-cyan)" />
                    <span>Panel de Control (Admin)</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
              )}
            </>
          )}

          <div style={{ margin: '1rem 0 0.5rem 0', borderTop: '1px solid var(--border-light)' }} />

          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Información y Ayuda
          </div>

          <button 
            onClick={() => { onClose(); onOpenPrivacyModal(); }}
            className="sidebar-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Shield size={20} color="var(--accent-cyan)" />
              <span>Políticas de Privacidad</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <button 
            onClick={() => { onClose(); onOpenContactModal(); }}
            className="sidebar-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Phone size={20} color="var(--accent-cyan)" />
              <span>Contacto y Soporte</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <div style={{ margin: 'auto 0 0 0', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
            {loggedInUser ? (
              <button 
                onClick={() => { handleLogout(); onClose(); }}
                className="sidebar-item"
                style={{ color: 'var(--error)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); onClose(); }}
                className="sidebar-item"
                style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <LogIn size={20} />
                  <span>Ingresar / Registrarse</span>
                </div>
                <ChevronRight size={18} />
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          ImportTodo v1.0 • Dropshipping Directo
        </div>
      </div>
    </>
  );
};

export default ContactSlide;
