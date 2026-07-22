const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const https = require('https');
require('dotenv').config();

const { scrapeUrl } = require('./utils/scraperHelper');
const { searchAllSuppliers, detectCategory, fetchMeliItemDetails, rapidApiGetJSON } = require('./utils/supplierConnector');
const { initializeDatabase, getDb } = require('./db/database');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Helmet security headers & CORS
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Rate Limiting for Authentication Endpoints (prevents brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth attempts per 15 minutes
  message: { error: 'Demasiados intentos de autenticación. Por favor reintenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth/', authLimiter);

// Log API Key Setup States
const stripeSet = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_secret_key');
const amazonSet = process.env.AMAZON_ASSOCIATE_TAG && !process.env.AMAZON_ASSOCIATE_TAG.includes('your_amazon');
const alibabaSet = (process.env.ALIBABA_API_KEY && !process.env.ALIBABA_API_KEY.includes('your_alibaba')) || (process.env.ALIEXPRESS_API_KEY && !process.env.ALIEXPRESS_API_KEY.includes('your_aliexpress'));
const mercadopagoSet = process.env.MERCADOPAGO_ACCESS_TOKEN && !process.env.MERCADOPAGO_ACCESS_TOKEN.includes('your_token');

const banggoodSet = process.env.BANGGOOD_APP_KEY && !process.env.BANGGOOD_APP_KEY.includes('tu_clave');

console.log("=================================================");
console.log("           IMPORTTODO BACKEND BOOTLOG            ");
console.log("=================================================");
console.log(`Motor de Base de Datos:      SQLITE (utiltech.db activo)`);
console.log(`Pasarela de Mercado Pago:    ${mercadopagoSet ? 'CONECTADO (Sandbox/Producción real)' : 'MODO SIMULACIÓN (Sandbox predeterminado)'}`);
console.log(`Pasarela de Pago (Stripe):   ${stripeSet ? 'CONECTADO (Producción/Pruebas real)' : 'MODO SIMULACIÓN (Sandbox)'}`);
console.log(`Amazon Affiliate Engine:     ${amazonSet ? 'ACTIVO' : 'MODO SIMULACIÓN'}`);
console.log(`AliExpress API Oficial:      ${alibabaSet ? 'CONECTADO (AppKey 540142)' : 'MODO SIMULACIÓN'}`);
console.log(`Banggood API Oficial:        ${banggoodSet ? 'CONECTADO (AppKey aff6a5e6558c57b)' : 'MODO SIMULACIÓN'}`);
console.log("=================================================");

// Free translation utility using Google Translate's public API endpoint
const translateText = (text, fromLang = 'en', toLang = 'es') => {
  return new Promise((resolve) => {
    if (!text || text.trim() === '') return resolve('');
    
    const targetUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    https.get(targetUrl, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed && parsed[0]) {
            const translated = parsed[0].map(item => item[0]).join('');
            resolve(translated);
          } else {
            resolve(text);
          }
        } catch (e) {
          console.warn('[TRANSLATOR ERROR] Failed to parse translation:', e.message);
          resolve(text);
        }
      });
    }).on('error', err => {
      console.warn('[TRANSLATOR ERROR] Network error:', err.message);
      resolve(text);
    });
  });
};

// Fetch live USD to ARS exchange rate from Dolar API (using Dolar Tarjeta for import rates)
const fetchDollarRate = () => {
  return new Promise((resolve) => {
    https.get('https://dolarapi.com/v1/dolares/tarjeta', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed && parsed.venta) {
            const rate = parseFloat(parsed.venta);
            if (!isNaN(rate) && rate > 0) {
              console.log(`[DOLAR API] Cotización del dólar tarjeta obtenida: $${rate} ARS`);
              return resolve(rate);
            }
          }
          console.warn('[DOLAR API WARNING] Respuesta vacía o inválida de Dolar API. Usando resguardo.');
          resolve(1450);
        } catch (e) {
          console.warn('[DOLAR API WARNING] Error al parsear JSON de Dolar API. Usando resguardo:', e.message);
          resolve(1450);
        }
      });
    }).on('error', err => {
      console.warn('[DOLAR API WARNING] Error de red al consultar Dolar API. Usando resguardo:', err.message);
      resolve(1450);
    });
  });
};

// Helper to hash passwords using SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// --- AUTH ENDPOINTS (SQLITE) ---

