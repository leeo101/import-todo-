# UtilTech - Tienda Dropshipping de Tecnología Útil y Económica

UtilTech es una plataforma de dropshipping diseñada para buscar, importar y vender gadgets tecnológicos prácticos y baratos desde China u otros portales web, aplicando márgenes de ganancia personalizables.

El proyecto está construido integrando 4 tecnologías de forma modular:
1. **Frontend (React)**: Interfaz de usuario interactiva y premium para los clientes.
2. **Backend (Node.js + Express)**: API que gestiona inventarios, pedidos y configuración de la tienda.
3. **Scraper (Python)**: Script automatizado para extraer ofertas tecnológicas e importarlas al backend.
4. **Admin Dashboard (PHP)**: Panel administrativo para ajustar el porcentaje de beneficio y monitorear ventas.

---

## 🏛️ Estructura del Proyecto

```
/
├── backend/              # API de Node.js & Base de Datos JSON
├── frontend/             # Sitio web del cliente en React (Vite)
├── scraper/              # Scripts de importación (Python y JS alternativo)
└── php-admin/            # Panel de control de márgenes en PHP
```

---

## 🚀 Guía de Inicio Rápido

Para levantar todo el entorno localmente, sigue estos pasos:

### 1. Iniciar la API de Node.js (Puerto 5000)
El backend actúa como el núcleo central, comunicando el frontend, el scraper y el admin panel.
En la carpeta `backend/`:
```bash
# Instalar dependencias (ya realizado)
npm install

# Iniciar servidor en modo desarrollo
npm run dev
```
*La API correrá en: `http://localhost:5000`*

### 2. Iniciar el Panel de Administración (PHP)
El panel administrativo te permite ajustar el margen de ganancia de dropshipping (ej. 45% sobre el precio de costo de fábrica) y ver estadísticas.
En la carpeta `php-admin/` levanta el servidor integrado de PHP:
```bash
php -S localhost:8000
```
*Accede al panel en tu navegador: `http://localhost:8000`*

### 3. Ejecutar el Scraper de Ofertas (Python / Node.js)
El scraper simula la extracción de productos tecnológicos de bajo costo e inteligentes del mercado y los guarda automáticamente en el catálogo de Node.js.

* **Opción A (Python)**:
  ```bash
  python scraper/scraper.py
  ```
* **Opción B (Node.js - si no tienes Python en tu PATH)**:
  ```bash
  node scraper/import_products.js
  ```

### 4. Iniciar el Frontend de React (Puerto 5173)
El sitio web principal donde los usuarios comprarán los gadgets.
En la carpeta `frontend/`:
```bash
# Iniciar servidor de Vite
npm run dev
```
*Accede a la tienda en: `http://localhost:5173`*

---

## ⚙️ ¿Cómo funciona el Margen Dinámico?
1. Cuando ejecutas el **Scraper (Python)**, este guarda los artículos con su **precio de costo original** en China (por ejemplo, `$4.10` para un cargador Qi).
2. En el **Admin Panel (PHP)** puedes configurar el margen de dropshipping (ej. `40%`). Esto se guarda en `settings.json` en el servidor de Node.js.
3. El **Servidor de Node.js** calcula automáticamente el precio de venta en tienda:
   `Precio Venta = Costo Original * (1 + Margen / 100)` (ej. `$4.10 * 1.40 = $5.74`).
4. El **Frontend (React)** consulta la API y muestra a los usuarios el precio final recalculado. ¡Cualquier cambio de margen en PHP se refleja instantáneamente en la tienda de React!
