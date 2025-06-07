import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  FileText, 
  Shield, 
  Users, 
  Store, 
  Smartphone, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Globe,
  BarChart3,
  Wrench,
  RefreshCw,
  Bot
} from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // Importar Helmet
import PendingTasks from './PendingTasks';
import PreviewBanner from './PreviewBanner';
import PrivacyPolicyPopup from './PrivacyPolicyPopup'; // Importar el nuevo componente
import TermsOfUsePopup from './TermsOfUsePopup'; // Importar el nuevo componente de Términos de Uso
import CookieConsentBanner from './CookieConsentBanner'; // Importar el banner de cookies
import { initializeAcceptedTrackingScripts } from '../utils/scriptManager'; // Importar para inicialización

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  TypingIndicator,
  ConversationHeader,
  Button
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './ChatScopeStyles.css'; // Nuestros estilos personalizados para el contenedor del chat
import ChatErrorBoundary from './ChatErrorBoundary'; // Importar el ErrorBoundary

import { useForm, ValidationError } from '@formspree/react';
const LandingPage = ({ showPendingTasks, isPreview }) => {
  const [isVisible, setIsVisible] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Detectar automáticamente el modo preview
  // La prop `showPendingTasks` podría ser redundante si `isPreview` ya está configurada correctamente.
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Estado para el formulario de contacto (usado principalmente por N8N)
  const [contactFormData, setContactFormData] = useState({
    email: '',
    message: ''
  });

  // Estados para el envío del formulario de contacto con N8N
  const [isN8NSubmitting, setIsN8NSubmitting] = useState(false);
  const [n8nSubmitStatus, setN8NSubmitStatus] = useState(null); // null, 'success', 'error'
  const [n8nSubmitMessage, setN8NSubmitMessage] = useState('');


  // Estado para gestionar el popup activo ('privacy-policy', 'terms-of-use', o null)
  const [activePopup, setActivePopup] = useState(null);

  // Feature Flag y URLs/IDs para el formulario de contacto
  const CONTACT_FORM_PROVIDER = process.env.REACT_APP_CONTACT_FORM_PROVIDER || 'n8n'; // 'n8n' (default) or 'formspree'
  const N8N_CONTACT_FORM_WEBHOOK_URL = process.env.REACT_APP_N8N_CONTACT_FORM_WEBHOOK_URL || 'TU_N8N_CONTACT_FORM_WEBHOOK_URL_AQUI';
  const FORMSPREE_FORM_ID = process.env.REACT_APP_FORMSPREE_FORM_ID || 'TU_FORMSPREE_FORM_ID_AQUI'; // Necesario si provider es 'formspree'

  // Estados para el Chat con @chatscope/chat-ui-kit-react
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // IMPORTANTE: Reemplaza esta URL con la URL de tu webhook de n8n
  const N8N_CHATBOT_WEBHOOK_URL = process.env.REACT_APP_N8N_CHATBOT_WEBHOOK_URL || 'TU_N8N_WEBHOOK_URL_POR_DEFECTO_AQUI';

  // Hook de Formspree (se llama incondicionalmente debido a las reglas de los hooks, pero solo se usa si el proveedor es 'formspree')
  const [formspreeState, formspreeHandleSubmitFunction] = useForm(FORMSPREE_FORM_ID);

  useEffect(() => {
    if (CONTACT_FORM_PROVIDER === 'formspree' && (FORMSPREE_FORM_ID === 'TU_FORMSPREE_FORM_ID_AQUI' || !FORMSPREE_FORM_ID)) {
      console.warn('ADVERTENCIA: El proveedor del formulario de contacto es "formspree", pero REACT_APP_FORMSPREE_FORM_ID no está configurado correctamente en el archivo .env. El formulario de contacto puede no funcionar.');
    }
    if (CONTACT_FORM_PROVIDER === 'n8n' && (N8N_CONTACT_FORM_WEBHOOK_URL === 'TU_N8N_CONTACT_FORM_WEBHOOK_URL_AQUI' || !N8N_CONTACT_FORM_WEBHOOK_URL)) {
      console.warn('ADVERTENCIA: El proveedor del formulario de contacto es "n8n", pero REACT_APP_N8N_CONTACT_FORM_WEBHOOK_URL no está configurado correctamente en el archivo .env. El formulario de contacto puede no funcionar.');
    }
  }, []); // Se ejecuta solo una vez al montar


  // Detectar modo preview
  useEffect(() => {
    // Detectar preview por URL, variable de entorno, o prop
    const urlParams = new URLSearchParams(window.location.search);
    const isUrlPreview = urlParams.get('preview') === 'true';
    const isEnvPreview = process.env.NODE_ENV === 'development';
    const isPropPreview = isPreview === true;
    const isEnvVarPreview = process.env.REACT_APP_PREVIEW_MODE === 'true';
    
    // También detectar si estamos en localhost
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    
    setIsPreviewMode(isUrlPreview || isEnvPreview || isPropPreview || isEnvVarPreview || isLocalhost);
    
    // Log para debugging
    console.log('Preview Mode Detection:', {
      isUrlPreview,
      isEnvPreview,
      isPropPreview,
      isEnvVarPreview,
      isLocalhost,
      finalPreviewMode: isUrlPreview || isEnvPreview || isPropPreview || isEnvVarPreview || isLocalhost
    });
  }, [isPreview]);

  // Inicializar scripts de seguimiento si ya hay consentimiento al cargar la página
  useEffect(() => {
    initializeAcceptedTrackingScripts();

    // Mensaje de bienvenida inicial para el chat
    // Se añade solo si no hay mensajes (ej. al cargar la página por primera vez)
    if (chatMessages.length === 0) {
      // Esta lógica de bienvenida podría ser condicional o incluso eliminarse
      // si el ErrorBoundary se activa antes de que el chat pueda inicializarse completamente.
        setChatMessages([
          {
            message: "¡Hola! Represento a NeuraSur. Contame qué necesitás.",
            sender: "NeuraSurBot",
            direction: "incoming",
          }
        ]);
    }
  }, [chatMessages.length]); // Se ejecuta si chatMessages.length cambia, para evitar múltiples bienvenidas.

  // Navigation items
  const navItems = [
    { id: 'hero', label: 'Inicio', icon: null },
    { id: 'services', label: 'Servicios', icon: <Zap className="w-4 h-4" /> },
    { id: 'product', label: 'Productos', icon: <FileText className="w-4 h-4" /> },
    { id: 'audience', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contacto', icon: <Phone className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para manejar la visibilidad de los popups vía URL
  useEffect(() => {
    const handlePopupFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const showParam = urlParams.get('show');
      // Solo activa popups conocidos para evitar abrir modales no deseados
      if (showParam === 'privacy-policy' || showParam === 'terms-of-use') {
        setActivePopup(showParam);
      } else if (activePopup && !showParam) { // Si había un popup activo y el param se quitó
        setActivePopup(null);
      }
    };

    handlePopupFromUrl(); // Comprobar al montar
    window.addEventListener('popstate', handlePopupFromUrl); // Escuchar cambios en el historial
    return () => window.removeEventListener('popstate', handlePopupFromUrl);
  }, [activePopup]); // Re-ejecutar si activePopup cambia para asegurar consistencia si se cierra programáticamente




  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleContactFormInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleN8NSubmit = async (e) => {
    e.preventDefault();
    if (!N8N_CONTACT_FORM_WEBHOOK_URL || N8N_CONTACT_FORM_WEBHOOK_URL === 'TU_N8N_CONTACT_FORM_WEBHOOK_URL_AQUI') {
      console.error("La URL del webhook para el formulario de contacto no está configurada.");
      setN8NSubmitStatus('error');
      setN8NSubmitMessage('Error de configuración: El servicio de contacto no está disponible.');
      setIsN8NSubmitting(false);
      return;
    }

    setIsN8NSubmitting(true);
    setN8NSubmitStatus(null);
    setN8NSubmitMessage('');

    try {
      const response = await fetch(N8N_CONTACT_FORM_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        setN8NSubmitStatus('success');
        setN8NSubmitMessage('¡Gracias! Tu mensaje ha sido enviado. Te contactaremos pronto.');
        setContactFormData({ email: '', message: '' }); // Limpia el formulario para N8N
      } else {
        const errorData = await response.text();
        console.error('Error al enviar el formulario:', response.status, errorData);
        setN8NSubmitStatus('error');
        setN8NSubmitMessage('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error de red o excepción al enviar el formulario:', error);
      setN8NSubmitStatus('error');
      setN8NSubmitMessage('No se pudo conectar con el servicio de envío. Revisa tu conexión o inténtalo más tarde.');
    } finally {
      setIsN8NSubmitting(false);
    }
  };

const handleDemoClick = () => {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
};

  const handleWhatsAppClick = () => {
window.open('https://wa.me/5491171299730?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios', '_blank');
  };

const handleEmailClick = () => {
  window.open('mailto:info@neurasur.com.ar', '_blank');
};

// Funciones para controlar los popups
const openPopup = (popupName) => {
  const url = new URL(window.location);
  url.searchParams.set('show', popupName);
  window.history.pushState({ path: url.toString() }, '', url.toString());
  setActivePopup(popupName);
};

const closePopup = () => {
  const url = new URL(window.location);
  url.searchParams.delete('show');
  window.history.replaceState({ path: url.toString() }, '', url.toString());
  setActivePopup(null);
};

  // Manejador para enviar mensajes del chat a n8n
  const handleChatSend = async (textContent) => {
    const newUserMessage = {
      message: textContent,
      sender: "user",
      direction: "outgoing",
    };
    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsBotTyping(true);

    try {
      // Generar un ID de usuario simple si no existe, para mantener contexto en n8n
      let userId = localStorage.getItem('chat_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('chat_user_id', userId);
      }

      console.log('Enviando a n8n webhook:', N8N_CHATBOT_WEBHOOK_URL, 'con datos:', { message: textContent, userId: userId });
      const response = await fetch(N8N_CHATBOT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textContent, userId: userId })
      });

      // Loguear status y content-type para diagnóstico
      console.log('Respuesta de n8n - Status:', response.status);
      console.log('Respuesta de n8n - Content-Type:', response.headers.get('Content-Type'));

      if (!response.ok) {
        // Error del servidor n8n (4xx, 5xx)
        const errorText = await response.text(); // Intentar leer el cuerpo del error como texto
        console.error('Error en la respuesta del webhook de n8n (status no OK):', response.status, errorText);
        // Este error sí debería llevar al catch genérico que muestra "En este momento me estoy entrenando..."
        throw new Error(`Error del servidor n8n: ${response.status}. Respuesta: ${errorText}`);
      }

      // Si la respuesta es OK (2xx), intentamos procesarla
      // Primero, clonamos la respuesta para poder leerla como texto (para debug) y luego como JSON.
      const responseBodyText = await response.clone().text();
      console.log('Respuesta de n8n - Cuerpo (texto crudo):', responseBodyText);

      let responseData;
      try {
        responseData = await response.json(); // Intentamos parsear como JSON
        console.log('Respuesta de n8n - Datos JSON parseados:', responseData);
      } catch (jsonError) {
        // Error al parsear JSON, incluso si el status es OK
        console.error('Error al parsear JSON de la respuesta de n8n:', jsonError);
        console.error('Cuerpo de la respuesta que causó el error de JSON:', responseBodyText);
        // Mostramos un mensaje específico para este caso, NO el genérico "entrenando"
        const botErrorMessage = {
          message: "Recibí una respuesta del servidor, pero no pude procesarla correctamente. Por favor, intenta de nuevo.",
          sender: "NeuraSurBot",
          direction: "incoming",
        };
        setChatMessages(prevMessages => [...prevMessages, botErrorMessage]);
        setIsBotTyping(false);
        return; // Salimos de handleChatSend aquí
      }
      
      // Si llegamos aquí, responseData es un JSON válido
      const botReplyText = responseData.reply || responseData.answer || responseData.text || (responseData.data && responseData.data.text);

      if (!botReplyText) {
        // El JSON es válido, pero no contiene los campos de respuesta esperados.
        console.warn('La respuesta JSON de n8n no contiene un campo de respuesta esperado (reply, answer, text, data.text). ResponseData:', responseData);
        const fallbackMessage = {
          message: "No he podido entender tu solicitud en este momento.",
          sender: "NeuraSurBot",
          direction: "incoming",
        };
        setChatMessages(prevMessages => [...prevMessages, fallbackMessage]);
      } else {
        const newBotMessage = { message: botReplyText, sender: "NeuraSurBot", direction: "incoming" };
        setChatMessages(prevMessages => [...prevMessages, newBotMessage]);
      }
    } catch (error) {
      // Este catch ahora es para errores de red (fetch falló) o cuando response.ok fue false.
      console.error('Error general en la comunicación con n8n o error del servidor:', error);
      const errorMessage = {
        message: "En este momento me estoy entrenando para responderte de la mejor manera!",
        sender: "NeuraSurBot",
        direction: "incoming",
      };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Logo para el avatar del bot
  const botAvatar = <Avatar src="/logo.png" name="NeuraSurBot" size="md" />;

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Presencia Digital Estratégica",
      description: "Potenciamos tu imagen online con sitios web modernos, SEO optimizado y estrategias de conversión que transforman visitantes en clientes.",
      benefits: ["Más conversiones", "Imagen profesional", "Posicionamiento web"],
      cta: "Mejorar mi presencia",
      popular: true
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Business Intelligence & Datos",
      description: "Integramos tus fuentes de datos dispersas en dashboards inteligentes para tomar decisiones basadas en información real.",
      benefits: ["Reportes automáticos", "Métricas clave", "Decisiones informadas"],
      cta: "Ver mis datos"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Chatbots con IA",
      description: "Automatizamos la atención al cliente 24/7 con inteligencia artificial que entiende y responde como un humano.",
      benefits: ["Atención 24/7", "Respuestas inteligentes", "Más ventas"],
      cta: "Probar chatbot",
      trending: true
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automatización de Procesos",
      description: "Eliminamos tareas repetitivas conectando WhatsApp, Excel, emails y sistemas para que trabajen solos.",
      benefits: ["Ahorro de tiempo", "Menos errores", "Mayor productividad"],
      cta: "Automatizar procesos"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguridad & Conectividad",
      description: "Protegemos tu negocio con sistemas de alarmas, cámaras IP y conexión a internet estable y segura.",
      benefits: ["Protección total", "Internet estable", "Monitoreo remoto"],
      cta: "Asegurar mi negocio"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Modernización de Sistemas",
      description: "Migramos sistemas obsoletos a tecnologías actuales con soporte completo durante todo el proceso.",
      benefits: ["Tecnología actual", "Migración segura", "Soporte continuo"],
      cta: "Modernizar sistemas"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Soporte Técnico Integral",
      description: "Mantenimiento preventivo y correctivo de hardware, software y redes con planes de servicio personalizados.",
      benefits: ["Mantenimiento preventivo", "Soporte inmediato", "Equipos optimizados"],
      cta: "Contratar soporte"
    }
  ];

  const targetProfiles = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Profesionales Independientes",
      description: "Profesionales de la salud, y servicios en general que buscan optimizar su tiempo",
      features: ["Gestión de clientes", "Facturación automática", "Agenda digital"]
    },
    {
      icon: <Store className="w-12 h-12" />,
      title: "Comercios Físicos",
      description: "Kioscos, almacenes, ferreterías que quieren modernizar sus procesos",
      features: ["Control de stock", "Ventas digitales", "Seguridad integrada"]
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Emprendedores Digitales",
      description: "Vendedores de Instagram, Tiendanube, Mercado Libre en crecimiento",
      features: ["Chatbots", "Facturación automática", "Reportes inteligentes"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Helmet>
        {/* Meta Tags Principales */}
        <title>NeuraSur: Consultoría Digital y Chatbots con IA para Pymes</title>
        <meta name="description" content="NeuraSur ofrece consultoría digital experta para pymes en Buenos Aires. Potenciamos tu negocio con automatización, chatbots con IA, desarrollo web y transformación digital." />
        <meta name="keywords" content="consultoría digital pymes, chatbots ia, automatización procesos, transformación digital, desarrollo web, consultoria digital buenos aires, neurasur" />
        <link rel="canonical" href="https://neurasur.nextba.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://neurasur.nextba.com/" />
        <meta property="og:title" content="NeuraSur: Consultoría Digital y Chatbots con IA para Pymes" />
        <meta property="og:description" content="Transformación digital para pequeñas empresas con NeuraSur. Ofrecemos chatbots con IA, automatización y consultoría experta." />
        <meta property="og:image" content="https://neurasur.nextba.com/og-image.png" /> {/* Asegúrate que esta URL sea correcta y la imagen exista */}
        <meta property="og:site_name" content="NeuraSur" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://neurasur.nextba.com/" />
        <meta name="twitter:title" content="NeuraSur: Consultoría Digital y Chatbots con IA para Pymes" />
        <meta name="twitter:description" content="Transformación digital para pequeñas empresas con NeuraSur. Ofrecemos chatbots con IA, automatización y consultoría experta." />
        <meta name="twitter:image" content="https://neurasur.nextba.com/og-image.png" /> {/* Asegúrate que esta URL sea correcta y la imagen exista */}
        {/* <meta name="twitter:site" content="@tuUsuarioTwitter" /> */} {/* Descomenta y añade tu usuario de Twitter si tienes */}
        {/* <meta name="twitter:creator" content="@tuUsuarioTwitter" /> */} {/* Descomenta y añade tu usuario de Twitter si tienes */}

        {/* Datos Estructurados JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NeuraSur",
            "url": "https://neurasur.nextba.com/",
            "logo": "https://neurasur.nextba.com/logo.png", // Asegúrate que esta URL sea correcta
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+54-911-7129-9730",
              "contactType": "Customer Service",
              "areaServed": "AR",
              "availableLanguage": ["es"]
            },
            "description": "NeuraSur ofrece consultoría digital experta para pymes en Buenos Aires, especializada en automatización, chatbots con IA, desarrollo web y transformación digital.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Buenos Aires",
              "addressCountry": "AR"
            }
            // "sameAs": [ // Añade tus redes sociales aquí si las tienes
            //   "https://www.linkedin.com/company/neurasur"
            // ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Chatbots con Inteligencia Artificial",
            "provider": {
              "@type": "Organization",
              "name": "NeuraSur"
            },
            "name": "Desarrollo e Implementación de Chatbots con IA para Pymes",
            "description": "Creamos chatbots con IA personalizados para atención al cliente 24/7, ventas en línea e integración con WhatsApp. Mejora la eficiencia y la experiencia de tus usuarios con NeuraSur.",
            "areaServed": {
              "@type": "Country",
              "name": "Argentina"
            },
            "keywords": "chatbots con ia, chatbots para atencion al cliente, chatbot whatsapp, chatbots para ventas en linea, inteligencia artificial para empresas, consultoría digital pymes"
          })}
        </script>
      </Helmet>

      {/* Enhanced Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 focus:outline-none ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-600 shadow-lg shadow-gray-900/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo y nombre "NeuraSur" a la derecha */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              // se puede eliminar el space-x-3 de classname
                            className="cursor-pointer flex items-center space-x-3"
                            onClick={() => scrollToSection('hero')}
            >
              {/* Contenedor para resaltar el logo */}
              <div className="bg-white/12 p-1.5 rounded-md shadow-sm"> 
                <img src="/logo.png" alt="Logo NeuraSur" className="h-10 w-auto" />
              </div>
              <span className="text-xl font-semibold text-white">NeuraSur</span> {/* se puede eliminar esta línea para quitar el texto */}
              {isPreviewMode && <PreviewBanner />}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group focus:outline-none border ${
                    activeSection === item.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 bg-transparent border-transparent'
                  }`}
                >
                  {item.icon && (
                    <span className={`transition-colors duration-300 ${
                      activeSection === item.id ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="hidden md:flex bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 items-center space-x-2 font-medium focus:outline-none"
              >
                <span>Consulta Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2 border-t border-gray-700/50 mt-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0, 
                    x: isMenuOpen ? 0 : -20 
                  }}
                  transition={{ delay: isMenuOpen ? 0.1 * index : 0 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 focus:outline-none border ${
                    activeSection === item.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 bg-transparent border-transparent'
                  }`}
                >
                  {item.icon && (
                    <span className={`${
                      activeSection === item.id ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMenuOpen ? 1 : 0, 
                  x: isMenuOpen ? 0 : -20 
                }}
                transition={{ delay: isMenuOpen ? 0.5 : 0 }}
                onClick={() => scrollToSection('contact')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-lg mt-4 flex items-center justify-center space-x-2 font-medium focus:outline-none"
              >
                <span>Consulta Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline // Important for iOS and some Android browsers
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="hero-background.mp4"
            type="video/mp4"
          >
            Tu navegador no soporta el tag de video.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-800/80 to-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </motion.div>
        
        <motion.div 
          style={{ y: y3 }}
          className="absolute inset-0 opacity-30"
        >
          <div className="pattern-grid w-full h-full" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Te acompañamos en la
            </span>
            <br />
            <span className="text-white drop-shadow-lg">Digitalización de tu Negocio</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          >
            Con herramientas digitales simples que te dan <span className="text-emerald-400 font-semibold">más tiempo libre</span>, 
            <span className="text-teal-400 font-semibold"> menos tareas repetitivas</span> y
            <span className="text-cyan-400 font-semibold"> más control</span> sobre tu negocio.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center min-w-[280px]"
            >
              Agendá una consulta gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="border-2 border-gray-500 px-8 py-4 rounded-full text-lg font-semibold hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center min-w-[200px]"
            >
              Conocé lo que hacemos
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <motion.div
          style={{ y: y3 }}
          className="absolute inset-0 opacity-10"
        >
          <div className="pattern-dots w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Qué hacemos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transformamos la manera en que trabajás, automatizando procesos y conectando tus herramientas favoritas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 h-full flex flex-col justify-between relative"
              >
                <div>
                  <div className="text-emerald-400 mb-6 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center">
                    {service.description}
                  </p>
                </div>
                {service.title === "Chatbots con IA" && (
                  <button
                    className="absolute top-[-1rem] right-[-0.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300 shadow-lg flex items-center space-x-2"
                    onClick={() => setIsChatOpen(true)} // Cambiado para abrir el chat interno
                  >
                    <MessageSquare size={18} className="opacity-90" />
                    <span>Interactuá!</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section id="product" className="py-24 relative overflow-hidden">
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0 opacity-15"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ⚡️ Producto Destacado
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Facturación Digital
                </span>
                <br />
                <span className="text-white">Eficiente</span>
              </h2>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Automatizá la generación de facturas electrónicas usando datos desde WhatsApp, 
                archivos Excel/CSV o plataformas e-commerce. Todo en un solo lugar.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: "Ahorra hasta 5 horas semanales" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Reduce errores de facturación al 99%" },
                  { icon: <Target className="w-5 h-5" />, text: "Mayor comodidad y control" },
                  { icon: <Users className="w-5 h-5" />, text: "Gestión de clientes" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="text-emerald-400">{benefit.icon}</div>
                    <span className="text-gray-200">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
              >
                Consultar
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 flex justify-center"
              style={{ y: y3 }}
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm p-8 rounded-3xl border border-emerald-500/30 max-w-md">
              <img 
                src="/FacturIA.png"
                alt="Facturación Digital"
                className="w-full h-auto rounded-2xl"
              />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-24 relative">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-5"
        >
          <div className="pattern-grid w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.audience ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                A quién ayudamos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Especialistas en soluciones digitales para diferentes tipos de negocios y profesionales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {targetProfiles.map((profile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.audience ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 h-full flex flex-col"
              >
                <div className="text-teal-400 mb-6 flex justify-center">
                  {profile.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-white">
                  {profile.title}
                </h3>
                <p className="text-gray-300 mb-6 text-center leading-relaxed flex-grow">
                  {profile.description}
                </p>
                <ul className="space-y-3">
                  {profile.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/4347481/pexels-photo-4347481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-900/90" />
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0 opacity-20"
        >
          <div className="pattern-dots w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Hablemos de tu proyecto
                </span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Contanos en qué podemos ayudarte o dejá tu mail para coordinar una llamada sin cargo.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { icon: <Phone className="w-5 h-5" />, text: "+54 911 7129 9730" },
                  { icon: <Mail className="w-5 h-5 cursor-pointer" onClick={handleEmailClick} />, text:<span className="cursor-pointer" onClick={handleEmailClick}> br1trezza@gmail.com</span>},
                  { icon: <MapPin className="w-5 h-5" />, text: "Buenos Aires, Argentina" }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30"
                  >
                    <div className="text-emerald-400 bg-emerald-400/10 p-3 rounded-full">{contact.icon}</div>
                    <span className="text-gray-200 text-lg">{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50"
            >
              <form 
                onSubmit={
                  CONTACT_FORM_PROVIDER === 'formspree' ? formspreeHandleSubmitFunction : handleN8NSubmit
                } 
                className="space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="tu@email.com"
                    value={CONTACT_FORM_PROVIDER === 'n8n' ? contactFormData.email : undefined}
                    onChange={CONTACT_FORM_PROVIDER === 'n8n' ? handleContactFormInputChange : undefined}
                  />
                  {CONTACT_FORM_PROVIDER === 'formspree' && (
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={formspreeState.errors}
                      className="text-red-400 text-sm mt-1"
                    />
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-3">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-400 resize-none transition-all duration-300"
                    placeholder="Contanos sobre tu proyecto o necesidad..."
                    value={CONTACT_FORM_PROVIDER === 'n8n' ? contactFormData.message : undefined}
                    onChange={CONTACT_FORM_PROVIDER === 'n8n' ? handleContactFormInputChange : undefined}
                  />
                  {CONTACT_FORM_PROVIDER === 'formspree' && (
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={formspreeState.errors}
                      className="text-red-400 text-sm mt-1"
                    />
                  )}
                </div>

                {/* Mensajes de estado para N8N */}
                {CONTACT_FORM_PROVIDER === 'n8n' && n8nSubmitStatus === 'success' && (
                  <div className="p-3 rounded-md text-sm bg-emerald-500/20 text-emerald-300">
                    {n8nSubmitMessage}
                  </div>
                )}
                {CONTACT_FORM_PROVIDER === 'n8n' && n8nSubmitStatus === 'error' && (
                  <div className="p-3 rounded-md text-sm bg-red-500/20 text-red-300">
                    {n8nSubmitMessage}
                  </div>
                )}

                {/* Mensajes de estado para Formspree */}
                {CONTACT_FORM_PROVIDER === 'formspree' && formspreeState.succeeded && (
                  <div className="p-3 rounded-md text-sm bg-emerald-500/20 text-emerald-300">
                    ¡Gracias! Tu mensaje ha sido enviado. Te contactaremos pronto.
                  </div>
                )}
                {CONTACT_FORM_PROVIDER === 'formspree' && formspreeState.errors && formspreeState.errors.length > 0 && !formspreeState.errors.find(e => e.field) && (
                  <div className="p-3 rounded-md text-sm bg-red-500/20 text-red-300">
                    Hubo un error al enviar tu mensaje. Por favor, revisa los campos o inténtalo de nuevo.
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={ (CONTACT_FORM_PROVIDER === 'n8n' && isN8NSubmitting) || (CONTACT_FORM_PROVIDER === 'formspree' && formspreeState.submitting) }
                  className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center ${
                    ( (CONTACT_FORM_PROVIDER === 'n8n' && isN8NSubmitting) || (CONTACT_FORM_PROVIDER === 'formspree' && formspreeState.submitting) ) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  { ( (CONTACT_FORM_PROVIDER === 'n8n' && isN8NSubmitting) || (CONTACT_FORM_PROVIDER === 'formspree' && formspreeState.submitting) ) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Enviar mensaje
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
                NeuraSur
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Transformamos tu negocio con tecnología accesible y efectiva que impulsa el crecimiento.
                <br />
                Te ayudamos a resolver las barreras tecnológicas.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Servicios</h4>
              <ul className="space-y-3 text-gray-400">
                <li 
                  className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => scrollToSection('services')}
                >Automatización</li>
                <li 
                  className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => scrollToSection('product')}
                >Facturación Digital</li>
                <li 
                  className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => scrollToSection('services')}
                >Consultoría</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Empresa</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Casos de éxito</li>
                <li 
                  className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => scrollToSection('contact')}
                >Contacto</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors duration-300">
                  <button onClick={() => openPopup('terms-of-use')} className="cursor-pointer text-center w-full focus:outline-none">Términos de uso</button>
                </li>
                <li className="hover:text-emerald-400 transition-colors duration-300">
                  <button onClick={() => openPopup('privacy-policy')} className="cursor-pointer text-center w-full focus:outline-none">Política de privacidad</button>
                </li>
                <li className="hover:text-emerald-400 transition-colors duration-300">
                  <button onClick={() => alert('Página de Cookies pendiente.')} className="cursor-pointer text-center w-full focus:outline-none">Cookies</button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="text-sm">
              &copy; 2025 NeuraSur. Todos los derechos reservados. <span className="mx-2">|</span> Diseño e implementación Web por <span className="italic text-emerald-400">NeuraSur</span>
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-100 hover:bg-green-300 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:shadow-green-300/25"
      >
        {/* Reemplaza MessageSquare con tu ícono de WhatsApp */}
        {/* Asegúrate de que el archivo whatsapp-logo.svg o .png esté en la carpeta public */}
        <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-7 h-7" /> 
        {/* Si usas PNG y necesitas ajustar el tamaño, puedes hacerlo aquí. 
            Si el SVG tiene su propio tamaño, podrías no necesitar w-7 h-7 */}
      </motion.button>

      {/* Visor de Tareas Pendientes (para desarrollo/recordatorio) */}
      {isPreviewMode && <PendingTasks />}

      {/* Popups */}
      {activePopup === 'privacy-policy' && <PrivacyPolicyPopup onClose={closePopup} />}
      {activePopup === 'terms-of-use' && <TermsOfUsePopup onClose={closePopup} />}

      {/* Banner de Consentimiento de Cookies */}
      <CookieConsentBanner onOpenPrivacyPolicy={() => openPopup('privacy-policy')} />

      {/* Chat con @chatscope/chat-ui-kit-react */}
      <ChatErrorBoundary>
        <div className="chat-widget-container">
          {!isChatOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsChatOpen(true)}
              className="chat-launcher-button"
              aria-label="Abrir chat de asistencia"
            >
              <Bot size={28} />
            </motion.button>
          )}

          {isChatOpen && (
            <motion.div
              className="chat-window"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MainContainer>
                <ChatContainer>
                  <ConversationHeader>
                    {botAvatar}
                    <ConversationHeader.Content userName="Asistente NeuraSur" info={isBotTyping ? "Escribiendo..." : "En línea"} />
                    <ConversationHeader.Actions>
                      <Button icon={<X size={20} />} onClick={() => setIsChatOpen(false)} aria-label="Cerrar chat" />
                    </ConversationHeader.Actions>
                  </ConversationHeader>
                  <MessageList typingIndicator={isBotTyping ? <TypingIndicator content="NeuraSur está escribiendo..." /> : null}>
                    {chatMessages.map((msg, i) => (
                      <Message key={i} model={msg} avatarSpacer={msg.direction === 'incoming'} avatar={msg.direction === 'incoming' ? botAvatar : null} />
                    ))}
                  </MessageList>
                  <MessageInput placeholder="Escribe tu mensaje aquí..." onSend={handleChatSend} attachButton={false} autoFocus />
                </ChatContainer>
              </MainContainer>
            </motion.div>
          )}
        </div>
      </ChatErrorBoundary>
    </div>
  );
};

export default LandingPage;
