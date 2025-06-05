import React, { useState, useEffect, useRef } from 'react';
import { Cookie, CheckCircle, XCircle } from 'lucide-react';
import { initializeAcceptedTrackingScripts } from '../utils/scriptManager'; // Importar

const COOKIE_CONSENT_KEY = 'flujodigital_cookie_consent';

const CookieConsentBanner = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef(null);
  const acceptButtonRef = useRef(null);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    // Mostrar solo si no hay consentimiento previo o si fue explícitamente no establecido (ej. 'pending')
    // Si ya aceptó o rechazó, no mostrar.
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible && acceptButtonRef.current) {
      acceptButtonRef.current.focus();
    }

    const handleKeyDown = (event) => {
      if (!isVisible || !bannerRef.current) return;

      if (event.key === 'Escape') {
        // Opcional: permitir cerrar con Escape, podría interpretarse como rechazo implícito o posponer.
        // Por ahora, no hacemos nada con Escape para forzar una elección explícita.
        // handleConsent('declined'); // Ejemplo si se quisiera que Escape rechace
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          bannerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.disabled && el.offsetParent !== null); // Solo visibles y habilitados

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const handleConsent = (consentValue) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, consentValue);
    setIsVisible(false);
    console.log(`Cookie consent: ${consentValue}`);
    if (consentValue === 'accepted') {
      initializeAcceptedTrackingScripts();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md text-gray-200 p-4 sm:p-5 shadow-2xl z-[150] border-t border-gray-700/50"
      role="alertdialog" // Más específico que 'dialog' para un banner de consentimiento
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      tabIndex={-1} // Para poder hacer focus programático en el div si fuera necesario
    >
      {/* Título para lectores de pantalla, puede ser visualmente oculto si el diseño no lo incluye */}
      <h2 id="cookie-consent-title" className="sr-only">Consentimiento de Cookies</h2>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3">
          <Cookie className="w-8 h-8 sm:w-7 sm:h-7 text-emerald-400 flex-shrink-0 mt-1 sm:mt-0" />
          <p id="cookie-consent-description" className="text-sm leading-relaxed">
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
            // ref={rejectButtonRef} // Si necesitas referenciarlo
            className="flex-1 sm:flex-none w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600/80 text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Rechazar cookies"
          >
            <XCircle size={18} />
            <span>Rechazar</span>
          </button>
          <button
            onClick={() => handleConsent('accepted')}
            ref={acceptButtonRef}
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