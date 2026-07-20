import React from 'react';
import { Loader2, Sparkles, ExternalLink, Plus, Trash2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const AdminDashboard = ({
  handleSyncCatalog,
  isSyncingCatalog,
  backendOnline,
  totalSales,
  totalProfit,
  pendingOrders,
  products,
  handleBulkSearch,
  bulkSearchQuery,
  setBulkSearchQuery,
  bulkSearching,
  bulkSearchResults,
  bulkSupplierFilter,
  setBulkSupplierFilter,
  settings,
  handleImportProduct,
  handleMarginSubmit,
  adminMarginInput,
  setAdminMarginInput,
  adminRateInput,
  setAdminRateInput,
  handleAddProductSubmit,
  newProdSupplier,
  setNewProdSupplier,
  handleAutoScrape,
  scrapingLink,
  newProdTitle,
  setNewProdTitle,
  newProdCategory,
  setNewProdCategory,
  newProdCost,
  setNewProdCost,
  newProdStock,
  setNewProdStock,
  newProdWeight,
  setNewProdWeight,
  newProdDimensions,
  setNewProdDimensions,
  newProdImage,
  setNewProdImage,
  newProdDesc,
  setNewProdDesc,
  orders,
  setSelectedOrderFulfillment,
  setIsFulfillmentOpen,
  navigateToDetail,
  handleDeleteProduct,
  handleDeleteOrder,
  handleUpdateOrderStatus
}) => {
  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="brand-font" style={{ fontSize: '2.2rem' }}>Panel de Control <span style={{ color: 'var(--accent-cyan)' }}>ImportTodo</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleSyncCatalog}
            disabled={isSyncingCatalog}
            className="add-to-cart-btn"
            style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {isSyncingCatalog ? (
              <>
                <Loader2 className="animate-spin" size={14} style={{ marginRight: '0.3rem', display: 'inline' }} /> Sincronizando...
              </>
            ) : (
              '⚡ Sincronizar Precios y Stock'
            )}
          </button>
          <span className="hero-badge" style={{ margin: 0, padding: '0.4rem 0.8rem', background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderColor: backendOnline ? 'var(--success)' : 'var(--error)', color: backendOnline ? 'var(--success)' : 'var(--error)' }}>
            ● Backend {backendOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ventas Facturadas</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Outfit' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(totalSales)}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ganancia Dropshipping</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)', fontFamily: 'Outfit' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(totalProfit)}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pedidos Pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)', fontFamily: 'Outfit' }}>{pendingOrders}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Productos Activos</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Outfit' }}>{products.length}</div>
        </div>
      </div>

      {/* Bulk Supplier Live Importer Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} /> Importador Masivo en Vivo (Alibaba, AliExpress, Mercado Libre, Amazon)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Busca mercaderías, herramientas o comestibles económicos en vivo en las APIs de proveedores e impórtalos directamente al catálogo con un solo click.
        </p>
        <form onSubmit={handleBulkSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ej: fideos, taladro, platos, campera, cargador..."
            value={bulkSearchQuery}
            onChange={(e) => setBulkSearchQuery(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <button 
            type="submit" 
            className="add-to-cart-btn" 
            disabled={bulkSearching}
            style={{ minWidth: '130px', justifyContent: 'center' }}
          >
            {bulkSearching ? <Loader2 className="animate-spin" size={16} /> : 'Buscar APIs'}
          </button>
        </form>

        {(() => {
          const filteredList = bulkSearchResults.filter(res => {
            if (bulkSupplierFilter === 'Todos') return true;
            if (bulkSupplierFilter === 'Mercado Libre' && res.supplierName === 'Mercado Libre') return true;
            if (bulkSupplierFilter === 'AliExpress' && res.supplierName === 'AliExpress') return true;
            if (bulkSupplierFilter === 'Amazon' && res.supplierName === 'Amazon Associates') return true;
            if (bulkSupplierFilter === 'Banggood' && res.supplierName === 'Banggood') return true;
            if (bulkSupplierFilter === 'CJ Dropshipping' && res.supplierName === 'CJ Dropshipping') return true;
            if (bulkSupplierFilter === 'Temu' && res.supplierName === 'Temu') return true;
            if (bulkSupplierFilter === 'eBay' && res.supplierName === 'eBay') return true;
            if (bulkSupplierFilter === 'Walmart' && res.supplierName === 'Walmart') return true;
            return false;
          });

          if (bulkSearchResults.length === 0) return null;

          return (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                {['Todos', 'Mercado Libre', 'AliExpress', 'Amazon', 'Banggood', 'CJ Dropshipping', 'Temu', 'eBay', 'Walmart'].map(provider => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => setBulkSupplierFilter(provider)}
                    style={{
                      padding: '0.4rem 1rem',
                      fontSize: '0.8rem',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: bulkSupplierFilter === provider ? 'var(--accent-cyan)' : 'var(--border-light)',
                      background: bulkSupplierFilter === provider ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                      color: bulkSupplierFilter === provider ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: bulkSupplierFilter === provider ? 'bold' : 'normal'
                    }}
                  >
                    {provider} ({
                      provider === 'Todos' ? bulkSearchResults.length :
                      provider === 'Mercado Libre' ? bulkSearchResults.filter(r => r.supplierName === 'Mercado Libre').length :
                      provider === 'AliExpress' ? bulkSearchResults.filter(r => r.supplierName === 'AliExpress').length :
                      provider === 'Amazon' ? bulkSearchResults.filter(r => r.supplierName === 'Amazon Associates').length :
                      provider === 'Banggood' ? bulkSearchResults.filter(r => r.supplierName === 'Banggood').length :
                      provider === 'CJ Dropshipping' ? bulkSearchResults.filter(r => r.supplierName === 'CJ Dropshipping').length :
                      provider === 'Temu' ? bulkSearchResults.filter(r => r.supplierName === 'Temu').length :
                      provider === 'eBay' ? bulkSearchResults.filter(r => r.supplierName === 'eBay').length :
                      bulkSearchResults.filter(r => r.supplierName === 'Walmart').length
                    })
                  </button>
                ))}
              </div>

              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Proveedor</th>
                      <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Título del Producto</th>
                      <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>Costo Fábrica</th>
                      <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>Precio Venta (+{settings.marginPercentage}%)</th>
                      <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'center' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((res, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                          <span className="badge badge-info">
                            {res.supplierName}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={res.image} alt={res.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0 }} onError={(e) => { e.target.src = '/images/default.svg' }} />
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.9rem', maxWidth: '320px', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }} title={res.title}>
                                {res.title}
                                {res.isCheapest && <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>🏷️ Más Barato</span>}
                                {res.isBestSeller && <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>🔥 Más Vendido</span>}
                              </div>
                              <a href={res.supplierUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>Ver original <ExternalLink size={10} /></a>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right', color: 'var(--text-muted)' }}>
                          USD ${res.originalPrice.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(res.originalPrice * (1 + settings.marginPercentage / 100) * settings.usdToArsRate)}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <button 
                            className="add-to-cart-btn" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.15rem' }}
                            onClick={() => handleImportProduct(res)}
                          >
                            <Plus size={12} /> Importar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="content-layout-cols">
        
        {/* Left Column Forms: Margin Config & New Product */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Margin config */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Ajustes Dropshipping</h2>
            <form onSubmit={handleMarginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Margen de Ganancia (%)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={adminMarginInput}
                  onChange={(e) => setAdminMarginInput(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Multiplicador actual aplicado: x{(1 + parseFloat(adminMarginInput || 0) / 100).toFixed(2)}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Cambio Dólar (1 USD = ARS $)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={adminRateInput}
                  onChange={(e) => setAdminRateInput(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'block', marginTop: '0.25rem' }}>
                  💡 Cotización Dólar Tarjeta: ${settings.usdToArsRate || 1450} ARS.
                </span>
              </div>

              <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>Guardar Ajustes</button>
            </form>
          </div>

          {/* Add Product Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Agregar Producto al Catálogo</h2>
            <form onSubmit={handleAddProductSubmit}>
              
              <div style={{ background: 'rgba(6,182,212,0.03)', padding: '1rem', border: '1px dashed var(--border-glow)', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>⚡ Cargar por Enlace (AliExpress/Amazon/Alibaba)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="Pega el link de la mercadería o máquina..."
                    value={newProdSupplier}
                    onChange={(e) => setNewProdSupplier(e.target.value)}
                    style={{ flexGrow: 1 }}
                  />
                  <button 
                    type="button" 
                    className="add-to-cart-btn" 
                    onClick={handleAutoScrape}
                    disabled={scrapingLink}
                    style={{ whiteSpace: 'nowrap', minWidth: '120px', justifyContent: 'center' }}
                  >
                    {scrapingLink ? <Loader2 className="animate-spin" size={16} /> : 'Auto-completar'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Fideos Tallarines x 500g"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select 
                  className="form-input"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  style={{ background: '#090d16' }}
                >
                  <option value="Comestibles">Comestibles</option>
                  <option value="Maquinaria y Herramientas">Maquinaria y Herramientas</option>
                  <option value="Hogar y Bazar">Hogar y Bazar</option>
                  <option value="Vestimenta">Vestimenta</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Costo Fábrica (USD)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    placeholder="2.50"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Peso (g / kg)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="500 g"
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dimensiones (cm)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="20 x 8 x 5 cm"
                    value={newProdDimensions}
                    onChange={(e) => setNewProdDimensions(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagen URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  placeholder="Especificaciones técnicas o detalles..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  style={{ height: '70px', resize: 'vertical' }}
                />
              </div>
              
              <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }}>
                Subir al Catálogo
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Active Orders & Inventory Tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flexGrow: 1 }}>
          
          {/* Active orders management table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              📦 Pedidos por Despachar y Gestión de Estado ({orders.length})
            </h2>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Cliente / Envío</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Pago</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Productos</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>Total</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No hay compras registradas en el sistema.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ padding: '1rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                          <div style={{ fontWeight: 'bold' }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DNI: {order.dni || 'N/C'} | Tel: {order.phone}</div>
                          
                          <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estado:</span>
                            {handleUpdateOrderStatus ? (
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                style={{
                                  background: 'rgba(9, 13, 22, 0.8)',
                                  border: '1px solid var(--border-light)',
                                  color: 'var(--accent-cyan)',
                                  borderRadius: '6px',
                                  padding: '0.15rem 0.4rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Procesando">Procesando</option>
                                <option value="En Camino">En Camino</option>
                                <option value="Aduana">Aduana</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                              </select>
                            ) : (
                              <span style={{ fontWeight: 'bold', color: 'var(--warning)', fontSize: '0.75rem' }}>{order.status}</span>
                            )}
                          </div>
                        </td>
                        
                        <td style={{ padding: '1rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            <CheckCircle2 size={12} /> PAGADO
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem', fontWeight: '500' }}>
                            {order.paymentMethod || 'Mercado Pago'}
                          </div>
                        </td>

                        <td style={{ padding: '1rem 0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx}>• {item.title} (x{item.quantity})</div>
                          ))}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(order.total)}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                            <button 
                              className="add-to-cart-btn" 
                              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: '6px', width: '100%' }}
                              onClick={() => {
                                setSelectedOrderFulfillment(order);
                                setIsFulfillmentOpen(true);
                              }}
                            >
                              Procesar Envío
                            </button>

                            {/* 📱 BOTÓN DE NOTIFICACIÓN AUTOMÁTICA POR WHATSAPP */}
                            <button 
                              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', borderRadius: '6px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 'bold' }}
                              onClick={() => {
                                const name = order.shippingAddress?.fullName || 'Cliente';
                                const phone = (order.shippingAddress?.phone || '').replace(/[^0-9]/g, '');
                                const tracking = order.trackingNumber || 'AR-PROCESANDO';
                                const msg = encodeURIComponent(`¡Hola ${name}! Te contactamos de ImportTodo. Tu pedido #${order.id} está en estado: *${order.status}*. Código de seguimiento internacional: *${tracking}*. ¡Gracias por confiar en nosotros! 🚀`);
                                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                              }}
                            >
                              📱 WhatsApp
                            </button>

                            {handleDeleteOrder && (
                              <button 
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--error)', borderRadius: '6px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 'bold' }}
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 size={12} /> Borrar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Cost vs Price Table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Costos y Precios en Catálogo</h2>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Producto</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'left' }}>Peso / Medidas</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>Costo Fábrica</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>P. Venta Público</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'right' }}>Stock</th>
                    <th style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={p.image} alt={p.title} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0 }} onError={(e) => { e.target.src = '/images/default.svg' }} />
                          <button 
                            onClick={() => navigateToDetail(p)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#fff', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}
                            className="hover-cyan-link"
                          >
                            {p.title}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div>⚖️ {p.weight || '300 g'}</div>
                        <div>📐 {p.dimensions || '15x10x5 cm'}</div>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right', color: 'var(--text-muted)' }}>
                        USD ${(p.originalPrice || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p.salePrice)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right' }}>
                        {p.stock} uds.
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                        <button 
                          className="add-to-cart-btn" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.15rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
                          onClick={() => handleDeleteProduct(p.id)}
                        >
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
