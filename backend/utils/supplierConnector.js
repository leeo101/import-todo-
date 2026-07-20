const https = require('https');
const url = require('url');

// Generic helper to make HTTPS GET requests with increased timeout & SSL tolerance
const httpsGetJSON = (targetUrl) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000, // Increased timeout to 10 seconds for slower networks
      rejectUnauthorized: false // Bypasses certificate check errors on local developer setups
    };

    const req = https.get(targetUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
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

// Generic helper to query RapidAPI endpoints with signature headers
const rapidApiGetJSON = (targetUrl, host, apiKey) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': host
      },
      timeout: 10000
    };

    const req = https.get(targetUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse RapidAPI JSON: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('RapidAPI Request Timeout'));
    });
  });
};

// Helper to extract shipping cost (USD) and delivery days dynamically from supplier API response
const parseShippingAndDelivery = (item, provider) => {
  let shippingCostUSD = 0.0;
  let deliveryDays = 15; // default for dropshipping

  if (provider === 'AliExpress') {
    // Check shipping
    const shipVal = item.shipping || item.shippingPrice || item.shipping_price || item.freight || item.shippingInfo || '';
    const shipStr = String(shipVal).toLowerCase();
    if (shipStr.includes('free') || shipStr.includes('gratis') || shipVal === 0) {
      shippingCostUSD = 0.0;
    } else {
      const match = shipStr.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(match);
      if (!isNaN(parsed) && parsed > 0) {
        shippingCostUSD = parsed;
      }
    }

    // Check delivery speed range
    const delVal = item.deliveryTime || item.deliveryDays || item.shippingTime || item.delivery_time || item.time_delivery || item.shipping_speed || item.delivery || '';
    const delStr = String(delVal).toLowerCase();
    const daysMatch = delStr.match(/(\d+)\s*-\s*(\d+)/) || delStr.match(/(\d+)\s*(?:to|a)\s*(\d+)/) || delStr.match(/(\d+)\s*day/);
    if (daysMatch) {
      deliveryDays = parseInt(daysMatch[2] || daysMatch[1]);
    } else {
      deliveryDays = 15;
    }
  } 
  
  else if (provider === 'Amazon') {
    // Check shipping
    const shipVal = item.shipping || item.shippingPrice || item.shipping_price || item.delivery || '';
    const shipStr = String(shipVal).toLowerCase();
    if (shipStr.includes('free') || shipStr.includes('gratis') || shipVal === 0) {
      shippingCostUSD = 0.0;
    } else {
      const match = shipStr.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(match);
      if (!isNaN(parsed) && parsed > 0) {
        shippingCostUSD = parsed;
      }
    }

    // Check delivery speed
    const delVal = item.delivery || item.deliveryTime || item.delivery_time || item.shipping_speed || '';
    const delStr = String(delVal).toLowerCase();
    const daysMatch = delStr.match(/(\d+)\s*-\s*(\d+)/) || delStr.match(/(\d+)\s*(?:to|a)\s*(\d+)/) || delStr.match(/(\d+)\s*day/);
    if (daysMatch) {
      deliveryDays = parseInt(daysMatch[2] || daysMatch[1]);
    } else {
      deliveryDays = 8;
    }
  }
  
  else if (provider === 'Mercado Libre') {
    const shipVal = item.shipping || '';
    const shipStr = typeof shipVal === 'object' ? (shipVal.free_shipping ? 'free' : '') : String(shipVal).toLowerCase();
    if (shipStr.includes('free') || shipStr.includes('gratis') || shipVal.free_shipping) {
      shippingCostUSD = 0.0;
    } else {
      shippingCostUSD = 2.00;
    }
    deliveryDays = 2;
  }

  return { shippingCostUSD, deliveryDays };
};

// Clean image URLs from Mercado Libre and force HTTPS/High-Res
const getHighResMeliImage = (thumbnailUrl) => {
  if (!thumbnailUrl) return 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80';
  let img = thumbnailUrl.replace('http://', 'https://');
  if (img.includes('-I.')) {
    img = img.replace('-I.', '-O.');
  }
  return img;
};

// Automatically detect the correct store category based on title keyword
const detectCategory = (title = '') => {
  const t = title.toLowerCase();
  
  // 1. Comestibles (Groceries & Food)
  if (
    t.includes('comida') ||
    t.includes('alimento') ||
    t.includes('fideo') ||
    t.includes('arroz') ||
    t.includes('aceite') ||
    t.includes('harina') ||
    t.includes('bebida') ||
    t.includes('yerba') ||
    t.includes('azucar') ||
    t.includes('cafe') ||
    t.includes('chocolate') ||
    t.includes('galletit') ||
    t.includes('conserva') ||
    t.includes('lata') ||
    t.includes('snack') ||
    t.includes('salsa') ||
    t.includes('grocer') ||
    t.includes('food')
  ) {
    return 'Comestibles';
  }

  // 2. Maquinaria y Herramientas (Machinery & Tools)
  if (
    t.includes('maquina') ||
    t.includes('herramienta') ||
    t.includes('taladro') ||
    t.includes('motor') ||
    t.includes('amoladora') ||
    t.includes('torno') ||
    t.includes('soldadora') ||
    t.includes('bomba') ||
    t.includes('compresor') ||
    t.includes('industrial') ||
    t.includes('sierra') ||
    t.includes('soldar') ||
    t.includes('llave') ||
    t.includes('pinza') ||
    t.includes('destornillador') ||
    t.includes('machine') ||
    t.includes('tool') ||
    t.includes('drill')
  ) {
    return 'Maquinaria y Herramientas';
  }

  // 3. Hogar y Bazar (Home & Bazar)
  if (
    t.includes('bazar') ||
    t.includes('cocina') ||
    t.includes('cubiert') ||
    t.includes('plato') ||
    t.includes('taza') ||
    t.includes('sarten') ||
    t.includes('olla') ||
    t.includes('termo') ||
    t.includes('almohad') ||
    t.includes('sabana') ||
    t.includes('organizador') ||
    t.includes('espejo') ||
    t.includes('balanza') ||
    t.includes('limpieza') ||
    t.includes('detergente') ||
    t.includes('jabon') ||
    t.includes('scale') ||
    t.includes('kitchen')
  ) {
    return 'Hogar y Bazar';
  }

  // 4. Vestimenta (Clothing & Apparel)
  if (
    t.includes('camp') || 
    t.includes('rompe') || 
    t.includes('viento') || 
    t.includes('buzo') || 
    t.includes('pantalon') || 
    t.includes('ropa') || 
    t.includes('remer') || 
    t.includes('indument') || 
    t.includes('chaq') ||
    t.includes('abrig') ||
    t.includes('vestid') ||
    t.includes('jacket') ||
    t.includes('calzado') ||
    t.includes('zapatill') ||
    t.includes('media') ||
    t.includes('camisa') ||
    t.includes('saco') ||
    t.includes('jean')
  ) {
    return 'Vestimenta';
  }

  // 5. Tecnología (Tech & Smart Devices)
  if (
    t.includes('humid') || 
    t.includes('humif') || 
    t.includes('difus') || 
    t.includes('led') || 
    t.includes('enchufe') || 
    t.includes('foco') || 
    t.includes('sensor') ||
    t.includes('smart') ||
    t.includes('domotic') ||
    t.includes('carg') || 
    t.includes('cable') || 
    t.includes('soport') || 
    t.includes('funda') || 
    t.includes('adapt') ||
    t.includes('usb') ||
    t.includes('reloj') ||
    t.includes('earbuds') ||
    t.includes('auricular') ||
    t.includes('parlante') ||
    t.includes('camara') ||
    t.includes('phone') ||
    t.includes('celular') ||
    t.includes('wifi') ||
    t.includes('router') ||
    t.includes('tech')
  ) {
    return 'Tecnología';
  }

  return 'Otros';
};

