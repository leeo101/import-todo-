import { useState, useEffect, useContext } from 'react'
import { 
  ShoppingCart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Sparkles,
  Cpu,
  AlertTriangle,
  Settings,
  Clipboard,
  ExternalLink,
  Users,
  LogOut,
  LogIn,
  Search,
  ChevronRight,
  CreditCard,
  History,
  Lock,
  Star,
  Info,
  Scale,
  Maximize2,
  Loader2,
  ArrowLeft,
  Heart,
  Moon,
  Sun
} from 'lucide-react'

import { ThemeContext } from './context/ThemeContext.jsx'
import Cart from './components/Cart.jsx'

import Navbar from './components/Navbar.jsx'
import ProductCard from './components/ProductCard.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Checkout from './pages/Checkout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AuthModal from './components/AuthModal.jsx'
import ContactSlide from './components/ContactSlide.jsx'
import UserProfile from './pages/UserProfile.jsx'
import PrivacyPolicyModal from './components/PrivacyPolicyModal.jsx'
import ContactModal from './components/ContactModal.jsx'

const BACKEND_URL = 'http://localhost:5000/api';

const FALLBACK_PRODUCTS = [
  {
    id: "prod_1",
    title: "Humidificador Ultra-Silencioso USB",
    description: "Mini humidificador difusor con luz LED de noche. Ideal para escritorios y habitaciones pequeñas. Capacidad de 300ml.",
    salePrice: 7.70,
    originalPrice: 5.50,
    category: "Tecnología",
    utilityScore: 9.2,
    image: "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&w=400&q=80",
    stock: 45,
    supplierUrl: "https://es.aliexpress.com/item/1005001234567891.html",
    weight: "210 g",
    dimensions: "12 x 8 x 8 cm"
  },
  {
    id: "prod_2",
    title: "Localizador Bluetooth Anti-Perdida",
    description: "Llavero inteligente rastreador compatible con iOS y Android. Encuentra tus llaves, mochila o mascotas con un click.",
    salePrice: 4.06,
    originalPrice: 2.90,
    category: "Tecnología",
    utilityScore: 8.8,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
    stock: 120,
    supplierUrl: "https://es.aliexpress.com/item/1005001234567892.html",
    weight: "15 g",
    dimensions: "3.8 x 3.8 x 0.7 cm"
  },
  {
    id: "prod_3",
    title: "Luz LED Recargable con Sensor de Movimiento",
    description: "Tira de luz LED inalámbrica de 20cm con imán para colocar en closets, alacenas o pasillos. Carga USB.",
    salePrice: 6.72,
    originalPrice: 4.80,
    category: "Tecnología",
    utilityScore: 9.5,
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=400&q=80",
    stock: 80,
    supplierUrl: "https://es.aliexpress.com/item/1005001234567893.html",
    weight: "130 g",
    dimensions: "20 x 4 x 1.5 cm"
  }
];

const MOCK_REVIEWS = [
  { name: "Carlos M.", rating: 5, comment: "Excelente producto. Tardó unos 12 días en llegar a Buenos Aires pero funciona excelente. El peso es muy ligero.", date: "12/06/2026" },
  { name: "Sofía R.", rating: 4, comment: "Muy útil para el escritorio de oficina, las dimensiones son compactas tal como detalla la descripción.", date: "02/07/2026" },
  { name: "Martín P.", rating: 5, comment: "Relación precio-calidad insuperable. El dropshipping directo de fábrica es lo mejor, me ahorré un montón.", date: "15/07/2026" }
];

const BANNERS = [
  {
    title: "Todo lo que necesitas, al precio más bajo",
    desc: "Importamos de fábrica de forma directa desde alimentos secos y artículos de bazar hasta herramientas y repuestos de maquinaria industrial.",
    badge: "Importación Directa",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Hogar, Bazar y Comestibles de Fábrica",
    desc: "Platos, termos, organizadores y una gran variedad de comestibles no perecederos a precio mayorista.",
    badge: "Hogar & Almacén",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Herramientas y Maquinaria Industrial",
    desc: "Soldadoras, taladros de banco, compresores y herramientas neumáticas. Máxima potencia garantizada de fábrica.",
    badge: "Herramientas & Equipos",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
  }
];

const CHATBOT_FAQS = [
  { 
    q: "¿Cuánto tarda el envío de mis compras?", 
    a: "Debido a que es un envío dropshipping internacional directo desde origen, el tiempo estimado de entrega a domicilio en Argentina es de 10 a 20 días hábiles." 
  },
  { 
    q: "¿ImportTodo se encarga de los trámites de aduana?", 
    a: "¡Sí! En ImportTodo gestionamos todo el trámite de importación y aduana. Por eso te solicitamos tu DNI o identificación fiscal al comprar, para agilizar el ingreso aduanero. Recibes el paquete directo en tu puerta." 
  },
  { 
    q: "¿Qué métodos de pago tienen habilitados?", 
    a: "Contamos con cobros seguros a través de Mercado Pago en pesos argentinos. Puedes pagar con tarjetas de crédito, débito, dinero en cuenta o mediante puntos de pago en efectivo." 
  },
  { 
    q: "¿Cuentan con garantía de compra?", 
    a: "Todos nuestros productos tienen una garantía oficial de 30 días de satisfacción por fallas de fábrica o roturas de envío. El cambio o devolución es 100% gratuito." 
  }
];

