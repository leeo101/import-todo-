import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const BACKEND_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true); // Can be checked or set here
  
  // Auth Form / Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authError, setAuthError] = useState('');
  
  // Form Fields
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDni, setAuthDni] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authApartment, setAuthApartment] = useState('');
  const [authZipCode, setAuthZipCode] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [authProvince, setAuthProvince] = useState('');
  const [authPrivacyAccepted, setAuthPrivacyAccepted] = useState(false);

  // Initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('utiltech_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setLoggedInUser(user);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loginUser = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('utiltech_user', JSON.stringify(user));
    
    setAuthModalOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthDni('');
    setAuthPhone('');
    setAuthAddress('');
    setAuthApartment('');
    setAuthZipCode('');
    setAuthCity('');
    setAuthProvince('');
    setAuthPrivacyAccepted(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('utiltech_user');
  };

  const updateUserProfile = (updatedFields) => {
    setLoggedInUser(prev => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('utiltech_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      if (!authEmail || !authPassword) {
        setAuthError('Por favor completa todos los campos.');
        return;
      }

      if (!backendOnline) {
        if (authEmail === 'admin@utiltech.com' && authPassword === 'admin') {
          const mockUser = { 
            id: 'usr_1', 
            name: 'Administrador Demo', 
            email: authEmail, 
            dni: '99888777',
            phone: '1199998888',
            address: 'Av. Corrientes 1234',
            apartment: 'Piso 5 B',
            zipCode: '1043',
            city: 'CABA',
            province: 'Buenos Aires'
          };
          loginUser(mockUser);
        } else {
          setAuthError('Error: Servidor backend offline. Usa admin@utiltech.com / admin.');
        }
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail, password: authPassword })
        });
        const result = await response.json();
        if (response.ok) {
          loginUser(result.user);
        } else {
          setAuthError(result.error || 'Error al iniciar sesión.');
        }
      } catch (err) {
        setAuthError('No se pudo conectar con el servidor.');
      }

    } else {
      if (!authName || !authEmail || !authPassword || !authDni || !authPhone || !authAddress || !authZipCode || !authCity || !authProvince) {
        setAuthError('Todos los campos son obligatorios para garantizar la seguridad de tus envíos.');
        return;
      }

      if (!authPrivacyAccepted) {
        setAuthError('Debes aceptar las Políticas de Privacidad y Términos de Servicio para registrarte.');
        return;
      }

      if (authPassword.length < 8) {
        setAuthError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (!/[A-Za-z]/.test(authPassword) || !/[0-9]/.test(authPassword)) {
        setAuthError('La contraseña debe combinar letras y números.');
        return;
      }

      const payload = {
        name: authName,
        email: authEmail,
        password: authPassword,
        dni: authDni,
        phone: authPhone,
        address: authAddress,
        apartment: authApartment,
        zipCode: authZipCode,
        city: authCity,
        province: authProvince
      };

      if (!backendOnline) {
        const mockUser = { id: `usr_${Date.now()}`, ...payload };
        loginUser(mockUser);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok) {
          loginUser(result.user);
        } else {
          setAuthError(result.error || 'Error al registrarse.');
        }
      } catch (err) {
        setAuthError('No se pudo conectar con el servidor.');
      }
    }
  };

  const value = {
    loggedInUser, setLoggedInUser,
    authModalOpen, setAuthModalOpen,
    authMode, setAuthMode,
    authError, setAuthError,
    authName, setAuthName,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    authDni, setAuthDni,
    authPhone, setAuthPhone,
    authAddress, setAuthAddress,
    authApartment, setAuthApartment,
    authZipCode, setAuthZipCode,
    authCity, setAuthCity,
    authProvince, setAuthProvince,
    authPrivacyAccepted, setAuthPrivacyAccepted,
    loginUser,
    handleLogout,
    updateUserProfile,
    handleAuthSubmit,
    backendOnline, setBackendOnline
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
