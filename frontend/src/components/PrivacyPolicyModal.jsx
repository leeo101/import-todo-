import React from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Shield size={24} color="var(--accent-cyan)" /> Políticas de Privacidad y Términos
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.05)', borderLeft: '4px solid var(--accent-cyan)', padding: '1rem', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontWeight: '500' }}>
              En ImportTodo nos tomamos muy en serio la seguridad y privacidad de tus datos personales. A continuación detallamos nuestras políticas de manejo de información.
            </p>
          </div>

          <section>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>1. Recopilación de Datos Personales</h3>
            <p>
              Recopilamos información indispensable como tu nombre completo, DNI / Identificación Fiscal, dirección de domicilio, código postal, correo electrónico y número de teléfono. Estos datos son estrictamente requeridos para procesar tus compras y gestionar el despacho aduanero correspondiente a las importaciones.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>2. Uso y Protección de la Información</h3>
            <p>
              Tus datos son utilizados de forma exclusiva para:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
              <li>Procesar cobros seguros mediante Mercado Pago.</li>
              <li>Coordinar los envíos directos de fábrica a tu domicilio con nuestros aliados logísticos.</li>
              <li>Enviar actualizaciones en tiempo real del estado del paquete y seguimiento de aduana.</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              No vendemos ni compartimos información con terceros ajenos a la transacción comercial.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>3. Seguridad y Cifrado</h3>
            <p>
              Todas las transacciones y contraseñas se gestionan mediante cifrado SSL/HTTPS de extremo a extremo. Los datos bancarios y tarjetas son procesados 100% en las plataformas oficiales de cobro sin almacenarse en nuestros servidores.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>4. Derechos del Usuario y Cancelación</h3>
            <p>
              Puedes consultar, modificar o solicitar la eliminación total de tus datos personales e historial de cuenta en cualquier momento desde tu panel de Perfil de Usuario o enviando una solicitud a nuestro equipo de soporte.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', textAlign: 'right' }}>
          <button 
            className="submit-btn" 
            onClick={onClose}
            style={{ padding: '0.6rem 1.5rem', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CheckCircle size={18} /> Comprendido y Aceptado
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