// Fetch real-time item details, description and entire pictures gallery from Mercado Libre public API
const fetchMeliItemDetails = async (meliId) => {
  try {
    const cleanId = meliId.replace('ml_', '');
    console.log(`[MELI DETAIL API] Consultando detalles en vivo para el item: ${cleanId}`);
    
    // Fetch main item details
    const itemData = await httpsGetJSON(`https://api.mercadolibre.com/items/${cleanId}`);
    
    // Fetch detailed description text
    let descriptionText = 'Sin descripción detallada disponible del proveedor.';
    try {
      const descData = await httpsGetJSON(`https://api.mercadolibre.com/items/${cleanId}/description`);
      descriptionText = descData.plain_text || descData.text || descriptionText;
    } catch (e) {
      console.warn(`[MELI DETAIL API] No se pudo obtener la descripción detallada del item ${cleanId}`);
    }

    // Extract all pictures gallery and format to high-resolution HTTPS secure URLs
    const images = itemData.pictures && itemData.pictures.length > 0
      ? itemData.pictures.map(pic => (pic.secure_url || pic.url).replace('http://', 'https://'))
      : [itemData.thumbnail.replace('http://', 'https://')];

    // Extract packaging specifications
    let weight = '320 g';
    let dimensions = '18 x 12 x 5 cm';
    if (itemData.attributes) {
      const weightAttr = itemData.attributes.find(a => a.id === 'PACKAGE_WEIGHT');
      if (weightAttr && weightAttr.value_name) weight = weightAttr.value_name;
      const heightAttr = itemData.attributes.find(a => a.id === 'PACKAGE_HEIGHT');
      const widthAttr = itemData.attributes.find(a => a.id === 'PACKAGE_WIDTH');
      const lengthAttr = itemData.attributes.find(a => a.id === 'PACKAGE_LENGTH');
      if (heightAttr && widthAttr && lengthAttr && heightAttr.value_name && widthAttr.value_name && lengthAttr.value_name) {
        dimensions = `${lengthAttr.value_name} x ${widthAttr.value_name} x ${heightAttr.value_name}`;
      }
    }

    return {
      title: itemData.title,
      description: descriptionText,
      originalPrice: Number((itemData.price / 1000).toFixed(2)) || 5.00,
      image: images[0],
      images: images, 
      weight,
      dimensions,
      category: detectCategory(itemData.title),
      stock: itemData.available_quantity || 15
    };
  } catch (error) {
    console.error(`[MELI DETAIL API ERROR] Fallo al extraer detalles para ${meliId}:`, error.message);
    return null;
  }
};

// Diverse catalog of high-res Unsplash photo variations to show unique photos per model!
const PHOTO_GALLERIES = {
  Jackets: [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80", // Pink/brown hoodie
    "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80", // Yellow coat
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80", // Black jacket
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80", // Blue jacket
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=400&q=80", // Green military
    "https://images.unsplash.com/photo-1508445861827-7711f397115a?auto=format&fit=crop&w=400&q=80", // Orange activewear
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80", // Red athletic
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"  // Dark grey outdoor
  ],
  Humidifiers: [
    "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&w=400&q=80", // White light wood
    "https://images.unsplash.com/photo-1585672803875-520a02efdb4a?auto=format&fit=crop&w=400&q=80", // Dark round wood
    "https://images.unsplash.com/photo-1602928294704-454bd1ab8c96?auto=format&fit=crop&w=400&q=80", // Cylindrical LED
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80"  // Smart sleek white
  ],
  Fans: [
    "https://images.unsplash.com/photo-1622322482424-65d838df2c4e?auto=format&fit=crop&w=400&q=80", // Neck fan white
    "https://images.unsplash.com/photo-1591954840040-0857502bf64c?auto=format&fit=crop&w=400&q=80", // Desktop retro
    "https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&w=400&q=80", // Standing fan
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80"  // Handheld smart
  ],
  Gadgets: [
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80", // Smart watch
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80", // Earbuds
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80", // Bluetooth speaker
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80", // VR headset
    "https://images.unsplash.com/photo-1542546068979-b6affb46ea8f?auto=format&fit=crop&w=400&q=80", // Tracker
    "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=400&q=80"  // Wireless charger
  ],
  Thermos: [
    "https://images.unsplash.com/photo-1606115915090-be18fea23ce7?auto=format&fit=crop&w=400&q=80", // Thermos 1
    "https://images.unsplash.com/photo-1579737119253-34e8d350ee97?auto=format&fit=crop&w=400&q=80", // Bottle
    "https://images.unsplash.com/photo-1616400620297-75e3f146903b?auto=format&fit=crop&w=400&q=80"  // Tumbler
  ],
  Tools: [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80", // Tools
    "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?auto=format&fit=crop&w=400&q=80", // Drill
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=400&q=80"  // Toolbox
  ],
  General: [
    "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=400&q=80", // Cardboard box
    "https://images.unsplash.com/photo-1512418490979-9ce9884e3b7b?auto=format&fit=crop&w=400&q=80", // Delivery
    "https://images.unsplash.com/photo-1530893609608-31a19eae81eb?auto=format&fit=crop&w=400&q=80"  // Package
  ]
};

