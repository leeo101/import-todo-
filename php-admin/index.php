<?php
// PHP Administration Panel for UtilTech Dropshipping Store
// Communicates with Node.js Backend API via HTTP requests

$nodeApiUrl = "http://localhost:5000/api";

// Helper to make API requests using file_get_contents
function makeApiRequest($url, $method = 'GET', $data = null) {
    $options = [
        'http' => [
            'method' => $method,
            'header' => "Content-Type: application/json\r\n",
            'ignore_errors' => true,
            'timeout' => 5 // 5 seconds timeout
        ]
    ];
    
    if ($data !== null) {
        $options['http']['content'] = json_encode($data);
    }
    
    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        return null;
    }
    
    return json_decode($response, true);
}

$message = '';
$error = '';

// Handle profit margin update form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_margin'])) {
    $newMargin = floatval($_POST['margin_percentage']);
    if ($newMargin >= 0) {
        $result = makeApiRequest("$nodeApiUrl/settings", 'POST', ['marginPercentage' => $newMargin]);
        if ($result && isset($result['settings'])) {
            $message = "Margen de ganancia actualizado con éxito a {$newMargin}%";
        } else {
            $error = "Error al actualizar el margen en el servidor backend.";
        }
    } else {
        $error = "El margen de ganancia debe ser un número positivo.";
    }
}

// Fetch data from Node.js API
$settings = makeApiRequest("$nodeApiUrl/settings");
$products = makeApiRequest("$nodeApiUrl/products");
$orders = makeApiRequest("$nodeApiUrl/orders");

// Handle API offline state
$apiOnline = ($settings !== null);
$marginPercentage = $apiOnline ? ($settings['marginPercentage'] ?? 40) : 40;
$productsList = $apiOnline ? ($products ?? []) : [];
$ordersList = $apiOnline ? ($orders ?? []) : [];

// Calculate stats
$totalSales = 0;
$totalProfit = 0;
$pendingOrdersCount = 0;

