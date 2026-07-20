import React from 'react';
import { X, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AuthModal = () => {
  const {
    authModalOpen, setAuthModalOpen,
    authMode, setAuthMode,
    authError, setAuthError,
    authName, setAuthName,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    authDni, setAuthDni,
    authPhone, setAuthPhone,
    authAddress, setAuthAddress,
    authApartment, setAuthApartment,
    authZipCode, setAuthZipCode,
    authCity, setAuthCity,
    authProvince, setAuthProvince,
    authPrivacyAccepted, setAuthPrivacyAccepted,
    handleAuthSubmit
  } = useAuth();

  if (!authModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="close-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} onClick={() => setAuthModalOpen(false)}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <img src="/images/logo.png" alt="ImportTodo Logo" style={{ height: '70px', borderRadius: '8px', objectFit: 'contain' }} />
        </div>
        <h2 className="modal-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {authMode === 'login' ? 'Iniciar Sesión' : 'Crear tu Cuenta Segura'}
        </h2>

        {authError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="ejemplo@correo.com" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="******" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
            {authMode === 'register' && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                *Mínimo 8 caracteres, incluyendo al menos una letra y un número. Encriptación criptográfica SHA-256.
              </span>
            )}
          </div>

          {authMode === 'register' && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> Datos de Identidad y Facturación</h3>
              
              <div className="form-group">
                <label className="form-label">Nombre y Apellido Completo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Juan Pérez" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">DNI / ID Fiscal</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="12345678" 
                    value={authDni}
                    onChange={(e) => setAuthDni(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="1199998888" 
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dirección (Calle y Número)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Av. Corrientes 1234" 
                    value={authAddress}
                    onChange={(e) => setAuthAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Piso / Dpto</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Piso 4 B" 
                    value={authApartment}
                    onChange={(e) => setAuthApartment(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cód. Postal</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="1043" 
                    value={authZipCode}
                    onChange={(e) => setAuthZipCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="CABA" 
                    value={authCity}
                    onChange={(e) => setAuthCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Provincia</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Buenos Aires" 
                    value={authProvince}
                    onChange={(e) => setAuthProvince(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1rem', padding: '0.5rem', background: 'var(--surface-light)', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  id="privacyPolicy"
                  checked={authPrivacyAccepted}
                  onChange={(e) => setAuthPrivacyAccepted(e.target.checked)}
                  style={{ marginTop: '0.25rem' }}
                />
                <label htmlFor="privacyPolicy" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                  Acepto las <a href="#" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Políticas de Privacidad</a> y los Términos de Servicio. Entiendo que mis datos serán utilizados para gestionar la cuenta y los envíos.
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            {authMode === 'login' ? 'Iniciar Sesión' : 'Registrar Cuenta Segura'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          {authMode === 'login' ? (
            <p style={{ color: 'var(--text-muted)' }}>¿¿¿No tienes cuenta? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Regístrate gratis</button></p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>¿¿¿Ya tienes cuenta? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesión</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