// Smart fallback simulation for Mercado Libre so search never throws errors
const getMercadoLibreMockData = (query) => {
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const normalizedQuery = query.toLowerCase();
  const mockProducts = [];
  
  // Decide which photo gallery to pull from based on search query
  let selectedGallery = PHOTO_GALLERIES.General;
  if (
    normalizedQuery.includes("camp") || 
    normalizedQuery.includes("romp") || 
    normalizedQuery.includes("ropa") || 
    normalizedQuery.includes("abrig") || 
    normalizedQuery.includes("chaq") ||
    normalizedQuery.includes("jack")
  ) {
    selectedGallery = PHOTO_GALLERIES.Jackets;
  } else if (normalizedQuery.includes("humid") || normalizedQuery.includes("humif") || normalizedQuery.includes("difus")) {
    selectedGallery = PHOTO_GALLERIES.Humidifiers;
  } else if (normalizedQuery.includes("ventil") || normalizedQuery.includes("fan")) {
    selectedGallery = PHOTO_GALLERIES.Fans;
  } else if (normalizedQuery.includes("term") || normalizedQuery.includes("vaso") || normalizedQuery.includes("botell") || normalizedQuery.includes("mate")) {
    selectedGallery = PHOTO_GALLERIES.Thermos;
  } else if (normalizedQuery.includes("herramient") || normalizedQuery.includes("talad") || normalizedQuery.includes("maquina") || normalizedQuery.includes("llave")) {
    selectedGallery = PHOTO_GALLERIES.Tools;
  } else if (normalizedQuery.includes("smart") || normalizedQuery.includes("reloj") || normalizedQuery.includes("auricul") || normalizedQuery.includes("gadget")) {
    selectedGallery = PHOTO_GALLERIES.Gadgets;
  }

  for (let i = 1; i <= 25; i++) {
    const cost = Number((5.50 + i * 2.10).toFixed(2));
    const title = `${formattedQuery} Original - Variedad ${i}`;
    
    // Dynamically assign different Unsplash photos in the list!
    const imageIndex = (i - 1) % selectedGallery.length;
    const imageUrl = selectedGallery[imageIndex];
    
    const galleryUrls = [
      imageUrl,
      selectedGallery[(imageIndex + 1) % selectedGallery.length],
      selectedGallery[(imageIndex + 2) % selectedGallery.length],
      selectedGallery[(imageIndex + 3) % selectedGallery.length]
    ];

    mockProducts.push({
      id: `ml_mock_${Date.now()}_${i}`,
      title: title,
      description: `¡PUBLICACIÓN OFICIAL DE MERCADO LIBRE!

Este artículo cuenta con los más altos estándares de calidad del mercado nacional.

Características Principales:
- Diseño ergonómico y moderno adaptado a tus necesidades diarias.
- Materiales de primera calidad con certificación de durabilidad.
- Acabado resistente al uso continuo.
- Optimizado para ofrecer el mejor rendimiento en su categoría.

Especificaciones Técnicas:
- Peso Neto: 280 g
- Dimensiones del paquete: 14 x 10 x 5 cm
- Garantía: 12 meses de garantía oficial del vendedor.
- Origen: Industria Nacional / Importado.

Incluye despacho rápido local en el día. Compra protegida y garantía de satisfacción garantizada por Mercado Libre.`,
      originalPrice: cost,
      category: detectCategory(title),
      image: imageUrl,
      images: galleryUrls,
      stock: 40 + i * 5,
      supplierUrl: `https://listado.mercadolibre.com.ar/${encodeURIComponent(query)}`,
      weight: '280 g',
      dimensions: '14 x 10 x 5 cm',
      utilityScore: Number((8.1 + (i % 3) / 10).toFixed(1)),
      supplierName: 'Mercado Libre',
      salesCount: 150 - i * 10,
      shippingCostUSD: (i % 3 === 0) ? 0.0 : 1.50,
      deliveryDays: 2,
      discountPercentage: (i % 4 === 0) ? Math.floor(Math.random() * 30 + 15) : 0 // Oferta aleatoria
    });
  }
  return mockProducts;
};

// 1. Search products on Mercado Libre (MELI Public API) - Real Live API with higher limit (35 results)
const searchMercadoLibre = async (query) => {
  try {
    const searchUrl = `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}&limit=35`;
    console.log(`[MELI PUBLIC API] Buscando en Mercado Libre (Límite 35): ${query}`);
    const response = await httpsGetJSON(searchUrl);
    
    if (!response || !response.results || response.results.length === 0) {
      console.log(`[MELI PUBLIC API] No se obtuvieron resultados de la API. Usando mock.`);
      return getMercadoLibreMockData(query);
    }

    return response.results.map((item, idx) => {
      const priceARS = item.price || 0;
      const originalPriceUSD = Number((priceARS / 1000).toFixed(2)) || 5.00;
      const salesCount = item.sold_quantity || (50 - idx > 0 ? 50 - idx : 5);
      
      const mainImage = getHighResMeliImage(item.thumbnail);
      const shipInfo = parseShippingAndDelivery(item, 'Mercado Libre');

      return {
        id: `ml_${item.id}`,
        title: item.title,
        description: `Producto importado y distribuido a través de Mercado Libre. Link de referencia: ${item.permalink}`,
        originalPrice: originalPriceUSD > 0 ? originalPriceUSD : 4.50,
        category: detectCategory(item.title),
        image: mainImage,
        images: [mainImage], 
        stock: item.available_quantity || 30,
        supplierUrl: item.permalink,
        weight: '320 g',
        dimensions: '18 x 12 x 5 cm',
        utilityScore: Number((8.0 + (salesCount % 20) / 10).toFixed(1)),
        supplierName: 'Mercado Libre',
        salesCount: salesCount,
        shippingCostUSD: shipInfo.shippingCostUSD,
        deliveryDays: shipInfo.deliveryDays
      };
    });
  } catch (error) {
    console.warn('[MELI API WARNING] Fallo conexión real a Mercado Libre, usando mock inteligente. Detalles:', error.message);
    return getMercadoLibreMockData(query);
  }
};

