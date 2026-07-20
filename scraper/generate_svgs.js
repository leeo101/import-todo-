const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const svgs = {
  "default.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <circle cx="50" cy="50" r="30" fill="url(#grad)"/>
        <rect x="35" y="35" width="30" height="30" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="50" cy="50" r="6" fill="#3b82f6"/>
    </svg>`,

  "humidifier.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60a5fa"/>
                <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Steam -->
        <path d="M45 25 Q48 15 45 10 Q42 5 45 0" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M50 25 Q53 17 50 12 Q47 7 50 2" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
        <path d="M55 25 Q58 15 55 10 Q52 5 55 0" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <!-- Humidifier Body -->
        <rect x="35" y="35" width="30" height="40" rx="6" fill="url(#blueGrad)"/>
        <rect x="35" y="45" width="30" height="4" fill="#1e293b"/>
        <circle cx="50" cy="58" r="4" fill="#ffffff" opacity="0.8"/>
    </svg>`,

  "tracker.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
            <radialGradient id="greenGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#1e293b" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <circle cx="50" cy="50" r="35" fill="url(#greenGrad)"/>
        <!-- Radar rings -->
        <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.8"/>
        <!-- Tracker Tag -->
        <rect x="42" y="42" width="16" height="16" rx="8" fill="#10b981"/>
        <circle cx="50" cy="50" r="3" fill="#ffffff"/>
        <!-- Ring loop -->
        <circle cx="50" cy="36" r="4" fill="none" stroke="#10b981" stroke-width="2"/>
    </svg>`,

  "led_light.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
            <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Rays -->
        <line x1="50" y1="20" x2="50" y2="10" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="25" y1="45" x2="15" y2="45" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="75" y1="45" x2="85" y2="45" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="32" y1="27" x2="25" y2="20" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="68" y1="27" x2="75" y2="20" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <!-- LED Light Bar / Bulb -->
        <rect x="25" y="45" width="50" height="16" rx="8" fill="url(#yellowGrad)"/>
        <rect x="35" y="61" width="30" height="12" fill="#94a3b8" rx="2"/>
        <!-- Sensor cap -->
        <circle cx="50" cy="53" r="5" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
    </svg>`,

  "cable_organizer.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Cable Base -->
        <rect x="20" y="55" width="60" height="15" rx="5" fill="#475569"/>
        <!-- Magnetic clips -->
        <circle cx="35" cy="50" r="6" fill="#818cf8"/>
        <circle cx="50" cy="50" r="6" fill="#a78bfa"/>
        <circle cx="65" cy="50" r="6" fill="#f472b6"/>
        <!-- Cables -->
        <line x1="35" y1="50" x2="35" y2="25" stroke="#818cf8" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="50" x2="50" y2="20" stroke="#a78bfa" stroke-width="3" stroke-linecap="round"/>
        <line x1="65" y1="50" x2="65" y2="25" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  "neck_fan.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Neck band -->
        <path d="M 30 70 A 25 25 0 0 1 70 70" fill="none" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round"/>
        <path d="M 30 70 A 25 25 0 0 1 70 70" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <!-- Fan Heads -->
        <rect x="22" y="62" width="16" height="16" rx="8" fill="#38bdf8"/>
        <rect x="62" y="62" width="16" height="16" rx="8" fill="#38bdf8"/>
        <!-- Wind curves -->
        <path d="M 18 50 Q 12 40 20 30" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <path d="M 82 50 Q 88 40 80 30" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>`,

  "scale.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Scale Platform -->
        <rect x="20" y="25" width="60" height="55" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="22" y="27" width="56" height="15" fill="#cbd5e1" rx="4"/>
        <!-- Display -->
        <rect x="35" y="32" width="30" height="8" rx="2" fill="#000000"/>
        <text x="50" y="39" fill="#00ff00" font-family="monospace" font-size="7" text-anchor="middle">0.00 kg</text>
        <!-- Glass Accent -->
        <path d="M 24 29 L 76 29" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
    </svg>`,

  "wireless_charger.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <circle cx="50" cy="50" r="32" fill="#334155" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="50" cy="50" r="24" fill="none" stroke="#475569" stroke-width="1"/>
        <!-- Lightning bolt -->
        <path d="M 52 35 L 43 49 L 49 49 L 47 65 L 57 51 L 51 51 Z" fill="#22d3ee"/>
    </svg>`,

  "bluetooth_dongle.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Metal USB connector -->
        <rect x="42" y="25" width="16" height="15" fill="#94a3b8" rx="1"/>
        <rect x="45" y="28" width="3" height="4" fill="#334155"/>
        <rect x="52" y="28" width="3" height="4" fill="#334155"/>
        <!-- Plastic body -->
        <rect x="35" y="40" width="30" height="35" rx="6" fill="#3b82f6"/>
        <!-- Bluetooth sign -->
        <path d="M 50 48 L 50 68 L 55 63 L 45 53 L 55 53 L 45 63 Z" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`,

  "mini_vacuum.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Body -->
        <path d="M 30 55 L 70 35 L 75 42 L 35 62 Z" fill="#64748b"/>
        <path d="M 70 35 L 78 20 Q 82 20 80 25 L 75 42" fill="#475569"/>
        <!-- Handle -->
        <path d="M 32 58 Q 20 62 25 72 Q 35 72 35 62" fill="none" stroke="#475569" stroke-width="5" stroke-linecap="round"/>
        <!-- Suction ripples -->
        <path d="M 85 15 Q 89 20 85 25" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M 90 12 Q 95 18 90 24" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
    </svg>`,

  "smart_plug.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Body -->
        <circle cx="50" cy="50" r="28" fill="#f8fafc"/>
        <rect x="42" y="44" width="4" height="12" rx="2" fill="#cbd5e1"/>
        <rect x="54" y="44" width="4" height="12" rx="2" fill="#cbd5e1"/>
        <!-- Wifi icon -->
        <path d="M 44 32 A 8 8 0 0 1 56 32" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
        <path d="M 47 35 A 4 4 0 0 1 53 35" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
        <circle cx="50" cy="38" r="1.5" fill="#10b981"/>
    </svg>`,

  "stylus.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Pencil -->
        <path d="M 75 25 L 35 65 L 30 70 L 35 65 L 30 70 L 25 75 L 32 72 L 35 65 Z" fill="#94a3b8"/>
        <!-- Tip -->
        <path d="M 25 75 L 28 71 L 24 67 Z" fill="#3b82f6"/>
        <!-- Drawing wave line -->
        <path d="M 20 80 Q 40 75 60 82 T 90 75" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  "phone_stand.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100" height="100" rx="15" fill="#1e293b"/>
        <!-- Aluminum Stand -->
        <path d="M 30 80 L 70 80 L 65 76 L 35 76 Z" fill="#475569"/>
        <path d="M 50 80 L 65 40 L 58 35 L 43 75 Z" fill="#64748b"/>
        <!-- Hook -->
        <path d="M 58 35 Q 64 35 60 45" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
        <!-- Phone silhouette -->
        <rect x="52" y="15" width="22" height="42" rx="3" transform="rotate(15 52 15)" fill="none" stroke="#94a3b8" stroke-width="2" opacity="0.6"/>
    </svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Generated ${filename}`);
}

console.log("SVG Generation completed successfully!");
