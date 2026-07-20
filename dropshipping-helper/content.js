(function() {
  console.log('%c[ImportTodo Helper] Extensión activa en AliExpress / Amazon.', 'color: #06b6d4; font-weight: bold; font-size: 1.1em;');

  // Function to search and populate fields on checkout forms
  const attemptAutofill = () => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('importtodo_data=')) return;

    try {
      const base64Data = hash.split('importtodo_data=')[1].split('&')[0];
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(base64Data))));
      
      console.log('[ImportTodo Helper] Datos de despacho decodificados:', decodedData);

      // 1. Selector queries for AliExpress shipping fields
      const nameInput = document.querySelector('input[placeholder*="Nombre"], input[placeholder*="nombre"], input[placeholder*="Name"], input[name="contactName"], #contact-name, .address-form-item input[type="text"]');
      const phoneInput = document.querySelector('input[placeholder*="Teléfono"], input[placeholder*="teléfono"], input[placeholder*="Phone"], input[name="phone"], #phone');
      const addressInput = document.querySelector('input[placeholder*="Dirección"], input[placeholder*="dirección"], input[placeholder*="Address line 1"], input[name="address"], #address, input[placeholder*="Calle"]');
      const apartmentInput = document.querySelector('input[placeholder*="Piso"], input[placeholder*="apto"], input[placeholder*="Apartment"], input[name="address2"], #address2');
      const zipInput = document.querySelector('input[placeholder*="Postal"], input[placeholder*="postal"], input[placeholder*="Zip"], input[name="zip"], #zip, input[placeholder*="CP"]');
      const cityInput = document.querySelector('input[placeholder*="Ciudad"], input[placeholder*="ciudad"], input[placeholder*="City"], input[name="city"], #city, input[placeholder*="Localidad"]');
      const provinceInput = document.querySelector('input[placeholder*="Provincia"], input[placeholder*="provincia"], input[placeholder*="State"], input[name="province"], #province, input[placeholder*="Estado"]');
      const dniInput = document.querySelector('input[placeholder*="Documento"], input[placeholder*="documento"], input[placeholder*="DNI"], input[placeholder*="CUIT"], input[placeholder*="CPF"], input[name="cpf"], input[name="taxId"], #cpf');

      // Helper to fill input value and dispatch events so React/Vue models register the input
      const setInputValue = (input, value) => {
        if (!input || !value) return false;
        if (input.value === value) return false; // Already filled
        
        input.value = value;
        // Dispatch key inputs for modern frontend frameworks (React, Vue, Angular)
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
      };

      let filledAny = false;

      if (setInputValue(nameInput, decodedData.name)) filledAny = true;
      if (setInputValue(phoneInput, decodedData.phone)) filledAny = true;
      if (setInputValue(addressInput, decodedData.address)) filledAny = true;
      if (setInputValue(apartmentInput, decodedData.apartment)) filledAny = true;
      if (setInputValue(zipInput, decodedData.zipCode)) filledAny = true;
      if (setInputValue(cityInput, decodedData.city)) filledAny = true;
      if (setInputValue(provinceInput, decodedData.province)) filledAny = true;
      if (setInputValue(dniInput, decodedData.dni)) filledAny = true;

      if (filledAny) {
        console.log('%c[ImportTodo Helper] ¡Formulario autocompletado con éxito!', 'color: #10b981; font-weight: bold;');
      }

    } catch (e) {
      console.error('[ImportTodo Helper] Error al parsear datos Base64:', e);
    }
  };

  // Run DOM scanning loop every 900ms to detect dynamically rendered shipping modals/forms
  const fillInterval = setInterval(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('importtodo_data=')) {
      attemptAutofill();
    } else {
      // If we navigate away or hash changes, clear interval
      clearInterval(fillInterval);
    }
  }, 1200); // Scans periodically

  // Execute immediately
  setTimeout(attemptAutofill, 1000);
  setTimeout(attemptAutofill, 2500);

  // Re-run on address changes or hash updates
  window.addEventListener('hashchange', () => {
    setTimeout(attemptAutofill, 500);
  });
})();