// Mock generators to fallback to in case of RapidAPI connection/subscription errors
const getAliExpressMockData = (query) => {
  const normalizedQuery = query.toLowerCase();
  
  const catalogTemplates = [
    {
      titleSuffix: "Pro Max Ultra",
      descTemplate: "Versión premium de alta fidelidad, con chips inteligentes mejorados y mayor autonomía.",
      priceFactor: 1.5,
      weight: "280 g",
      dimensions: "15 x 10 x 4 cm"
    },
    {
      titleSuffix: "Compact Slim Edition",
      descTemplate: "Diseño ergonómico ultra liviano y portátil. Ideal para llevar de viaje o espacio reducido.",
      priceFactor: 0.8,
      weight: "110 g",
      dimensions: "10 x 6 x 3 cm"
    },
    {
      titleSuffix: "Eco Smart USB",
      descTemplate: "Bajo consumo de energía con materiales reciclables y carga rápida tipo C.",
      priceFactor: 1.0,
      weight: "190 g",
      dimensions: "12 x 8 x 6 cm"
    },
    {
      titleSuffix: "Professional Heavy Duty",
      descTemplate: "Construcción robusta metálica de grado industrial. Máximo rendimiento certificado.",
      priceFactor: 2.2,
      weight: "650 g",
      dimensions: "22 x 15 x 8 cm"
    },
    {
      titleSuffix: "Lite Starter Kit",
      descTemplate: "Versión de entrada económica con lo indispensable para el uso cotidiano básico.",
      priceFactor: 0.6,
      weight: "150 g",
      dimensions: "11 x 7 x 4 cm"
    },
    {
      titleSuffix: "Edición Limitada Premium",
      descTemplate: "Diseño de lujo con acabados en aluminio cepillado y kit de accesorios extras incluidos.",
      priceFactor: 1.9,
      weight: "320 g",
      dimensions: "16 x 11 x 5 cm"
    }
  ];

  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);

  // Select appropriate gallery
  let selectedGallery = PHOTO_GALLERIES.Gadgets;
  if (
    normalizedQuery.includes("camp") || 
    normalizedQuery.includes("romp") || 
    normalizedQuery.includes("ropa") || 
    normalizedQuery.includes("abrig") || 
    normalizedQuery.includes("chaq") ||
    normalizedQuery.includes("jack")
  ) {
    selectedGallery = PHOTO_GALLERIES.Jackets;
  } else if (normalizedQuery.includes("humid") || normalizedQuery.includes("humif") || normalizedQuery.includes("difus")) {
    selectedGallery = PHOTO_GALLERIES.Humidifiers;
  } else if (normalizedQuery.includes("ventil") || normalizedQuery.includes("fan")) {
    selectedGallery = PHOTO_GALLERIES.Fans;
  }

  // Generate more results by repeating templates
  let results = [];
  for(let r=0; r<4; r++) {
    catalogTemplates.forEach((template, idx) => {
      const baseCost = 5.00 + r;
      const finalCost = Number((baseCost * template.priceFactor).toFixed(2));
      const salesCount = Math.floor(Math.random() * 500) + 20;
      const utilityScore = Number((7.5 + (finalCost % 3.0)).toFixed(1));

    // Dynamic high-res image routing using round index mapping
    const imageIndex = idx % selectedGallery.length;
    const image = selectedGallery[imageIndex];
    const images = [
      image,
      selectedGallery[(imageIndex + 1) % selectedGallery.length],
      selectedGallery[(imageIndex + 2) % selectedGallery.length]
    ];

    const title = `${formattedQuery} ${template.titleSuffix}`;

    results.push({
      id: `ali_gen_${Date.now()}_${idx}`,
      title: title,
      description: `${template.descTemplate} ${formattedQuery} importado directo de fábrica con control de calidad certificado.`,
      originalPrice: finalCost,
      category: detectCategory(title),
      weight: template.weight,
      dimensions: template.dimensions,
      image: image,
      images: images,
      stock: 120 - idx * 10,
      supplierUrl: `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`,
      utilityScore: utilityScore,
      supplierName: 'AliExpress',
      salesCount: salesCount,
      shippingCostUSD: (idx % 3 === 0) ? 0.0 : 1.99,
      deliveryDays: 12 + (idx % 8),
      discountPercentage: (idx % 3 === 0) ? Math.floor(Math.random() * 40 + 20) : 0
    });
  });
  }
  return results;
};

