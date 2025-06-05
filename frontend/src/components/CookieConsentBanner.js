import React, { useState, useEffect } from 'react';
import { Cookie, CheckCircle, XCircle } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'flujodigital_cookie_consent';

const CookieConsentBanner = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    // Mostrar solo si no hay consentimiento previo o si fue explícitamente no establecido (ej. 'pending')
    // Si ya aceptó o rechazó, no mostrar.
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (consentValue) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, consentValue);
    setIsVisible(false);
    // Aquí podrías añadir lógica adicional si es necesario,
    // como inicializar scripts de tracking si 'accepted',
    // o asegurarse de que no se carguen si 'declined'.
    // Por ahora, solo guardamos la preferencia.
    console.log(`Cookie consent: ${consentValue}`);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md text-gray-200 p-4 sm:p-5 shadow-2xl z-[150] border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3">
          <Cookie className="w-8 h-8 sm:w-7 sm:h-7 text-emerald-400 flex-shrink-0 mt-1 sm:mt-0" />
          <p className="text-sm leading-relaxed">
            Este sitio web utiliza cookies para mejorar tu experiencia y analizar el tráfico. Al hacer clic en "Aceptar", aceptas nuestro uso de cookies. Puedes obtener más información en nuestra{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200 focus:outline-none"
            >
              Política de Privacidad
            </button>
            .
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => handleConsent('declined')}
            className="flex-1 sm:flex-none w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600/80 text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Rechazar cookies"
          >
            <XCircle size={18} />
            <span>Rechazar</span>
          </button>
          <button
            onClick={() => handleConsent('accepted')}
            className="flex-1 sm:flex-none w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Aceptar cookies"
          >
            <CheckCircle size={18} />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;