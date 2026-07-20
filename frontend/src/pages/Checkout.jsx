import React, { useState } from 'react';
import { X, CheckCircle2, Lock, CreditCard, Loader2, ShieldCheck, DollarSign } from 'lucide-react';

const Checkout = ({
  isCheckoutOpen,
  setIsCheckoutOpen,
  orderSuccess,
  setOrderSuccess,
  checkoutError,
  handleCheckoutSubmit,
  checkoutName, setCheckoutName,
  checkoutDni, setCheckoutDni,
  checkoutPhone, setCheckoutPhone,
  checkoutAddress, setCheckoutAddress,
  checkoutApartment, setCheckoutApartment,
  checkoutZipCode, setCheckoutZipCode,
  checkoutCity, setCheckoutCity,
  checkoutProvince, setCheckoutProvince,
  checkoutEmail, setCheckoutEmail,
  cartTotal
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Mercado Pago');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  if (!isCheckoutOpen) return null;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsSimulatingPayment(true);
    
    // Simulate 1.8 second payment gateway processing window
    setTimeout(() => {
      setIsSimulatingPayment(false);
      handleCheckoutSubmit(e, paymentMethod);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={() => { if (!orderSuccess && !isSimulatingPayment) setIsCheckoutOpen(false); }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px' }}>
        <button 
          className="close-btn" 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} 
          onClick={() => setIsCheckoutOpen(false)}
          disabled={isSimulatingPayment}
        >
          <X size={20} />
        </button>

        {isSimulatingPayment ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Loader2 className="animate-spin" size={54} color="var(--accent-cyan)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Conectando con la Pasarela de Pago...</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Procesando cobro seguro con <strong style={{ color: 'var(--accent-cyan)' }}>{paymentMethod}</strong>
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} /> Cifrado SSL de 256 bits activo
            </div>
          </div>
        ) : orderSuccess ? (
          <div className="success-alert">
            <CheckCircle2 className="success-icon" />
            <h2 style={{ marginBottom: '0.5rem' }}>¡Pago Aprobado con Éxito!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Tu pago ha sido registrado a través de <strong>{paymentMethod}</strong>. Hemos enviado el recibo de compra y el número de seguimiento a tu correo.
            </p>
            <button className="submit-btn" onClick={() => { setOrderSuccess(false); setIsCheckoutOpen(false); }}>
              Volver a la Tienda
            </button>
          </div>
        ) : (
          <div>
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard color="var(--accent-cyan)" /> Finalizar Compra y Pago
            </h2>
            
            {checkoutError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                {checkoutError}
              </div>
            )}

            <form onSubmit={onSubmitForm}>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Lock size={14} /> Datos de Entrega y Facturación (Aduana)
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Nombre Destinatario</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Juan Pérez" 
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">DNI / ID Fiscal (Requerido Aduana)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="12345678" 
                      value={checkoutDni}
                      onChange={(e) => setCheckoutDni(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono / Celular</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="1199998888" 
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
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
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Piso / Dpto</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Piso 4 Depto B" 
                      value={checkoutApartment}
                      onChange={(e) => setCheckoutApartment(e.target.value)}
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
                      value={checkoutZipCode}
                      onChange={(e) => setCheckoutZipCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ciudad</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="CABA" 
                      value={checkoutCity}
                      onChange={(e) => setCheckoutCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Provincia</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Buenos Aires" 
                      value={checkoutProvince}
                      onChange={(e) => setCheckoutProvince(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email del Destinatario</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="juan@email.com" 
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CreditCard size={14} /> Selecciona tu Método de Pago
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Mercado Pago')}
                    style={{
                      padding: '0.85rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'Mercado Pago' ? '2px solid #009ee3' : '1px solid var(--border-light)',
                      background: paymentMethod === 'Mercado Pago' ? 'rgba(0, 158, 227, 0.12)' : 'rgba(255,255,255,0.02)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: paymentMethod === 'Mercado Pago' ? 'bold' : 'normal',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>💳</span>
                    <span style={{ fontSize: '0.85rem' }}>Mercado Pago</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PayPal')}
                    style={{
                      padding: '0.85rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'PayPal' ? '2px solid #003087' : '1px solid var(--border-light)',
                      background: paymentMethod === 'PayPal' ? 'rgba(0, 48, 135, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: paymentMethod === 'PayPal' ? 'bold' : 'normal',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🅿️</span>
                    <span style={{ fontSize: '0.85rem' }}>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transferencia Bancaria')}
                    style={{
                      padding: '0.85rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'Transferencia Bancaria' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-light)',
                      background: paymentMethod === 'Transferencia Bancaria' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: paymentMethod === 'Transferencia Bancaria' ? 'bold' : 'normal',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🏦</span>
                    <span style={{ fontSize: '0.85rem' }}>Transferencia</span>
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Monto Total a Pagar:</span>
                  <span style={{ color: 'var(--success)' }}>
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(cartTotal)}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                style={{ 
                  background: paymentMethod === 'Mercado Pago' ? 'linear-gradient(135deg, #009ee3, #007eb5)' : 
                              paymentMethod === 'PayPal' ? 'linear-gradient(135deg, #003087, #0070ba)' : 
                              'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  fontWeight: 'bold',
                  fontSize: '1.05rem',
                  padding: '1rem'
                }}
              >
                Pagar ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(cartTotal)} con {paymentMethod}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