const getAmazonMockData = (query) => {
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const normalizedQuery = query.toLowerCase();

  const title1 = `${formattedQuery} - Marca Amazon Basics`;
  const title2 = `${formattedQuery} Profesional Heavy-Duty`;

  // Select appropriate gallery
  let selectedGallery = PHOTO_GALLERIES.Gadgets;
  if (
    normalizedQuery.includes("camp") || 
    normalizedQuery.includes("romp") || 
    normalizedQuery.includes("ropa") || 
    normalizedQuery.includes("abrig") || 
    normalizedQuery.includes("chaq") ||
    normalizedQuery.includes("jack")
  ) {
    selectedGallery = PHOTO_GALLERIES.Jackets;
  } else if (normalizedQuery.includes("humid") || normalizedQuery.includes("humif") || normalizedQuery.includes("difus")) {
    selectedGallery = PHOTO_GALLERIES.Humidifiers;
  } else if (normalizedQuery.includes("ventil") || normalizedQuery.includes("fan")) {
    selectedGallery = PHOTO_GALLERIES.Fans;
  }

  const image1 = selectedGallery[0];
  const image2 = selectedGallery.length > 1 ? selectedGallery[1] : selectedGallery[0];

  let results = [];
  for(let i=0; i<8; i++) {
    results.push(
      {
        id: `amz_gen_${Date.now()}_1_${i}`,
        title: `${title1} Gen ${i+1}`,
        description: `Soporte y diseño funcional con garantía oficial de Amazon. Fabricado en materiales resistentes de larga duración.`,
      originalPrice: 9.90,
      category: detectCategory(title1),
      weight: "340 g",
      dimensions: "15 x 10 x 3 cm",
      image: image1,
      images: [image1, image2],
      stock: 75,
      supplierUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=utiltech_affiliate-20`,
      utilityScore: 8.9,
      supplierName: 'Amazon Associates',
      salesCount: 380,
      shippingCostUSD: 0.0, // free
      deliveryDays: 8
    },
    {
      id: `amz_gen_${Date.now()}_2`,
      title: title2,
      description: `Edición especial mejorada para usuarios exigentes. Alta durabilidad y excelentes calificaciones de compradores.`,
      originalPrice: 19.99,
      category: detectCategory(title2),
      weight: "510 g",
      dimensions: "18 x 12 x 4 cm",
      image: image2,
      images: [image2, image1],
      stock: 40,
      supplierUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=utiltech_affiliate-20`,
      utilityScore: 9.4,
      supplierName: 'Amazon Associates',
      salesCount: 820,
      shippingCostUSD: 4.99,
      deliveryDays: 10,
      discountPercentage: (i % 2 === 0) ? Math.floor(Math.random() * 25 + 10) : 0
    }
    );
  }
  return results;
};

const translateToEnglish = (query) => {
  const dict = {
    "campera": "jacket",
    "camperas": "jacket",
    "chaqueta": "jacket",
    "chaquetas": "jacket",
    "pantalon": "pants",
    "pantalones": "pants",
    "jean": "jeans",
    "jeans": "jeans",
    "fideos": "noodles",
    "fideo": "noodles",
    "arroz": "rice",
    "aceite": "oil",
    "harina": "flour",
    "bebida": "drink",
    "bebidas": "drinks",
    "yerba": "tea",
    "azucar": "sugar",
    "cafe": "coffee",
    "chocolate": "chocolate",
    "galletita": "cookie",
    "galletitas": "cookies",
    "conserva": "canned food",
    "lata": "can",
    "latas": "cans",
    "snack": "snack",
    "snacks": "snacks",
    "salsa": "sauce",
    "maquina": "machine",
    "maquinas": "machines",
    "herramienta": "tool",
    "herramientas": "tools",
    "taladro": "drill",
    "taladros": "drill",
    "motor": "motor",
    "motores": "motor",
    "amoladora": "grinder",
    "torno": "lathe",
    "soldadora": "welder",
    "bomba": "pump",
    "compresor": "compressor",
    "sierra": "saw",
    "llave": "wrench",
    "pinza": "pliers",
    "destornillador": "screwdriver",
    "bazar": "bazar",
    "cocina": "kitchen",
    "cubierto": "cutlery",
    "cubiertos": "cutlery",
    "plato": "plate",
    "platos": "plates",
    "taza": "cup",
    "tazas": "cups",
    "sarten": "pan",
    "olla": "pot",
    "ollas": "pots",
    "termo": "thermos",
    "almohada": "pillow",
    "almohadas": "pillow",
    "sabana": "sheet",
    "sabanas": "sheets",
    "organizador": "organizer",
    "espejo": "mirror",
    "balanza": "scale",
    "limpieza": "cleaning",
    "detergente": "detergent",
    "jabon": "soap",
    "humidificador": "humidifier",
    "difusor": "diffuser",
    "enchufe": "plug",
    "foco": "bulb",
    "sensor": "sensor",
    "cargador": "charger",
    "cable": "cable",
    "cables": "cables",
    "soporte": "mount",
    "funda": "case",
    "adaptador": "adapter",
    "reloj": "watch",
    "auriculares": "headphones",
    "auricular": "headphone",
    "parlante": "speaker",
    "camara": "camera",
    "celular": "phone",
    "telefono": "phone"
  };
  
  const words = query.toLowerCase().split(/\s+/);
  const translatedWords = words.map(w => {
    const cleanWord = w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, '');
    return dict[cleanWord] || w;
  });
  return translatedWords.join(' ');
};

// 2. Search products on AliExpress Dropshipping Center (Live if RapidAPI key set, otherwise simulated)
// Helper to calculate AliExpress TOP API signature
const generateTopSign = (params, appSecret) => {
  const crypto = require('crypto');
  const sortedKeys = Object.keys(params).filter(k => k !== 'sign').sort();
  let str = appSecret;
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null) {
      str += k + params[k];
    }
  }
  str += appSecret;
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
};