function App() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [settings, setSettings] = useState({ marginPercentage: 40, usdToArsRate: 1450 });
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Wishlist & Banner & Chatbot States
  const [wishlist, setWishlist] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isContactSlideOpen, setIsContactSlideOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [selectedOrderFulfillment, setSelectedOrderFulfillment] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Selected product page
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const cheapestProducts = [...products]
    .sort((a, b) => a.salePrice - b.salePrice)
    .slice(0, 4);
  
  // App views: 'store', 'admin', 'my-orders', or 'product-detail'
  const [currentView, setCurrentView] = useState('store');
  
  // Auth state injected from context
  const {
    loggedInUser,
    setAuthModalOpen,
    setAuthMode,
    backendOnline,
    setBackendOnline,
    handleLogout
  } = useAuth();
  
  // Status states
  const [loading, setLoading] = useState(true);

  // Checkout inputs
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutDni, setCheckoutDni] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutApartment, setCheckoutApartment] = useState('');
  const [checkoutZipCode, setCheckoutZipCode] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutProvince, setCheckoutProvince] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  // Admin setting forms
  const [adminMarginInput, setAdminMarginInput] = useState('40');
  const [adminRateInput, setAdminRateInput] = useState('1450');
  
  // Admin add product form
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Comestibles');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdSupplier, setNewProdSupplier] = useState('');
  const [newProdImage, setNewProdImage] = useState('/images/default.svg');
  const [newProdWeight, setNewProdWeight] = useState('250 g');
  const [newProdDimensions, setNewProdDimensions] = useState('15 x 10 x 5 cm');
  const [scrapingLink, setScrapingLink] = useState(false);

  // Admin bulk search importer states
  const [bulkSearchQuery, setBulkSearchQuery] = useState('');
  const [bulkSearchResults, setBulkSearchResults] = useState([]);
  const [bulkSearching, setBulkSearching] = useState(false);
  const [bulkSupplierFilter, setBulkSupplierFilter] = useState('Todos');

  // Dynamic automatic banner rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => {
        const limit = cheapestProducts.length > 0 ? cheapestProducts.length : BANNERS.length;
        return (prev + 1) % limit;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [cheapestProducts.length]);

  // Fetch logged in user orders
  const fetchUserOrders = async (userId) => {
    if (!backendOnline) return;
    try {
      const response = await fetch(`${BACKEND_URL}/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error("Error fetching user orders: ", err);
    }
  };

  // Helper to dynamically auto-detect category client-side
  const clientDetectCategory = (title = '') => {
    const t = title.toLowerCase();
    
    // 1. Comestibles
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

    // 2. Maquinaria y Herramientas
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

    // 3. Hogar y Bazar
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

    // 4. Vestimenta
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

    // 5. Tecnología
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

  // Load database
  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch(`${BACKEND_URL}/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
        setBackendOnline(true);
      } else {
        throw new Error('Products API Error');
      }

      const setRes = await fetch(`${BACKEND_URL}/settings`);
      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData);
        setAdminMarginInput(setData.marginPercentage.toString());
        setAdminRateInput(setData.usdToArsRate ? setData.usdToArsRate.toString() : '1450');
      }

      const ordRes = await fetch(`${BACKEND_URL}/orders`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }
    } catch (err) {
      console.warn("Express backend offline, loading fallback products");
      setProducts(FALLBACK_PRODUCTS);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Trigger payment confirmation webhook when returning from Mercado Pago
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('payment');
    const orderId = queryParams.get('orderId');

    if (paymentStatus === 'success' && orderId) {
      const confirmPayment = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/orders/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
          });
          if (res.ok) {
            setOrderSuccess(true);
            setIsCheckoutOpen(true);
            setCart([]);
            localStorage.removeItem('utiltech_cart');
            window.history.replaceState({}, document.title, window.location.pathname);
            fetchStoreData();
            if (loggedInUser) {
              fetchUserOrders(loggedInUser.id);
            }
          }
        } catch (e) {
          console.error("Error confirming payment:", e);
        }
      };
      confirmPayment();
    }
  }, [backendOnline, loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      autofillCustomerFields(loggedInUser);
    }
  }, [loggedInUser]);

  // Initial load
  useEffect(() => {
    fetchStoreData();
    
    // Load local cart
    const savedCart = localStorage.getItem('utiltech_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    // Load local wishlist
    const savedWish = localStorage.getItem('utiltech_wishlist');
    if (savedWish) {
      try {
        setWishlist(JSON.parse(savedWish));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const autofillCustomerFields = (user) => {
    setCheckoutName(user.name || '');
    setCheckoutEmail(user.email || '');
    setCheckoutDni(user.dni || '');
    setCheckoutPhone(user.phone || '');
    setCheckoutAddress(user.address || '');
    setCheckoutApartment(user.apartment || '');
    setCheckoutZipCode(user.zipCode || '');
    setCheckoutCity(user.city || '');
    setCheckoutProvince(user.province || '');
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchUserOrders(loggedInUser.id);
    }
  }, [loggedInUser, products]);

  // Periodic automatic order tracking updater for clients (runs status fetches client-side every 30 seconds!)
  useEffect(() => {
    if (loggedInUser) {
      const interval = setInterval(() => {
        fetchUserOrders(loggedInUser.id);
        if (currentView === 'admin') {
          fetchStoreData();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [loggedInUser, currentView]);

  // Save cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('utiltech_cart', JSON.stringify(cart));
  }, [cart]);

  // Toggle wishlist item
  const toggleWishlist = (product, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter(p => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('utiltech_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    handleLogout();
    setCurrentView('store');
    setSelectedProductDetail(null);
    setUserOrders([]);
  };

  // Scrape link function
  const handleAutoScrape = async () => {
    if (!newProdSupplier) {
      showToast("Por favor pega primero la URL del proveedor en el campo correspondiente.");
      return;
    }

    setScrapingLink(true);
    try {
      const response = await fetch(`${BACKEND_URL}/scrape-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newProdSupplier })
      });

      if (response.ok) {
        const data = await response.json();
        setNewProdTitle(data.title || '');
        setNewProdDesc(data.description || '');
        setNewProdCategory(data.category || 'Comestibles');
        setNewProdCost(data.originalPrice ? data.originalPrice.toString() : '5.00');
        setNewProdStock(data.stock ? data.stock.toString() : '50');
        setNewProdImage(data.image || '/images/default.svg');
        setNewProdWeight(data.weight || '300 g');
        setNewProdDimensions(data.dimensions || '15 x 10 x 5 cm');
        
        showToast("¡Datos del proveedor auto-completados con éxito!");
      }
    } catch (err) {
      showToast("Error de red con el extractor.", 'error');
    } finally {
      setScrapingLink(false);
    }
  };

  // Search suppliers (Mercado Libre directly from client, AliExpress/Amazon from backend)
  const handleBulkSearch = async (e) => {
    e.preventDefault();
    if (!bulkSearchQuery.trim()) return;

    setBulkSearching(true);
    try {
      let otherResults = [];
      try {
        const response = await fetch(`${BACKEND_URL}/suppliers/search?q=${encodeURIComponent(bulkSearchQuery)}`);
        if (response.ok) {
          otherResults = await response.json();
        }
      } catch (err) {
        console.warn("Backend suppliers search failed, using simulations.");
      }

      // Filter out backend's Mercado Libre results (since they are mock simulations due to PolicyAgent blocks!)
      const backendNonMeli = otherResults.filter(res => res.supplierName !== 'Mercado Libre');

      // Fetch REAL Mercado Libre results directly from user's browser (bypasses datacenter blocks!)
      let realMeliResults = [];
      try {
        console.log("[CLIENT SIDE MELI SEARCH] Consultando Mercado Libre desde tu navegador...");
        const meliRes = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(bulkSearchQuery)}&limit=35`);
        if (meliRes.ok) {
          const meliData = await meliRes.json();
          if (meliData.results && meliData.results.length > 0) {
            realMeliResults = meliData.results.map((item, idx) => {
              const priceARS = item.price || 0;
              const originalPriceUSD = Number((priceARS / 1000).toFixed(2)) || 5.00;
              
              let img = item.thumbnail ? item.thumbnail.replace('http://', 'https://') : '/images/default.svg';
              if (img.includes('-I.')) {
                img = img.replace('-I.', '-O.'); // Convert to high resolution
              }

              return {
                id: `ml_${item.id}`,
                title: item.title,
                description: `Producto real de Mercado Libre. Link original: ${item.permalink}`,
                originalPrice: originalPriceUSD > 0 ? originalPriceUSD : 4.50,
                category: clientDetectCategory(item.title),
                image: img,
                images: [img],
                stock: item.available_quantity || 15,
                supplierUrl: item.permalink,
                weight: '320 g',
                dimensions: '18 x 12 x 5 cm',
                utilityScore: Number((8.0 + (idx % 20) / 10).toFixed(1)),
                supplierName: 'Mercado Libre',
                salesCount: item.sold_quantity || 10
              };
            });
          }
        }
      } catch (err) {
        console.warn("Direct browser search to Mercado Libre failed: ", err);
      }

      // Fallback: If browser fetch yielded 0 items, keep backend's mock Mercado Libre items
      const finalMeli = realMeliResults.length > 0 
        ? realMeliResults 
        : otherResults.filter(res => res.supplierName === 'Mercado Libre');

      // Combine and flags cheapest/best sellers
      const combined = [...finalMeli, ...backendNonMeli];

      if (combined.length > 0) {
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
      }

      setBulkSearchResults(combined);
    } catch (err) {
      showToast("Error de red general al consultar proveedores.", 'error');
    } finally {
      setBulkSearching(false);
    }
  };

  // Import product directly resolving details & images gallery client-side to bypass API blocks
  const handleImportProduct = async (product) => {
    let images = product.images && product.images.length > 0 ? product.images : [product.image];
    let description = product.description;
    let weight = product.weight;
    let dimensions = product.dimensions;
    let title = product.title;
    let originalPrice = product.originalPrice;
    let category = product.category;

    // Fetch REAL product details, full pictures gallery and technical specifications in client browser
    if (product.id.startsWith('ml_') && !product.id.includes('mock')) {
      try {
        const cleanId = product.id.replace('ml_', '');
        console.log(`[CLIENT-SIDE MELI DETAIL] Extrayendo galería de fotos para: ${cleanId}`);
        
        // Fetch item details
        const itemRes = await fetch(`https://api.mercadolibre.com/items/${cleanId}`);
        if (itemRes.ok) {
          const itemData = await itemRes.json();
          
          if (itemData.pictures && itemData.pictures.length > 0) {
            images = itemData.pictures.map(pic => (pic.secure_url || pic.url).replace('http://', 'https://'));
          }

          if (itemData.attributes) {
            let attrsDesc = "\n\nEspecificaciones Técnicas:\n";
            itemData.attributes.forEach(attr => {
              if (attr.name && attr.value_name) {
                attrsDesc += `- ${attr.name}: ${attr.value_name}\n`;
              }
              if (attr.id === 'PACKAGE_WEIGHT') weight = attr.value_name;
            });
            const heightAttr = itemData.attributes.find(a => a.id === 'PACKAGE_HEIGHT');
            const widthAttr = itemData.attributes.find(a => a.id === 'PACKAGE_WIDTH');
            const lengthAttr = itemData.attributes.find(a => a.id === 'PACKAGE_LENGTH');
            if (heightAttr && widthAttr && lengthAttr && heightAttr.value_name && widthAttr.value_name && lengthAttr.value_name) {
              dimensions = `${lengthAttr.value_name} x ${widthAttr.value_name} x ${heightAttr.value_name}`;
            }
            product.tempAttrs = attrsDesc;
          }
          originalPrice = Number((itemData.price / 1000).toFixed(2)) || originalPrice;
          title = itemData.title || title;
        }

        // Fetch detailed description
        const descRes = await fetch(`https://api.mercadolibre.com/items/${cleanId}/description`);
        if (descRes.ok) {
          const descData = await descRes.json();
          description = descData.plain_text || descData.text || description;
        }

        if (product.tempAttrs) {
          description += product.tempAttrs;
        }
      } catch (err) {
        console.warn("Client-side details query failed, fallback to defaults.", err);
      }
    }

    const payload = {
      id: product.id,
      title: title,
      category: category || 'Comestibles',
      description: description,
      originalPrice: originalPrice,
      stock: product.stock || 50,
      supplierUrl: product.supplierUrl,
      image: images[0] || product.image,
      images: images,
      weight: weight,
      dimensions: dimensions,
      utilityScore: product.utilityScore || 8.5,
      shippingCostUSD: product.shippingCostUSD !== undefined ? product.shippingCostUSD : 0.0,
      deliveryDays: product.deliveryDays !== undefined ? product.deliveryDays : 15
    };

    if (!backendOnline) {
      const newLocalProd = {
        ...payload,
        id: payload.id,
        salePrice: Number((payload.originalPrice * (1 + settings.marginPercentage / 100)).toFixed(2))
      };
      setProducts(prev => [...prev, newLocalProd]);
      showToast(`¡[${product.supplierName}] Producto importado con éxito! (Simulado)`);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showToast(`¡[${product.supplierName}] Producto importado con éxito! Se cargaron ${images.length} imágenes y su descripción en vivo.`);
        fetchStoreData();
      } else {
        showToast("Fallo al importar el producto.", 'error');
      }
    } catch (err) {
      showToast("Error de red al subir el producto.", 'error');
    }
  };

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const newQty = existingItem.quantity + 1;
        if (newQty > product.stock) {
          showToast(`Disculpas, solo quedan ${product.stock} unidades.`, 'error');
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product) => {
    if (product.stock <= 0) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleDeleteOrder = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pedido del registro?')) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    setUserOrders(prev => prev.filter(o => o.id !== id));
    showToast('Pedido eliminado exitosamente.');
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setUserOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Estado del pedido actualizado a: ${newStatus}`);
  };

  const updateQty = (id, delta) => {
    const product = products.find(p => p.id === id);
    const maxStock = product ? product.stock : 99;

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > maxStock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  // Checkout order placement with payment gateway method integration
  const handleCheckoutSubmit = async (e, chosenPaymentMethod = 'Mercado Pago') => {
    e.preventDefault();
    setCheckoutError('');

    if (!checkoutName || !checkoutEmail || !checkoutDni || !checkoutPhone || !checkoutAddress || !checkoutZipCode || !checkoutCity || !checkoutProvince) {
      setCheckoutError('Por favor completa todos los campos de envío.');
      return;
    }

    const orderPayload = {
      customerName: checkoutName,
      email: checkoutEmail,
      dni: checkoutDni,
      phone: checkoutPhone,
      address: checkoutAddress,
      apartment: checkoutApartment,
      zipCode: checkoutZipCode,
      city: checkoutCity,
      province: checkoutProvince,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        salePrice: item.salePrice,
        originalPrice: item.originalPrice || (item.salePrice / (1 + settings.marginPercentage / 100))
      })),
      total: cartTotal,
      userId: loggedInUser ? loggedInUser.id : null,
      paymentMethod: chosenPaymentMethod,
      paymentStatus: 'PAGADO'
    };

    if (!backendOnline) {
      setOrderSuccess(true);
      const offlineOrder = {
        ...orderPayload,
        id: `ord_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Pendiente'
      };
      setOrders(prev => [offlineOrder, ...prev]);
      setUserOrders(prev => [offlineOrder, ...prev]);
      setCart([]);
      localStorage.removeItem('utiltech_cart');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/orders/mercadopago-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const result = await response.json();
      setOrderSuccess(true);
      const newOrder = {
        ...orderPayload,
        id: result.orderId || `ord_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Pendiente'
      };
      setOrders(prev => [newOrder, ...prev]);
      setUserOrders(prev => [newOrder, ...prev]);
      setCart([]);
      localStorage.removeItem('utiltech_cart');
    } catch (err) {
      setCheckoutError('Fallo al conectar con la pasarela de pagos.');
    }
  };

  // Add product (Admin Panel)
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdTitle || !newProdCost) {
      showToast("El Título y el Costo de Fábrica son obligatorios.");
      return;
    }

    const payload = {
      title: newProdTitle,
      category: newProdCategory,
      description: newProdDesc,
      originalPrice: parseFloat(newProdCost),
      stock: parseInt(newProdStock),
      supplierUrl: newProdSupplier || 'https://es.aliexpress.com/',
      image: newProdImage,
      weight: newProdWeight,
      dimensions: newProdDimensions,
      utilityScore: 8.5
    };

    if (!backendOnline) {
      const newLocalProd = {
        ...payload,
        id: `prod_${Date.now()}`,
        salePrice: Number((payload.originalPrice * (1 + settings.marginPercentage / 100)).toFixed(2))
      };
      setProducts(prev => [...prev, newLocalProd]);
      showToast("Simulación: Producto añadido con éxito.");
      resetProductForm();
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showToast("Producto guardado con éxito.");
        resetProductForm();
        fetchStoreData();
      }
    } catch (err) {
      showToast("Error al guardar.", 'error');
    }
  };

  const resetProductForm = () => {
    setNewProdTitle('');
    setNewProdDesc('');
    setNewProdCost('');
    setNewProdStock('50');
    setNewProdSupplier('');
    setNewProdImage('/images/default.svg');
    setNewProdWeight('250 g');
    setNewProdDimensions('15 x 10 x 5 cm');
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este producto?')) return;
    try {
      const resp = await fetch(`${BACKEND_URL}/products/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Error al eliminar');
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Producto eliminado exitosamente');
    } catch (err) {
      console.error(err);
      showToast('Error eliminando producto', 'error');
    }
  };

  const handleSyncCatalog = async () => {
    setIsSyncingCatalog(true);
    try {
      const res = await fetch('${BACKEND_URL}/admin/sync-catalog', {
        method: 'POST'
      });
      if (res.ok) {

        const data = await res.json();
        setProducts(data);
        showToast('Catálogo sincronizado exitosamente', 'success');
      } else {
        showToast('Error al sincronizar catálogo', 'error');
      }
    } catch (err) {
      showToast('Error de conexión al sincronizar', 'error');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const handleMarginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marginPercentage: Number(adminMarginInput), usdToArsRate: Number(adminRateInput) })
      });
      if (res.ok) {
        showToast('Configuraciones guardadas.');
        fetchStoreData();
      }
    } catch (err) {
      showToast('Error al guardar configuraciones.', 'error');
    }
  };

  const renderTrackerPipeline = (status) => {
    const steps = [
      { name: 'Pendiente', icon: <Lock size={16} />, desc: 'Pago Acreditado' },
      { name: 'Procesando', icon: <Cpu size={16} />, desc: 'Pedido al Proveedor' },
      { name: 'En Camino', icon: <ShoppingCart size={16} />, desc: 'Tránsito Internacional' },
      { name: 'Aduana', icon: <AlertTriangle size={16} />, desc: 'Ingreso al País' },
      { name: 'Entregado', icon: <CheckCircle2 size={16} />, desc: 'En tu Domicilio' }
    ];

    const activeIndex = steps.findIndex(s => s.name === status);

    return (
      <div style={{ marginTop: '1.5rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Seguimiento en Vivo:</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '18px', left: '1.25rem', width: `${(activeIndex / (steps.length - 1)) * 92}%`, height: '3px', background: 'var(--accent-cyan)', zIndex: 2, transition: 'width 0.6s ease' }} />

          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, minWidth: '90px', textAlign: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--accent-cyan)' : (isCompleted ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-card)'),
                  border: isCompleted ? '2px solid var(--accent-cyan)' : '2px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: isCompleted ? '#fff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 0 15px var(--accent-cyan)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isCompleted ? 'bold' : 'normal',
                  color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                  marginTop: '0.5rem'
                }}>
                  {step.name}
                </span>
                <span style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.1rem',
                  maxWidth: '85px'
                }}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigateToStore = () => {
    setCurrentView('store');
    setSelectedProductDetail(null);
  };

  const navigateToDetail = (product) => {
    setSelectedProductDetail(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filteredProductsList = products.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const relatedProducts = selectedProductDetail 
    ? products.filter(p => p.category === selectedProductDetail.category && p.id !== selectedProductDetail.id).slice(0, 4) 
    : [];

  const totalSales = orders.filter(o => o.status === 'Entregado').reduce((acc, o) => acc + o.total, 0);
  const totalProfit = totalSales * (settings.marginPercentage / 100);
  const pendingOrders = orders.filter(o => o.status !== 'Entregado').length;

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loggedInUser={loggedInUser}
        handleLogout={logout}
        setAuthMode={setAuthMode}
        setAuthModalOpen={setAuthModalOpen}
        setSelectedProductDetail={setSelectedProductDetail}
        setIsCartOpen={setIsCartOpen}
        cartItemCount={cartItemCount}
        navigateToStore={navigateToStore}
        setIsContactSlideOpen={setIsContactSlideOpen}
      />

      <ContactSlide 
        isOpen={isContactSlideOpen} 
        onClose={() => setIsContactSlideOpen(false)}
        loggedInUser={loggedInUser}
        setCurrentView={setCurrentView}
        setSelectedProductDetail={setSelectedProductDetail}
        setAuthModalOpen={setAuthModalOpen}
        setAuthMode={setAuthMode}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        handleLogout={logout}
      />

      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* --- 1. VIEW: CLIENT STORE --- */}
      {currentView === 'store' && (
        <Home 
          cheapestProducts={cheapestProducts}
          activeBannerIndex={activeBannerIndex}
          setActiveBannerIndex={setActiveBannerIndex}
          navigateToDetail={navigateToDetail}
          BANNERS={BANNERS}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setSearchQuery={setSearchQuery}
          loading={loading}
          filteredProductsList={filteredProductsList}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          buyNow={buyNow}
        />
      )}

      {/* --- 2. VIEW: DEDICATED PRODUCT DETAILS PAGE --- */}
      {currentView === 'product-detail' && selectedProductDetail && (
        <ProductDetail 
          selectedProductDetail={selectedProductDetail}
          navigateToStore={navigateToStore}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          addToCart={addToCart}
          buyNow={buyNow}
          MOCK_REVIEWS={MOCK_REVIEWS}
          relatedProducts={relatedProducts}
          navigateToDetail={navigateToDetail}
        />
      )}

      {/* --- NEW VIEW: USER PROFILE --- */}
      {currentView === 'profile' && (
        <UserProfile 
          userOrders={userOrders}
          onNavigate={(view) => {
            setCurrentView(view);
            setSelectedProductDetail(null);
          }}
        />
      )}

      {/* --- 3. VIEW: CUSTOMER ORDERS HISTORY --- */}
      {currentView === 'my-orders' && (
        <main className="container" style={{ paddingTop: '3rem', minHeight: '60vh' }}>
          <h1 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History style={{ color: 'var(--accent-cyan)' }} /> Mis Compras Realizadas
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                <p>Aún no has realizado ninguna compra en ImportTodo. ¡Visita el catálogo e importa tus primeros productos!</p>
              </div>
            ) : (
              userOrders.map(order => (
                <div key={order.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem', gap: '1rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Pedido ID:</span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Fecha:</span>
                      <div style={{ fontWeight: '600' }}>{new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Entrega a Domicilio:</span>
                      <div style={{ fontWeight: '600' }}>
                        {order.address} {order.apartment && `, ${order.apartment}`} (CP: {order.zipCode})<br/>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.city}, {order.province}</span>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado de Envío:</span>
                      <div>
                        <span style={{ 
                          background: order.status === 'Entregado' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                          color: order.status === 'Entregado' ? 'var(--success)' : 'var(--warning)', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold' 
                        }}>
                          â— {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Artículos:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.95rem' }}>
                        <span>â€¢ {item.title} <span style={{ color: 'var(--text-muted)' }}>(x{item.quantity})</span></span>
                        <span style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(item.salePrice * item.quantity)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      <span>Monto Total Cobrado:</span>
                      <span style={{ color: 'var(--success)' }}>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(order.total)}</span>
                    </div>
                  </div>

                  {/* Real-time Dropshipping shipping tracker visual pipeline */}
                  {renderTrackerPipeline(order.status)}

                </div>
              ))
            )}
          </div>
        </main>
      )}

      {/* --- 4. VIEW: ADMIN CONTROL PANEL --- */}
      {currentView === 'admin' && (
        <AdminDashboard 
          handleSyncCatalog={handleSyncCatalog}
          isSyncingCatalog={isSyncingCatalog}
          backendOnline={backendOnline}
          totalSales={totalSales}
          totalProfit={totalProfit}
          pendingOrders={pendingOrders}
          products={products}
          handleBulkSearch={handleBulkSearch}
          bulkSearchQuery={bulkSearchQuery}
          setBulkSearchQuery={setBulkSearchQuery}
          bulkSearching={bulkSearching}
          bulkSearchResults={bulkSearchResults}
          bulkSupplierFilter={bulkSupplierFilter}
          setBulkSupplierFilter={setBulkSupplierFilter}
          settings={settings}
          handleImportProduct={handleImportProduct}
          handleMarginSubmit={handleMarginSubmit}
          adminMarginInput={adminMarginInput}
          setAdminMarginInput={setAdminMarginInput}
          adminRateInput={adminRateInput}
          setAdminRateInput={setAdminRateInput}
          handleAddProductSubmit={handleAddProductSubmit}
          newProdSupplier={newProdSupplier}
          setNewProdSupplier={setNewProdSupplier}
          handleAutoScrape={handleAutoScrape}
          scrapingLink={scrapingLink}
          newProdTitle={newProdTitle}
          setNewProdTitle={setNewProdTitle}
          newProdCategory={newProdCategory}
          setNewProdCategory={setNewProdCategory}
          newProdCost={newProdCost}
          setNewProdCost={setNewProdCost}
          newProdStock={newProdStock}
          setNewProdStock={setNewProdStock}
          newProdWeight={newProdWeight}
          setNewProdWeight={setNewProdWeight}
          newProdDimensions={newProdDimensions}
          setNewProdDimensions={setNewProdDimensions}
          newProdImage={newProdImage}
          setNewProdImage={setNewProdImage}
          newProdDesc={newProdDesc}
          setNewProdDesc={setNewProdDesc}
          orders={orders}
          setSelectedOrderFulfillment={setSelectedOrderFulfillment}
          setIsFulfillmentOpen={setIsFulfillmentOpen}
          navigateToDetail={navigateToDetail}
          handleDeleteProduct={handleDeleteProduct}
          handleDeleteOrder={handleDeleteOrder}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* --- POPUPS & DRAWER MODALS --- */}

      {/* 1. Cart Drawer */}
      {isCartOpen && (
        <Cart 
          cart={cart} 
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
          updateQty={updateQty} 
          removeFromCart={removeFromCart} 
          cartTotal={cartTotal} 
          onCheckout={() => setIsCheckoutOpen(true)} 
        />
      )}

      {/* 2. Checkout Modal */}
      <Checkout 
        isCheckoutOpen={isCheckoutOpen}
        setIsCheckoutOpen={setIsCheckoutOpen}
        orderSuccess={orderSuccess}
        setOrderSuccess={setOrderSuccess}
        checkoutError={checkoutError}
        handleCheckoutSubmit={handleCheckoutSubmit}
        checkoutName={checkoutName} setCheckoutName={setCheckoutName}
        checkoutDni={checkoutDni} setCheckoutDni={setCheckoutDni}
        checkoutPhone={checkoutPhone} setCheckoutPhone={setCheckoutPhone}
        checkoutAddress={checkoutAddress} setCheckoutAddress={setCheckoutAddress}
        checkoutApartment={checkoutApartment} setCheckoutApartment={setCheckoutApartment}
        checkoutZipCode={checkoutZipCode} setCheckoutZipCode={setCheckoutZipCode}
        checkoutCity={checkoutCity} setCheckoutCity={setCheckoutCity}
        checkoutProvince={checkoutProvince} setCheckoutProvince={setCheckoutProvince}
        checkoutEmail={checkoutEmail} setCheckoutEmail={setCheckoutEmail}
        cartTotal={cartTotal}
      />

      {/* 3. Authentication Modal */}
      <AuthModal />

      {/* 4. Dropshipping Fulfillment Modal */}
      {isFulfillmentOpen && selectedOrderFulfillment && (
        <div className="modal-overlay" onClick={() => setIsFulfillmentOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="close-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} onClick={() => setIsFulfillmentOpen(false)}>
              <X size={20} />
            </button>

            <h2 className="modal-title" style={{ textAlign: 'left', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronRight size={22} style={{ color: 'var(--accent-cyan)' }} /> Despachar Dropshipping
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Copia los datos de entrega de tu cliente para rellenarlos en el proveedor. **¡DNI y Teléfono son requeridos en la aduana de importaciones!**
            </p>

            {/* Quick block address recognition copy box */}
            <div style={{ background: 'rgba(6, 182, 212, 0.04)', border: '1px dashed var(--border-glow)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⚡ Relleno Rápido de Dirección (AliExpress / Amazon)
              </h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                Haz click abajo para copiar toda la información en un solo bloque. Luego, en la pantalla de agregar dirección de AliExpress o Amazon, pégalo en la caja de **"Reconocimiento Inteligente / Relleno Rápido"** y se autocompletará todo el formulario en un segundo.
              </p>
              <button
                className="submit-btn"
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.8rem', 
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                onClick={() => {
                  const blockText = `${selectedOrderFulfillment.customerName}, ${selectedOrderFulfillment.phone}, ${selectedOrderFulfillment.address} ${selectedOrderFulfillment.apartment || ''}, ${selectedOrderFulfillment.city}, ${selectedOrderFulfillment.province}, ${selectedOrderFulfillment.zipCode}, Argentina, DNI/CUIT: ${selectedOrderFulfillment.dni}`;
                  copyToClipboard(blockText);
                }}
              >
                📋 Copiar Dirección en Bloque
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Nombre Completo del Cliente</label>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                <span id="copyName" style={{ flexGrow: 1, fontSize: '0.95rem' }}>{selectedOrderFulfillment.customerName}</span>
                <button className="add-to-cart-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--border-light)', color: 'var(--text-main)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.customerName)}>Copiar</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>DNI / Identificación Fiscal (Aduana)</label>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                <span id="copyDni" style={{ flexGrow: 1, fontSize: '0.95rem', fontWeight: 'bold' }}>{selectedOrderFulfillment.dni || 'No provisto'}</span>
                <button className="add-to-cart-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--border-light)', color: 'var(--text-main)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.dni || '')}>Copiar</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Teléfono del Cliente (Courier/Envío)</label>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                <span id="copyPhone" style={{ flexGrow: 1, fontSize: '0.95rem' }}>{selectedOrderFulfillment.phone}</span>
                <button className="add-to-cart-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--border-light)', color: 'var(--text-main)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.phone)}>Copiar</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Dirección de Calle y Nro</label>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                <span id="copyAddr" style={{ flexGrow: 1, fontSize: '0.95rem' }}>{selectedOrderFulfillment.address} {selectedOrderFulfillment.apartment && `- ${selectedOrderFulfillment.apartment}`}</span>
                <button className="add-to-cart-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--border-light)', color: 'var(--text-main)' }} onClick={() => copyToClipboard(`${selectedOrderFulfillment.address} ${selectedOrderFulfillment.apartment || ''}`)}>Copiar</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>CP</label>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                  <span style={{ flexGrow: 1, fontSize: '0.85rem' }}>{selectedOrderFulfillment.zipCode}</span>
                  <button className="add-to-cart-btn" style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem', background: 'var(--border-light)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.zipCode)}>Copiar</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Ciudad</label>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                  <span style={{ flexGrow: 1, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedOrderFulfillment.city}</span>
                  <button className="add-to-cart-btn" style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem', background: 'var(--border-light)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.city)}>Copiar</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Provincia</label>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                  <span style={{ flexGrow: 1, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedOrderFulfillment.province}</span>
                  <button className="add-to-cart-btn" style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem', background: 'var(--border-light)' }} onClick={() => copyToClipboard(selectedOrderFulfillment.province)}>Copiar</button>
                </div>
              </div>
            </div>

            {(() => {
              const baseSupplierUrl = products.find(p => p.id === selectedOrderFulfillment.items[0].id)?.supplierUrl || "https://es.aliexpress.com/";
              let finalUrl = baseSupplierUrl;
              try {
                const clientData = {
                  name: selectedOrderFulfillment.customerName,
                  phone: selectedOrderFulfillment.phone,
                  address: selectedOrderFulfillment.address,
                  apartment: selectedOrderFulfillment.apartment || '',
                  zipCode: selectedOrderFulfillment.zipCode,
                  city: selectedOrderFulfillment.city,
                  province: selectedOrderFulfillment.province,
                  dni: selectedOrderFulfillment.dni
                };
                const base64Data = btoa(unescape(encodeURIComponent(JSON.stringify(clientData))));
                finalUrl = baseSupplierUrl.includes('#') 
                  ? `${baseSupplierUrl.split('#')[0]}#importtodo_data=${base64Data}`
                  : `${baseSupplierUrl}#importtodo_data=${base64Data}`;
              } catch (e) {
                console.error(e);
              }

              return (
                <>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '10px', marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      🔌 Activar Autocompletado (Extensión de Chrome):
                    </h4>
                    <ol style={{ fontSize: '0.65rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
                      <li>Ingresa en Chrome a: <strong style={{ color: 'var(--accent-cyan)' }}>chrome://extensions</strong></li>
                      <li>Activa el **"Modo desarrollador"** (arriba a la derecha).</li>
                      <li>Haz click en **"Cargar descomprimida"** (arriba a la izquierda).</li>
                      <li>Elige la carpeta <strong style={{ color: 'var(--accent-cyan)' }}>dropshipping-helper</strong> dentro de este proyecto.</li>
                    </ol>
                  </div>

                  <a 
                    href={finalUrl}
                    target="_blank" 
                    rel="noreferrer"
                    className="submit-btn"
                    style={{ 
                      marginTop: '1.5rem', 
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    🚀 Abrir Proveedor y Autocompletar
                  </a>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 5. AI Assistant Floating Widget */}
      <div className="chatbot-overlay">
        {isChatbotOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Asistente de Importación</h3>
              </div>
              <button className="close-btn" onClick={() => setIsChatbotOpen(false)}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '12px',
                    maxWidth: '85%',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.chatInput;
                if (!input.value.trim()) return;
                const userMsg = input.value;
                setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
                input.value = '';
                setTimeout(() => {
                  setChatMessages(prev => [...prev, { sender: 'bot', text: '¡Hola! Soy tu asistente de ImportTodo. Puedo ayudarte con información sobre envíos, aduana y seguimiento de tus paquetes.' }]);
                }, 800);
              }}
              style={{ padding: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}
            >
              <input 
                name="chatInput"
                type="text"
                placeholder="Pregunta sobre tu envío..."
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              />
              <button type="submit" className="add-to-cart-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                Enviar
              </button>
            </form>
          </div>
        )}

        <button 
          className="chatbot-trigger" 
          onClick={() => setIsChatbotOpen(prev => !prev)}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', 
            border: 'none', 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.25rem',
            transition: 'transform 0.2s ease'
          }}
          title="Asistente de Soporte Virtual"
        >
          💬
        </button>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '2rem 1.5rem', background: '#070b12', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/images/logo.png" alt="ImportTodo Logo" style={{ height: '36px', borderRadius: '4px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>ImportTodo</div>
              <div style={{ fontSize: '0.75rem' }}>Tu Tienda de Ofertas Globales</div>
            </div>
          </div>
          <div>
            Â© {new Date().getFullYear()} ImportTodo - Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Custom Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <div className="toast-content">{toast.message}</div>
          <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, visible: false }))}>
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  )
}

export default App
