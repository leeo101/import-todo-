import React from 'react';
import { X, Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <MessageSquare size={24} color="var(--accent-cyan)" /> Contacto y Soporte al Cliente
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            ¿Tienes dudas sobre tus compras, envíos internacionales o aduana? Nuestro equipo de atención al cliente está listo para ayudarte.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>Atención Telefónica / WhatsApp</h4>
                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-cyan)' }}>+54 11 1234-5678</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>Correo Electrónico de Soporte</h4>
                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-cyan)' }}>soporte@importtodo.com</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>Oficinas Comerciales</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Av. Corrientes 1234, Piso 5, CABA, Argentina</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>Horarios de Atención</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lunes a Viernes de 09:00 a 18:00 hs (ART)</p>
              </div>
            </div>

          </div>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', textAlign: 'right' }}>
          <button 
            className="submit-btn" 
            onClick={onClose}
            style={{ padding: '0.6rem 1.5rem', width: 'auto' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