// 2. Search products on AliExpress Dropshipping Center (Live if Official TOP API or RapidAPI key set)
const searchAliExpress = async (query) => {
  const appKey = process.env.ALIEXPRESS_APP_KEY || process.env.ALIEXPRESS_API_KEY || '540142';
  const appSecret = process.env.ALIEXPRESS_APP_SECRET || process.env.ALIEXPRESS_SECRET_KEY || 'rSpFw9CdwltP9rZiNC6aubJ38oJb1GA5';
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  // 1. Try official AliExpress Open Platform (TOP API) with authenticated signature
  if (appKey && appSecret && !appSecret.includes('tu_clave')) {
    try {
      const translatedQuery = translateToEnglish(query);
      console.log(`[ALIEXPRESS OFFICIAL TOP API] Consultando API Oficial (AppKey ${appKey}): ${translatedQuery}`);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      let params = {
        method: 'aliexpress.ds.recommend.feed.get',
        app_key: appKey,
        sign_method: 'md5',
        timestamp: timestamp,
        format: 'json',
        v: '2.0',
        feed_name: 'DS_RECOMMEND_FEED',
        target_currency: 'USD',
        target_language: 'ES',
        page_size: '15'
      };
      
      params.sign = generateTopSign(params, appSecret);
      let searchParams = new URLSearchParams(params).toString();
      let targetUrl = `https://api-sg.aliexpress.com/sync?${searchParams}`;
      
      let response = await httpsGetJSON(targetUrl);
      
      // Fallback method if feed is empty
      if (!response || !response.aliexpress_ds_recommend_feed_get_response || !response.aliexpress_ds_recommend_feed_get_response.result) {
        params.method = 'aliexpress.affiliate.product.query';
        delete params.feed_name;
        params.keywords = translatedQuery;
        params.sign = generateTopSign(params, appSecret);
        searchParams = new URLSearchParams(params).toString();
        targetUrl = `https://api-sg.aliexpress.com/sync?${searchParams}`;
        response = await httpsGetJSON(targetUrl);
      }

      if (response && response.aliexpress_affiliate_product_query_response && response.aliexpress_affiliate_product_query_response.resp_result) {
        const result = response.aliexpress_affiliate_product_query_response.resp_result;
        if (result.result && result.result.products && result.result.products.product) {
          const rawItems = result.result.products.product;
          return rawItems.map((item, idx) => {
            const title = item.product_title || 'Artículo de AliExpress';
            const price = parseFloat(item.target_sale_price || item.target_original_price || 5.00);
            const mainImg = (item.product_main_image_url || '/images/default.svg').replace('http://', 'https://');
            const images = item.product_small_image_urls && item.product_small_image_urls.string
              ? item.product_small_image_urls.string.map(img => img.replace('http://', 'https://'))
              : [mainImg];

            return {
              id: `ali_${item.product_id || Date.now() + '_' + idx}`,
              title: title,
              description: `Producto de importación directa desde AliExpress con garantía oficial. Enlace de afiliado: ${item.promotion_link || item.product_detail_url}`,
              originalPrice: price,
              category: detectCategory(title),
              weight: '300 g',
              dimensions: '15 x 10 x 5 cm',
              image: mainImg,
              images: images,
              stock: 99,
              supplierUrl: item.promotion_link || item.product_detail_url,
              utilityScore: 9.1,
              supplierName: 'AliExpress',
              salesCount: parseInt(item.volume) || 150,
              shippingCostUSD: 0.0,
              deliveryDays: 14
            };
          });
        }
      }
    } catch (topErr) {
      console.warn(`[ALIEXPRESS TOP API WARNING] Error al consultar API Oficial: ${topErr.message}`);
    }
  }

  // 2. Try RapidAPI if configured
  if (rapidApiKey && !rapidApiKey.includes('tu_clave_de_rapidapi') && rapidApiKey !== '') {
    try {
      const host = 'aliexpress-datahub.p.rapidapi.com';
      const translatedQuery = translateToEnglish(query);
      console.log(`[ALIEXPRESS LIVE API] Buscando en AliExpress (RapidAPI): ${translatedQuery}`);
      const targetUrl = `https://${host}/item_search_4?q=${encodeURIComponent(translatedQuery)}&page=1`;
      const data = await rapidApiGetJSON(targetUrl, host, rapidApiKey);

      const items = data.result && data.result.resultList 
        ? data.result.resultList 
        : (data.docs || data.result || data.products || (data.data && data.data.products) || data);

      if (Array.isArray(items) && items.length > 0) {
        return items.slice(0, 15).map((x, idx) => {
          const item = x.item ? x.item : x;
          const title = item.title || item.productTitle || item.name || 'Artículo de AliExpress';
          let originalPrice = 5.00;
          if (item.sku && item.sku.def) {
            originalPrice = item.sku.def.promotionPrice || item.sku.def.price || originalPrice;
          } else if (item.price) {
            const pStr = typeof item.price === 'object' ? (item.price.value || item.price.originalPrice) : item.price;
            const cleaned = pStr ? pStr.toString().replace(/[^0-9.]/g, '') : '';
            const val = parseFloat(cleaned);
            if (!isNaN(val) && val > 0) originalPrice = val;
          }

          let mainImage = item.image || item.imageUrl || (item.images && item.images[0]) || '/images/default.svg';
          if (mainImage.startsWith('//')) mainImage = 'https:' + mainImage;
          else mainImage = mainImage.replace('http://', 'https://');

          const images = item.images && Array.isArray(item.images)
            ? item.images.map(img => img.startsWith('//') ? 'https:' + img : img.replace('http://', 'https://'))
            : [mainImage];

          let rawUrl = item.itemUrl || item.productUrl || item.url || `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(translatedQuery)}`;
          if (rawUrl.startsWith('//')) rawUrl = 'https:' + rawUrl;

          const shipInfo = parseShippingAndDelivery(item, 'AliExpress');

          return {
            id: `ali_${item.itemId || item.productId || item.id || Date.now() + '_' + idx}`,
            title: title,
            description: item.description || `Producto importado de fábrica directa vía AliExpress. Código de modelo: ${item.itemId || item.productId || 'N/A'}.`,
            originalPrice: originalPrice,
            category: detectCategory(title),
            weight: item.weight || '300 g',
            dimensions: item.dimensions || '15 x 10 x 5 cm',
            image: mainImage,
            images: images,
            stock: item.stock || item.availableQuantity || 99,
            supplierUrl: rawUrl,
            utilityScore: Number((8.0 + (idx % 20) / 10).toFixed(1)),
            supplierName: 'AliExpress',
            salesCount: parseInt(item.sales) || parseInt(item.sold) || 120,
            shippingCostUSD: shipInfo.shippingCostUSD,
            deliveryDays: shipInfo.deliveryDays
          };
        });
      }
    } catch (rapidErr) {
      console.warn(`[ALIEXPRESS API WARNING] Error RapidAPI (${rapidErr.message}).`);
    }
  }

  console.log(`[ALIEXPRESS SIMULATION] Cargando catálogo dinámico de AliExpress.`);
  return getAliExpressMockData(query);
};