// 1. POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, dni, phone, address, apartment, zipCode, city, province } = req.body;

  if (!name || !email || !password || !dni || !phone || !address || !zipCode || !city || !province) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para el registro (DNI, Teléfono y Datos de Envío completos son requeridos).' });
  }

  // Security checks
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener letras y números.' });
  }

  // DNI and Phone validation
  if (!/^\d+$/.test(dni.trim())) {
    return res.status(400).json({ error: 'El DNI debe contener solo números.' });
  }
  if (!/^\+?\d{8,15}$/.test(phone.trim())) {
    return res.status(400).json({ error: 'El teléfono ingresado es inválido (debe tener entre 8 y 15 dígitos).' });
  }

  try {
    const db = await getDb();
    
    // Check unique email & DNI
    const emailExists = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const dniExists = await db.get('SELECT * FROM users WHERE dni = ?', dni.trim());
    if (dniExists) {
      return res.status(400).json({ error: 'El DNI ingresado ya pertenece a una cuenta registrada.' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      dni: dni.trim(),
      phone: phone.trim(),
      address,
      apartment: apartment || '',
      zipCode: zipCode.trim(),
      city,
      province
    };

    await db.run(
      `INSERT INTO users (id, name, email, password, dni, phone, address, apartment, zipCode, city, province) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      newUser.id, newUser.name, newUser.email, newUser.password, newUser.dni, newUser.phone, newUser.address, newUser.apartment, newUser.zipCode, newUser.city, newUser.province
    );

    const isAdmin = newUser.email.toLowerCase() === 'enzorodriguez31@gmail.com';
    const userPayload = { ...userResponse, role: isAdmin ? 'admin' : 'user', isAdmin };

    res.status(201).json({ message: 'User registered successfully', user: userPayload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user in SQLite database.' });
  }
});

// 2. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const db = await getDb();
    const hashedPassword = hashPassword(password);
    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', email.toLowerCase(), hashedPassword);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const { password: _, ...userResponse } = user;
    const isAdmin = user.email.toLowerCase() === 'enzorodriguez31@gmail.com' || user.role === 'admin';
    const userPayload = { ...userResponse, role: isAdmin ? 'admin' : 'user', isAdmin };

    res.json({ message: 'Login successful', user: userPayload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server database error during login.' });
  }
});

// --- SCRAPE LINK ENDPOINT ---
app.post('/api/scrape-link', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Se requiere la URL del producto.' });
  }
  console.log(`[AUTO-SCRAPE REQUEST] Extrayendo datos de: ${url}`);
  try {
    const scrapedData = await scrapeUrl(url);
    
    // Auto-translate description and title to Spanish if URL is from AliExpress or Amazon
    const isAliOrAmz = url.includes('aliexpress') || url.includes('amazon');
    if (isAliOrAmz && scrapedData) {
      console.log(`[TRANSLATOR] Traduciendo datos extraídos del enlace al español...`);
      const [transTitle, transDesc] = await Promise.all([
        translateText(scrapedData.title),
        translateText(scrapedData.description)
      ]);
      scrapedData.title = transTitle;
      scrapedData.description = transDesc;
      console.log('[TRANSLATOR] Traducción de enlace finalizada.');
    }
    
    res.json(scrapedData);
  } catch (error) {
    console.error('Error in scrape-link:', error);
    res.status(500).json({ error: 'Fallo al extraer o traducir el enlace.' });
  }
});

// --- SUPPLIERS SEARCH ENDPOINT ---
app.get('/api/suppliers/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Se requiere el parámetro de búsqueda q.' });
  }

  try {
    const results = await searchAllSuppliers(q, { alibabaSet, amazonSet });
    res.json(results);
  } catch (error) {
    console.error('Error fetching suppliers search:', error);
    res.status(500).json({ error: 'Error al buscar en los catálogos de proveedores.' });
  }
});

// --- STORE API ENDPOINTS (SQLITE) ---

// 4. GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const db = await getDb();
    const marginRow = await db.get('SELECT value FROM settings WHERE key = ?', 'marginPercentage');
    const margin = marginRow ? parseFloat(marginRow.value) : 40;

    const rateRow = await db.get('SELECT value FROM settings WHERE key = ?', 'usdToArsRate');
    const rate = rateRow ? parseFloat(rateRow.value) : 1450;

    const products = await db.all('SELECT * FROM products');
    
    // Fetch image gallery for each product
    const formattedProducts = [];
    for (const p of products) {
      const imgRows = await db.all('SELECT imageUrl FROM product_images WHERE productId = ?', p.id);
      const images = imgRows.map(r => r.imageUrl);
      
      const originalPrice = parseFloat(p.originalPrice) || 0;
      const shippingUSD = parseFloat(p.shippingCostUSD) || 0;
      
      // Calculate sale price in ARS (incorporating shipping cost in base before markup)
      const salePrice = Number(((originalPrice + shippingUSD) * (1 + margin / 100) * rate).toFixed(2));
      const shippingARS = Number((shippingUSD * (1 + margin / 100) * rate).toFixed(2));
      
      formattedProducts.push({
        ...p,
        images: images.length > 0 ? images : [p.image],
        salePrice,
        shippingCostARS: shippingARS,
        marginPercentage: margin,
        usdToArsRate: rate
      });
    }

    res.json(formattedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch catalog from database.' });
  }
});

// 5. POST /api/products - Seeded to SQLite tables
app.post('/api/products', async (req, res) => {
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.originalPrice) {
    return res.status(400).json({ error: 'Title and originalPrice are required' });
  }

  try {
    const db = await getDb();
    
    const productId = newProduct.id || `prod_${Date.now()}`;
    let productData = {
      id: productId,
      title: newProduct.title,
      description: newProduct.description || 'Sin descripción',
      originalPrice: parseFloat(newProduct.originalPrice),
      category: newProduct.category || detectCategory(newProduct.title),
      utilityScore: parseFloat(newProduct.utilityScore) || 8.0,
      image: newProduct.image || '/images/default.svg',
      images: newProduct.images || [newProduct.image || '/images/default.svg'],
      stock: parseInt(newProduct.stock) || 50,
      supplierUrl: newProduct.supplierUrl || 'https://es.aliexpress.com/',
      weight: newProduct.weight || '350 g',
      dimensions: newProduct.dimensions || '15 x 10 x 5 cm',
      shippingCostUSD: parseFloat(newProduct.shippingCostUSD) || 0.0,
      deliveryDays: parseInt(newProduct.deliveryDays) || 15
    };

    // Translate Title and Description to Spanish if from AliExpress or Amazon
    const isAliOrAmz = productId.startsWith('ali_') || productId.startsWith('amz_') || 
                       (productData.supplierUrl && (productData.supplierUrl.includes('aliexpress') || productData.supplierUrl.includes('amazon')));
    if (isAliOrAmz) {
      try {
        console.log(`[TRANSLATOR] Traduciendo producto al español: ${productData.title.substring(0, 45)}...`);
        const [transTitle, transDesc] = await Promise.all([
          translateText(productData.title),
          translateText(productData.description)
        ]);
        productData.title = transTitle;
        productData.description = transDesc;
        console.log('[TRANSLATOR] Traducción finalizada.');
      } catch (transErr) {
        console.warn('[TRANSLATOR WARNING] Falló la traducción, guardando textos originales:', transErr.message);
      }
    }

    // If this is a real Mercado Libre product, pull full details in real-time
    if (productId.startsWith('ml_') && !productId.includes('mock')) {
      const fullDetails = await fetchMeliItemDetails(productId);
      if (fullDetails) {
        productData = {
          ...productData,
          title: fullDetails.title,
          description: fullDetails.description,
          originalPrice: fullDetails.originalPrice,
          image: fullDetails.image,
          images: fullDetails.images,
          weight: fullDetails.weight,
          dimensions: fullDetails.dimensions,
          category: fullDetails.category,
          shippingCostUSD: fullDetails.shippingCostUSD !== undefined ? fullDetails.shippingCostUSD : productData.shippingCostUSD,
          deliveryDays: fullDetails.deliveryDays !== undefined ? fullDetails.deliveryDays : productData.deliveryDays
        };
      }
    }

    // Save product to SQLite
    const existing = await db.get('SELECT id FROM products WHERE id = ? OR LOWER(title) = ?', productData.id, productData.title.toLowerCase());
    
    if (existing) {
      await db.run(
        `UPDATE products SET title = ?, description = ?, originalPrice = ?, category = ?, utilityScore = ?, image = ?, stock = ?, supplierUrl = ?, weight = ?, dimensions = ?, shippingCostUSD = ?, deliveryDays = ? WHERE id = ?`,
        productData.title, productData.description, productData.originalPrice, productData.category, productData.utilityScore, productData.image, productData.stock, productData.supplierUrl, productData.weight, productData.dimensions, productData.shippingCostUSD, productData.deliveryDays, existing.id
      );
      // Re-seed gallery
      await db.run('DELETE FROM product_images WHERE productId = ?', existing.id);
      for (const imgUrl of productData.images) {
        await db.run('INSERT INTO product_images (productId, imageUrl) VALUES (?, ?)', existing.id, imgUrl);
      }
    } else {
      await db.run(
        `INSERT INTO products (id, title, description, originalPrice, category, utilityScore, image, stock, supplierUrl, weight, dimensions, shippingCostUSD, deliveryDays) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        productData.id, productData.title, productData.description, productData.originalPrice, productData.category, productData.utilityScore, productData.image, productData.stock, productData.supplierUrl, productData.weight, productData.dimensions, productData.shippingCostUSD, productData.deliveryDays
      );
      for (const imgUrl of productData.images) {
        await db.run('INSERT INTO product_images (productId, imageUrl) VALUES (?, ?)', productData.id, imgUrl);
      }
    }

    res.status(201).json({ message: 'Product saved successfully in SQLite database', product: productData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save product to SQL database.' });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const existing = await db.get('SELECT id FROM products WHERE id = ?', id);
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await db.run('DELETE FROM products WHERE id = ?', id);
    await db.run('DELETE FROM product_images WHERE productId = ?', id);
    res.json({ message: 'Producto eliminado exitosamente', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// 6. GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    const db = await getDb();
    const marginRow = await db.get('SELECT value FROM settings WHERE key = ?', 'marginPercentage');
    const rateRow = await db.get('SELECT value FROM settings WHERE key = ?', 'usdToArsRate');
    
    res.json({
      marginPercentage: marginRow ? parseFloat(marginRow.value) : 40,
      usdToArsRate: rateRow ? parseFloat(rateRow.value) : 1450
    });
  } catch (err) {
    res.status(500).json({ error: 'DB Settings load failed.' });
  }
});

// 7. POST /api/settings
app.post('/api/settings', async (req, res) => {
  const { marginPercentage, usdToArsRate } = req.body;
  if (marginPercentage === undefined && usdToArsRate === undefined) {
    return res.status(400).json({ error: 'At least marginPercentage or usdToArsRate must be provided' });
  }

  try {
    const db = await getDb();
    const updatedSettings = {};

    if (marginPercentage !== undefined && !isNaN(marginPercentage)) {
      await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', 'marginPercentage', marginPercentage.toString());
      updatedSettings.marginPercentage = parseFloat(marginPercentage);
    }

    if (usdToArsRate !== undefined && !isNaN(usdToArsRate)) {
      await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', 'usdToArsRate', usdToArsRate.toString());
      updatedSettings.usdToArsRate = parseFloat(usdToArsRate);
    }

    res.json({ message: 'Settings updated successfully', settings: updatedSettings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write settings to database.' });
  }
});

// 8. GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders ORDER BY date DESC');
    const formattedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.itemsJson)
    }));
    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// 9. GET /api/orders/user/:userId
app.get('/api/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY date DESC', userId);
    const formattedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.itemsJson)
    }));
    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user orders.' });
  }
});

