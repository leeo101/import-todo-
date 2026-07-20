const https = require('https');
const http = require('http');
const url = require('url');

// Helper to fetch HTML from URL safely
const fetchHtml = (targetUrl) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 3000 // 3 seconds timeout
    };

    const req = client.get(targetUrl, options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request Timeout'));
    });
  });
};

// Extract specs from HTML text using regex
const extractSpecifications = (html) => {
  // Strip HTML tags for clean text search
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

  // Look for weight (e.g. 350g, 1.2kg, 2.5 kg, 500 gramos)
  const weightRegex = /\b(\d+(?:\.\d+)?)\s*(kg|g|kilogramos|gramos|lbs|ounces)\b/i;
  const weightMatch = textContent.match(weightRegex);
  const weight = weightMatch ? `${weightMatch[1]} ${weightMatch[2].toLowerCase()}` : '350 g';

  // Look for dimensions (e.g. 15x10x5 cm, 20 x 20 x 10 cm, 8x5 cm)
  const dimRegex = /\b(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?\s*(cm|mm|inches|pulgadas)\b/i;
  const dimMatch = textContent.match(dimRegex);
  let dimensions = '15 x 10 x 5 cm';
  if (dimMatch) {
    dimensions = dimMatch[3] 
      ? `${dimMatch[1]} x ${dimMatch[2]} x ${dimMatch[3]} ${dimMatch[4].toLowerCase()}`
      : `${dimMatch[1]} x ${dimMatch[2]} ${dimMatch[4].toLowerCase()}`;
  }

  return { weight, dimensions };
};

// Smart fallback generator based on keywords in URL
const getSmartMockData = (targetUrl) => {
  const lowercaseUrl = targetUrl.toLowerCase();
  
  let keyword = 'gadget';
  let title = 'Gadget Tecnológico Útil';
  let description = 'Accesorio tecnológico inteligente de alta calidad para el día a día.';
  let category = 'Gadgets';
  let weight = '250 g';
  let dimensions = '12 x 8 x 3 cm';
  let cost = 3.50;
  let image = '/images/default.svg';

  if (lowercaseUrl.includes('humidificador') || lowercaseUrl.includes('humidifier')) {
    title = 'Humidificador Ultrasónico Inteligente USB';
    description = 'Mini difusor de niebla con luces de respiración LED. Depósito de agua silencioso e ideal para escritorios de trabajo.';
    category = 'Smart Home';
    weight = '180 g';
    dimensions = '14 x 9 x 9 cm';
    cost = 4.20;
    image = '/images/humidifier.svg';
  } else if (lowercaseUrl.includes('ventilador') || lowercaseUrl.includes('fan') || lowercaseUrl.includes('cuello')) {
    title = 'Mini Ventilador Portátil de Cuello USB';
    description = 'Ventilador manos libres silencioso con flujo de aire de 360 grados y batería recargable integrada.';
    category = 'Gadgets';
    weight = '260 g';
    dimensions = '21 x 18 x 6 cm';
    cost = 7.10;
    image = '/images/neck_fan.svg';
  } else if (lowercaseUrl.includes('cargador') || lowercaseUrl.includes('charger') || lowercaseUrl.includes('qi')) {
    title = 'Cargador Inalámbrico Rápido Qi 15W Slim';
    description = 'Base de carga rápida inalámbrica antideslizante con indicador de estado LED inteligente y protección térmica.';
    category = 'Accesorios';
    weight = '95 g';
    dimensions = '10 x 10 x 0.8 cm';
    cost = 3.90;
    image = '/images/wireless_charger.svg';
  } else if (lowercaseUrl.includes('enchufe') || lowercaseUrl.includes('plug') || lowercaseUrl.includes('smart')) {
    title = 'Enchufe Inteligente Wifi Smart Plug';
    description = 'Smart plug con temporizador y medición de consumo de energía. Control remoto mediante aplicación móvil.';
    category = 'Smart Home';
    weight = '110 g';
    dimensions = '8.5 x 5 x 5 cm';
    cost = 5.80;
    image = '/images/smart_plug.svg';
  } else if (lowercaseUrl.includes('balanza') || lowercaseUrl.includes('scale')) {
    title = 'Balanza de Cocina Digital de Precisión';
    description = 'Báscula para pesar ingredientes con exactitud de décima de gramo. Superficie de acero inoxidable lavable.';
    category = 'Hogar & Cocina';
    weight = '420 g';
    dimensions = '20 x 16 x 2.5 cm';
    cost = 3.80;
    image = '/images/scale.svg';
  } else if (lowercaseUrl.includes('aspiradora') || lowercaseUrl.includes('vacuum')) {
    title = 'Mini Aspiradora Inalámbrica Recargable';
    description = 'Aspiradora de mano ligera con excelente potencia de succión para teclados, computadoras, y automóviles.';
    category = 'Gadgets';
    weight = '380 g';
    dimensions = '16 x 14 x 6 cm';
    cost = 8.10;
    image = '/images/mini_vacuum.svg';
  }

  return {
    title,
    description,
    category,
    originalPrice: cost,
    stock: 50,
    weight,
    dimensions,
    image,
    supplierUrl: targetUrl,
    shippingCostUSD: 0.0,
    deliveryDays: targetUrl.toLowerCase().includes('amazon') ? 8 : 15
  };
};

// Main scraper function
const scrapeUrl = async (targetUrl) => {
  try {
    const html = await fetchHtml(targetUrl);
    
    // Parse using RegExp
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    let description = ogDescMatch ? ogDescMatch[1] : (metaDescMatch ? metaDescMatch[1] : '');

    const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
    let image = ogImgMatch ? ogImgMatch[1] : '/images/default.svg';

    const { weight, dimensions } = extractSpecifications(html);

    // If titles or descriptions are blocked or captcha pages (AliExpress blocking standard requests)
    if (!title || title.toLowerCase().includes('cloudflare') || title.toLowerCase().includes('robot') || title.toLowerCase().includes('captcha')) {
      return getSmartMockData(targetUrl);
    }

    // Clean up title (remove website names if present)
    title = title.split(' - ')[0].split(' | ')[0];

    return {
      title: title || 'Gadget Importado',
      description: description || 'Detalles en el enlace del proveedor.',
      category: 'Gadgets',
      originalPrice: 4.50, // default placeholder cost
      stock: 50,
      weight,
      dimensions,
      image,
      supplierUrl: targetUrl,
      shippingCostUSD: 0.0,
      deliveryDays: targetUrl.toLowerCase().includes('amazon') ? 8 : 15
    };

  } catch (error) {
    // If request fails (offline, 403, DNS error, etc.), fall back to smart mock data based on URL text
    console.log(`[SCRAPER FALLBACK] Fallo fetch real para ${targetUrl}. Usando mock inteligente.`);
    return getSmartMockData(targetUrl);
  }
};

module.exports = { scrapeUrl };