// 3. Search products on Amazon Product Advertising API (PA-API) (Live if RapidAPI key set, otherwise simulated)
const searchAmazon = async (query) => {
  const apiKey = process.env.RAPIDAPI_KEY;
  const host = 'real-time-amazon-data.p.rapidapi.com';

  if (!apiKey || apiKey.includes('tu_clave_de_rapidapi') || apiKey === '') {
    console.log(`[AMAZON SIMULATION] No se detectó clave de RapidAPI. Cargando simulación.`);
    return getAmazonMockData(query);
  }

  try {
    const translatedQuery = translateToEnglish(query);
    console.log(`[AMAZON LIVE API] Buscando en Amazon (RapidAPI): ${translatedQuery} (Original: ${query})`);
    const targetUrl = `https://${host}/search?query=${encodeURIComponent(translatedQuery)}&limit=10&country=US`;
    const data = await rapidApiGetJSON(targetUrl, host, apiKey);

    const items = data.products || (data.data && data.data.products) || data.result || data;

    if (!Array.isArray(items) || items.length === 0) {
      console.warn('[AMAZON LIVE API] Sin resultados del API. Usando simulación de resguardo.');
      return getAmazonMockData(query);
    }

    return items.slice(0, 10).map((item, idx) => {
      const title = item.title || item.product_title || 'Artículo de Amazon';
      
      let originalPrice = 12.50;
      const priceStr = item.price || item.product_price;
      if (priceStr) {
        const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
        const val = parseFloat(cleaned);
        if (!isNaN(val) && val > 0) originalPrice = val;
      }

      let mainImage = item.image || item.product_photo || '/images/default.svg';
      if (mainImage.startsWith('//')) {
        mainImage = 'https:' + mainImage;
      } else {
        mainImage = mainImage.replace('http://', 'https://');
      }

      const images = item.images && Array.isArray(item.images)
        ? item.images.map(img => img.startsWith('//') ? 'https:' + img : img.replace('http://', 'https://'))
        : [mainImage];

      let rawUrl = item.url || item.product_url || `https://www.amazon.com/s?k=${encodeURIComponent(translatedQuery)}`;
      if (rawUrl.startsWith('//')) {
        rawUrl = 'https:' + rawUrl;
      }

      const shipInfo = parseShippingAndDelivery(item, 'Amazon');

      return {
        id: `amz_${item.asin || item.id || Date.now() + '_' + idx}`,
        title: title,
        description: item.description || `Artículo de importación directa desde el catálogo de Amazon. Código ASIN: ${item.asin || 'N/A'}.`,
        originalPrice: originalPrice,
        category: detectCategory(title),
        weight: item.weight || '400 g',
        dimensions: item.dimensions || '18 x 12 x 4 cm',
        image: mainImage,
        images: images,
        stock: 45,
        supplierUrl: rawUrl,
        utilityScore: Number((8.5 + (idx % 15) / 10).toFixed(1)),
        supplierName: 'Amazon Associates',
        salesCount: parseInt(item.ratings_count) || 280,
        shippingCostUSD: shipInfo.shippingCostUSD,
        deliveryDays: shipInfo.deliveryDays
      };
    });
  } catch (error) {
    console.warn(`[AMAZON API WARNING] Error de conexión RapidAPI (${error.message}). Cargando simulador.`);
    return getAmazonMockData(query);
  }
};

// --- BANGGOOD INTEGRATION (OFFICIAL API) ---
const searchBanggoodLive = async (query) => {
  const apiKey = process.env.BANGGOOD_APP_KEY;
  const apiSecret = process.env.BANGGOOD_APP_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn(`[BANGGOOD API WARNING] Credenciales oficiales (BANGGOOD_APP_KEY) no configuradas. Cargando simulador enriquecido.`);
    return getGenericMockData(query, 'Banggood', { limit: 8, basePrice: 6.5, priceIncrement: 1.8, idPrefix: 'bg', baseStock: 120, urlTemplate: 'https://www.banggood.com/search/{query}.html', baseSales: 300, shippingCost: 2.5, deliveryDays: 18 });
  }

  try {
    console.log(`[BANGGOOD LIVE API] Consultando API Oficial de afiliados Banggood: ${query}`);
    
    // Official Banggood Open Platform structure
    const timestamp = Math.floor(Date.now() / 1000);
    const apiUrl = `https://api.banggood.com/product/search?keyword=${encodeURIComponent(query)}&api_key=${apiKey}&timestamp=${timestamp}`;
    
    // Uses Node 18+ native fetch
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP Status ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.code === 0 && data.response && data.response.product_list) {
      return data.response.product_list.map((item, idx) => {
        return {
          id: `bg_${item.product_id}`,
          title: item.product_name,
          description: item.description || `Importación directa desde Banggood Oficial.`,
          originalPrice: parseFloat(item.price),
          category: detectCategory(item.product_name),
          image: item.image_url,
          images: item.image_list || [item.image_url],
          stock: item.stock || 100,
          supplierUrl: item.product_url,
          weight: item.weight || '400 g',
          dimensions: '15 x 12 x 8 cm',
          utilityScore: 9.0,
          supplierName: 'Banggood',
          salesCount: item.sales || 200,
          shippingCostUSD: item.shipping_fee || 2.50,
          deliveryDays: item.delivery_time || 18,
          discountPercentage: item.discount || 0
        };
      });
    } else {
      throw new Error(data.msg || "Estructura de respuesta inválida de la API");
    }
  } catch (error) {
    console.warn(`[BANGGOOD API ERROR] Fallo al contactar API oficial (${error.message}). Volviendo a simulador...`);
    return getGenericMockData(query, 'Banggood', { limit: 8, basePrice: 6.5, priceIncrement: 1.8, idPrefix: 'bg', baseStock: 120, urlTemplate: 'https://www.banggood.com/search/{query}.html', baseSales: 300, shippingCost: 2.5, deliveryDays: 18 });
  }
};