// 10. POST /api/orders/mercadopago-preference - Official sandbox pref creator
app.post('/api/orders/mercadopago-preference', async (req, res) => {
  const { customerName, email, dni, phone, address, apartment, zipCode, city, province, items, total, userId } = req.body;

  if (!customerName || !email || !dni || !phone || !address || !zipCode || !city || !province || !items || !items.length) {
    return res.status(400).json({ error: 'Faltan datos de envío o información del DNI/Teléfono.' });
  }

  try {
    const db = await getDb();
    
    // Verify stocks
    for (const orderItem of items) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', orderItem.id);
      if (!product) {
        return res.status(400).json({ error: `Producto ${orderItem.title} no encontrado en el catálogo.` });
      }
      if (product.stock < orderItem.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para: ${product.title}. Stock disponible: ${product.stock}` });
      }
    }

    const orderId = `ord_${Date.now()}`;
    const itemsJson = JSON.stringify(items);

    // Save order in db with status 'Pendiente de Pago'
    await db.run(
      `INSERT INTO orders (id, date, customerName, email, dni, phone, address, apartment, zipCode, city, province, itemsJson, total, status, userId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      orderId, new Date().toISOString(), customerName, email, dni.trim(), phone.trim(), address, apartment || '', zipCode.trim(), city, province, itemsJson, parseFloat(total), 'Pendiente de Pago', userId || null
    );

    // Create Preference Link in Mercado Pago Sandbox
    const mPToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-8276709778278783-041215-5645d94348fe05d6cb46d5c64364234c-123456';
    let initPointUrl = `http://localhost:5173/?payment=success&orderId=${orderId}`; // fallback redirect

    try {
      const client = new MercadoPagoConfig({ accessToken: mPToken });
      const preference = new Preference(client);

      const preferenceItems = items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.salePrice),
        currency_id: 'ARS'
      }));

      const body = {
        items: preferenceItems,
        back_urls: {
          success: `http://localhost:5173/?payment=success&orderId=${orderId}`,
          failure: `http://localhost:5173/?payment=failure&orderId=${orderId}`,
          pending: `http://localhost:5173/?payment=pending&orderId=${orderId}`
        },
        auto_return: 'approved',
        external_reference: orderId
      };

      const result = await preference.create({ body });
      if (result && result.init_point) {
        initPointUrl = result.init_point;
      }
    } catch (mpErr) {
      console.warn('[MERCADO PAGO WARNING] Usando pasarela simulada de test. Detalles:', mpErr.message);
    }

    res.json({
      orderId,
      init_point: initPointUrl
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    res.status(500).json({ error: 'Fallo al procesar el pedido con Mercado Pago.' });
  }
});

