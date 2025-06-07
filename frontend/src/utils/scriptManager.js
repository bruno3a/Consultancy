// src/utils/scriptManager.js

const SCRIPT_LOAD_STATUS = {
  GA: false,
  FB_PIXEL: false,
  // Agrega aquí otros scripts que necesites gestionar
};

const COOKIE_CONSENT_KEY = 'neurasur_cookie_consent';

/**
 * Carga el script de Google Analytics.
 * @param {string} gaId - Tu ID de Google Analytics (ej. G-XXXXXXXXXX o UA-XXXXXXXXX-X).
 */
export const loadGoogleAnalytics = (gaId) => {
  if (SCRIPT_LOAD_STATUS.GA || !gaId || typeof window === 'undefined' || typeof document === 'undefined') return;

  if (document.getElementById('ga-script')) {
    SCRIPT_LOAD_STATUS.GA = true;
    return;
  }

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || []; // Ensure dataLayer is treated as a window property
    function gtag(){window.dataLayer.push(arguments);} // Use window.dataLayer
    gtag('js', new Date());
    gtag('config', gaId);
    SCRIPT_LOAD_STATUS.GA = true;
    console.log('Google Analytics cargado y configurado.');
  };
  script.onerror = () => {
    console.error('Error al cargar Google Analytics.');
  };
};

/**
 * Carga el script del Píxel de Facebook.
 * @param {string} pixelId - Tu ID del Píxel de Facebook.
 */
export const loadFacebookPixel = (pixelId) => {
  if (SCRIPT_LOAD_STATUS.FB_PIXEL || !pixelId || typeof window === 'undefined' || typeof document === 'undefined') return;
  
  if (document.getElementById('fb-pixel-script')) {
    SCRIPT_LOAD_STATUS.FB_PIXEL = true;
    return;
  }

  // Lógica para cargar el Píxel de Facebook
  // Esto es un ejemplo, ajusta según las instrucciones de Facebook
  void function(f,b,e,v,n,t,s) // Added void to satisfy no-unused-expressions
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;t.id='fb-pixel-script';s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  // Check if fbq is defined on window before using it
  if (window.fbq) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
  SCRIPT_LOAD_STATUS.FB_PIXEL = true;
  console.log('Facebook Pixel cargado y configurado.');
};

/**
 * Inicializa los scripts de seguimiento si el consentimiento fue otorgado.
 * Se llama al cargar la página y cuando se acepta el consentimiento.
 */
export const initializeAcceptedTrackingScripts = () => {
  const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consentStatus === 'accepted') {
    console.log('Consentimiento de cookies aceptado. Inicializando scripts de seguimiento...');
    // Reemplaza con tus IDs reales, idealmente desde variables de entorno
    loadGoogleAnalytics(process.env.REACT_APP_GA_ID || 'TU_GA_ID');
    loadFacebookPixel(process.env.REACT_APP_FB_PIXEL_ID || 'TU_FB_PIXEL_ID');
    // Llama aquí a otras funciones de carga de scripts
  } else {
    console.log('Scripts de seguimiento no inicializados. Estado del consentimiento:', consentStatus || 'no establecido');
  }
};
