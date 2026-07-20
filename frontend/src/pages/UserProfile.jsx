import React, { useState } from 'react';
import { User, Settings, Package, ChevronRight, LogOut, Shield, Edit3, Save, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const UserProfile = ({ userOrders, onNavigate }) => {
  const { loggedInUser, handleLogout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'settings'
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with user data
  const [formData, setFormData] = useState({
    name: loggedInUser?.name || '',
    dni: loggedInUser?.dni || '',
    email: loggedInUser?.email || '',
    phone: loggedInUser?.phone || '',
    address: loggedInUser?.address || '',
    apartment: loggedInUser?.apartment || '',
    city: loggedInUser?.city || '',
    province: loggedInUser?.province || '',
    zipCode: loggedInUser?.zipCode || ''
  });

  if (!loggedInUser) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Inicia sesión para ver tu perfil</h2>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startEdit = () => {
    setFormData({
      name: loggedInUser.name || '',
      dni: loggedInUser.dni || '',
      email: loggedInUser.email || '',
      phone: loggedInUser.phone || '',
      address: loggedInUser.address || '',
      apartment: loggedInUser.apartment || '',
      city: loggedInUser.city || '',
      province: loggedInUser.province || '',
      zipCode: loggedInUser.zipCode || ''
    });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const logoutAndRedirect = () => {
    handleLogout();
    onNavigate('store');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Profile Card Header */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{loggedInUser.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{loggedInUser.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('info')}
              className={`filter-btn ${activeTab === 'info' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Datos Personales
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`filter-btn ${activeTab === 'orders' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Mis Pedidos ({userOrders.length})
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`filter-btn ${activeTab === 'settings' ? 'active' : ''}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Configuración
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '2rem' }}>
          
          {saveSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={20} /> ¡Datos personales actualizados correctamente!
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <User size={22} color="var(--accent-cyan)" /> Información Personal
                </h2>

                {!isEditing ? (
                  <button 
                    onClick={startEdit}
                    className="submit-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Edit3 size={16} /> Editar Datos
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setIsEditing(false)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSave}
                      className="submit-btn"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Save size={16} /> Guardar Cambios
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                /* READ-ONLY VIEW */
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Nombre Completo</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.name}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>DNI / ID Fiscal</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.dni || 'No asignado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Correo Electrónico</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Teléfono</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.phone || 'No asignado'}</p>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Dirección de Envío Principal</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Calle y Número</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.address || 'No asignado'} {loggedInUser.apartment ? `- ${loggedInUser.apartment}` : ''}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Ciudad</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.city || 'No asignado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Provincia</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.province || 'No asignado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Código Postal</p>
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>{loggedInUser.zipCode || 'No asignado'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT FORM VIEW */
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        name="name" 
                        className="form-input" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">DNI / ID Fiscal (Aduana)</label>
                      <input 
                        type="text" 
                        name="dni" 
                        className="form-input" 
                        value={formData.dni} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        name="email" 
                        className="form-input" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Teléfono de Contacto</label>
                      <input 
                        type="text" 
                        name="phone" 
                        className="form-input" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Dirección de Envío</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                      <label className="form-label">Calle y Número</label>
                      <input 
                        type="text" 
                        name="address" 
                        className="form-input" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        placeholder="Ej: Av. Santa Fe 2345"
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Piso / Departamento (Opcional)</label>
                      <input 
                        type="text" 
                        name="apartment" 
                        className="form-input" 
                        value={formData.apartment} 
                        onChange={handleInputChange} 
                        placeholder="Ej: 4° B"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Ciudad</label>
                      <input 
                        type="text" 
                        name="city" 
                        className="form-input" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Provincia</label>
                      <input 
                        type="text" 
                        name="province" 
                        className="form-input" 
                        value={formData.province} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Código Postal</label>
                      <input 
                        type="text" 
                        name="zipCode" 
                        className="form-input" 
                        value={formData.zipCode} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn" 
                      style={{ padding: '0.75rem 2rem', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Save size={18} /> Guardar Cambios
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <Package size={22} color="var(--accent-cyan)" /> Historial de Compras
              </h2>
              {userOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No registras pedidos recientes</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Explora nuestro catálogo e importa productos directo de fábrica.</p>
                  <button onClick={() => onNavigate('store')} className="submit-btn" style={{ maxWidth: '200px', margin: '0 auto' }}>Ir a la Tienda</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {userOrders.map(order => (
                    <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pedido ID: {order.id}</p>
                          <p style={{ fontWeight: 'bold' }}>{new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span style={{ 
                            padding: '0.3rem 0.8rem', 
                            borderRadius: '6px', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold', 
                            background: order.status === 'Entregado' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: order.status === 'Entregado' ? 'var(--success)' : 'var(--warning)'
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.95rem' }}>• {item.title} <span style={{ color: 'var(--text-muted)' }}>(x{item.quantity})</span></span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(item.salePrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '1.25rem', textAlign: 'right', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-light)' }}>
                        <p style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>Monto Total: <span style={{ color: 'var(--success)' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(order.total)}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <Settings size={22} color="var(--accent-cyan)" /> Configuraciones de Cuenta
              </h2>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={18} /> Privacidad y Protección de Datos</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Has aceptado las políticas de privacidad. Tu información está resguardada con cifrado SSL de extremo a extremo.
                </p>
                <button className="glass-btn" style={{ fontSize: '0.85rem' }}>
                  Exportar Mis Datos de Cuenta
                </button>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--error)', marginBottom: '0.5rem' }}>Cerrar Sesión o Dar de Baja</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Puedes cerrar tu sesión o solicitar la desactivación de tu cuenta en cualquier momento.
                </p>
                <button 
                  onClick={logoutAndRedirect}
                  style={{ padding: '0.6rem 1.25rem', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                >
                  Cerrar Sesión Activa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