// 11. POST /api/orders/confirm-payment - Binds approved checkout to order status and stock deduction
app.post('/api/orders/confirm-payment', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  try {
    const db = await getDb();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only approve if pending payment (this handles idempotency safely!)
    if (order.status === 'Pendiente de Pago') {
      await db.run("UPDATE orders SET status = 'Pendiente' WHERE id = ?", orderId);
      
      // Deduct product stock
      const items = JSON.parse(order.itemsJson);
      for (const item of items) {
        await db.run('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', item.quantity, item.id);
      }
      console.log(`[PAYMENT CONFIRMED] Pedido ${orderId} pagado con éxito. Listo para despachar.`);
    }

    res.json({ message: 'Payment confirmed successfully', orderId });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Webhook endpoint to capture remote notification callbacks from Mercado Pago
app.post('/api/payments/webhook', async (req, res) => {
  const { action, data } = req.body;
  console.log(`[MP WEBHOOK NOTIFICATION] Evento recibido: action=${action}`);
  
  if (action === 'payment.created' || action === 'payment.updated') {
    // Process asynchronous validation later. We respond 200 OK immediately to satisfy callback limits.
  }
  res.sendStatus(200);
});

// Function to synchronize all catalog // Helper to sync supplier catalog prices, stock, titles and descriptions in live database
const syncSupplierCatalog = async () => {
  console.log('[CATALOG SYNC] Iniciando sincronización de precios, datos y stocks con proveedores...');
  let updatedCount = 0;
  
  try {
    const db = await getDb();
    
    // 1. Update live Dollar exchange rate
    console.log('[CATALOG SYNC] Actualizando tipo de cambio del dólar en vivo...');
    try {
      const rate = await fetchDollarRate();
      await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', 'usdToArsRate', rate.toString());
    } catch (e) {
      console.warn('[CATALOG SYNC WARNING] No se pudo actualizar la cotización del dólar:', e.message);
    }

    const products = await db.all('SELECT * FROM products');
    const settings = await db.get('SELECT value FROM settings WHERE key = ?', 'usdToArsRate');
    const usdRate = settings ? parseFloat(settings.value) : 1450;
    
    const apiKey = process.env.RAPIDAPI_KEY;
    const aliHost = 'aliexpress-datahub.p.rapidapi.com';
    const amzHost = 'real-time-amazon-data.p.rapidapi.com';

    for (const p of products) {
      let newPrice = p.originalPrice;
      let newStock = p.stock;
      let newTitle = p.title;
      let newDesc = p.description;
      let newImage = p.image;
      let newImagesJson = p.images;
      let newWeight = p.weight;
      let newDimensions = p.dimensions;
      let syncSuccess = false;

      // A. Mercado Libre Sync by ID or URL
      const meliMatch = (p.supplierUrl || p.id).match(/(MLA-?\d+|\b\d{8,12}\b)/i);
      const isMeli = (p.id && p.id.startsWith('ml_')) || (p.supplierUrl && (p.supplierUrl.includes('mercadolibre') || p.supplierUrl.includes('MLA')));

      if (isMeli && meliMatch) {
        try {
          const numbersOnly = meliMatch[1].replace(/[^0-9]/g, '');
          const targetMeliId = `MLA${numbersOnly}`;
          console.log(`[CATALOG SYNC] Verificando proveedor Mercado Libre: ${targetMeliId}`);
          
          const response = await fetchMeliItemDetails(targetMeliId);
          if (response) {
            if (response.originalPrice) newPrice = response.originalPrice;
            if (response.stock !== undefined) newStock = response.stock;
            if (response.title) newTitle = response.title;
            if (response.description) newDesc = response.description;
            if (response.images && response.images.length > 0) {
              newImagesJson = JSON.stringify(response.images);
              newImage = response.images[0];
            }
            if (response.weight) newWeight = response.weight;
            if (response.dimensions) newDimensions = response.dimensions;
            
            syncSuccess = true;
          }
        } catch (e) {
          console.warn(`[CATALOG SYNC WARNING] Error al sincronizar item ML ${p.id}:`, e.message);
        }
      }

      // B. AliExpress Sync by API ID
      else if (p.id.startsWith('ali_') && !p.id.includes('gen') && apiKey && !apiKey.includes('tu_clave_de_rapidapi')) {
        try {
          const cleanId = p.id.replace('ali_', '');
          const targetUrl = `https://${aliHost}/item_detail?itemId=${cleanId}`;
          const data = await rapidApiGetJSON(targetUrl, aliHost, apiKey);
          
          const item = data.result || data.data || data;
          if (item) {
            if (item.price) {
              const pStr = typeof item.price === 'object' ? (item.price.value || item.price.originalPrice) : item.price;
              const cleaned = pStr ? pStr.toString().replace(/[^0-9.]/g, '') : '';
              const val = parseFloat(cleaned);
              if (!isNaN(val) && val > 0) newPrice = val;
            }
            if (item.stock !== undefined) newStock = item.stock;
            else if (item.availableQuantity !== undefined) newStock = item.availableQuantity;
            if (item.title) newTitle = item.title;
            
            syncSuccess = true;
          }
        } catch (e) {
          console.warn(`[CATALOG SYNC WARNING] Error al sincronizar item AliExpress ${p.id}:`, e.message);
        }
      }

      // C. Amazon Sync by API ASIN
      else if (p.id.startsWith('amz_') && !p.id.includes('gen') && apiKey && !apiKey.includes('tu_clave_de_rapidapi')) {
        try {
          const cleanId = p.id.replace('amz_', '');
          const targetUrl = `https://${amzHost}/product-details?asin=${cleanId}&country=US`;
          const data = await rapidApiGetJSON(targetUrl, amzHost, apiKey);
          
          const item = data.product_details || data.data || data;
          if (item) {
            const priceStr = item.price || item.product_price;
            if (priceStr) {
              const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
              const val = parseFloat(cleaned);
              if (!isNaN(val) && val > 0) newPrice = val;
            }
            if (item.product_title) newTitle = item.product_title;
            syncSuccess = true;
          }
        } catch (e) {
          console.warn(`[CATALOG SYNC WARNING] Error al sincronizar item Amazon ${p.id}:`, e.message);
        }
      }

      // D. External Web Link Scraper fallback (AliExpress, Amazon, Alibaba, etc.)
      else if (p.supplierUrl && p.supplierUrl.startsWith('http')) {
        try {
          console.log(`[CATALOG SYNC] Re-escaneando enlace del proveedor: ${p.supplierUrl}`);
          const data = await scrapeUrl(p.supplierUrl);
          if (data) {
            if (data.originalPrice && data.originalPrice !== 4.5) newPrice = data.originalPrice;
            if (data.title && data.title !== 'Producto Importado') newTitle = data.title;
            if (data.description) newDesc = data.description;
            if (data.image && !data.image.includes('default.svg')) newImage = data.image;
            if (data.images && data.images.length > 0) newImagesJson = JSON.stringify(data.images);
            if (data.weight) newWeight = data.weight;
            if (data.dimensions) newDimensions = data.dimensions;
            syncSuccess = true;
          }
        } catch (err) {
          console.warn(`[CATALOG SYNC WARNING] Error escaneando enlace ${p.supplierUrl}:`, err.message);
        }
      }

      // If price, stock, title, description, or photos changed, update SQLite database
      const hasChanged = newPrice !== p.originalPrice || newStock !== p.stock || newTitle !== p.title || newDesc !== p.description || newImage !== p.image;
      
      if (syncSuccess || hasChanged) {
        await db.run(
          `UPDATE products SET 
            title = ?, 
            description = ?, 
            originalPrice = ?, 
            stock = ?, 
            image = ?, 
            images = ?, 
            weight = ?, 
            dimensions = ? 
           WHERE id = ?`,
          newTitle, newDesc, newPrice, newStock, newImage, newImagesJson, newWeight, newDimensions, p.id
        );
        updatedCount++;
        console.log(`[CATALOG SYNC] Producto [${newTitle}] verificado/actualizado. Costo: ${newPrice} USD, Stock: ${newStock}`);
      }
    }

    console.log(`[CATALOG SYNC SUCCESS] Sincronización finalizada. ${updatedCount} productos auditados y actualizados.`);
    return { updatedCount, totalChecked: products.length };
  } catch (error) {
    console.error('[CATALOG SYNC ERROR] Error durante la sincronización de catálogo:', error.message);
    throw error;
  }
};

// Route to manually trigger catalog price and stock synchronization from Admin panel
app.post('/api/admin/sync-catalog', async (req, res) => {
  try {
    const { updatedCount, totalChecked } = await syncSupplierCatalog();
    const db = await getDb();
    const products = await db.all('SELECT * FROM products ORDER BY id DESC');

    const formattedProducts = products.map(p => {
      let parsedImages = [];
      try {
        if (p.images) parsedImages = JSON.parse(p.images);
      } catch (e) {
        parsedImages = p.image ? [p.image] : [];
      }
      if (parsedImages.length === 0 && p.image) parsedImages = [p.image];

      return {
        ...p,
        images: parsedImages
      };
    });

    res.json({ 
      success: true, 
      message: `¡Sincronización en vivo completada! Se verificaron ${totalChecked} productos con sus proveedores y se actualizaron ${updatedCount} productos en tiempo real.`,
      products: formattedProducts
    });
  } catch (error) {
    res.status(500).json({ error: `Error de servidor durante la sincronización: ${error.message}` });
  }
});

// --- AUTOMATION SCHEDULER: COURIER TRACKER LOOPS ---
// Advances state pipeline every 90 seconds for simulated delivery trackers!
setInterval(async () => {
  try {
    const db = await getDb();
    const activeOrders = await db.all("SELECT id, status FROM orders WHERE status NOT IN ('Entregado', 'Pendiente de Pago')");
    
    const statesPipeline = [
      'Pendiente',
      'Procesado en Origen',
      'En Tránsito Internacional',
      'Llegado a Aduana',
      'En Distribución Local',
      'Entregado'
    ];

    for (const order of activeOrders) {
      const currentIndex = statesPipeline.indexOf(order.status);
      if (currentIndex > -1 && currentIndex < statesPipeline.length - 1) {
        const nextStatus = statesPipeline[currentIndex + 1];
        await db.run('UPDATE orders SET status = ? WHERE id = ?', nextStatus, order.id);
        console.log(`[LOGISTICA AUTOMATICA] Pedido ${order.id} avanzado de [${order.status}] a [${nextStatus}]`);
      }
    }
  } catch (err) {
    console.error('[LOGISTICA AUTOMATICA ERROR] Error al simular logística en segundo plano:', err.message);
  }
}, 90000); // 90 seconds loop

// Automatically sync supplier catalog price and stock levels every 12 hours
setInterval(async () => {
  try {
    await syncSupplierCatalog();
  } catch (err) {
    console.error('[AUTOMATIC CATALOG SYNC ERROR] Error during background catalog sync:', err.message);
  }
}, 43200000); // 12 hours


// --- STARTUP DB INITIALIZATION & BOOT ---
initializeDatabase().then(async () => {
  try {
    const db = await getDb();
    console.log('[DOLAR API] Consultando tipo de cambio inicial de importación...');
    const rate = await fetchDollarRate();
    await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', 'usdToArsRate', rate.toString());
    console.log(`[DOLAR API] Tipo de cambio inicial establecido en: $${rate} ARS`);
  } catch (err) {
    console.warn('[DOLAR API WARNING] Error al establecer cotización inicial, usando resguardo:', err.message);
    try {
      const db = await getDb();
      await db.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', 'usdToArsRate', '1450');
    } catch (e) {}
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ImportTodo API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