// --- GENERIC SIMULATOR FOR EXTRA INTEGRATIONS ---
const getGenericMockData = (query, supplierName, config) => {
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const normalizedQuery = query.toLowerCase();
  const mockProducts = [];
  
  let selectedGallery = PHOTO_GALLERIES.Gadgets;
  if (normalizedQuery.includes("herramient") || normalizedQuery.includes("talad") || normalizedQuery.includes("soldad")) {
    selectedGallery = PHOTO_GALLERIES.Tools;
  } else if (normalizedQuery.includes("term") || normalizedQuery.includes("vaso")) {
    selectedGallery = PHOTO_GALLERIES.Thermos;
  } else if (normalizedQuery.includes("ropa") || normalizedQuery.includes("camp") || normalizedQuery.includes("jack")) {
    selectedGallery = PHOTO_GALLERIES.Jackets;
  }

  for (let i = 1; i <= config.limit; i++) {
    const cost = Number((config.basePrice + i * config.priceIncrement).toFixed(2));
    const title = `${formattedQuery} - ${supplierName} Edition ${i}`;
    const imageIndex = (i - 1) % selectedGallery.length;
    
    mockProducts.push({
      id: `${config.idPrefix}_mock_${Date.now()}_${i}`,
      title: title,
      description: `¡OFERTA EXCLUSIVA DE ${supplierName.toUpperCase()}!

Este artículo es de importación directa y cuenta con los más altos estándares de calidad internacional.

Características Principales:
- Diseño de vanguardia alineado a las últimas tendencias globales.
- Manufacturado con materiales de alta resistencia bajo normas ISO.
- Alto nivel de ventas mundiales comprobadas.
- Empaque sellado de fábrica con protección antigolpes.

Especificaciones Técnicas:
- Peso Neto Aproximado: 400 g
- Medidas del Paquete: 15 x 12 x 8 cm
- Garantía del Fabricante: 6 meses internacionales.
- Origen de Envío: Almacén central de ${supplierName}.

Aprovecha esta oportunidad única de conseguir stock limitado a precio de mayorista directamente en nuestra tienda. Excelente relación calidad-precio y envíos internacionales garantizados.`,
      originalPrice: cost,
      category: detectCategory(title),
      image: selectedGallery[imageIndex],
      images: [
        selectedGallery[imageIndex],
        selectedGallery[(imageIndex + 1) % selectedGallery.length],
        selectedGallery[(imageIndex + 2) % selectedGallery.length],
        selectedGallery[(imageIndex + 3) % selectedGallery.length]
      ],
      stock: config.baseStock + i * 5,
      supplierUrl: config.urlTemplate.replace("{query}", encodeURIComponent(query)),
      weight: '400 g',
      dimensions: '15 x 12 x 8 cm',
      utilityScore: Number((8.0 + (i % 5) / 10).toFixed(1)),
      supplierName: supplierName,
      salesCount: config.baseSales - i * 10,
      shippingCostUSD: config.shippingCost,
      deliveryDays: config.deliveryDays,
      discountPercentage: (i % 3 === 0) ? Math.floor(Math.random() * 20 + 5) : 0
    });
  }
  return mockProducts;
};

const searchCJDropshipping = async (query) => {
  console.log(`[CJ MOCK API] Buscando en CJ Dropshipping (Simulado): ${query}`);
  return getGenericMockData(query, 'CJ Dropshipping', { limit: 6, basePrice: 4.5, priceIncrement: 1.2, idPrefix: 'cj', baseStock: 150, urlTemplate: 'https://cjdropshipping.com/search/{query}.html', baseSales: 400, shippingCost: 1.5, deliveryDays: 12 });
};

const searchTemu = async (query) => {
  console.log(`[TEMU MOCK API] Buscando en Temu (Simulado): ${query}`);
  return getGenericMockData(query, 'Temu', { limit: 8, basePrice: 2.5, priceIncrement: 0.9, idPrefix: 'temu', baseStock: 500, urlTemplate: 'https://www.temu.com/search_result.html?search_key={query}', baseSales: 800, shippingCost: 0, deliveryDays: 15 });
};

const searchEbay = async (query) => {
  console.log(`[EBAY MOCK API] Buscando en eBay (Simulado): ${query}`);
  return getGenericMockData(query, 'eBay', { limit: 5, basePrice: 8.0, priceIncrement: 2.5, idPrefix: 'ebay', baseStock: 50, urlTemplate: 'https://www.ebay.com/sch/i.html?_nkw={query}', baseSales: 150, shippingCost: 4.5, deliveryDays: 20 });
};

const searchWalmart = async (query) => {
  console.log(`[WALMART MOCK API] Buscando en Walmart (Simulado): ${query}`);
  return getGenericMockData(query, 'Walmart', { limit: 4, basePrice: 12.0, priceIncrement: 3.0, idPrefix: 'walmart', baseStock: 80, urlTemplate: 'https://www.walmart.com/search?q={query}', baseSales: 200, shippingCost: 6.0, deliveryDays: 8 });
};

// Main connector module export - Integrates "Cheapest" and "Best Seller" flags dynamically
const searchAllSuppliers = async (query, apiConfig = {}) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const meliProducts = await searchMercadoLibre(query);
  const aliProducts = await searchAliExpress(query, apiConfig.alibabaSet);
  const amzProducts = await searchAmazon(query, apiConfig.amazonSet);
  const bgProducts = await searchBanggoodLive(query);
  const cjProducts = await searchCJDropshipping(query);
  const temuProducts = await searchTemu(query);
  const ebayProducts = await searchEbay(query);
  const walmartProducts = await searchWalmart(query);

  const combined = [...meliProducts, ...aliProducts, ...amzProducts, ...bgProducts, ...cjProducts, ...temuProducts, ...ebayProducts, ...walmartProducts];

  if (combined.length === 0) {
    return [];
  }

  let cheapestIndex = 0;
  let lowestPrice = combined[0].originalPrice;

  let bestSellerIndex = 0;
  let highestSales = combined[0].salesCount || 0;

  for (let i = 1; i < combined.length; i++) {
    const price = combined[i].originalPrice;
    if (price < lowestPrice) {
      lowestPrice = price;
      cheapestIndex = i;
    }

    const sales = combined[i].salesCount || 0;
    if (sales > highestSales) {
      highestSales = sales;
      bestSellerIndex = i;
    }
  }

  combined[cheapestIndex].isCheapest = true;
  combined[bestSellerIndex].isBestSeller = true;
  
  // Randomly assign some "Ofertas" to real API results if they don't have them
  combined.forEach((item, idx) => {
    if (item.discountPercentage === undefined) {
      item.discountPercentage = (idx % 7 === 0) ? Math.floor(Math.random() * 35 + 15) : 0;
    }
  });

  return combined;
};

module.exports = {
  searchAllSuppliers,
  detectCategory,
  fetchMeliItemDetails,
  rapidApiGetJSON
};
