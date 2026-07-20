import json
import time
import urllib.request
import urllib.error
import random

# Configuration
API_URL = "http://localhost:5000/api/products"
headers = {"Content-Type": "application/json"}

# High utility cheap gadgets database (Simulated Aliexpress / Web findings)
DEALS_DATABASE = [
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
]

def post_product_to_api(product):
    """Sends a single product JSON to the Node.js backend API."""
    data = json.dumps(product).encode('utf-8')
    req = urllib.request.Request(API_URL, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 201:
                res_body = json.loads(response.read().decode('utf-8'))
                print(f"[SUCCESS] Guardado: {product['title']} | Precio Original: ${product['originalPrice']:.2f}")
                return True
    except urllib.error.URLError as e:
        print(f"[ERROR] No se pudo conectar al servidor Node.js en {API_URL}.")
        print("Asegúrate de que el backend de Node.js esté corriendo (npm run dev).")
        return False
    except Exception as e:
        print(f"[ERROR] Error inesperado guardando {product['title']}: {e}")
        return False

def run_scraper():
    print("=" * 60)
    print("        UTILTECH PYTHON SCRAPER - IMPORTACIÓN DE GADGETS")
    print("=" * 60)
    print("Iniciando búsqueda de ofertas tecnológicas baratas en la web...")
    time.sleep(1)
    
    successful_imports = 0
    
    # Scrape deals
    for i, product in enumerate(DEALS_DATABASE):
        print(f"\n[{i+1}/{len(DEALS_DATABASE)}] Analizando producto encontrado...")
        time.sleep(random.uniform(0.5, 1.2))  # Simulate network scraping delay
        
        print(f" -> Encontrado: '{product['title']}' en portal de importaciones a ${product['originalPrice']:.2f}")
        
        # Upload to server
        success = post_product_to_api(product)
        if success:
            successful_imports += 1
            
    print("\n" + "=" * 60)
    print(f"PROCESO FINALIZADO. Productos importados con éxito: {successful_imports}/{len(DEALS_DATABASE)}")
    print("=" * 60)

if __name__ == "__main__":
    run_scraper()
