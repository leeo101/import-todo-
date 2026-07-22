const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dbPath = isVercel ? path.join('/tmp', 'utiltech.db') : path.join(__dirname, '..', 'data', 'utiltech.db');
const productsJsonPath = path.join(__dirname, '..', 'data', 'products.json');
const usersJsonPath = path.join(__dirname, '..', 'data', 'users.json');
const ordersJsonPath = path.join(__dirname, '..', 'data', 'orders.json');
const settingsJsonPath = path.join(__dirname, '..', 'data', 'settings.json');

let db = null;

const getDb = async () => {
  if (db) return db;
  
  // Ensure the directory exists
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  return db;
};

const initializeDatabase = async () => {
  const database = await getDb();

  // Create tables
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      dni TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      apartment TEXT,
      zipCode TEXT NOT NULL,
      city TEXT NOT NULL,
      province TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      originalPrice REAL NOT NULL,
      category TEXT NOT NULL,
      utilityScore REAL,
      image TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      supplierUrl TEXT,
      weight TEXT,
      dimensions TEXT
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      customerName TEXT NOT NULL,
      email TEXT NOT NULL,
      dni TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      apartment TEXT,
      zipCode TEXT NOT NULL,
      city TEXT NOT NULL,
      province TEXT NOT NULL,
      itemsJson TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendiente',
      userId TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  try {
    await database.exec('ALTER TABLE products ADD COLUMN shippingCostUSD REAL DEFAULT 0.0');
    console.log('[SQLITE DB] Columna shippingCostUSD agregada con éxito.');
  } catch (err) {
    // Column already exists
  }
  try {
    await database.exec('ALTER TABLE products ADD COLUMN deliveryDays INTEGER DEFAULT 15');
    console.log('[SQLITE DB] Columna deliveryDays agregada con éxito.');
  } catch (err) {
    // Column already exists
  }

  console.log('[SQLITE DB] Tablas inicializadas correctamente.');

  // Migration logic
  await migrateFromJsonToSqlite(database);

  // Reclassify old category names into new general catalog category labels
  try {
    await database.exec(`
      UPDATE products SET category = 'Tecnología' WHERE category IN ('Smart Home', 'Gadgets', 'Accesorios');
      UPDATE products SET category = 'Hogar y Bazar' WHERE category = 'Hogar & Cocina';
      UPDATE products SET category = 'Vestimenta' WHERE category = 'Indumentaria';
    `);
    console.log('[SQLITE DB] Categorías de productos actualizadas al nuevo catálogo generalista.');
  } catch (err) {
    console.error('[SQLITE DB ERROR] Fallo al reclasificar categorías:', err.message);
  }
};

const migrateFromJsonToSqlite = async (database) => {
  // 1. Migrate Settings
  const settingsCount = await database.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0 && fs.existsSync(settingsJsonPath)) {
    try {
      const settingsData = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf8'));
      if (settingsData && settingsData.marginPercentage !== undefined) {
        await database.run('INSERT INTO settings (key, value) VALUES (?, ?)', 'marginPercentage', settingsData.marginPercentage.toString());
        console.log('[MIGRATION] Configuración de margen migrada.');
      }
    } catch (e) {
      console.error('[MIGRATION ERROR] Error migrando settings:', e);
    }
  }

  // 2. Migrate Users
  const usersCount = await database.get('SELECT COUNT(*) as count FROM users');
  if (usersCount.count === 0 && fs.existsSync(usersJsonPath)) {
    try {
      const usersData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));
      if (Array.isArray(usersData)) {
        for (const user of usersData) {
          await database.run(
            `INSERT OR IGNORE INTO users (id, name, email, password, dni, phone, address, apartment, zipCode, city, province) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            user.id, user.name, user.email, user.password, user.dni, user.phone, user.address, user.apartment || '', user.zipCode, user.city, user.province
          );
        }
        console.log(`[MIGRATION] ${usersData.length} usuarios migrados.`);
      }
    } catch (e) {
      console.error('[MIGRATION ERROR] Error migrando usuarios:', e);
    }
  }

  // 3. Migrate Products
  const productsCount = await database.get('SELECT COUNT(*) as count FROM products');
  if (productsCount.count === 0 && fs.existsSync(productsJsonPath)) {
    try {
      const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
      if (Array.isArray(productsData)) {
        for (const p of productsData) {
          await database.run(
            `INSERT OR IGNORE INTO products (id, title, description, originalPrice, category, utilityScore, image, stock, supplierUrl, weight, dimensions) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            p.id, p.title, p.description || '', p.originalPrice, p.category, p.utilityScore || 8.0, p.image, p.stock || 0, p.supplierUrl || '', p.weight || '350 g', p.dimensions || '15 x 10 x 5 cm'
          );

          // Seed product_images table with p.images gallery if it exists
          const imagesList = p.images && Array.isArray(p.images) ? p.images : [p.image];
          for (const imgUrl of imagesList) {
            await database.run(
              'INSERT INTO product_images (productId, imageUrl) VALUES (?, ?)',
              p.id, imgUrl
            );
          }
        }
        console.log(`[MIGRATION] ${productsData.length} productos migrados.`);
      }
    } catch (e) {
      console.error('[MIGRATION ERROR] Error migrando productos:', e);
    }
  }

  // 4. Migrate Orders
  const ordersCount = await database.get('SELECT COUNT(*) as count FROM orders');
  if (ordersCount.count === 0 && fs.existsSync(ordersJsonPath)) {
    try {
      const ordersData = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
      if (Array.isArray(ordersData)) {
        for (const o of ordersData) {
          const itemsJson = JSON.stringify(o.items || []);
          await database.run(
            `INSERT OR IGNORE INTO orders (id, date, customerName, email, dni, phone, address, apartment, zipCode, city, province, itemsJson, total, status, userId) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            o.id, o.date, o.customerName, o.email, o.dni, o.phone, o.address, o.apartment || '', o.zipCode, o.city, o.province, itemsJson, o.total, o.status || 'Pendiente', o.userId || null
          );
        }
        console.log(`[MIGRATION] ${ordersData.length} pedidos migrados.`);
      }
    } catch (e) {
      console.error('[MIGRATION ERROR] Error migrando pedidos:', e);
    }
  }
};

module.exports = {
  getDb,
  initializeDatabase
};
