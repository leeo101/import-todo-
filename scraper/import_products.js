const http = require('http');

const API_URL = "http://localhost:5000/api/products";

// High utility cheap gadgets database (Same as python scraper)
const DEALS_DATABASE = [
  {
    "id": "scrape_1",
    "title": "Cargador Inalámbrico Rápido Qi 15W",
    "description": "Base de carga inalámbrica ultra delgada con control de temperatura. Compatible con iPhone, Samsung y Xiaomi.",
    "originalPrice": 4.10,
    "category": "Accesorios",
    "utilityScore": 9.1,
    "image": "/images/wireless_charger.svg",
    "stock": 100,
    "link": "https://es.aliexpress.com/item/wireless-charger"
  },
  {
    "id": "scrape_2",
    "title": "Adaptador Bluetooth USB 5.3 para PC",
    "description": "Mini receptor y transmisor Bluetooth para conectar auriculares, controles y teclados inalámbricos a la computadora.",
    "originalPrice": 1.80,
    "category": "Accesorios",
    "utilityScore": 8.9,
    "image": "/images/bluetooth_dongle.svg",
    "stock": 250,
    "link": "https://es.aliexpress.com/item/bluetooth-dongle"
  },
  {
    "id": "scrape_3",
    "title": "Aspiradora de Mano Recargable USB para Auto/Teclado",
    "description": "Mini aspiradora portátil de alta succión. Ideal para limpiar el interior del auto, teclado de PC y rincones difíciles.",
    "originalPrice": 8.50,
    "category": "Gadgets",
    "utilityScore": 9.4,
    "image": "/images/mini_vacuum.svg",
    "stock": 40,
    "link": "https://es.aliexpress.com/item/mini-vacuum"
  },
  {
    "id": "scrape_4",
    "title": "Enchufe Inteligente Wifi Smart Home",
    "description": "Controla tus electrodomésticos desde el celular mediante app. Compatible con Alexa y Google Home. Programable.",
    "originalPrice": 6.20,
    "category": "Smart Home",
    "utilityScore": 9.6,
    "image": "/images/smart_plug.svg",
    "stock": 70,
    "link": "https://es.aliexpress.com/item/smart-plug"
  },
  {
    "id": "scrape_5",
    "title": "Lápiz Óptico Capacitivo Universal",
    "description": "Lápiz táctil de alta precisión compatible con iPads, tablets Android y smartphones. Punta fina de precisión.",
    "originalPrice": 3.40,
    "category": "Gadgets",
    "utilityScore": 8.6,
    "image": "/images/stylus.svg",
    "stock": 110,
    "link": "https://es.aliexpress.com/item/stylus"
  },
  {
    "id": "scrape_6",
    "title": "Soporte de Celular Regulable para Escritorio",
    "description": "Soporte de aluminio plegable y antideslizante para teléfonos y tablets. Ajuste multiángulo para videollamadas.",
    "originalPrice": 1.99,
    "category": "Accesorios",
    "utilityScore": 8.7,
    "image": "/images/phone_stand.svg",
    "stock": 300,
    "link": "https://es.aliexpress.com/item/phone-stand"
  }
];

function postProduct(product) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(product);
    
    const req = http.request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`[SUCCESS] Guardado: ${product.title} | Precio Original: $${product.originalPrice.toFixed(2)}`);
          resolve(true);
        } else {
          console.error(`[ERROR] Server returned status ${res.statusCode} for ${product.title}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[ERROR] Conexión fallida para ${product.title}: ${e.message}`);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function runImporter() {
  console.log("=".repeat(60));
  console.log("        UTILTECH JS IMPORTER (FALLBACK SCRAPER)");
  console.log("=".repeat(60));
  console.log("Enviando gadgets a la API de Node.js...");
  
  let successCount = 0;
  for (const product of DEALS_DATABASE) {
    const ok = await postProduct(product);
    if (ok) successCount++;
    await new Promise(r => setTimeout(r, 200)); // sleep 200ms
  }
  
  console.log("=".repeat(60));
  console.log(`PROCESO FINALIZADO. Importados con éxito: ${successCount}/${DEALS_DATABASE.length}`);
  console.log("=".repeat(60));
}

runImporter();