foreach ($ordersList as $order) {
    $totalSales += $order['total'];
    if ($order['status'] === 'Pendiente') {
        $pendingOrdersCount++;
    }
    
    foreach ($order['items'] as $item) {
        $qty = $item['quantity'] ?? 1;
        $salePrice = $item['salePrice'] ?? $item['price'] ?? 0;
        $originalPrice = $item['originalPrice'] ?? ($salePrice / (1 + $marginPercentage / 100));
        $totalProfit += ($salePrice - $originalPrice) * $qty;
    }
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UtilTech - Panel de Administración</title>
    <style>
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --border: #334155;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            padding: 2rem;
            min-height: 100vh;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo span {
            color: var(--accent);
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .status-online {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-offline {
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .grid-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .stat-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background-color: var(--accent);
        }

        .stat-card.profit::before {
            background-color: var(--success);
        }

        .stat-card.pending::before {
            background-color: var(--warning);
        }

        .stat-title {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
        }

        .content-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        @media (min-width: 1024px) {
            .content-layout {
                grid-template-columns: 350px 1fr;
            }
        }

        .panel-box {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            height: fit-content;
        }

        .panel-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.5rem;
        }

        .form-group {
            margin-bottom: 1.25rem;
        }

        .form-label {
            display: block;
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .input-group {
            position: relative;
            display: flex;
            align-items: center;
        }

        .form-input {
            width: 100%;
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
        }

        .form-input:focus {
            border-color: var(--accent);
        }

        .btn {
            display: inline-block;
            width: 100%;
            background-color: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.75rem 1.25rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
            text-align: center;
            text-decoration: none;
        }

        .btn:hover {
            background-color: var(--accent-hover);
        }

        .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
            border-radius: 4px;
            width: auto;
        }

        .btn-success {
            background-color: var(--success);
        }
        .btn-success:hover {
            background-color: #059669;
        }

        .alert {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }

        .alert-success {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .alert-danger {
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .table-container {
            width: 100%;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.5rem;
        }

        th {
            text-align: left;
            padding: 0.75rem 1rem;
            color: var(--text-secondary);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid var(--border);
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.95rem;
        }

        tr:hover td {
            background-color: rgba(255, 255, 255, 0.02);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge-info {
            background-color: rgba(59, 130, 246, 0.15);
            color: var(--accent);
        }

        .badge-success {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--success);
        }

        .badge-warning {
            background-color: rgba(245, 158, 11, 0.15);
            color: var(--warning);
        }

        .help-box {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: rgba(59, 130, 246, 0.05);
            border: 1px dashed var(--accent);
            border-radius: 8px;
            font-size: 0.85rem;
            line-height: 1.4;
        }

        .help-box code {
            background-color: var(--bg-primary);
            padding: 0.1rem 0.3rem;
            border-radius: 4px;
            color: var(--accent);
        }

        /* Modal styling */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }
        .modal-content {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            padding: 2rem;
            border-radius: 12px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            position: relative;
        }
        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
        }
        .close-modal:hover {
            color: var(--text-primary);
        }
        .fulfillment-item {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .copy-btn {
            background-color: var(--border);
            color: var(--text-primary);
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
        }
        .copy-btn:hover {
            background-color: var(--accent);
        }
    </style>
</head>
<body>

    <header>
        <a href="#" class="logo">Util<span>Tech</span> Admin</a>
        <div>
            <?php if ($apiOnline): ?>
                <span class="status-badge status-online">● Backend Online</span>
            <?php else: ?>
                <span class="status-badge status-offline">● Backend Offline</span>
            <?php endif; ?>
        </div>
    </header>

    <?php if (!$apiOnline): ?>
        <div class="alert alert-danger">
            <strong>Atención:</strong> El servidor de Node.js no está respondiendo. Para inicializar el panel, inicia la API ejecutando <code>npm run dev</code> en la carpeta <code>backend/</code>.
        </div>
    <?php endif; ?>

    <?php if ($message): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($message); ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <div class="grid-stats">
        <div class="stat-card">
            <div class="stat-title">Ventas Totales</div>
            <div class="stat-value">$<?php echo number_format($totalSales, 2); ?></div>
        </div>
        <div class="stat-card profit">
            <div class="stat-title">Ganancia Estimada</div>
            <div class="stat-value">$<?php echo number_format($totalProfit, 2); ?></div>
        </div>
        <div class="stat-card pending">
            <div class="stat-title">Pedidos Pendientes</div>
            <div class="stat-value"><?php echo $pendingOrdersCount; ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Productos en Catálogo</div>
            <div class="stat-value"><?php echo count($productsList); ?></div>
        </div>
    </div>

    <div class="content-layout">
        <!-- Sidebar Controls -->
        <div class="panel-box">
            <h2 class="panel-title">Ajustes de Dropshipping</h2>
            <form method="POST" action="">
                <div class="form-group">
                    <label class="form-label" for="margin_percentage">Margen de Ganancia (%)</label>
                    <div class="input-group">
                        <input type="number" step="0.1" name="margin_percentage" id="margin_percentage" class="form-input" value="<?php echo htmlspecialchars($marginPercentage); ?>" <?php echo !$apiOnline ? 'disabled' : ''; ?>>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                        Multiplicador actual aplicado: x<?php echo number_format(1 + $marginPercentage/100, 2); ?> sobre el precio original chino.
                    </span>
                </div>
                <button type="submit" name="update_margin" class="btn" <?php echo !$apiOnline ? 'disabled' : ''; ?>>Guardar Configuración</button>
            </form>

            <div class="help-box">
                <strong>¿Cómo agregar productos?</strong><br>
                Corre el scraper de Python desde la terminal para importar automáticamente nuevos gadgets económicos desde la web:<br><br>
                <code>python scraper/scraper.py</code>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="panel-box" style="flex-grow: 1;">
            <h2 class="panel-title">Inventario de Productos Importados</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>P. Original (Costo)</th>
                            <th>Margen</th>
                            <th>P. Venta (Tienda)</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($productsList)): ?>
                            <tr>
                                <td colspan="6" style="text-align: center; color: var(--text-secondary);">No hay productos registrados en la base de datos.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($productsList as $product): ?>
                                <tr>
                                    <td style="font-weight: 600;">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img src="<?php echo htmlspecialchars($product['image'] ?? '/images/default.svg'); ?>" alt="<?php echo htmlspecialchars($product['title']); ?>" style="width: 36px; height: 36px; border-radius: 4px; object-fit: contain; background: #fff; padding: 2px; flex-shrink: 0;" onerror="this.src='/images/default.svg'">
                                            <div>
                                                <?php echo htmlspecialchars($product['title']); ?>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: normal; margin-top: 0.25rem;">
                                                    ⚖️ <?php echo htmlspecialchars($product['weight'] ?? '300 g'); ?> | 📐 <?php echo htmlspecialchars($product['dimensions'] ?? '15x10x5 cm'); ?>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="badge badge-info"><?php echo htmlspecialchars($product['category']); ?></span></td>
                                    <td>$<?php echo number_format($product['originalPrice'], 2); ?></td>
                                    <td><?php echo $marginPercentage; ?>%</td>
                                    <td style="color: var(--success); font-weight: 600;">$<?php echo number_format($product['salePrice'], 2); ?></td>
                                    <td><?php echo $product['stock']; ?> uds.</td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <h2 class="panel-title" style="margin-top: 2.5rem;">Pedidos Recibidos (Gestión Dropshipping)</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fulfillment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($ordersList)): ?>
                            <tr>
                                <td colspan="7" style="text-align: center; color: var(--text-secondary);">No se han recibido pedidos aún.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($ordersList as $order): ?>
                                <tr>
                                    <td style="font-family: monospace; font-size: 0.85rem;"><?php echo htmlspecialchars($order['id']); ?></td>
                                    <td>
                                        <div style="font-weight: 600;"><?php echo htmlspecialchars($order['customerName']); ?></div>
                                        <div style="font-size: 0.75rem; color: var(--text-secondary);"><?php echo htmlspecialchars($order['email']); ?></div>
                                    </td>
                                    <td style="font-size: 0.85rem;"><?php echo date('d/m/Y H:i', strtotime($order['date'])); ?></td>
                                    <td>
                                        <div style="font-size: 0.85rem;">
                                            <?php foreach ($order['items'] as $item): ?>
                                                • <?php echo htmlspecialchars($item['title']); ?> (x<?php echo $item['quantity']; ?>)<br>
                                            <?php endforeach; ?>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; color: var(--success);">$<?php echo number_format($order['total'], 2); ?></td>
                                    <td>
                                        <span class="badge badge-warning"><?php echo htmlspecialchars($order['status']); ?></span>
                                    </td>
                                    <td>
                                        <!-- Dropshipping Fulfillment Helper Button -->
                                        <button class="btn btn-sm btn-success" onclick="openFulfillmentModal(
                                            '<?php echo addslashes(htmlspecialchars($order['customerName'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['dni'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['phone'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['address'] . ($order['apartment'] ? ' - '.$order['apartment'] : ''))); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['zipCode'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['city'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['province'] ?? '')); ?>',
                                            '<?php echo addslashes(htmlspecialchars($order['email'] ?? '')); ?>',
                                            '<?php 
                                                $firstProduct = $order['items'][0];
                                                $prodId = $firstProduct['id'] ?? '';
                                                $supUrl = 'https://es.aliexpress.com/';
                                                foreach($productsList as $p) {
                                                    if ($p['id'] === $prodId && !empty($p['supplierUrl'])) {
                                                        $supUrl = $p['supplierUrl'];
                                                        break;
                                                    }
                                                }
                                                echo htmlspecialchars($supUrl);
                                            ?>'
                                        )">Comprar Proveedor</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Fulfillment Modal -->
    <div id="fulfillmentModal" class="modal">
        <div class="modal-content" style="max-height: 90vh; overflow-y: auto;">
            <button class="close-modal" onclick="closeFulfillmentModal()">&times;</button>
            <h2 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; font-size: 1.25rem;">Asistente de Pedido Dropshipping</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Copia los datos de entrega de tu cliente. Recuerda que para aduana internacional (AliExpress), **el DNI y el Teléfono son requeridos**:
            </p>
            
            <div class="form-label">Nombre del Destinatario</div>
            <div class="fulfillment-item">
                <span id="fName" style="font-weight: 600;">-</span>
                <button class="copy-btn" onclick="copyText('fName')">Copiar</button>
            </div>

            <div class="form-label">DNI / Identificación Fiscal (Aduana)</div>
            <div class="fulfillment-item">
                <span id="fDni" style="font-weight: 600; color: var(--success);">-</span>
                <button class="copy-btn" onclick="copyText('fDni')">Copiar</button>
            </div>

            <div class="form-label">Teléfono / Celular (Courier)</div>
            <div class="fulfillment-item">
                <span id="fPhone" style="font-weight: 600;">-</span>
                <button class="copy-btn" onclick="copyText('fPhone')">Copiar</button>
            </div>

            <div class="form-label">Dirección de Envío</div>
            <div class="fulfillment-item">
                <span id="fAddress" style="font-weight: 600;">-</span>
                <button class="copy-btn" onclick="copyText('fAddress')">Copiar</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                <div>
                    <div class="form-label">CP</div>
                    <div class="fulfillment-item" style="padding: 0.5rem;">
                        <span id="fZip" style="font-size: 0.8rem; font-weight: 600;">-</span>
                        <button class="copy-btn" style="padding: 0.2rem 0.4rem; font-size: 0.65rem;" onclick="copyText('fZip')">Cp</button>
                    </div>
                </div>
                <div>
                    <div class="form-label">Ciudad</div>
                    <div class="fulfillment-item" style="padding: 0.5rem;">
                        <span id="fCity" style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</span>
                        <button class="copy-btn" style="padding: 0.2rem 0.4rem; font-size: 0.65rem;" onclick="copyText('fCity')">Cp</button>
                    </div>
                </div>
                <div>
                    <div class="form-label">Provincia</div>
                    <div class="fulfillment-item" style="padding: 0.5rem;">
                        <span id="fProvince" style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</span>
                        <button class="copy-btn" style="padding: 0.2rem 0.4rem; font-size: 0.65rem;" onclick="copyText('fProvince')">Cp</button>
                    </div>
                </div>
            </div>

            <div class="form-label" style="margin-top: 1rem;">Email (Notificaciones)</div>
            <div class="fulfillment-item">
                <span id="fEmail" style="font-weight: 600;">-</span>
                <button class="copy-btn" onclick="copyText('fEmail')">Copiar</button>
            </div>

            <div style="margin-top: 2rem;">
                <a href="#" id="fSupplierLink" target="_blank" class="btn btn-success" style="display: block; text-decoration: none;">Comprar en AliExpress (Proveedor)</a>
            </div>
        </div>
    </div>

    <script>
        function openFulfillmentModal(name, dni, phone, address, zip, city, province, email, supplierLink) {
            document.getElementById('fName').innerText = name;
            document.getElementById('fDni').innerText = dni || 'No cargado';
            document.getElementById('fPhone').innerText = phone || 'No cargado';
            document.getElementById('fAddress').innerText = address;
            document.getElementById('fZip').innerText = zip || '-';
            document.getElementById('fCity').innerText = city || '-';
            document.getElementById('fProvince').innerText = province || '-';
            document.getElementById('fEmail').innerText = email;
            document.getElementById('fSupplierLink').href = supplierLink;
            document.getElementById('fulfillmentModal').style.display = 'flex';
        }

        function closeFulfillmentModal() {
            document.getElementById('fulfillmentModal').style.display = 'none';
        }

        function copyText(elementId) {
            const text = document.getElementById(elementId).innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert('¡Copiado!');
            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        }
    </script>

</body>
</html>
