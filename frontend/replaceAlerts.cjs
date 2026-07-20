const fs = require('fs');
let txt = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Inject Toast State and Function
const hookPosition = txt.indexOf('const [isDarkMode, setIsDarkMode]');
if (hookPosition !== -1 && !txt.includes('setToastMessage')) {
  const insertText = `
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success', visible: false });
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, visible: true });
    setTimeout(() => {
      setToastMessage(prev => ({ ...prev, visible: false }));
    }, 3500);
  };
`;
  txt = txt.slice(0, hookPosition) + insertText + txt.slice(hookPosition);
}

// 2. Replace alert() with showToast()
txt = txt.replace(/alert\((.*)\);/g, (match, p1) => {
  if (p1.toLowerCase().includes('error') || p1.toLowerCase().includes('fallo') || p1.toLowerCase().includes('disculpas')) {
    return `showToast(${p1}, 'error');`;
  }
  return `showToast(${p1});`;
});

// 3. Inject Toast JSX Component right before the final closing </ThemeContext.Provider>
const endPosition = txt.lastIndexOf('</ThemeContext.Provider>');
if (endPosition !== -1 && !txt.includes('toast-container')) {
  const toastJsx = `
        {/* Custom Centralized Toast Notification */}
        {toastMessage.visible && (
          <div className="toast-container" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: toastMessage.type === 'error' ? 'var(--error)' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            color: 'var(--text-dark)',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: '600',
            fontSize: '1.1rem',
            animation: 'fadeInOut 3.5s ease-in-out forwards',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {toastMessage.type === 'error' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            <span>{toastMessage.text}</span>
          </div>
        )}
      `;
  txt = txt.slice(0, endPosition) + toastJsx + txt.slice(endPosition);
}

fs.writeFileSync('src/App.jsx', txt, 'utf8');
console.log('App.jsx alerts replaced with Custom Toast!');
